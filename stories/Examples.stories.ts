import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "./demo-app";
const meta: Meta = {
  title: "Examples/SaaS",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Separate examples built from the same reusable library. Menus, navigation, filters, forms, tabs and dialogs are interactive. Sample data; no backend or email service.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const Dashboard: Story = {
  render: () => html`<lil-demo-app initial-page="overview"></lil-demo-app>`,
};
export const Settings: Story = {
  render: () => html`<lil-demo-app initial-page="settings"></lil-demo-app>`,
};
export const MobileDashboard: Story = {
  ...Dashboard,
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
export const MobileSettings: Story = {
  ...Settings,
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
