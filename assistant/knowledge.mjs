import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const repo = "https://github.com/AnkurLittleRaj/lil-toolkit";
const storybook = "https://ankurlittleraj.github.io/lil-toolkit/";

/** Build only from explicitly selected public documentation and component APIs. */
export async function buildKnowledge() {
  const pkg = JSON.parse(
    await fs.readFile(path.join(root, "package.json"), "utf8"),
  );
  const version = pkg.version;
  const sourceRef = process.env.GITHUB_SHA || "main";
  if (!/^(main|[a-f0-9]{40})$/.test(sourceRef))
    throw Error("GITHUB_SHA must identify a source commit.");
  const documents = [];
  function add(id, title, text, sourcePath, story, framework = "all") {
    documents.push({
      id,
      title,
      text: text.trim(),
      version,
      framework,
      url: `${repo}/blob/${sourceRef}/${sourcePath}`,
      ...(story
        ? { storybookUrl: `${storybook}?path=/docs/${story}--documentation` }
        : {}),
    });
  }
  for (const sourcePath of [
    "README.md",
    "docs/design-parity.md",
    "docs/zeroheight/foundations.md",
    "docs/zeroheight/components.md",
    "stories/Integration.mdx",
    "stories/Foundations.stories.ts",
    "stories/Examples.stories.ts",
  ]) {
    const content = await fs.readFile(path.join(root, sourcePath), "utf8");
    const sections = content.split(/(?=^#{1,3} )/m);
    let n = 0;
    for (const section of sections) {
      // Bound context size while keeping small examples intact.
      for (let offset = 0; offset < section.length; offset += 6000) {
        const text = section.slice(offset, offset + 6000);
        if (!text.trim()) continue;
        const title = (section.match(/^#+ (.+)/m)?.[1] || sourcePath).replace(
          /[*`]/g,
          "",
        );
        add(
          `guide-${sourcePath.replaceAll(/[^a-z0-9]/gi, "-")}-${n++}`,
          title,
          text,
          sourcePath,
          undefined,
          /^(React|Angular|Vue)$/.test(title)
            ? title.toLowerCase()
            : title === "Plain JavaScript"
              ? "javascript"
              : "all",
        );
      }
    }
  }
  const manifest = JSON.parse(
    await fs.readFile(
      path.join(root, "packages/core/custom-elements.json"),
      "utf8",
    ),
  );
  const storyPaths = [
    "stories/Components.stories.ts",
    ...(await fs.readdir(path.join(root, "stories/components")))
      .filter((p) => p.endsWith(".stories.ts"))
      .map((p) => `stories/components/${p}`),
  ];
  const stories = await Promise.all(
    storyPaths.map(async (p) => ({
      path: p,
      source: await fs.readFile(path.join(root, p), "utf8"),
    })),
  );
  for (const declaration of manifest.modules
    .flatMap((m) => m.declarations || [])
    .filter((d) => d.customElement)) {
    const story = stories.find((s) =>
      s.source.includes(`component: "${declaration.tagName}"`),
    );
    const title = story?.source.match(/title: "([^"]+)"/)?.[1];
    if (!story || !title)
      throw Error(`Missing story for ${declaration.tagName}`);
    const slug = title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
    add(
      declaration.tagName,
      `${title}: ${declaration.tagName}`,
      JSON.stringify(
        {
          tag: declaration.tagName,
          description: declaration.description,
          members: declaration.members,
          attributes: declaration.attributes,
          events: declaration.events,
          slots: declaration.slots,
          cssProperties: declaration.cssProperties,
        },
        null,
        2,
      ) +
        "\n\nActual Storybook examples:\n" +
        story.source,
      story.path,
      slug,
    );
  }
  const tokens = JSON.parse(
    await fs.readFile(path.join(root, "tokens/tokens.json"), "utf8"),
  );
  for (const [group, values] of Object.entries(tokens)) {
    add(
      `tokens-${group}`,
      `${group} design tokens and theme colors`,
      JSON.stringify(values, null, 2),
      "tokens/tokens.json",
      "foundations-design-guidelines",
    );
  }
  return {
    version,
    revision: createHash("sha256")
      .update(JSON.stringify(documents.map(({ url, ...document }) => document)))
      .digest("hex"),
    documents,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const knowledge = await buildKnowledge();
  await fs.mkdir(path.join(root, "assistant/generated"), { recursive: true });
  await fs.writeFile(
    path.join(root, "assistant/generated/knowledge.json"),
    JSON.stringify(knowledge, null, 2) + "\n",
  );
  console.log(
    `Ask Little: ${knowledge.documents.length} source documents, toolkit ${knowledge.version}, revision ${knowledge.revision.slice(0, 12)}.`,
  );
}
