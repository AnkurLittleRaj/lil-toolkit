import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { renderComponent } from "../component-renderer";

const meta: Meta = {
  title: "Components/Dropdown menu",
  component: "lil-menu",
  tags: ["autodocs"],
  args: {
    label: "Last 30 days",
    items: [
      {
        label: "Last 7 days",
        value: "7",
      },
      {
        label: "Last 30 days",
        value: "30",
      },
      {
        label: "This year",
        value: "year",
      },
    ],
    value: "30",
  },
  argTypes: {
    label: {
      control: "text",
    },
    items: {
      control: "object",
    },
    value: {
      control: "text",
    },
  },
  render: (args) => renderComponent("lil-menu", args),
  parameters: {
    docs: {
      description: {
        component:
          "Open the trigger to choose an option. Arrow keys move focus; Escape closes and restores focus; outside click closes. A selection emits lilSelect with detail.value.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const Default: Story = {};
export const DisabledOption: Story = {
  args: {
    items: [
      {
        label: "Last 7 days",
        value: "7",
      },
      {
        label: "Last 30 days",
        value: "30",
      },
      {
        label: "This year",
        value: "year",
        disabled: true,
      },
    ],
  },
};
export const PlanFilter: Story = {
  args: {
    label: "All plans",
    value: "all",
    items: [
      {
        label: "All plans",
        value: "all",
      },
      {
        label: "Pro",
        value: "pro",
      },
      {
        label: "Starter",
        value: "starter",
      },
    ],
  },
};
