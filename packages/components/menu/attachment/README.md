# @kumiki/attachment-menu

Svelte 5 attachments (Layer 3) for the Menu (single-level) component on
top of `@kumiki/machine-menu`. Three factories: `trigger`, `menu`, and
`item(item)`. The trigger pops the menu; the menu uses
`aria-activedescendant` to track keyboard focus across items without
rolling tabindex.

Item activation calls the consumer's `onSelect(item)` callback when
ACTIVATE bumps the machine's `activatedId`. The Layer 3 controller wraps
this so consumers don't have to subscribe manually.

See [APG Menu / Menubar](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/).
