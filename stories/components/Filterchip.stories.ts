import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { renderComponent } from "../component-renderer";

const meta: Meta = {
  title: "Components/Filter chip",
  component: "lil-filter-chip",
  tags: ["autodocs"],
  args: {
    label: "All plans",
    selected: false,
    expanded: false,
  },
  argTypes: {
    label: {
      control: "text",
    },
    selected: {
      control: "boolean",
    },
    expanded: {
      control: "boolean",
    },
  },
  render: (args) => renderComponent("lil-filter-chip", args),
  parameters: {
    docs: {
      description: {
        component:
          "A trigger for a filter panel or menu. Label the active value, expose expanded state, and provide a way to clear filtering in the surrounding interface.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const Default: Story = {};
export const Selected: Story = {
  args: {
    label: "Pro plan",
    selected: true,
  },
};
export const Expanded: Story = {
  args: {
    expanded: true,
  },
};
