import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const tokens = JSON.parse(
  await fs.readFile(new URL("../tokens/source.json", import.meta.url), "utf8"),
);
const luminance = (hex) => {
  const c = hex
    .match(/../g)
    .map((c) => parseInt(c, 16) / 255)
    .map((n) => (n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
test("all semantic aliases resolve in both themes", () => {
  for (const aliases of Object.values(tokens.semantic)) {
    assert.equal(aliases.length, 2);
    for (const name of aliases) assert.ok(tokens.palette[name], name);
  }
});
for (const [index, theme] of ["Light", "Dark"].entries())
  test(`${theme}: supported text pairings meet AA contrast`, () => {
    for (const [fg, bg] of [
      ["text/primary", "surface/canvas"],
      ["text/primary", "surface/panel"],
      ["text/secondary", "surface/panel"],
      ["text/muted", "surface/canvas"],
      ["text/on-accent", "accent/solid"],
      ["accent/text", "accent/subtle"],
      ["success/text", "success/surface"],
      ["danger/text", "danger/surface"],
      ["warning/text", "warning/surface"],
    ]) {
      const value = ratio(
        tokens.palette[tokens.semantic[fg][index]],
        tokens.palette[tokens.semantic[bg][index]],
      );
      assert.ok(value >= 4.5, `${fg}/${bg}: ${value.toFixed(2)}:1`);
    }
  });
test("generated CSS retains both theme selectors and no unresolved values", async () => {
  const css = await fs.readFile(
    new URL("../packages/core/src/tokens.css", import.meta.url),
    "utf8",
  );
  assert.match(css, /data-lil-theme="dark"/);
  assert.match(css, /prefers-color-scheme: dark/);
  assert.ok(!css.includes("undefined"));
});
test("single DTCG token set contains both named theme groups", async () => {
  const dtcg = JSON.parse(
    await fs.readFile(new URL("../tokens/tokens.json", import.meta.url)),
  );
  assert.ok(dtcg.light && dtcg.dark && dtcg.primitive);
});
