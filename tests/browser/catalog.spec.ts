import { test, expect } from "@playwright/test";
import fs from "node:fs";
const manifest = JSON.parse(
  fs.readFileSync("packages/core/custom-elements.json", "utf8"),
);
const tags = manifest.modules
  .flatMap(
    (m: {
      declarations?: Array<{ customElement?: boolean; tagName: string }>;
    }) => m.declarations || [],
  )
  .filter((d: { customElement?: boolean }) => d.customElement)
  .map((d: { tagName: string }) => d.tagName);
const index = JSON.parse(
  fs.readFileSync("storybook-static/index.json", "utf8"),
);
const entries = Object.values(index.entries) as Array<{
  id: string;
  type: string;
  importPath: string;
}>;
for (const tag of tags) {
  const source = entries.find(
    (e) =>
      e.type === "story" &&
      new RegExp(`component:\\s*["']${tag}["']`).test(
        fs.readFileSync(e.importPath, "utf8"),
      ),
  )?.importPath;
  const entry = entries.find(
    (e) =>
      e.type === "story" &&
      e.importPath === source &&
      (e.id.endsWith("--default") || e.id.endsWith("--primary")),
  );
  test(`${tag}: dedicated catalog renders without runtime errors`, async ({
    page,
  }) => {
    expect(entry, `${tag} story`).toBeTruthy();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`/iframe.html?id=${entry!.id}&viewMode=story`);
    await expect(page.locator(tag)).toHaveCount(1);
    await expect(page.locator(tag)).toHaveJSProperty("isConnected", true);
    expect(errors).toEqual([]);
  });
}
