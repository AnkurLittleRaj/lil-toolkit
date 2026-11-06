import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { renderComponent } from "../component-renderer";

const meta: Meta = {
  title: "Components/Data state",
  component: "lil-data-state",
  tags: ["autodocs"],
  args: {
    state: "empty",
    heading: "",
    message: "",
  },
  argTypes: {
    state: {
      control: "select",
      options: ["empty", "loading", "error"],
    },
    heading: {
      control: "text",
    },
    message: {
      control: "text",
    },
  },
  render: (args) => renderComponent("lil-data-state", args),
  parameters: {
    docs: {
      description: {
        component:
          "Design empty, loading and error states. Explain the situation and offer recovery only when it helps. Error retry emits lilRetry.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const Default: Story = {};
export const Loading: Story = {
  args: {
    state: "loading",
  },
};
export const Error: Story = {
  args: {
    state: "error",
  },
};
export const Custom: Story = {
  args: {
    state: "empty",
    heading: "No matching customers",
    message: "Try changing your filters.",
  },
};
