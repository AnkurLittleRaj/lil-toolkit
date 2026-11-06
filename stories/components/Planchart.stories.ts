import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { renderComponent } from "../component-renderer";

const meta: Meta = {
  title: "Components/Plan chart",
  component: "lil-plan-chart",
  tags: ["autodocs"],
  args: {
    heading: "Subscriptions by plan",
    data: [
      {
        label: "Pro",
        value: 68,
      },
      {
        label: "Starter",
        value: 24,
      },
      {
        label: "Business",
        value: 8,
      },
    ],
  },
  argTypes: {
    heading: {
      control: "text",
    },
    data: {
      control: "object",
    },
  },
  render: (args) => renderComponent("lil-plan-chart", args),
  parameters: {
    docs: {
      description: {
        component:
          "Use labeled horizontal bars for part-to-whole comparisons. Values represent percentages. Keep labels and percentages visible in both themes.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const Default: Story = {};
export const SinglePlan: Story = {
  args: {
    data: [
      {
        label: "Pro",
        value: 100,
      },
    ],
  },
};
export const Empty: Story = {
  args: {
    data: [],
  },
};
