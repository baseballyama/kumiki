/**
 * `@kumiki/components/loading-spinner` — Layer 4 LoadingSpinner.
 *
 * Visual busy indicator wrapped in a polite `role="status"` live region.
 * The spinning glyph is consumer-supplied via the `spinner` snippet
 * (per ADR 0014); atelier provides a default reduced-motion-friendly
 * glyph that consumers can opt into.
 *
 * ```svelte
 * <LoadingSpinner.Root>
 *   <LoadingSpinner.Label>Loading…</LoadingSpinner.Label>
 * </LoadingSpinner.Root>
 * ```
 *
 * @when-to-use Inside a button while a request is in flight; over a region
 *              that is loading; never as a sole indeterminate progress
 *              indicator (use `role="progressbar"` for *determinate*
 *              progress only).
 *
 * @anti-pattern Don't render multiple `role="status"` regions simultaneously
 *               — screen readers collide. Don't omit a label.
 */

import Root from './Root.svelte';
import Label from './Label.svelte';

export { Root, Label };

export const LoadingSpinner = { Root, Label };

export type {
  Props as LoadingSpinnerProps,
  LoadingSpinnerMode,
  LoadingSpinnerSize,
} from './Root.svelte';
