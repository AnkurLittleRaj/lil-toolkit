import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { renderComponent } from "../component-renderer";

const meta: Meta = {
  title: "Components/Customer table",
  component: "lil-customer-table",
  tags: ["autodocs"],
  args: {
    caption: "Recent customers",
    customers: [
      {
        id: "olivia",
        name: "Olivia Martin",
        email: "olivia@example.com",
        plan: "Pro monthly",
        status: "Active",
        amount: "$29.00",
        joined: "Today, 10:42",
      },
      {
        id: "alex",
        name: "Alex Chen",
        email: "alex@example.com",
        plan: "Starter",
        status: "Trial",
        amount: "$9.00",
        joined: "Yesterday",
      },
    ],
  },
  argTypes: {
    caption: {
      control: "text",
    },
    customers: {
      control: "object",
    },
  },
  render: (args) => renderComponent("lil-customer-table", args),
  parameters: {
    docs: {
      description: {
        component:
          "Sortable customer records. Click the Customer heading to change sorting. On mobile the same fields become labeled records. Keep essential information rather than hiding columns.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const Default: Story = {};
export const Empty: Story = {
  args: {
    customers: [],
  },
};
export const PastDue: Story = {
  args: {
    customers: [
      {
        id: "olivia",
        name: "Olivia Martin",
        email: "olivia@example.com",
        plan: "Pro monthly",
        status: "Past due",
        amount: "$29.00",
        joined: "Today, 10:42",
      },
    ],
  },
};
