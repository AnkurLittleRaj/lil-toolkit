import { Component, Prop, State, Event, EventEmitter, h } from "@stencil/core";
import type { LilNavigationItem } from "../../types";
/** Desktop sidebar; a native modal navigation drawer below 1024px. */
@Component({ tag: "lil-sidebar", styleUrl: "lil-sidebar.css", shadow: true })
export class LilSidebar {
  @Prop() brand = "little / workspace";
  @Prop() workspace = "Ankur’s workspace";
  @Prop() items: LilNavigationItem[] = [];
  @Prop() selected = "overview";
  @State() menuOpen = false;
  @Event() lilNavigate!: EventEmitter<{ value: string }>;
  private dialog?: HTMLDialogElement;
  private choose(value: string) {
    this.dialog?.close();
    this.menuOpen = false;
    this.lilNavigate.emit({ value });
  }
  private content() {
    return (
      <div class="content">
        <strong class="brand">{this.brand}</strong>
        <div class="workspace">{this.workspace}</div>
        <nav aria-label="Workspace">
          {this.items.map((i) => (
            <lil-nav-item
              label={i.label}
              icon={i.icon || "grid"}
              selected={i.value === this.selected}
              onLilNavigate={(e) => {
                e.stopPropagation();
                this.choose(i.value);
              }}
            />
          ))}
        </nav>
        <div class="account">
          <strong>Ankur</strong>
          <span>Personal workspace</span>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div>
        <aside>{this.content()}</aside>
        <div class="mobile-header">
          <button
            type="button"
            aria-label="Open navigation"
            aria-haspopup="dialog"
            aria-expanded={this.menuOpen ? "true" : "false"}
            onClick={() => {
              this.dialog?.showModal();
              this.menuOpen = true;
            }}
          >
            <lil-icon name="menu" />
          </button>
          <strong>{this.brand}</strong>
          <slot name="mobile-actions" />
        </div>
        <dialog
          ref={(el) => (this.dialog = el)}
          aria-label="Workspace navigation"
          onClose={() => (this.menuOpen = false)}
          onClick={(e) => {
            if (e.target === this.dialog) {
              const r = this.dialog.getBoundingClientRect();
              if (
                e.clientX < r.left ||
                e.clientX > r.right ||
                e.clientY < r.top ||
                e.clientY > r.bottom
              )
                this.dialog.close();
            }
          }}
        >
          <button
            class="close"
            type="button"
            aria-label="Close navigation"
            onClick={() => this.dialog?.close()}
          >
            <lil-icon name="close" />
          </button>
          {this.content()}
        </dialog>
      </div>
    );
  }
}
