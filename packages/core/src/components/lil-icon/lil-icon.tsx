import { Component, Prop, h } from "@stencil/core";
import { paths } from "./paths";
/** Outline icons from the original Figma component definitions. */
@Component({
  tag: "lil-icon",
  shadow: true,
  styles:
    ":host{display:inline-flex;flex:none;vertical-align:middle;width:var(--lil-icon-size,20px);height:var(--lil-icon-size,20px)}svg{width:100%;height:100%;display:block}",
})
export class LilIcon {
  @Prop() name = "grid";
  /** Omit when decorative. Icon-only buttons need a label on the button. */
  @Prop() accessibleLabel?: string;
  render() {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden={this.accessibleLabel ? undefined : "true"}
        role={this.accessibleLabel ? "img" : undefined}
        aria-label={this.accessibleLabel}
        ref={(el) => {
          if (el) el.innerHTML = paths[this.name] || paths.grid;
        }}
      />
    );
  }
}
