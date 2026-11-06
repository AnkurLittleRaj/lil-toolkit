# Component guidelines

**Buttons:** one primary action per section. Secondary supports it; Ghost is low emphasis. Danger is reserved for destructive actions. Loading and disabled controls do not activate.

**Inputs:** keep the label visible. Explain the expected value before an error. Errors tell the user how to recover. Native form support and framework adapters share the same field implementation.

**Checkboxes and switches:** checkboxes represent independent selections; switches apply immediate preferences. Always show a text label.

**Navigation:** one active destination. Sidebar on desktop; modal menu on mobile. Tabs switch related views; arrow keys move between enabled tabs.

**Menus and filters:** label the active value, close on outside click or Escape and return focus to the trigger. Provide a way to clear a filter.

**Cards and metrics:** one purpose per card. A metric needs its timeframe and a direction cue. Use neutral sentiment when an increase is not inherently good.

**Charts:** use a zero baseline for bars. Keep labels visible. Supply a data table so the chart is understandable without color or a pointer.

**Tables:** preserve essential fields on mobile by stacking labeled records. Use meaningful column headers and announce sorting.

**Dialogs:** one focused task. Give a clear cancel action, contain keyboard focus and return it to the opener.

**Feedback:** toasts confirm work without blocking. Keep essential information outside transient feedback. Include empty, loading and error states, with recovery when possible.

Embed the corresponding Storybook stories below each guideline to show the actual implementation and supported states.
