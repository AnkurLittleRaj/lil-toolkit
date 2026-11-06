# Figma provenance and parity

Design source: [Little Design System](https://www.figma.com/design/mjE6UWIjTk1zkJ0F0uonGD), by Ankur.

The initial code uses the exact original Figma construction definitions for colors, semantic aliases, Inter sizes, spacing, radius and outline icon paths. The Figma component-guide, desktop dashboard, mobile dashboard and settings screenshots were reviewed during creation.

A fresh `get_design_context` request on 6 November 2026 was refused by the Figma Starter tool-call limit. The source is therefore the saved construction data, not a new export. Code parity is not presented as a fresh pixel-perfect Figma verification.

The Figma file itself still has known unfinished work: mobile input width fixes, compact sidebar rows, table heading alignment and example-level prototype links. The code implements fluid inputs, 44px navigation rows, readable table headings and real interactions independently. Those code fixes have not been synced back to Figma.

## Component mapping

| Figma family | Code |
| --- | --- |
| Button / Primary, Secondary, Ghost, Danger | `lil-button` variants |
| Input | `lil-input` |
| Checkbox / Switch | `lil-checkbox` / `lil-switch` |
| Navigation item / Sidebar | `lil-nav-item` / `lil-sidebar` |
| Filter chip / Tabs | `lil-filter-chip` / `lil-tabs` |
| Badge / Toast / Data state | `lil-badge` / `lil-toast` / `lil-data-state` |
| Metric card / Revenue chart / Plan chart | `lil-metric-card` / `lil-chart` / `lil-plan-chart` |
| Customer row | Responsive `lil-customer-table` |
| Activity card | `lil-activity-card` |
| Dropdown menu / Dialog | `lil-menu` / `lil-dialog` |
| Outline icons | `lil-icon` |

`lil-card` adds a reusable surface container. Desktop and mobile use the same components and CSS breakpoints, rather than separate implementations.
