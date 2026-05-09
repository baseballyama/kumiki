/**
 * `@kumiki/components/badge` — Layer 4 component for the Badge.
 *
 * A presentational `<span>` with status data hooks. No FSM, no Layer 2/3.
 *
 * ```svelte
 * <Badge.Root variant="success">New</Badge.Root>
 * <Badge.Root aria-label="3 unread notifications">3</Badge.Root>
 * <Badge.Root decorative variant="error" />
 * ```
 *
 * @when-to-use Status pills, count indicators, label tags. For interactive
 *              chips (filters, dismissible tags), use `@kumiki/components/chips`.
 *
 * @anti-pattern Don't add click handlers to a Badge — use Button or Chips.
 *               Don't put a Badge inside a button as the only label —
 *               provide visible text or `aria-label` on the parent button.
 */

import Root from './Root.svelte';

export { Root };

export const Badge = { Root };

export type { Props as BadgeProps, BadgeVariant, BadgeSize } from './Root.svelte';
