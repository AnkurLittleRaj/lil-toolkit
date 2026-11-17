import { LitElement, css, html } from "lit";
import knowledge from "../assistant/generated/knowledge.json";
import { searchKnowledge } from "../assistant/search.mjs";

type Source = {
  id: string;
  title: string;
  text?: string;
  url: string;
  storybookUrl?: string;
};
type Result = {
  mode: string;
  answer: string;
  sources: Source[];
  supported: boolean;
};
const examples = [
  "Which component should I use for filtering a table?",
  "Show me an Angular form using our inputs and buttons.",
  "Which token is used for selected states in dark mode?",
  "How does the sidebar work on mobile?",
];
const configuredUrl = (import.meta as any).env.VITE_ASK_LITTLE_API_URL || "";

/** Documentation UI only. No model credentials are accepted or stored here. */
export class AskLittle extends LitElement {
  static properties = {
    apiUrl: { attribute: "api-url" },
    question: { state: true },
    framework: { state: true },
    busy: { state: true },
    result: { state: true },
    error: { state: true },
    aiReady: { state: true },
    mode: { state: true },
    connection: { state: true },
    copied: { state: true },
  };
  declare apiUrl: string;
  declare question: string;
  declare framework: string;
  declare busy: boolean;
  declare result: Result | null;
  declare error: string;
  declare aiReady: boolean;
  declare mode: string;
  declare copied: boolean;
  declare connection: string;
  private pending?: AbortController;
  private health?: AbortController;

  constructor() {
    super();
    this.apiUrl = configuredUrl;
    this.question = "";
    this.framework = "all";
    this.busy = false;
    this.result = null;
    this.error = "";
    this.aiReady = false;
    this.mode = "search";
    this.copied = false;
    this.connection =
      "AI answers aren’t connected yet. Documentation search works here for free.";
  }
  updated(changes: Map<string, unknown>) {
    if (changes.has("apiUrl") && this.apiUrl) {
      this.connection = "Checking AI connection…";
      void this.checkConnection();
    }
  }
  disconnectedCallback() {
    this.pending?.abort();
    this.health?.abort();
    super.disconnectedCallback();
  }
  private baseUrl() {
    const url = new URL(this.apiUrl);
    if (
      url.protocol !== "https:" &&
      !(
        url.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(url.hostname)
      )
    )
      throw Error("Use an HTTPS backend URL.");
    if (url.username || url.password || url.search || url.hash)
      throw Error("Invalid backend URL.");
    return url.href.replace(/\/$/, "");
  }
  private async checkConnection() {
    this.health = new AbortController();
    const timer = setTimeout(() => this.health?.abort(), 7000);
    try {
      const response = await fetch(`${this.baseUrl()}/health`, {
        signal: this.health.signal,
      });
      if (!response.ok) throw Error();
      const status = await response.json();
      this.aiReady =
        status.configured === true &&
        status.version === knowledge.version &&
        status.revision === knowledge.revision;
      this.mode = this.aiReady ? "assistant" : "search";
      this.connection = this.aiReady
        ? "AI answers use the toolkit documentation. Questions are sent to the assistant backend and OpenAI; don’t include private data."
        : "AI answers need a configured backend with the current knowledge index. Documentation search is available.";
    } catch {
      this.connection =
        "Couldn’t connect to AI answers. Documentation search is available.";
    } finally {
      clearTimeout(timer);
    }
  }
  private async ask(event?: Event) {
    event?.preventDefault();
    if (this.busy || this.question.trim().length < 3) return;
    this.busy = true;
    this.error = "";
    this.result = null;
    this.copied = false;
    const question = this.question.trim();
    if (this.mode === "search") {
      const sources = searchKnowledge(
        knowledge,
        `${question} ${this.framework === "all" ? "" : this.framework}`,
        this.framework,
      );
      this.result = {
        mode: "search",
        supported: Boolean(sources.length),
        answer: sources.length
          ? "Here are matching excerpts from the toolkit documentation. These are search results, not an AI-generated answer."
          : "No matching documentation found. Try a component name, framework, or token.",
        sources,
      };
      this.busy = false;
      return;
    }
    this.pending = new AbortController();
    const timer = setTimeout(() => this.pending?.abort(), 100_000);
    try {
      const response = await fetch(`${this.baseUrl()}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: this.pending.signal,
        body: JSON.stringify({
          question,
          framework: this.framework,
          version: knowledge.version,
        }),
      });
      if (!response.ok)
        throw Error(
          response.status === 429
            ? "Ask Little has reached its allowance. Try documentation search or come back later."
            : "AI answers are unavailable. Please try again or switch to documentation search.",
        );
      const answer = await response.json();
      if (
        answer.version !== knowledge.version ||
        typeof answer.answer !== "string" ||
        !Array.isArray(answer.sources)
      )
        throw Error(
          "The answer didn’t match this toolkit version. Try documentation search.",
        );
      const sources = answer.sources
        .map((s: { id: string }) =>
          knowledge.documents.find((d) => d.id === s.id),
        )
        .filter(Boolean);
      if (answer.supported && !sources.length)
        throw Error(
          "The answer has no verifiable sources. Try documentation search.",
        );
      this.result = {
        mode: "assistant",
        supported: answer.supported === true,
        answer: answer.answer,
        sources,
      };
    } catch (error) {
      this.error = this.pending.signal.aborted
        ? "Request stopped. You can try another question."
        : (error as Error).message;
    } finally {
      clearTimeout(timer);
      this.busy = false;
    }
  }
  private answerContent(text: string) {
    return text
      .split(/(```[\s\S]*?```)/g)
      .map((part) =>
        part.startsWith("```")
          ? html`<pre><code>${part.replace(/^```[^\n]*\n?/, "").replace(/```$/, "")}</code></pre>`
          : html`<p class="answer-text">${part}</p>`,
      );
  }
  render() {
    return html`<main aria-labelledby="ask-title">
      <header>
        <div class="brand">LITTLE DESIGN SYSTEM <span>By Ankur</span></div>
        <h1 id="ask-title">
          Ask Little<span class="spark" aria-hidden="true">✦</span>
        </h1>
        <p class="intro">A little guidance for what you’re building.</p>
        <p>
          Find the right component, explore a token, or start with a documented
          example.
        </p>
      </header>
      <div class="meta">
        <span>Toolkit ${knowledge.version}</span
        ><span
          >${knowledge.documents.filter((d) => d.id.startsWith("lil-")).length}
          components</span
        ><span>Source-linked guidance</span>
      </div>
      <p class="connection">${this.connection}</p>
      <form @submit=${this.ask}>
        <div class="options">
          <label
            >Mode<select
              aria-label="Answer mode"
              .value=${this.mode}
              ?disabled=${this.busy}
              @change=${(e: Event) => {
                this.mode = (e.target as HTMLSelectElement).value;
                this.result = null;
                this.error = "";
              }}
            >
              <option value="search">Documentation search</option>
              <option value="assistant" ?disabled=${!this.aiReady}>
                AI assistant${this.aiReady ? "" : " — not connected"}
              </option>
            </select></label
          ><label
            >Framework<select
              aria-label="Framework"
              .value=${this.framework}
              ?disabled=${this.busy}
              @change=${(e: Event) => {
                this.framework = (e.target as HTMLSelectElement).value;
              }}
            >
              <option value="all">All frameworks</option>
              <option value="javascript">JavaScript</option>
              <option value="react">React</option>
              <option value="angular">Angular</option>
              <option value="vue">Vue</option>
            </select></label
          >
        </div>
        <label class="question-label" for="question">Your question</label
        ><textarea
          id="question"
          maxlength="1500"
          rows="3"
          placeholder="How do I build a settings form with Little?"
          .value=${this.question}
          ?disabled=${this.busy}
          @input=${(e: Event) => {
            this.question = (e.target as HTMLTextAreaElement).value;
          }}
        ></textarea>
        <div class="submit-row">
          <span class="hint">Each question is answered independently.</span
          >${this.busy ? html`<button type="button" class="secondary" @click=${() => this.pending?.abort()}>Stop</button>` : html`<button type="submit" ?disabled=${this.question.trim().length < 3}>${this.mode === "assistant" ? "Ask Little" : "Search docs"}<span aria-hidden="true"> ↗</span></button>`}
        </div>
      </form>
      <div class="suggestions" aria-label="Suggested questions">
        ${examples.map(
          (question) =>
            html`<button
              class="suggestion"
              ?disabled=${this.busy}
              @click=${() => {
                this.question = question;
                void this.ask();
              }}
            >
              ${question}<span aria-hidden="true"> ↗</span>
            </button>`,
        )}
      </div>
      <div role="status" aria-live="polite">
        ${this.busy ? html`<p class="loading">Finding guidance in the toolkit documentation…</p>` : ""}
      </div>
      ${this.error ? html`<p role="alert" class="error">${this.error}</p>` : ""}
      ${
        this.result
          ? html`<article
              aria-label="${this.result.mode === "assistant" ? "Assistant answer" : "Documentation results"}"
            >
              <div class="result-head">
                <h2>
                  ${this.result.mode === "assistant" ? "Little’s answer" : "From the documentation"}
                </h2>
                ${
                  this.result.mode === "assistant"
                    ? html`<button
                        class="secondary"
                        @click=${async () => {
                          try {
                            await navigator.clipboard.writeText(
                              this.result!.answer,
                            );
                            this.copied = true;
                          } catch {
                            this.error =
                              "Copy isn’t available in this browser. Select the answer text to copy it.";
                          }
                        }}
                      >
                        ${this.copied ? "Copied" : "Copy answer"}
                      </button>`
                    : ""
                }
              </div>
              ${this.answerContent(this.result.answer)}
              <div class="sources">
                ${this.result.sources.map(
                  (source) =>
                    html`<div class="source">
                      <h3>
                        <a
                          href=${source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          >${source.title}</a
                        >
                      </h3>
                      ${source.storybookUrl ? html`<a class="story-link" href=${source.storybookUrl} target="_blank" rel="noopener noreferrer">Open in Storybook ↗</a>` : ""}${this.result!.mode === "search" ? html`<pre class="excerpt" tabindex="0" aria-label="Source excerpt">${source.text?.slice(0, 1100)}${(source.text?.length || 0) > 1100 ? "…" : ""}</pre>` : ""}
                    </div>`,
                )}
              </div>
              <p class="hint">
                Toolkit ${knowledge.version} · Review the linked sources before
                using generated code.
              </p>
            </article>`
          : ""
      }
      <footer>
        <a
          href="https://zeroheight.com/75c403f45"
          target="_blank"
          rel="noopener noreferrer"
          >Usage guide ↗</a
        ><a
          href="https://github.com/AnkurLittleRaj/lil-toolkit"
          target="_blank"
          rel="noopener noreferrer"
          >Source code ↗</a
        >
      </footer>
    </main>`;
  }
  static styles = css`
    :host {
      display: block;
      color: var(--lil-text-primary);
      font-family: var(--lil-font-family);
      font-size: 14px;
      line-height: 1.6;
    }
    * {
      box-sizing: border-box;
    }
    main {
      max-width: 900px;
      margin: 0 auto;
      padding: 48px 32px;
    }
    .brand {
      font-size: 11px;
      letter-spacing: 0.13em;
      font-weight: 600;
      color: var(--lil-text-secondary);
    }
    .brand span {
      font-weight: 400;
      letter-spacing: 0;
      margin-left: 12px;
    }
    h1 {
      font-size: 44px;
      letter-spacing: -0.04em;
      line-height: 1.15;
      margin: 20px 0 14px;
      font-weight: 600;
    }
    .spark {
      color: var(--lil-accent-solid);
      margin-left: 14px;
      font-size: 32px;
    }
    p {
      margin: 8px 0;
    }
    header p {
      color: var(--lil-text-secondary);
    }
    header .intro {
      color: var(--lil-text-primary);
      font-size: 20px;
    }
    .meta {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      margin: 24px 0;
      font-size: 12px;
      color: var(--lil-text-secondary);
    }
    .connection {
      padding: 12px 16px;
      background: var(--lil-accent-subtle);
      color: var(--lil-text-primary);
      border-radius: 8px;
      font-size: 12px;
      margin-bottom: 24px;
    }
    form {
      border: 1px solid var(--lil-border-default);
      border-radius: 12px;
      padding: 24px;
      background: var(--lil-surface-panel);
    }
    .options {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
    }
    label {
      display: block;
      font-weight: 500;
      flex: 1;
    }
    select {
      display: block;
      margin-top: 6px;
      width: 100%;
    }
    select,
    textarea,
    button {
      font: inherit;
    }
    select,
    textarea {
      background: var(--lil-surface-panel);
      color: var(--lil-text-primary);
      border: 1px solid var(--lil-border-strong);
      border-radius: 6px;
      padding: 10px 12px;
      min-height: 44px;
    }
    textarea {
      width: 100%;
      resize: vertical;
      margin-top: 8px;
      line-height: 1.6;
    }
    textarea::placeholder {
      color: var(--lil-text-muted);
    }
    .submit-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-top: 16px;
    }
    .hint {
      color: var(--lil-text-secondary);
      font-size: 12px;
    }
    button {
      cursor: pointer;
      min-height: 44px;
      padding: 10px 18px;
      border: 1px solid transparent;
      border-radius: 6px;
      background: var(--lil-accent-solid);
      color: var(--lil-text-on-accent);
      font-weight: 500;
    }
    button:hover {
      background: var(--lil-accent-hover);
    }
    button:disabled {
      cursor: default;
      opacity: 0.55;
    }
    :is(button, select, textarea, a):focus-visible {
      outline: 3px solid var(--lil-accent-focus);
      outline-offset: 3px;
    }
    .suggestions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 20px 0 32px;
    }
    .suggestion,
    .secondary {
      background: var(--lil-surface-panel);
      border-color: var(--lil-border-default);
      color: var(--lil-text-primary);
      font-size: 12px;
      font-weight: 400;
    }
    .suggestion {
      text-align: left;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .suggestion:hover,
    .secondary:hover {
      background: var(--lil-surface-hover);
    }
    h2 {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }
    h3 {
      font-size: 14px;
      margin: 0;
      font-weight: 500;
    }
    a {
      color: var(--lil-accent-text);
      text-underline-offset: 3px;
    }
    article {
      border-top: 1px solid var(--lil-border-default);
      padding-top: 24px;
    }
    .result-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    .answer-text {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
    pre {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      padding: 16px;
      border: 1px solid var(--lil-border-default);
      border-radius: 8px;
      background: var(--lil-surface-subtle);
      font:
        12px/1.7 ui-monospace,
        monospace;
    }
    .source {
      border-left: 2px solid var(--lil-border-default);
      padding-left: 16px;
      margin: 20px 0;
    }
    .story-link {
      font-size: 12px;
    }
    .excerpt {
      max-height: 200px;
      overflow: auto;
    }
    .error {
      color: var(--lil-danger-text);
      background: var(--lil-danger-surface);
      padding: 16px;
      border-radius: 8px;
    }
    .loading {
      color: var(--lil-text-secondary);
    }
    footer {
      display: flex;
      gap: 24px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid var(--lil-border-default);
      font-size: 12px;
    }
    @media (max-width: 600px) {
      main {
        padding: 28px 8px;
      }
      h1 {
        font-size: 36px;
      }
      form {
        padding: 16px;
      }
      .options {
        flex-direction: column;
        gap: 12px;
      }
      .suggestions {
        grid-template-columns: 1fr;
      }
      .submit-row {
        align-items: flex-start;
      }
      .meta {
        gap: 12px;
      }
    }
  `;
}
if (!customElements.get("ask-little"))
  customElements.define("ask-little", AskLittle);
