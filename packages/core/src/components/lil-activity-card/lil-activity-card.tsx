import { Component, Prop, h } from "@stencil/core";
import type { LilActivity } from "../../types";
/** A concise list of recent workspace events. */
@Component({
  tag: "lil-activity-card",
  styleUrl: "lil-activity-card.css",
  shadow: true,
})
export class LilActivityCard {
  @Prop() heading = "Recent activity";
  @Prop() items: LilActivity[] = [];
  render() {
    return (
      <lil-card heading={this.heading}>
        <ul>
          {this.items.map((item) => (
            <li>
              <lil-icon name={item.icon || "plus"} />
              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </lil-card>
    );
  }
}
