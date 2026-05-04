# @kumiki/machine-menu

Pure-TypeScript finite state machine for a single-level Menu — open/close

- active-descendant cursor + arrow / Home / End navigation + typeahead.

Submenus (the `menubar` + nested `menu` shape) are deliberately deferred
until single-level Menu is shipping; the runtime FSM model stays simple
in the meantime.

See [APG Menu / Menubar](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/).
