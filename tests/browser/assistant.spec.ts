import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
const knowledge = JSON.parse(
  await fs.readFile("assistant/generated/knowledge.json", "utf8"),
);
const story = (theme = "light") =>
  `/iframe.html?id=ask-little-assistant--ask-little&viewMode=story&globals=theme:${theme}`;
test("Ask Little offers honest local search with working component sources", async ({
  page,
}) => {
  await page.goto(story());
  await expect(
    page.getByText("AI answers aren’t connected yet.", { exact: false }),
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
