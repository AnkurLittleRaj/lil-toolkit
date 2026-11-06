import fs from "node:fs/promises";
const framework = process.argv[2];
const root = new URL(`../packages/${framework}/`, import.meta.url);
const required =
  framework === "core"
    ? [
        "dist/components/index.js",
        "dist/components/index.d.ts",
        "dist/types/index.d.ts",
        "loader/index.js",
        "dist/tokens.css",
        "dist/fonts.css",
        "custom-elements.json",
      ]
    : framework === "angular"
      ? ["dist/package.json"]
      : ["dist/index.js", "dist/index.d.ts"];
for (const path of required) await fs.access(new URL(path, root));
console.log(`${framework}: publish artifacts present`);
