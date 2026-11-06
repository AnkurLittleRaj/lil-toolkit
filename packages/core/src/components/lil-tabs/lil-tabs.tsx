import {
  Component,
  Prop,
  Event,
  EventEmitter,
  Element,
  h,
} from "@stencil/core";
import type { LilTab } from "../../types";
let nextId = 0;
/** Related views with roving focus, arrow keys, Home and End support. */
@Component({ tag: "lil-tabs", styleUrl: "lil-tabs.css", shadow: true })
export class LilTabs {
  @Element() el!: HTMLElement;
  @Prop() label = "Settings";
  @Prop() tabs: LilTab[] = [];
  @Prop({ mutable: true }) value = "";
  @Event() lilChange!: EventEmitter<{ value: string }>;
  private uid = `lil-tabs-${++nextId}`;
  private select(value: string) {
    this.value = value;
    this.lilChange.emit({ value });
  }
  private onKey(e: KeyboardEvent, index: number) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const enabled = this.tabs
      .map((t, i) => (!t.disabled ? i : -1))
      .filter((i) => i >= 0);
    let at = enabled.indexOf(index);
    const next =
      e.key === "Home"
        ? enabled[0]
        : e.key === "End"
          ? enabled.at(-1)
          : enabled[
              (at + (e.key === "ArrowRight" ? 1 : -1) + enabled.length) %
                enabled.length
            ];
    if (next !== undefined) {
      this.select(this.tabs[next].value);
      this.el.shadowRoot
        ?.querySelectorAll<HTMLButtonElement>("[role=tab]")
        [next]?.focus();
    }
  }
  render() {
    const selected = this.value || this.tabs.find((t) => !t.disabled)?.value;
    return (
      <div>
        <div role="tablist" aria-label={this.label}>
          {this.tabs.map((t, i) => (
            <button
              type="button"
              id={`${this.uid}-tab-${i}`}
              role="tab"
              disabled={t.disabled}
              aria-selected={t.value === selected ? "true" : "false"}
              aria-controls={`${this.uid}-panel-${i}`}
              tabIndex={t.value === selected ? 0 : -1}
              onClick={() => this.select(t.value)}
              onKeyDown={(e) => this.onKey(e, i)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {this.tabs.map((t, i) => (
          <div
            id={`${this.uid}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${this.uid}-tab-${i}`}
            hidden={t.value !== selected}
            tabIndex={0}
          >
            <slot name={t.value} />
          </div>
        ))}
      </div>
    );
  }
}
