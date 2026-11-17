# Ask Little

Little Design System’s documentation assistant, **By Ankur**.

Open [Ask Little in Storybook](https://ankurlittleraj.github.io/lil-toolkit/?path=/story/ask-little-assistant--ask-little).

## Available now

Documentation search runs in the browser with no account, API key or model cost. It finds matching excerpts and links to component stories, APIs, framework examples and tokens. It is explicitly labeled search, not a generated answer. Each question is independent; there is no stored conversation.

AI answers are implemented but remain disconnected until the owner supplies an OpenAI project and backend host. The interface shows that status rather than pretending to generate answers. No OpenAI resources or paid hosting have been provisioned.

## How AI answers work

1. `assistant/knowledge.mjs` extracts only selected public files: component APIs, actual stories, framework guides and tokens. It includes all 20 components. No workspace files are crawled broadly, and `.env` files and credentials are excluded.
2. Each knowledge snapshot has a toolkit version and content revision. CI source links point to the exact GitHub commit; local source links use `main`.
3. `assistant/sync.mjs` uploads that snapshot to an OpenAI vector store and records file-to-source mappings in `.ask-little/index.json`.
4. The Node backend searches that store using exact version/revision filters and applicable framework metadata. It sends retrieved excerpts to the Responses API with a strict answer schema.
5. Answers cite only known retrieved source IDs. Unknown files, invalid citations, incomplete responses and unsupported questions produce an explicit no-answer response. Source IDs are mapped to repository-controlled links, never model-generated URLs.

The frontend renders generated text and fenced code without evaluating HTML. API credentials stay on the backend. The assistant has no file-editing, publishing or command-execution tools. RAG can still produce mistakes: source links help review an answer but do not prove every generated claim is correct.

## Local development

Use Node 24.15+ and npm 11+ as for the toolkit.

```sh
npm ci
npm run build
npm run storybook
```

Search is immediately available under **Ask Little → Assistant → Ask Little**. The generated corpus lives at `assistant/generated/knowledge.json` and is intentionally ignored by git.

## Connect an OpenAI project later

1. Create an OpenAI API project and set its usage controls. ChatGPT sign-in is not an API credential. Select a model in that project that supports Responses structured outputs; the implementation deliberately has no hard-coded paid model.
2. Copy `.env.example` to `.env` locally. Set `OPENAI_API_KEY` and `ASK_LITTLE_MODEL` privately. Never put credentials in chat, source control, Storybook arguments, or any `VITE_` variable.
3. Run `npm run assistant:sync`. This uploads the public knowledge and incurs embedding/storage usage. Keep the generated knowledge and resulting index manifest together.
4. Run `npm run assistant:serve`. `GET http://127.0.0.1:8787/health` should return `configured: true`, matching `version` and `revision`.
5. Set `VITE_ASK_LITTLE_API_URL=http://127.0.0.1:8787` for Storybook and restart it. When health checks pass, the UI enables AI answers. The framework selector and source links work in both modes.

No private data should be entered in questions. AI mode sends the question and retrieved public excerpts to your backend and OpenAI. `store: false` disables Responses application-state storage; this is not a promise of zero retention under every provider policy. The application does not write prompts or responses to logs or a database.

## Deploy the backend later

GitHub Pages hosts static Storybook; it cannot run the Node API. Choose a host that supports a persistent Node process or container. `assistant/Dockerfile` prepares a standalone backend image using the repository root as its build context. Docker has not been run or provisioned as part of the initial setup.

Configure runtime values using the host’s secret settings:

| Setting                   | Purpose                                                                    |
| ------------------------- | -------------------------------------------------------------------------- |
| `OPENAI_API_KEY`          | Server-only project credential                                             |
| `ASK_LITTLE_MODEL`        | Project-approved model with Responses structured outputs                   |
| `ASK_LITTLE_INDEX_PATH`   | Absolute path to the matching index manifest                               |
| `ASK_LITTLE_ORIGINS`      | Comma-separated origins, e.g. `https://ankurlittleraj.github.io` (no path) |
| `ASK_LITTLE_HOURLY_LIMIT` | Global per-process request allowance, default 30, maximum 200              |
| `HOST` / `PORT`           | Listen address; use `0.0.0.0` and the host-provided port in a container    |

Deploy the generated knowledge snapshot and index manifest from the same source commit as Storybook. Mount the index manifest read-only, and ensure the runtime can read it. A revision mismatch disables AI answers. Use HTTPS. After the backend is ready, set the GitHub repository **Actions variable** `ASK_LITTLE_API_URL` to its public base URL and rerun **Deploy Storybook**. This is a public URL, not a credential.

CORS is a browser policy, not authentication. The built-in allowance is deliberately global and single-process; it is reset by a process restart. Before exposing a billable endpoint, configure a durable gateway quota/rate limit across instances and project usage controls. For a private assistant, put the API behind your host’s access gate; no login or permissions system has been added to the library. The two-concurrent-request cap and input/output limits reduce load but are not a guaranteed monetary spending cap.

## Refreshing the index

**Ask Little knowledge** runs on documentation/core changes and produces a downloadable `ask-little-knowledge` workflow artifact. With no secret it only builds the corpus, so the initial configuration is free.

When ready to enable managed indexing, add the repository Actions secret `ASK_LITTLE_OPENAI_API_KEY`. Adding it opts subsequent matching `main` pushes into OpenAI upload/indexing. A manual workflow run additionally requires checking `sync_to_openai`. Never add the API key as an Actions variable.

The artifact contains the generated knowledge snapshot and, after a sync, `.ask-little/index.json`. Download and deploy both together to the backend; this workflow does not deploy an unspecified hosting service. Redeploy Storybook from the same commit. An existing, matching local manifest makes repeated local syncs idempotent; fresh CI jobs create a store for the new snapshot. Prior stores remain available for rollback and expire after 30 inactive days. Uploaded Files resources may remain after store expiry; review and remove unused resources through your OpenAI project. A failed sync records file IDs in `.ask-little/pending.json` and does not overwrite the previous active manifest. Before retrying a failed upload, inspect and clean up its unused files/store to avoid duplicates.

This first version ships one current toolkit snapshot per deployment. It rejects unsupported versions rather than mixing releases. Supporting historical versions later requires retaining matching backend/corpus deployments and adding a version selector.

## Verification

`npm test` exercises real retrieval against the generated public corpus and mocks the provider boundary to verify version filters, valid citations, refusal/incomplete handling, origins, payload limits and request allowance. Browser tests cover search, source links, framework requests, safe rendering of code/HTML-like text, AI errors and both themes on mobile with axe. The tests do not call paid APIs. Live OpenAI retrieval/generation still requires the project setup above and a smoke test before enabling the public AI option.

API contracts follow the official [retrieval documentation](https://developers.openai.com/api/docs/guides/retrieval) and [Responses structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs).
