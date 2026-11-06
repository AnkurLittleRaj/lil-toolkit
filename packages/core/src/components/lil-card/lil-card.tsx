import { Component, Prop, h } from "@stencil/core";
/** A calm, bordered surface for one group of related content. */
@Component({ tag: "lil-card", styleUrl: "lil-card.css", shadow: true })
export class LilCard {
  @Prop() heading = "";
  @Prop() description = "";
  render() {
    return (
      <section part="surface">
        {this.heading ? <h3>{this.heading}</h3> : null}
        {this.description ? <p>{this.description}</p> : null}
        <slot />
      </section>
    );
  }
}
