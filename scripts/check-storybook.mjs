import fs from "node:fs/promises";
const manifest = JSON.parse(
  await fs.readFile("packages/core/custom-elements.json", "utf8"),
);
const tags = manifest.modules
  .flatMap((m) => m.declarations || [])
  .filter((d) => d.customElement)
  .map((d) => d.tagName);
const index = JSON.parse(
  await fs.readFile("storybook-static/index.json", "utf8"),
);
const sourcePaths = [
  ...new Set(Object.values(index.entries).map((e) => e.importPath)),
];
const covered = new Map();
for (const path of sourcePaths) {
  if (!path.endsWith(".stories.ts")) continue;
  const source = await fs.readFile(path, "utf8");
  const tag = source.match(/component:\s*["'](lil-[^"']+)["']/)?.[1];
  if (tag) {
    const entries = Object.values(index.entries).filter(
      (e) => e.importPath === path,
    );
    if (
      !entries.some((e) => e.type === "story") ||
      !entries.some((e) => e.type === "docs")
    )
      throw Error(`${tag}: live story or API documentation is missing`);
    covered.set(tag, entries.length);
  }
}
const missing = tags.filter((tag) => !covered.has(tag));
if (missing.length)
  throw Error(
    "Missing dedicated component documentation: " + missing.join(", "),
  );
console.log(
  `Storybook coverage: ${tags.length}/${tags.length} components have live stories and API documentation.`,
);
