import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
for (const framework of ["core", "react", "vue", "angular"])
  test(`${framework}: publishable package contains its declared entrypoints`, async () => {
    const dir = new URL(
      `../packages/${framework}${framework === "angular" ? "/dist" : ""}/`,
      import.meta.url,
    );
    const pkg = JSON.parse(await fs.readFile(new URL("package.json", dir)));
    assert.equal(pkg.version, "0.1.0");
    assert.equal(pkg.license, "MIT");
    assert.ok(!pkg.private);
    assert.ok(pkg.name.startsWith("@ankurlittleraj/lil-toolkit"));
    const paths = [];
    function walk(v) {
      if (typeof v === "string" && v.startsWith("./") && !v.includes("*"))
        paths.push(v);
      else if (v && typeof v === "object")
        for (const x of Object.values(v)) walk(x);
    }
    walk(pkg.exports);
    for (const file of paths) await fs.access(new URL(file, dir));
    await fs.access(new URL("LICENSE", dir));
  });
test("custom element manifest includes public component APIs", async () => {
  const data = JSON.parse(
    await fs.readFile(
      new URL("../packages/core/custom-elements.json", import.meta.url),
    ),
  );
  const declarations = data.modules.flatMap((m) => m.declarations || []);
  const tags = declarations
    .filter((d) => d.customElement)
    .map((d) => d.tagName);
  for (const tag of [
    "lil-button",
    "lil-input",
    "lil-dialog",
    "lil-tabs",
    "lil-sidebar",
    "lil-customer-table",
  ])
    assert.ok(tags.includes(tag), tag);
});
