import test from "node:test";
import assert from "node:assert/strict";
import { buildKnowledge } from "../assistant/knowledge.mjs";
import { searchKnowledge } from "../assistant/search.mjs";
import { answerQuestion } from "../assistant/openai.mjs";
import { createAssistantServer } from "../assistant/server.mjs";

const knowledge = await buildKnowledge();
const source = knowledge.documents.find((d) => d.id === "lil-input");
const index = {
  version: knowledge.version,
  revision: knowledge.revision,
  vectorStoreId: "vs_test",
  files: { file_test: source.id },
};
function provider({
  supported = true,
  sourceIds = [source.id],
  status = "completed",
  fail = false,
  unknown = false,
} = {}) {
  const calls = [];
  return {
    calls,
    fetchImpl: async (url, init) => {
      const body = JSON.parse(init.body);
      calls.push({ url, body });
      if (fail)
        return new Response("secret upstream diagnostic", { status: 500 });
      if (url.endsWith("/search"))
        return Response.json({
          data: [
            {
              file_id: unknown ? "file_unknown" : "file_test",
              content: [
                {
                  type: "text",
                  text: "lil-input supports label, name, and lilInput.",
                },
              ],
            },
          ],
        });
      return Response.json({
        status,
        output: [
          {
            type: "message",
            content: [
              {
                type: "output_text",
                text: JSON.stringify({
                  supported,
                  answer: "Use lil-input with a visible label.",
                  sourceIds,
                }),
              },
            ],
          },
        ],
      });
    },
  };
}

test("knowledge covers every component, tokens, framework examples and safe public sources", () => {
  assert.equal(
    knowledge.documents.filter((d) => d.id.startsWith("lil-")).length,
    20,
  );
  for (const id of ["tokens-light", "tokens-dark", "tokens-spacing"])
    assert.ok(knowledge.documents.some((d) => d.id === id));
  assert.ok(
    knowledge.documents.some((d) => d.text.includes("TextValueAccessor")),
  );
  assert.ok(knowledge.documents.some((d) => d.text.includes("v-model")));
  assert.equal(
    new Set(knowledge.documents.map((d) => d.id)).size,
    knowledge.documents.length,
  );
  for (const doc of knowledge.documents) {
    assert.equal(doc.version, knowledge.version);
    assert.match(
      doc.url,
      /^https:\/\/github.com\/AnkurLittleRaj\/lil-toolkit\/blob\/main\//,
    );
    assert.ok(!doc.url.includes(".env"));
  }
});
test("retrieval finds component guidance and exact dark token values", () => {
  assert.ok(
    searchKnowledge(knowledge, "lil-input validation label error")
      .slice(0, 3)
      .some((d) => d.id === "lil-input"),
  );
  assert.ok(
    searchKnowledge(knowledge, "dark accent solid selected color").some(
      (d) => d.id === "tokens-dark",
    ),
  );
  assert.deepEqual(searchKnowledge(knowledge, "zzzxqnonexistent"), []);
});
test("RAG filters exact revision/version and returns only retrieved source links", async () => {
  const mock = provider();
  const result = await answerQuestion({
    question: "How do I label a field?",
    framework: "angular",
    knowledge,
    index,
    apiKey: "test-secret",
    model: "test-model",
    fetchImpl: mock.fetchImpl,
  });
  assert.equal(result.supported, true);
  assert.equal(result.sources[0].url, source.url);
  assert.equal(mock.calls[0].body.filters.filters[1].value, knowledge.revision);
  assert.equal(mock.calls[1].body.store, false);
  assert.equal(mock.calls[1].body.text.format.strict, true);
  assert.match(mock.calls[1].body.input, /angular/);
});
for (const [name, options] of Object.entries({
  "unknown file": { unknown: true },
  "invented citation": { sourceIds: ["https://evil.example"] },
  "unsupported question": { supported: false },
  "incomplete generation": { status: "incomplete" },
})) {
  test(`RAG declines ${name}`, async () => {
    const mock = provider(options);
    const result = await answerQuestion({
      question: "Question",
      framework: "all",
      knowledge,
      index,
      apiKey: "test-secret",
      model: "test-model",
      fetchImpl: mock.fetchImpl,
    });
    assert.equal(result.supported, false);
    assert.deepEqual(result.sources, []);
  });
}
test("stale index cannot answer against newer documentation", async () => {
  await assert.rejects(
    answerQuestion({ knowledge, index: { ...index, revision: "old" } }),
    /refreshed/,
  );
});
async function withServer(options, run) {
  const server = createAssistantServer({
    knowledge,
    index,
    apiKey: "test-secret",
    model: "test-model",
    origins: ["https://docs.example"],
    ...options,
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    await run(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}
const headers = {
  Origin: "https://docs.example",
  "Content-Type": "application/json",
};
const question = {
  question: "How do I label a field?",
  framework: "react",
  version: knowledge.version,
};
test("HTTP validates origin, payload, version, and global request allowance", async () => {
  const mock = provider();
  await withServer(
    { fetchImpl: mock.fetchImpl, hourlyLimit: 1 },
    async (base) => {
      const post = (body, custom = headers) =>
        fetch(base + "/api/ask", {
          method: "POST",
          headers: custom,
          body: JSON.stringify(body),
        });
      assert.equal(
        (await post(question, { ...headers, Origin: "https://evil.example" }))
          .status,
        403,
      );
      assert.equal((await post({ ...question, version: "0.0.0" })).status, 400);
      assert.equal(
        (await post({ ...question, question: "x".repeat(7000) })).status,
        413,
      );
      assert.equal((await post(question)).status, 200);
      assert.equal((await post(question)).status, 429);
      assert.equal(mock.calls.length, 2);
      const health = await (await fetch(base + "/health")).text();
      assert.ok(!health.includes("test-secret"));
    },
  );
});
test("HTTP reports missing setup and hides provider errors", async () => {
  await withServer({ apiKey: undefined }, async (base) => {
    assert.equal(
      (await (await fetch(base + "/health")).json()).configured,
      false,
    );
    assert.equal(
      (
        await fetch(base + "/api/ask", {
          method: "POST",
          headers,
          body: JSON.stringify(question),
        })
      ).status,
      503,
    );
  });
  await withServer(
    { fetchImpl: provider({ fail: true }).fetchImpl },
    async (base) => {
      const response = await fetch(base + "/api/ask", {
        method: "POST",
        headers,
        body: JSON.stringify(question),
      });
      assert.equal(response.status, 502);
      assert.ok(!(await response.text()).includes("secret"));
    },
  );
});
