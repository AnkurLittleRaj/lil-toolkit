# Foundations

## Color

Indigo-violet `#6941D9` is the primary accent. Neutrals carry most of the interface. Use semantic tokens such as `surface/panel`, `text/primary` and `accent/solid`, rather than hardcoded values. Status colors always have text labels.

Both themes are in the same token source. In code, apply `data-lil-theme="light"` or `data-lil-theme="dark"`. In Figma Starter, choose a component’s Theme variant because the plan permits only one mode per collection.

## Typography

Inter, weights 400, 500 and 600. Desktop body 14/22; large body and mobile field text 16/24. Headings 32/40, 24/32 and 18/28. Display 56/64; metric 30/38; caption 12/18.

## Spacing and shape

4px base grid. Use 8–12px within controls, 16–24px between related elements and 32–64px between sections. Controls use 6px corners; cards use 8px. Elevation is reserved for menus and dialogs.

## Responsive layouts

Under 640px: one column, 24px gutters, stacked form actions and labeled records instead of wide tables. From 640px to 1023px: flexible columns and menu navigation. From 1024px: a 232px sidebar, 48px gutters and four metric columns.

## Accessibility

Aim for WCAG AA contrast. Keep labels persistent, focus visible and touch targets at least 44px. Support keyboard navigation and reduced motion. Native dialogs contain focus and close with Escape. Charts offer a text data table. Automated checks complement manual screen-reader testing.
