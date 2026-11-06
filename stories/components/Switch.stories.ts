import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { renderComponent } from "../component-renderer";

const meta: Meta = {
  title: "Components/Switch",
  component: "lil-switch",
  tags: ["autodocs"],
  args: {
    label: "Email notifications",
    checked: false,
    disabled: false,
    name: "notifications",
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
  },
  render: (args) => renderComponent("lil-switch", args),
  parameters: {
    docs: {
      description: {
        component:
          "Use for an immediate on/off preference. Always provide a label. Click or press Space to toggle; lilChange reports detail.checked.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const Default: Story = {};
export const On: Story = {
  args: {
    checked: true,
  },
};
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
export const DisabledOn: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};
