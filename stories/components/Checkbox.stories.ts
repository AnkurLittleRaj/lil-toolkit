import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { renderComponent } from "../component-renderer";

const meta: Meta = {
  title: "Components/Checkbox",
  component: "lil-checkbox",
  tags: ["autodocs"],
  args: {
    label: "Remember this device",
    checked: false,
    disabled: false,
    name: "remember",
    value: "on",
  },
  argTypes: {
    label: {
      control: "text",
    },
    checked: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    name: {
      control: "text",
    },
    value: {
      control: "text",
    },
  },
  render: (args) => renderComponent("lil-checkbox", args),
  parameters: {
    docs: {
      description: {
        component:
          "Use for independent selections. Click or press Space to toggle. The label is part of the 44px target. Emits lilChange with detail.checked.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const Default: Story = {};
export const Checked: Story = {
  args: {
    checked: true,
  },
};
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};
