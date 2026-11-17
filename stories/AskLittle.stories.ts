import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "./ask-little";

const meta: Meta = {
  title: "Ask Little/Assistant",
  parameters: { layout: "fullscreen" },
};
export default meta;
export const AskLittle: StoryObj = {
  name: "Ask Little",
  render: () => html`<ask-little></ask-little>`,
};
