import { LitElement, html, nothing } from "lit";
import type { LilCustomer } from "../packages/core/src/types";
const customers: LilCustomer[] = [
  {
    id: "olivia",
    name: "Olivia Martin",
    email: "olivia@example.com",
    plan: "Pro monthly",
    status: "Active",
    amount: "$29.00",
    joined: "Today, 10:42",
  },
  {
    id: "alex",
    name: "Alex Chen",
    email: "alex@example.com",
    plan: "Starter",
    status: "Trial",
    amount: "$9.00",
    joined: "Today, 09:16",
  },
  {
    id: "sofia",
    name: "Sofia Patel",
    email: "sofia@example.com",
    plan: "Business",
    status: "Active",
    amount: "$79.00",
    joined: "Yesterday, 16:30",
  },
];
class DemoApp extends LitElement {
  static properties = {
    initialPage: { type: String, attribute: "initial-page" },
    page: { state: true },
    tab: { state: true },
    theme: { state: true },
    range: { state: true },
    plan: { state: true },
    dialogOpen: { state: true },
    toast: { state: true },
    first: { state: true },
    last: { state: true },
    email: { state: true },
    inviteEmail: { state: true },
    inviteError: { state: true },
  };
  declare initialPage: string;
  declare page: string;
  declare tab: string;
  declare theme: string;
  declare range: string;
  declare plan: string;
  declare dialogOpen: boolean;
  declare toast: string;
  declare first: string;
  declare last: string;
  declare email: string;
  declare inviteEmail: string;
  declare inviteError: string;
  private timer?: ReturnType<typeof setTimeout>;
  constructor() {
    super();
    this.page = "overview";
    this.tab = "profile";
    this.theme = "";
    this.range = "30";
    this.plan = "all";
    this.dialogOpen = false;
    this.toast = "";
    this.first = "Ankur";
    this.last = "Raj";
    this.email = "ankur@example.com";
    this.inviteEmail = "";
    this.inviteError = "";
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback();
    this.page = this.initialPage || "overview";
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this.timer);
  }
  private notify(message: string) {
    this.toast = message;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => (this.toast = ""), 4000);
  }
  private toggleTheme() {
    const current =
      this.theme || document.documentElement.dataset.lilTheme || "light";
    this.theme = current === "dark" ? "light" : "dark";
  }
  private settings() {
    return html`<lil-tabs
      .tabs=${[
        { label: "Profile", value: "profile" },
        { label: "Notifications", value: "notifications" },
      ]}
      .value=${this.tab}
      @lilChange=${(e: CustomEvent) => {
        if ((e.target as HTMLElement).tagName === "LIL-TABS")
          this.tab = e.detail.value;
      }}
      ><div slot="profile" class="stack" style="max-width:none">
        <lil-card
          heading="Profile details"
          description="Your personal details and contact information."
          ><form
            class="demo-form"
            @submit=${(e: SubmitEvent) => {
              e.preventDefault();
              this.notify("Changes saved");
            }}
          >
            <div class="avatar" aria-label="Ankur Raj">AR</div>
            <div class="name-fields">
              <lil-input
                label="First name"
                name="first"
                .value=${this.first}
                @lilInput=${(e: CustomEvent) => (this.first = e.detail.value)}
              ></lil-input
              ><lil-input
                label="Last name"
                name="last"
                .value=${this.last}
                @lilInput=${(e: CustomEvent) => (this.last = e.detail.value)}
              ></lil-input>
            </div>
            <lil-input
              label="Email address"
              name="email"
              type="email"
              required
              .value=${this.email}
              @lilInput=${(e: CustomEvent) => (this.email = e.detail.value)}
              help="Used for sign-in and important account updates."
            ></lil-input>
            <div class="form-actions">
              <lil-button
                @click=${() => {
                  const form = this.querySelector("form");
                  if (form?.reportValidity()) this.notify("Changes saved");
                }}
                >Save changes</lil-button
              ><lil-button
                variant="secondary"
                @click=${() => {
                  this.first = "Ankur";
                  this.last = "Raj";
                  this.email = "ankur@example.com";
                }}
                >Cancel</lil-button
              >
            </div>
          </form></lil-card
        ><lil-card
          heading="Workspace preferences"
          description="Make this workspace feel like yours."
          ><div class="demo-form">
            <lil-switch label="Weekly activity summary" checked></lil-switch>
            <div>
              <lil-button variant="secondary" @click=${() => this.toggleTheme()}
                >Switch color theme</lil-button
              >
            </div>
          </div></lil-card
        >
      </div>
      <div slot="notifications">
        <lil-card
          heading="Email notifications"
          description="Choose the updates you want to receive."
          ><div class="demo-form">
            <lil-switch label="Product updates"></lil-switch
            ><lil-switch label="Weekly summary"></lil-switch
            ><lil-switch label="Billing reminders" checked></lil-switch>
            <div>
              <lil-button
                @click=${() => this.notify("Notification preferences saved")}
                >Save changes</lil-button
              >
            </div>
          </div></lil-card
        >
      </div></lil-tabs
    >`;
  }
  private dashboard() {
    const filtered = customers.filter(
      (c) => this.plan === "all" || c.plan.toLowerCase().includes(this.plan),
    );
    const rangeLabel =
      this.range === "7"
        ? "Last 7 days"
        : this.range === "year"
          ? "This year"
          : "Last 30 days";
    const all = [
      { label: "Jun", value: 22000 },
      { label: "Jul", value: 29000 },
      { label: "Aug", value: 25000 },
      { label: "Sep", value: 34000 },
      { label: "Oct", value: 38000 },
      { label: "Nov", value: 48000 },
    ];
    const data =
      this.range === "7"
        ? [
            { label: "Mon", value: 3200 },
            { label: "Tue", value: 4100 },
            { label: "Wed", value: 3600 },
            { label: "Thu", value: 4900 },
            { label: "Fri", value: 5700 },
            { label: "Sat", value: 4200 },
            { label: "Sun", value: 6100 },
          ]
        : all;
    return html`<div class="demo-actions">
        <lil-menu
          .label=${rangeLabel}
          .value=${this.range}
          .items=${[
            { label: "Last 7 days", value: "7" },
            { label: "Last 30 days", value: "30" },
            { label: "This year", value: "year" },
          ]}
          @lilSelect=${(e: CustomEvent) => (this.range = e.detail.value)}
        ></lil-menu
        ><lil-button @click=${() => (this.dialogOpen = true)}
          ><lil-icon slot="icon" name="plus"></lil-icon>Invite
          teammate</lil-button
        >
      </div>
      <div class="metrics">
        ${[
          ["Total revenue", "$48,290", "↗ 12.8% vs. last month"],
          ["Active users", "2,420", "↗ 8.2% vs. last month"],
          ["Subscriptions", "1,284", "↗ 6.4% vs. last month"],
          ["Net retention", "108.4%", "↗ 2.1 pts vs. last month"],
        ].map(
          ([label, value, trend]) =>
            html`<lil-metric-card
              .label=${label}
              .value=${value}
              .trend=${trend}
              sentiment="positive"
            ></lil-metric-card>`,
        )}
      </div>
      <lil-chart
        .data=${data}
        .description=${this.range === "7" ? "Daily revenue · USD" : "Monthly recurring revenue · USD"}
        .summary=${this.range === "7" ? "Sample data · last seven days" : "Nov $48k · Oct $38k · +26.3%"}
      ></lil-chart>
      <div class="demo-grid">
        <lil-plan-chart
          .data=${[
            { label: "Pro", value: 68 },
            { label: "Starter", value: 24 },
            { label: "Business", value: 8 },
          ]}
        ></lil-plan-chart
        ><lil-activity-card
          .items=${[
            {
              title: "New Pro subscription",
              description: "Olivia Martin · 2 minutes ago",
              icon: "plus",
            },
            {
              title: "Payment received",
              description: "+$29.00 · 18 minutes ago",
              icon: "card",
            },
            {
              title: "Team invitation accepted",
              description: "Alex Chen · 1 hour ago",
              icon: "users",
            },
          ]}
        ></lil-activity-card>
      </div>
      <lil-card
        heading="Recent customers"
        description="The latest subscriptions in your workspace."
        ><div class="row" style="margin-bottom:16px">
          <lil-menu
            .label=${this.plan === "all" ? "All plans" : this.plan === "pro" ? "Pro" : "Starter"}
            .value=${this.plan}
            .items=${[
              { label: "All plans", value: "all" },
              { label: "Pro", value: "pro" },
              { label: "Starter", value: "starter" },
            ]}
            @lilSelect=${(e: CustomEvent) => (this.plan = e.detail.value)}
          ></lil-menu
          ><lil-badge>${filtered.length} customers</lil-badge>
        </div>
        <lil-customer-table .customers=${filtered}></lil-customer-table
      ></lil-card>`;
  }
  render() {
    return html`<div data-lil-theme=${this.theme || nothing}>
      <div class="demo-shell">
        <lil-sidebar
          .selected=${this.page}
          .items=${[
            { label: "Overview", value: "overview", icon: "grid" },
            { label: "Settings", value: "settings", icon: "settings" },
          ]}
          @lilNavigate=${(e: CustomEvent) => (this.page = e.detail.value)}
          ><lil-button
            slot="mobile-actions"
            variant="ghost"
            accessible-label="Switch color theme"
            @click=${() => this.toggleTheme()}
            ><lil-icon name="moon"></lil-icon></lil-button
        ></lil-sidebar>
        <main class="demo-main">
          <div class="demo-top">
            <p>
              Workspace / ${this.page === "overview" ? "Overview" : "Settings"}
            </p>
            <lil-button
              variant="secondary"
              accessible-label="Switch color theme"
              @click=${() => this.toggleTheme()}
              ><lil-icon name="moon"></lil-icon
            ></lil-button>
          </div>
          <h1>${this.page === "overview" ? "Overview" : "Settings"}</h1>
          <p class="intro">
            ${this.page === "overview" ? "A clear view of how your business is doing." : "Manage your profile and workspace preferences."}
          </p>
          ${this.page === "overview" ? this.dashboard() : this.settings()}
          <footer class="demo-footer">
            <span>Sample data · November 2026</span><span>By Ankur</span>
          </footer>
        </main>
      </div>
      <lil-dialog
        .open=${this.dialogOpen}
        heading="Invite a teammate"
        description="Give someone access to your workspace."
        @lilClose=${() => (this.dialogOpen = false)}
        ><lil-input
          label="Email address"
          type="email"
          .value=${this.inviteEmail}
          .error=${this.inviteError}
          @lilInput=${(e: CustomEvent) => {
            this.inviteEmail = e.detail.value;
            this.inviteError = "";
          }}
          placeholder="teammate@example.com"
          help="Demo only; no email is sent."
        ></lil-input
        ><lil-button
          slot="actions"
          variant="secondary"
          @click=${() => (this.dialogOpen = false)}
          >Cancel</lil-button
        ><lil-button
          slot="actions"
          @click=${() => {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.inviteEmail)) {
              this.inviteError = "Enter a valid email address.";
              return;
            }
            this.dialogOpen = false;
            this.notify("Invitation ready — demo only");
          }}
          >Send invitation</lil-button
        ></lil-dialog
      >
      <div class="toast-position">
        <lil-toast
          .open=${!!this.toast}
          .heading=${this.toast}
          message="Demo confirmation; changes are not stored."
        ></lil-toast>
      </div>
    </div>`;
  }
}
if (!customElements.get("lil-demo-app"))
  customElements.define("lil-demo-app", DemoApp);
