import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { renderComponent } from "../component-renderer";

const meta: Meta = {
  title: "Components/Dialog",
  component: "lil-dialog",
  tags: ["autodocs"],
  args: {
    heading: "Invite a teammate",
    description: "Give someone access to your workspace.",
    open: false,
  },
  argTypes: {
    heading: {
      control: "text",
    },
    description: {
      control: "text",
    },
    open: {
      control: "boolean",
    },
  },
  render: (args) => renderComponent("lil-dialog", args),
  parameters: {
    docs: {
      description: {
        component:
          "A native modal dialog for one focused task. The Open dialog trigger demonstrates focus containment, Escape and focus return. Put form content in the default slot and actions in the actions slot.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const Default: Story = {};
export const Open: Story = {
  args: {
    open: true,
  },
};
export const WithoutDescription: Story = {
  args: {
    description: "",
  },
};
