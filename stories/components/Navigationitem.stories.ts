import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { renderComponent } from "../component-renderer";

const meta: Meta = {
  title: "Components/Navigation item",
  component: "lil-nav-item",
  tags: ["autodocs"],
  args: {
    label: "Overview",
    icon: "grid",
    selected: false,
    href: "",
  },
  argTypes: {
    label: {
      control: "text",
    },
    icon: {
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
    selected: {
      control: "boolean",
    },
    href: {
      control: "text",
    },
  },
  render: (args) => renderComponent("lil-nav-item", args),
  parameters: {
    docs: {
      description: {
        component:
          "One active destination at a time. selected exposes aria-current. Use href for a real route, or lilNavigate for application-managed navigation.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const Default: Story = {};
export const Selected: Story = {
  args: {
    selected: true,
  },
};
export const WithLink: Story = {
  args: {
    label: "Source repository",
    icon: "arrow",
    href: "https://github.com/AnkurLittleRaj/lil-toolkit",
  },
};
