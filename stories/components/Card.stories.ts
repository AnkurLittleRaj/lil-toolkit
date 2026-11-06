import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { renderComponent } from "../component-renderer";

const meta: Meta = {
  title: "Components/Card",
  component: "lil-card",
  tags: ["autodocs"],
  args: {
    heading: "Workspace preferences",
    description: "Make this workspace feel like yours.",
  },
  argTypes: {
    heading: {
      control: "text",
    },
    description: {
      control: "text",
    },
  },
  render: (args) => renderComponent("lil-card", args),
  parameters: {
    docs: {
      description: {
        component:
          "A bordered surface for one group of related content. Use heading and description for context; compose the default slot from other components.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const Default: Story = {};
export const WithoutDescription: Story = {
  args: {
    description: "",
  },
};
export const ContentOnly: Story = {
  args: {
    heading: "",
    description: "",
  },
};
