import { Component, Prop, h } from "@stencil/core";
/** A filter trigger; pair with a menu or application-specific filter panel. */
@Component({
  tag: "lil-filter-chip",
  styleUrl: "lil-filter-chip.css",
  shadow: true,
})
export class LilFilterChip {
  @Prop() label = "All items";
  @Prop({ reflect: true }) selected = false;
  @Prop() expanded = false;
  @Prop() controls?: string;
  render() {
    return (
      <button
        type="button"
        aria-expanded={this.expanded ? "true" : "false"}
        aria-controls={this.controls}
      >
        <span>{this.label}</span>
        <lil-icon name="chevron" />
      </button>
    );
  }
}
