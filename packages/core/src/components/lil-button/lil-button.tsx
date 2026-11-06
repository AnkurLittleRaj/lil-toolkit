import { Component, Prop, h } from "@stencil/core";
/** A native action button. Use one primary action per section. */
@Component({ tag: "lil-button", styleUrl: "lil-button.css", shadow: true })
export class LilButton {
  /** Visual emphasis. Danger is reserved for destructive actions. */
  @Prop({ reflect: true }) variant:
    "primary" | "secondary" | "ghost" | "danger" = "primary";
  /** Medium is a 44px touch target. Small is for desktop density. */
  @Prop({ reflect: true }) size: "small" | "medium" = "medium";
  @Prop({ reflect: true }) disabled = false;
  @Prop({ reflect: true }) loading = false;
  /** Button purpose for an icon-only control. */
  @Prop() accessibleLabel?: string;
  render() {
    return (
      <button
        part="button"
        type="button"
        disabled={this.disabled || this.loading}
        aria-label={this.accessibleLabel}
        aria-busy={this.loading ? "true" : undefined}
      >
        <span class="spinner" hidden={!this.loading} aria-hidden="true" />
        <slot name="icon" />
        <slot />
      </button>
    );
  }
}
