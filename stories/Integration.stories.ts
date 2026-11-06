import type { Meta, StoryObj } from "@storybook/web-components-vite";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { createApp, h, ref } from "vue";
import {
  LilInput as ReactInput,
  LilButton as ReactButton,
} from "../packages/react/dist/index.js";
import {
  LilInput as VueInput,
  LilButton as VueButton,
} from "../packages/vue/dist/index.js";
const meta: Meta = { title: "Integration/Framework bindings" };
export default meta;
type Story = StoryObj;
export const ReactBindings: Story = {
  render: () => {
    const mount = document.createElement("div");
    mount.className = "stack control-width";
    function Example() {
      const [value, setValue] = useState("");
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(ReactInput, {
          label: "React email",
          value,
          onLilInput: (e) => setValue(e.detail.value),
        }),
        React.createElement("output", { "aria-live": "polite" }, value),
        React.createElement(ReactButton, null, "React action"),
      );
    }
    createRoot(mount).render(React.createElement(Example));
    return mount;
  },
};
export const VueBindings: Story = {
  render: () => {
    const mount = document.createElement("div");
    mount.className = "stack control-width";
    createApp({
      setup() {
        const value = ref("");
        return () =>
          h("div", { class: "stack" }, [
            h(VueInput, {
              label: "Vue email",
              modelValue: value.value,
              "onUpdate:modelValue": (next: string) => (value.value = next),
            }),
            h("output", { "aria-live": "polite" }, value.value),
            h(VueButton, {}, () => "Vue action"),
          ]);
      },
    }).mount(mount);
    return mount;
  },
};
