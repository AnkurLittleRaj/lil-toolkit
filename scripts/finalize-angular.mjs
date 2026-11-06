import fs from "node:fs/promises";
const path = "packages/angular/dist/package.json";
const pkg = JSON.parse(await fs.readFile(path, "utf8"));
// Publishing happens from this output folder. The workspace's `files: [dist]`
// would otherwise exclude its sibling fesm2022/ and types/ directories.
delete pkg.files;
await fs.writeFile(path, JSON.stringify(pkg, null, 2) + "\n");
