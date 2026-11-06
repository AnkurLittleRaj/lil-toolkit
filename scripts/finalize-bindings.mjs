import fs from "node:fs/promises";
for (const file of ["tokens.css", "tokens.json", "fonts.css"])
  await fs.copyFile(`packages/core/src/${file}`, `packages/core/dist/${file}`);
await fs.cp("packages/core/src/fonts", "packages/core/dist/fonts", {
  recursive: true,
});
// Angular 22 strictly types host event targets as EventTarget. Narrow only the
// generated custom-element event target; keep strict templates for the library.
for (const file of ["boolean-value-accessor.ts", "text-value-accessor.ts"]) {
  const path = "packages/angular/src/generated/" + file;
  let source = await fs.readFile(path, "utf8");
  source = source
    .replaceAll('$event.target?.["checked"]', "$any($event.target).checked")
    .replaceAll('$event.target?.["value"]', "$any($event.target).value");
  await fs.writeFile(path, source);
}
// Single-export-module keeps framework imports tree-shakable. Plain JS also
// gets an explicit, convenient registration function without import side effects.
await fs.writeFile(
  "packages/core/dist/register.js",
  `import * as components from './components/index.js';\nexport function defineCustomElements() {\n  if (typeof customElements === 'undefined') return;\n  for (const [name, define] of Object.entries(components)) {\n    if (name.startsWith('defineCustomElement') && typeof define === 'function') define();\n  }\n}\n`,
);
await fs.writeFile(
  "packages/core/dist/register.d.ts",
  "export declare function defineCustomElements(): void;\n",
);
for (const framework of ["core", "react", "vue", "angular"])
  for (const file of ["README.md", "LICENSE"])
    await fs.copyFile(file, `packages/${framework}/${file}`);
