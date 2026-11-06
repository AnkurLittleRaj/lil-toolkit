import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { renderComponent } from "../component-renderer";

const meta: Meta = {
  title: "Components/Toast",
  component: "lil-toast",
  tags: ["autodocs"],
  args: {
    heading: "Changes saved",
    message: "Your preferences are up to date.",
    open: true,
  },
  argTypes: {
    heading: {
      control: "text",
    },
    message: {
      control: "text",
    },
    open: {
      control: "boolean",
    },
  },
  render: (args) => renderComponent("lil-toast", args),
  parameters: {
    docs: {
      description: {
        component:
          "Nonblocking confirmation announced through a polite live region. Keep essential actions and persistent status outside transient toasts.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const Default: Story = {};
export const HeadingOnly: Story = {
  args: {
    message: "",
  },
};
export const Hidden: Story = {
  args: {
    open: false,
  },
};
