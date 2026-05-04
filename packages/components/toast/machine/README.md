# @kumiki/machine-toast

Pure-TypeScript finite state machine for the Toast (toaster queue) component
— manages an array of toast items, max-size trim, and per-item politeness.
The Layer 3 attachment owns the per-toast auto-dismiss timer and
hover-pause math; the machine is queue + metadata only.

See [WAI-ARIA Live Region pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#live)
and the [APG Alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
for surrounding context.
