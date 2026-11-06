import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { renderComponent } from "../component-renderer";

const meta: Meta = {
  title: "Components/Tabs",
  component: "lil-tabs",
  tags: ["autodocs"],
  args: {
    label: "Settings",
    tabs: [
      {
        label: "Profile",
        value: "profile",
      },
      {
        label: "Notifications",
        value: "notifications",
      },
    ],
    value: "profile",
  },
  argTypes: {
    label: {
      control: "text",
    },
    tabs: {
      control: "object",
    },
    value: {
      control: "text",
    },
  },
  render: (args) => renderComponent("lil-tabs", args),
  parameters: {
    docs: {
      description: {
        component:
          "Related views with arrow-key navigation, Home and End. Use matching named slots for panel content. Disabled tabs are skipped by keyboard navigation.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const Default: Story = {};
export const Notifications: Story = {
  args: {
    value: "notifications",
  },
};
export const DisabledTab: Story = {
  args: {
    tabs: [
      {
        label: "Profile",
        value: "profile",
      },
      {
        label: "Notifications",
        value: "notifications",
      },
      {
        label: "Billing",
        value: "billing",
        disabled: true,
      },
    ],
  },
};
