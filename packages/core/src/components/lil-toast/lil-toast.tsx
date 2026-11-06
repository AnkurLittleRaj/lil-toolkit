import { Component, Prop, h } from "@stencil/core";
/** Nonblocking confirmation. Keep essential actions outside a toast. */
@Component({ tag: "lil-toast", styleUrl: "lil-toast.css", shadow: true })
export class LilToast {
  @Prop() heading = "Changes saved";
  @Prop() message = "Your preferences are up to date.";
  @Prop() open = false;
  render() {
    return (
      <div role="status" aria-live="polite" aria-atomic="true">
        {this.open ? (
          <div class="toast">
            <lil-icon name="check" />
            <div>
              <strong>{this.heading}</strong>
              {this.message ? <p>{this.message}</p> : null}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
