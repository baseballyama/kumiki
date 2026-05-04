# @kumiki/machine-popover

Pure-TypeScript finite state machine for the Popover component — non-modal
trigger-anchored disclosure with `closeOnEscape` / `closeOnOutsideClick`
policy flags.

Popover differs from Dialog in that it is non-modal by default — focus
isn't trapped, the page stays interactive — and it's anchored to a
specific trigger element. The Layer 3 attachment owns positioning,
focus management, and dismissal wiring; the machine is just the
open / closed state.
