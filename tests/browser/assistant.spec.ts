import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
const knowledge = JSON.parse(
  await fs.readFile("assistant/generated/knowledge.json", "utf8"),
);
const story = (theme = "light") =>
  `/iframe.html?id=ask-little-assistant--ask-little&viewMode=story&globals=theme:${theme}`;
test.beforeEach(async ({ page }) => {
  // Browser tests never contact an owner-configured, billable backend.
  await page.route(/\/health$/, (route) => route.abort());
});
test("Ask Little offers honest local search with working component sources", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto(story());
  await expect(
    page.getByText(
      /AI answers aren’t connected yet\.|Couldn’t connect to AI answers\./,
    ),
  ).toBeVisible();
  await page
    .getByLabel("Your question", { exact: true })
    .fill("lil-input validation error");
  await page.getByRole("button", { name: "Search docs" }).click();
  await expect(
    page.getByRole("article", { name: "Documentation results" }),
  ).toContainText("not an AI-generated answer");
  await expect(
    page.getByRole("link", { name: "Components/Input: lil-input" }),
  ).toHaveAttribute("href", /github.com/);
  await expect(
    page.getByRole("link", { name: "Open in Storybook" }).first(),
  ).toHaveAttribute("href", /path=\/docs\/components-input/);
  await fs.mkdir("artifacts", { recursive: true });
  await page.screenshot({ path: "artifacts/ask-little.png" });
  await page
    .getByLabel("Your question", { exact: true })
    .fill("zzzxqnonexistent");
  await page.getByRole("button", { name: "Search docs" }).click();
  await expect(
    page.getByText("No matching documentation found.", { exact: false }),
  ).toBeVisible();
});
for (const theme of ["light", "dark"])
  test(`Ask Little ${theme}: mobile fits and passes axe`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(story(theme));
    await expect(
      page.getByRole("heading", { name: "Ask Little" }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "How does the sidebar work on mobile?" })
      .click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations).toEqual([]);
  });

async function connectMock(page, responseStatus = 200, supported = true) {
  await page.route("https://ask.test/health", (route) =>
    route.fulfill({
      json: {
        configured: true,
        version: knowledge.version,
        revision: knowledge.revision,
      },
    }),
  );
  await page.route("https://ask.test/api/ask", async (route) => {
    const body = route.request().postDataJSON();
    expect(body.framework).toBe("angular");
    expect(body.version).toBe(knowledge.version);
    await route.fulfill({
      status: responseStatus,
      json: {
        version: knowledge.version,
        supported,
        answer: supported
          ? 'Use lil-input with a visible label. <script>window.injected=true</script>\n```html\n<lil-input label="Email"></lil-input>\n```'
          : "This isn’t documented for this version.",
        sources: supported
          ? [{ id: "lil-input", url: "https://untrusted.example" }]
          : [],
      },
    });
  });
  await page.goto(story());
  await page
    .locator("ask-little")
    .evaluate((element) => element.setAttribute("api-url", "https://ask.test"));
  await expect(page.getByLabel("Answer mode")).toHaveValue("assistant");
  await page.getByLabel("Framework", { exact: true }).selectOption("angular");
  await page
    .getByLabel("Your question", { exact: true })
    .fill("Show me a labeled Angular input");
  await page.getByRole("button", { name: "Ask Little", exact: true }).click();
}
test("connected AI renders a grounded answer and code as text with canonical source links", async ({
  page,
}) => {
  await connectMock(page);
  await expect(
    page.getByRole("article", { name: "Assistant answer" }),
  ).toContainText("visible label");
  await expect(
    page.getByRole("link", { name: "Components/Input: lil-input" }),
  ).toHaveAttribute("href", /^https:\/\/github.com\//);
  expect(await page.evaluate(() => (window as any).injected)).toBeUndefined();
  await expect(page.locator("ask-little").locator("code")).toContainText(
    '<lil-input label="Email">',
  );
});
test("connected AI displays unsupported answers and rate limits honestly", async ({
  page,
}) => {
  await connectMock(page, 200, false);
  await expect(
    page.getByRole("article", { name: "Assistant answer" }),
  ).toContainText("isn’t documented");
  await page.route("https://ask.test/api/ask", (route) =>
    route.fulfill({ status: 429, json: { error: "Rate limited" } }),
  );
  await page.getByRole("button", { name: "Ask Little", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("allowance");
  await expect(
    page.getByRole("button", { name: "Ask Little", exact: true }),
  ).toBeEnabled();
});
