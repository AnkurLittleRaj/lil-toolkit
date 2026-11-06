import { Component, Prop, h } from "@stencil/core";
import type { LilChartDatum } from "../../types";
/** A labeled part-to-whole comparison. Values are percentages. */
@Component({
  tag: "lil-plan-chart",
  styleUrl: "lil-plan-chart.css",
  shadow: true,
})
export class LilPlanChart {
  @Prop() heading = "Subscriptions by plan";
  @Prop() data: LilChartDatum[] = [];
  render() {
    return (
      <lil-card heading={this.heading}>
        <ul>
          {this.data.map((d) => (
            <li>
              <div class="labels">
                <span>{d.label}</span>
                <strong>{d.value}%</strong>
              </div>
              <div class="rail" aria-hidden="true">
                <div
                  class="bar"
                  style={{ width: Math.min(100, Math.max(0, d.value)) + "%" }}
                />
              </div>
            </li>
          ))}
        </ul>
      </lil-card>
    );
  }
}
