import http from "node:http";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { answerQuestion } from "./openai.mjs";

export function createAssistantServer({
  knowledge,
  index,
  apiKey,
  model,
  origins = ["http://localhost:6006", "http://127.0.0.1:6006"],
  fetchImpl,
  now = Date.now,
  hourlyLimit = 30,
} = {}) {
  let windowStart = now(),
    used = 0,
    active = 0;
  const configured = Boolean(
    apiKey &&
    model &&
    index?.vectorStoreId &&
    index.version === knowledge.version &&
    index.revision === knowledge.revision,
  );
  return http.createServer(async (req, res) => {
    const origin = req.headers.origin;
    const allowed = origins.includes(origin);
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Vary", "Origin");
    if (allowed) res.setHeader("Access-Control-Allow-Origin", origin);
    const send = (status, body) => {
      res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
      });
      res.end(JSON.stringify(body));
    };
    if (req.method === "OPTIONS") {
      if (!allowed) return send(403, { error: "Origin is not allowed." });
      res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.writeHead(204);
      return res.end();
    }
    if (req.url === "/health" && req.method === "GET")
      return send(200, {
        configured,
        version: knowledge.version,
        revision: knowledge.revision,
      });
    if (req.url !== "/api/ask") return send(404, { error: "Not found." });
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return send(405, { error: "Use POST." });
    }
    if (!allowed) return send(403, { error: "Origin is not allowed." });
    if (!req.headers["content-type"]?.startsWith("application/json"))
      return send(415, { error: "Use application/json." });
    if (!configured)
      return send(503, {
        error:
          "AI answers are not configured. Use documentation search for now.",
      });
    req.setTimeout(5000, () => req.destroy());
    let body;
    try {
      let text = "";
      for await (const chunk of req.iterator({ destroyOnReturn: false })) {
        text += chunk;
        if (Buffer.byteLength(text) > 6000) {
          send(413, { error: "Question is too large." });
          return;
        }
      }
      body = JSON.parse(text);
    } catch {
      return send(400, { error: "Send a valid JSON question." });
    } finally {
      req.setTimeout(0);
    }
    if (
      !body ||
      typeof body.question !== "string" ||
      body.question.trim().length < 3 ||
      body.question.length > 1500 ||
      !["all", "javascript", "react", "angular", "vue"].includes(
        body.framework || "all",
      ) ||
      body.version !== knowledge.version
    )
      return send(400, {
        error:
          "Provide a question of 3–1500 characters, a supported framework, and the current toolkit version.",
      });
    if (now() - windowStart >= 3_600_000) {
      windowStart = now();
      used = 0;
    }
    if (used >= hourlyLimit || active >= 2) {
      res.setHeader("Retry-After", "60");
      return send(429, {
        error:
          "Ask Little is busy or has reached its hourly allowance. Try documentation search.",
      });
    }
    used++;
    active++;
    try {
      const answer = await answerQuestion({
        question: body.question.trim(),
        framework: body.framework || "all",
        knowledge,
        index,
        apiKey,
        model,
        fetchImpl,
      });
      send(200, answer);
    } catch {
      send(502, {
        error:
          "AI answers are temporarily unavailable. Please try again or use documentation search.",
      });
    } finally {
      active--;
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const knowledge = JSON.parse(
    await fs.readFile(
      new URL("./generated/knowledge.json", import.meta.url),
      "utf8",
    ),
  );
  let index;
  try {
    index = JSON.parse(
      await fs.readFile(
        process.env.ASK_LITTLE_INDEX_PATH || ".ask-little/index.json",
        "utf8",
      ),
    );
  } catch {}
  const server = createAssistantServer({
    knowledge,
    index,
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.ASK_LITTLE_MODEL,
    origins: (
      process.env.ASK_LITTLE_ORIGINS ||
      "http://localhost:6006,http://127.0.0.1:6006"
    )
      .split(",")
      .map((s) => s.trim()),
    hourlyLimit: Math.min(
      200,
      Math.max(1, Number(process.env.ASK_LITTLE_HOURLY_LIMIT) || 30),
    ),
  });
  server.requestTimeout = 15_000;
  server.headersTimeout = 10_000;
  server.listen(
    Number(process.env.PORT) || 8787,
    process.env.HOST || "127.0.0.1",
    () =>
      console.log(
        "Ask Little backend started. GET /health reports configuration status.",
      ),
  );
}
