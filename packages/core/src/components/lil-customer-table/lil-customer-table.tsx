import { Component, Prop, State, h } from "@stencil/core";
import type { LilCustomer } from "../../types";
/** A sortable customer table that becomes labeled records on narrow screens. */
@Component({
  tag: "lil-customer-table",
  styleUrl: "lil-customer-table.css",
  shadow: true,
})
export class LilCustomerTable {
  @Prop() customers: LilCustomer[] = [];
  @Prop() caption = "Recent customers";
  @State() ascending = true;
  render() {
    const rows = [...this.customers].sort(
      (a, b) => a.name.localeCompare(b.name) * (this.ascending ? 1 : -1),
    );
    return (
      <div class="scroll">
        <table>
          <caption>{this.caption}</caption>
          <thead>
            <tr>
              <th
                scope="col"
                aria-sort={this.ascending ? "ascending" : "descending"}
              >
                <button
                  type="button"
                  onClick={() => (this.ascending = !this.ascending)}
                >
                  Customer{" "}
                  <span aria-hidden="true">{this.ascending ? "↑" : "↓"}</span>
                </button>
              </th>
              <th scope="col">Plan</th>
              <th scope="col">Status</th>
              <th scope="col">Amount</th>
              <th scope="col">Joined</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((c) => (
                <tr>
                  <th scope="row">
                    <span>{c.name}</span>
                    <small>{c.email}</small>
                  </th>
                  <td data-label="Plan">{c.plan}</td>
                  <td data-label="Status">
                    <lil-badge
                      status={
                        c.status === "Active"
                          ? "success"
                          : c.status === "Trial"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {c.status}
                    </lil-badge>
                  </td>
                  <td data-label="Amount">{c.amount}</td>
                  <td data-label="Joined">{c.joined}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No customers match these filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
