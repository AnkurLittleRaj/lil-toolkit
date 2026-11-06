import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { renderComponent } from "../component-renderer";

const meta: Meta = {
  title: "Components/Icon",
  component: "lil-icon",
  tags: ["autodocs"],
  args: {
    name: "grid",
    accessibleLabel: "Overview",
  },
  argTypes: {
    name: {
      control: "select",
      options: [
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
      ],
    },
    accessibleLabel: {
      control: "text",
    },
  },
  render: (args) => renderComponent("lil-icon", args),
  parameters: {
    docs: {
      description: {
        component:
          "19 outline icons from the original Figma definitions. Omit accessibleLabel when decorative; label the enclosing button for icon-only actions. CSS variable --lil-icon-size controls 16/20/24px sizing.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const Default: Story = {};
export const Settings: Story = {
  args: {
    name: "settings",
    accessibleLabel: "Settings",
  },
};
export const Decorative: Story = {
  args: {
    name: "plus",
    accessibleLabel: "",
  },
};
