import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
const meta: Meta = {
  title: "Components/Navigation",
  parameters: {
    docs: {
      description: {
        component:
          "Choose one active destination. Desktop sidebars become modal menus on mobile. Use tabs for related views; menus offer short choices.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const NavigationItems: Story = {
  render: () =>
    html`<div style="width:232px">
      <lil-nav-item label="Overview" selected></lil-nav-item
      ><lil-nav-item label="Settings" icon="settings"></lil-nav-item>
    </div>`,
};
export const Tabs: Story = {
  render: () =>
    html`<lil-tabs
      .tabs=${[
        { label: "Profile", value: "profile" },
        { label: "Notifications", value: "notifications" },
      ]}
      ><p slot="profile">Profile details and contact information.</p>
      <p slot="notifications">
        Choose the updates you want to receive.
      </p></lil-tabs
    >`,
};
export const Menu: Story = {
  render: () =>
    html`<div style="min-height:260px">
      <lil-menu
        label="Last 30 days"
        value="30"
        .items=${[
          { label: "Last 7 days", value: "7" },
          { label: "Last 30 days", value: "30" },
          { label: "This year", value: "year" },
        ]}
      ></lil-menu>
    </div>`,
};
export const FilterChip: Story = {
  render: () =>
    html`<div class="row">
      <lil-filter-chip label="All plans"></lil-filter-chip
      ><lil-filter-chip label="Pro plan" selected></lil-filter-chip>
    </div>`,
};
export const Icons: Story = {
  render: () =>
    html`<div class="row">
      ${[
        "grid",
        "users",
        "card",
        "settings",
        "search",
        "plus",
        "check",
        "chevron",
        "arrow",
        "menu",
        "close",
        "bell",
        "filter",
        "download",
        "calendar",
        "moon",
        "help",
        "mail",
        "more",
      ].map(
        (name) =>
          html`<div style="width:100px">
            <lil-icon name=${name} accessible-label=${name}></lil-icon>
            <p>${name}</p>
          </div>`,
      )}
    </div>`,
};
