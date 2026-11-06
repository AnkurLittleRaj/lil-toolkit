import { Component, Prop, Event, EventEmitter, h } from "@stencil/core";
/** A destination within application navigation. */
@Component({ tag: "lil-nav-item", styleUrl: "lil-nav-item.css", shadow: true })
export class LilNavItem {
  @Prop() label = "";
  @Prop() icon = "grid";
  @Prop() href?: string;
  @Prop({ reflect: true }) selected = false;
  @Event() lilNavigate!: EventEmitter<void>;
  render() {
    const content = [<lil-icon name={this.icon} />, <span>{this.label}</span>];
    return this.href ? (
      <a
        href={this.href}
        aria-current={this.selected ? "page" : undefined}
        onClick={() => this.lilNavigate.emit()}
      >
        {content}
      </a>
    ) : (
      <button
        type="button"
        aria-current={this.selected ? "page" : undefined}
        onClick={() => this.lilNavigate.emit()}
      >
        {content}
      </button>
    );
  }
}
