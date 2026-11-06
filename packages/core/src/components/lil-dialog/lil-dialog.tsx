import {
  Component,
  Prop,
  Event,
  EventEmitter,
  Element,
  h,
} from "@stencil/core";
let nextId = 0;
/** A native modal dialog with focus containment and Escape support. */
@Component({ tag: "lil-dialog", styleUrl: "lil-dialog.css", shadow: true })
export class LilDialog {
  @Element() el!: HTMLElement;
  @Prop({ mutable: true, reflect: true }) open = false;
  @Prop() heading = "";
  @Prop() description = "";
  @Event() lilClose!: EventEmitter<void>;
  private uid = `lil-dialog-${++nextId}`;
  private dialog?: HTMLDialogElement;
  componentDidRender() {
    if (!this.dialog?.isConnected) return;
    if (this.open && !this.dialog.open) this.dialog.showModal();
    else if (!this.open && this.dialog.open) this.dialog.close();
  }
  private close() {
    if (this.open) {
      this.open = false;
      this.lilClose.emit();
    }
  }
  render() {
    return (
      <dialog
        ref={(el) => (this.dialog = el)}
        aria-labelledby={`${this.uid}-title`}
        aria-describedby={
          this.description ? `${this.uid}-description` : undefined
        }
        onClose={() => this.close()}
        onCancel={() => this.close()}
        onClick={(e) => {
          if (e.target === this.dialog) {
            const r = this.dialog.getBoundingClientRect();
            if (
              e.clientX < r.left ||
              e.clientX > r.right ||
              e.clientY < r.top ||
              e.clientY > r.bottom
            )
              this.close();
          }
        }}
      >
        <div class="header">
          <h2 id={`${this.uid}-title`}>{this.heading}</h2>
          <button
            class="close"
            type="button"
            aria-label="Close dialog"
            onClick={() => this.close()}
          >
            <lil-icon name="close" />
          </button>
        </div>
        {this.description ? (
          <p id={`${this.uid}-description`}>{this.description}</p>
        ) : null}
        <slot />
        <div class="actions">
          <slot name="actions" />
        </div>
      </dialog>
    );
  }
}
