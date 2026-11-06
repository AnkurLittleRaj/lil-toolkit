import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { renderComponent } from "../component-renderer";

const meta: Meta = {
  title: "Components/Activity card",
  component: "lil-activity-card",
  tags: ["autodocs"],
  args: {
    heading: "Recent activity",
    items: [
      {
        title: "New Pro subscription",
        description: "Olivia Martin · 2 minutes ago",
        icon: "plus",
      },
      {
        title: "Payment received",
        description: "+$29.00 · 18 minutes ago",
        icon: "card",
      },
      {
        title: "Team invitation accepted",
        description: "Alex Chen · 1 hour ago",
        icon: "users",
      },
    ],
  },
  argTypes: {
    heading: {
      control: "text",
    },
    items: {
      control: "object",
    },
  },
  render: (args) => renderComponent("lil-activity-card", args),
  parameters: {
    docs: {
      description: {
        component:
          "A concise event summary with actor and relative timestamp. Supply a full timestamp in product-level accessible details when needed.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const Default: Story = {};
export const Empty: Story = {
  args: {
    items: [],
  },
};
export const SingleItem: Story = {
  args: {
    items: [
      {
        title: "Workspace created",
        description: "Ankur · just now",
        icon: "grid",
      },
    ],
  },
};
