import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { renderComponent } from "../component-renderer";

const meta: Meta = {
  title: "Components/Metric card",
  component: "lil-metric-card",
  tags: ["autodocs"],
  args: {
    label: "Total revenue",
    value: "$48,290",
    trend: "↗ 12.8% vs. last month",
    sentiment: "positive",
  },
  argTypes: {
    label: {
      control: "text",
    },
    value: {
      control: "text",
    },
    trend: {
      control: "text",
    },
    sentiment: {
      control: "select",
      options: ["positive", "neutral", "negative"],
    },
  },
  render: (args) => renderComponent("lil-metric-card", args),
  parameters: {
    docs: {
      description: {
        component:
          "Summarize one metric with its timeframe and a textual direction cue. Choose neutral sentiment when an increase is not inherently positive.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const Default: Story = {};
export const Neutral: Story = {
  args: {
    label: "Support requests",
    value: "128",
    trend: "12 more than last month",
    sentiment: "neutral",
  },
};
export const Negative: Story = {
  args: {
    label: "Failed payments",
    value: "24",
    trend: "↗ 6 vs. last month",
    sentiment: "negative",
  },
};
export const NoTrend: Story = {
  args: {
    trend: "",
  },
};
