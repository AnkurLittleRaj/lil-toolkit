import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { renderComponent } from "../component-renderer";

const meta: Meta = {
  title: "Components/Input",
  component: "lil-input",
  tags: ["autodocs"],
  args: {
    label: "Email address",
    name: "email",
    type: "email",
    value: "",
    placeholder: "you@example.com",
    help: "We’ll only send account updates.",
    error: "",
    required: false,
    disabled: false,
    autocomplete: "email",
  },
  argTypes: {
    label: {
      control: "text",
    },
    name: {
      control: "text",
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "url", "tel"],
    },
    value: {
      control: "text",
    },
    placeholder: {
      control: "text",
    },
    help: {
      control: "text",
    },
    error: {
      control: "text",
    },
    required: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    autocomplete: {
      control: "text",
    },
  },
  render: (args) => renderComponent("lil-input", args),
  parameters: {
    docs: {
      description: {
        component:
          "Keep labels visible. Use helper text for context and a specific validation error after checking the value. Native form participation, lilInput and lilChange are available.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;
export const Default: Story = {};
export const Filled: Story = {
  args: {
    value: "ankur@example.com",
  },
};
export const Error: Story = {
  args: {
    value: "invalid",
    error: "Enter a valid email address.",
  },
};
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
export const Required: Story = {
  args: {
    required: true,
  },
};
export const Password: Story = {
  args: {
    type: "password",
    label: "Password",
    placeholder: "Enter password",
    autocomplete: "current-password",
  },
};
export const Search: Story = {
  args: {
    type: "search",
    label: "Search customers",
    placeholder: "Search by name",
    help: "",
  },
};
