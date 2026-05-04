# @kumiki/attachment-popover

Svelte 5 attachments (Layer 3) for the Popover component — non-modal
trigger-anchored disclosure with dismissable wiring on top of
`@kumiki/machine-popover`.

Compound primitive across five factories: `trigger`, `content`, `close`,
`title`, `description`. The Layer 3 attachment owns ARIA, focus
management on open / close, and ESC + outside-click dismissal via
`@kumiki/primitives/dismissable`. Anchor positioning is left to the
consumer (or to a Layer 5 recipe wrapping Floating UI).
