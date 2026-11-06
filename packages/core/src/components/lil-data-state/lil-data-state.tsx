import { Component, Prop, Event, EventEmitter, h } from "@stencil/core";
/** Clear empty, loading and error messages for data surfaces. */
@Component({
  tag: "lil-data-state",
  styleUrl: "lil-data-state.css",
  shadow: true,
})
export class LilDataState {
  @Prop() state: "empty" | "loading" | "error" = "empty";
  @Prop() heading = "";
  @Prop() message = "";
  @Event() lilRetry!: EventEmitter<void>;
  render() {
    const title =
      this.heading ||
      (this.state === "empty"
        ? "No customers yet"
        : this.state === "loading"
          ? "Loading customers…"
          : "Couldn’t load customers");
    const body =
      this.message ||
      (this.state === "empty"
        ? "New customers will appear here."
        : this.state === "loading"
          ? "This should only take a moment."
          : "Check your connection, then try again.");
    return (
      <div
        role="status"
        aria-busy={this.state === "loading" ? "true" : "false"}
      >
        <lil-card heading={title} description={body}>
          {this.state === "error" ? (
            <lil-button
              variant="secondary"
              onClick={() => this.lilRetry.emit()}
            >
              Try again
            </lil-button>
          ) : null}
          <slot />
        </lil-card>
      </div>
    );
  }
}
