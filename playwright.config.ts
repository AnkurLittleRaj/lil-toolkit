import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/browser",
  fullyParallel: true,
  workers: 2,
  timeout: 30000,
  use: {
    baseURL: "http://127.0.0.1:6006",
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node scripts/serve-storybook.mjs",
    url: "http://127.0.0.1:6006",
    reuseExistingServer: !process.env.CI,
  },
  reporter: process.env.CI ? "github" : "list",
});
