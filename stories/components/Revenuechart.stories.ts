import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { renderComponent } from "../component-renderer";

const meta: Meta = {
  title: "Components/Revenue chart",
  component: "lil-chart",
  tags: ["autodocs"],
  args: {
    heading: "Revenue over time",
    description: "Monthly recurring revenue · USD",
    data: [
      {
        label: "Jun",
        value: 22000,
      },
      {
        label: "Jul",
        value: 29000,
      },
      {
        label: "Aug",
        value: 25000,
      },
      {
        label: "Sep",
        value: 34000,
      },
      {
        label: "Oct",
        value: 38000,
      },
      {
        label: "Nov",
        value: 48000,
      },
    ],
    summary: "Nov $48k · Oct $38k · +26.3%",
    locale: "en-US",
    currency: "USD",
  },
  argTypes: {
    heading: {
      control: "text",
    },
    description: {
      control: "text",
    },
    data: {
      control: "object",
    },
    summary: {
      control: "text",
    },
    locale: {
      control: "text",
    },
    currency: {
      control: "text",
    },
  },
  render: (args) => renderComponent("lil-chart", args),
  parameters: {
    docs: {
      description: {
        component:
          "Editable zero-baseline bars with visible labels, a summary and an accessible data table. Do not rely on hover or color alone.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const Default: Story = {};
export const ZeroValues: Story = {
  args: {
    data: [
      {
        label: "Jan",
        value: 0,
      },
      {
        label: "Feb",
        value: 0,
      },
    ],
    summary: "No revenue in this period.",
  },
};
export const Empty: Story = {
  args: {
    data: [],
    summary: "No data in this period.",
  },
};
