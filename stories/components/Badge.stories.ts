import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { renderComponent } from "../component-renderer";

const meta: Meta = {
  title: "Components/Badge",
  component: "lil-badge",
  tags: ["autodocs"],
  args: {
    status: "neutral",
    content: "Draft",
  },
  argTypes: {
    status: {
      control: "select",
      options: ["neutral", "success", "warning", "danger"],
    },
    content: {
      control: "text",
    },
  },
  render: (args) => renderComponent("lil-badge", args),
  parameters: {
    docs: {
      description: {
        component:
          "Pair status color with a meaningful text label. A badge displays status; it is not an interactive filter.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const Default: Story = {};
export const Success: Story = {
  args: {
    status: "success",
    content: "Active",
  },
};
export const Warning: Story = {
  args: {
    status: "warning",
    content: "Trial",
  },
};
export const Danger: Story = {
  args: {
    status: "danger",
    content: "Past due",
  },
};
