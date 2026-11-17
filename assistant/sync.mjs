import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { openaiRequest } from "./openai.mjs";

export async function syncKnowledge({
  knowledge,
  apiKey,
  indexPath = ".ask-little/index.json",
  pendingPath = ".ask-little/pending.json",
  fetchImpl,
} = {}) {
  if (!apiKey)
    throw Error(
      "Set OPENAI_API_KEY in the server environment. Never put it in Storybook or client code.",
    );
  const request = (route, body, options = {}) =>
    openaiRequest(apiKey, route, body, { fetchImpl, ...options });
  let previous;
  try {
    previous = JSON.parse(await fs.readFile(indexPath, "utf8"));
  } catch {}
  if (previous?.revision === knowledge.revision) {
    try {
      const current = await request(
        `/vector_stores/${encodeURIComponent(previous.vectorStoreId)}`,
        undefined,
        { method: "GET" },
      );
      if (
        current.status === "completed" &&
        current.file_counts?.completed === knowledge.documents.length
      )
        return previous;
    } catch (error) {
      if (error.status !== 404) throw error;
    }
  }
  const store = await request("/vector_stores", {
    name: `Ask Little ${knowledge.version} ${knowledge.revision.slice(0, 12)}`,
    expires_after: { anchor: "last_active_at", days: 30 },
  });
  const index = {
    version: knowledge.version,
    revision: knowledge.revision,
    vectorStoreId: store.id,
    files: {},
  };
  await fs.mkdir(path.dirname(indexPath), { recursive: true });
  await fs.mkdir(path.dirname(pendingPath), { recursive: true });
  await fs.writeFile(pendingPath, JSON.stringify(index, null, 2));
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
    const file = await request("/files", form);
    index.files[file.id] = doc.id;
    // Keep uploaded file IDs available even if attachment fails.
    await fs.writeFile(pendingPath, JSON.stringify(index, null, 2));
    await request(`/vector_stores/${store.id}/files`, {
      file_id: file.id,
      attributes: {
        version: knowledge.version,
        revision: knowledge.revision,
        source_id: doc.id,
        framework: doc.framework,
      },
    });
  }
  const deadline = Date.now() + 300_000;
  while (true) {
    const status = await request(`/vector_stores/${store.id}`, undefined, {
      method: "GET",
    });
    if (status.file_counts?.failed || status.file_counts?.cancelled)
      throw Error(`Some files failed indexing; inspect ${pendingPath}.`);
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
  await fs.writeFile(
    indexPath + ".next",
    JSON.stringify(index, null, 2) + "\n",
  );
  await fs.rename(indexPath + ".next", indexPath);
  return index;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const knowledge = JSON.parse(
    await fs.readFile(
      new URL("./generated/knowledge.json", import.meta.url),
      "utf8",
    ),
  );
  await syncKnowledge({
    knowledge,
    apiKey: process.env.OPENAI_API_KEY,
    indexPath: process.env.ASK_LITTLE_INDEX_PATH || ".ask-little/index.json",
  });
  console.log(
    `Ask Little index ready for toolkit ${knowledge.version}, revision ${knowledge.revision.slice(0, 12)}. Prior stores expire after 30 inactive days.`,
  );
}
