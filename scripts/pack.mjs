import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
await fs.mkdir("artifacts", { recursive: true });
for (const name of ["core", "react", "vue", "angular"]) {
  execFileSync("node", ["scripts/check-package.mjs", name], {
    stdio: "inherit",
  });
  const output = execFileSync(
    "npm",
    [
      "pack",
      name === "angular" ? "./packages/angular/dist" : `./packages/${name}`,
      "--ignore-scripts",
      "--json",
      "--pack-destination",
      "artifacts",
    ],
    { encoding: "utf8" },
  );
  const [packed] = JSON.parse(output);
  const paths = packed.files.map((file) => file.path);
  const required =
    name === "angular"
      ? paths.some(
          (path) => path.startsWith("fesm2022/") && path.endsWith(".mjs"),
        )
      : paths.includes(
          name === "core" ? "dist/components/index.js" : "dist/index.js",
        );
  if (!required) throw Error(`${name}: packed artifact is missing its runtime`);
  if (!paths.includes("LICENSE")) throw Error(`${name}: license missing`);
  console.log(
    `${packed.filename}: ${paths.length} files, ${packed.size} bytes`,
  );
}
