import fs from "node:fs/promises";
import { openaiRequest } from "./openai.mjs";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey)
  throw Error(
    "Set OPENAI_API_KEY in the server environment. Never put it in Storybook or client code.",
  );
const knowledge = JSON.parse(
  await fs.readFile(
    new URL("./generated/knowledge.json", import.meta.url),
    "utf8",
  ),
);
const indexPath = process.env.ASK_LITTLE_INDEX_PATH || ".ask-little/index.json";
let previous;
try {
  previous = JSON.parse(await fs.readFile(indexPath, "utf8"));
} catch {}
if (previous?.revision === knowledge.revision) {
  await openaiRequest(
    apiKey,
    `/vector_stores/${encodeURIComponent(previous.vectorStoreId)}`,
    undefined,
    { method: "GET" },
  );
  console.log("Ask Little index is already current.");
} else {
  const store = await openaiRequest(apiKey, "/vector_stores", {
    name: `Ask Little ${knowledge.version} ${knowledge.revision.slice(0, 12)}`,
    expires_after: { anchor: "last_active_at", days: 30 },
  });
  const index = {
    version: knowledge.version,
    revision: knowledge.revision,
    vectorStoreId: store.id,
    files: {},
  };
  // Save progress for recovery without changing the active manifest until all files are ready.
  await fs.mkdir(new URL("../.ask-little/", import.meta.url), {
    recursive: true,
  });
  await fs.writeFile(
    ".ask-little/pending.json",
    JSON.stringify(index, null, 2),
  );
  for (const doc of knowledge.documents) {
    const form = new FormData();
    form.set("purpose", "assistants");
    form.set(
      "file",
      new Blob(
        [
          `${doc.title}\nToolkit version: ${doc.version}\nSource ID: ${doc.id}\n\n${doc.text}`,
        ],
        { type: "text/plain" },
      ),
      `${doc.id}.txt`,
    );
    const file = await openaiRequest(apiKey, "/files", form);
    await openaiRequest(apiKey, `/vector_stores/${store.id}/files`, {
      file_id: file.id,
      attributes: {
        version: knowledge.version,
        revision: knowledge.revision,
        source_id: doc.id,
        framework: doc.framework,
      },
    });
    index.files[file.id] = doc.id;
    await fs.writeFile(
      ".ask-little/pending.json",
      JSON.stringify(index, null, 2),
    );
  }
  const deadline = Date.now() + 300_000;
  while (true) {
    const status = await openaiRequest(
      apiKey,
      `/vector_stores/${store.id}`,
      undefined,
      { method: "GET" },
    );
    if (status.file_counts?.failed || status.file_counts?.cancelled)
      throw Error(
        "Some knowledge files failed indexing; inspect .ask-little/pending.json.",
      );
    if (
      status.status === "completed" &&
      status.file_counts?.completed === knowledge.documents.length
    )
      break;
    if (Date.now() > deadline)
      throw Error(
        "Indexing timed out; the previous active manifest has been preserved.",
      );
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  await fs.writeFile(indexPath, JSON.stringify(index, null, 2) + "\n");
  console.log(
    `Indexed ${knowledge.documents.length} documents for toolkit ${knowledge.version}. Active manifest: ${indexPath}. Prior stores are retained for rollback and expire after 30 inactive days.`,
  );
}
