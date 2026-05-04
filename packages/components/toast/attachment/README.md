# @kumiki/attachment-toast

Svelte 5 attachments (Layer 3) for the Toast (toaster queue) component
on top of `@kumiki/machine-toast`.

Three factories: `viewport` (the live-region container), `item` (per-toast
wrapper), and `closeButton` (per-toast close action). Auto-dismiss timers
pause on hover or focus inside the viewport, and resume on leave (with
the elapsed-ms preserved). Sticky toasts (`duration: -1`) never schedule
a timer.

See the [WAI-ARIA Live Region pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#live).
