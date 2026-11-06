import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
const meta: Meta = { title: "Foundations/Design guidelines" };
export default meta;
type Story = StoryObj;
export const Colors: Story = {
  render: () =>
    html`<div class="stack">
      <h1>Neutral canvas, deliberate accent</h1>
      <p class="quiet">
        Semantic tokens adapt to both themes. Reserve indigo-violet for actions
        and selected states. Always label status.
      </p>
      <div class="swatches">
        ${[
          "surface-canvas",
          "surface-panel",
          "surface-subtle",
          "accent-solid",
          "accent-subtle",
          "success-surface",
          "danger-surface",
          "warning-surface",
        ].map(
          (token) =>
            html`<div class="swatch">
              <div
                class="color"
                style=${`background:var(--lil-${token})`}
              ></div>
              <p>${token}</p>
            </div>`,
        )}
      </div>
    </div>`,
};
export const Typography: Story = {
  render: () =>
    html`<div class="stack">
      <h1>Inter. Clear by default.</h1>
      ${[
        [56, 64, "Display"],
        [32, 40, "Heading 1"],
        [24, 32, "Heading 2"],
        [18, 28, "Heading 3"],
        [16, 24, "Body large"],
        [14, 22, "Body"],
        [12, 18, "Caption"],
      ].map(
        ([size, line, name]) =>
          html`<div>
            <small class="quiet">${name} · ${size}/${line}</small>
            <div
              style=${`font-size:${size}px;line-height:${line}px;font-weight:${Number(size) > 16 ? 600 : 400}`}
            >
              A place for everything.
            </div>
          </div>`,
      )}
    </div>`,
};
export const Spacing: Story = {
  render: () =>
    html`<div class="stack">
      <h1>Space to breathe</h1>
      <p class="quiet">
        4px base grid. Use 8–12 within controls, 16–24 for groups, and 32–64
        between sections. Controls use 6px corners; cards use 8px.
      </p>
      <div class="row">
        ${[4, 8, 12, 16, 24, 32, 48, 64].map(
          (n) =>
            html`<div style="width:80px">
              <div
                style=${`height:24px;width:${n}px;border-radius:4px;background:var(--lil-accent-solid)`}
              ></div>
              <p>${n}px</p>
            </div>`,
        )}
      </div>
    </div>`,
};
export const Accessibility: Story = {
  render: () =>
    html`<div class="stack">
      <h1>Accessible by intention</h1>
      <ul>
        <li>Persistent input labels and helpful validation messages.</li>
        <li>44px touch targets and a visible focus outline.</li>
        <li>Status labels instead of color alone.</li>
        <li>Native dialogs for focus containment and Escape.</li>
        <li>Arrow keys for tabs and menus; Enter/Space for buttons.</li>
        <li>Reduced-motion support and accessible chart data tables.</li>
        <li>
          Automated axe checks complement manual keyboard and screen-reader
          review.
        </li>
      </ul>
      <h2>Responsive behavior</h2>
      <p>
        Under 640px: one column and stacked records. 640–1023px: flexible
        columns and menu navigation. From 1024px: a 232px sidebar, 48px gutters
        and four metric columns.
      </p>
    </div>`,
};
