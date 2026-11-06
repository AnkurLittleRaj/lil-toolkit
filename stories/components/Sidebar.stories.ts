import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { renderComponent } from "../component-renderer";

const meta: Meta = {
  title: "Components/Sidebar",
  component: "lil-sidebar",
  tags: ["autodocs"],
  args: {
    brand: "little / workspace",
    workspace: "Ankur’s workspace",
    items: [
      {
        label: "Overview",
        value: "overview",
        icon: "grid",
      },
      {
        label: "Customers",
        value: "customers",
        icon: "users",
      },
      {
        label: "Subscriptions",
        value: "subscriptions",
        icon: "card",
      },
      {
        label: "Settings",
        value: "settings",
        icon: "settings",
      },
    ],
    selected: "overview",
  },
  argTypes: {
    brand: {
      control: "text",
    },
    workspace: {
      control: "text",
    },
    items: {
      control: "object",
    },
    selected: {
      control: "text",
    },
  },
  render: (args) => renderComponent("lil-sidebar", args),
  parameters: {
    docs: {
      description: {
        component:
          "232px desktop sidebar; below 1024px it becomes a modal navigation menu. Native dialog behavior contains focus and supports Escape. lilNavigate reports detail.value.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const Default: Story = {};
export const SettingsSelected: Story = {
  args: {
    selected: "settings",
  },
};
export const Minimal: Story = {
  args: {
    items: [
      {
        label: "Overview",
        value: "overview",
        icon: "grid",
      },
      {
        label: "Settings",
        value: "settings",
        icon: "settings",
      },
    ],
  },
};
