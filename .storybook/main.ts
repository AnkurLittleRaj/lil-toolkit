import type { StorybookConfig } from "@storybook/web-components-vite";
import { fileURLToPath } from "node:url";
const config: StorybookConfig = {
  core: { disableTelemetry: true },
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.ts"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: { name: "@storybook/web-components-vite", options: {} },
  docs: { defaultName: "Documentation" },
  async viteFinal(config) {
    config.base = "./";
    config.resolve ??= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@lil/core": fileURLToPath(
        new URL("../packages/core/dist/components/index.js", import.meta.url),
      ),
    };
    return config;
  },
};
export default config;
