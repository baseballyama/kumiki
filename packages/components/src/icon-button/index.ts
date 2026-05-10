/**
 * `@kumiki/components/icon-button` — Layer 4 icon-only Button variant.
 *
 * Thin wrapper around `Button.Root` that narrows the type-level contract:
 * `icon` snippet and one of `aria-label` / `aria-labelledby` are required.
 * Behavior, FSM-less Layer 3 controller, and loading/disabled semantics are
 * inherited from Button. Visual styling (variants, sizes) lives in
 * `@kumiki/atelier/icon-button` or your own CSS — pass `class` / `data-*`
 * via the rest-spread.
 *
 * ```svelte
 * <IconButton.Root aria-label="Close" onclick={close}>
 *   {#snippet icon()}<XIcon />{/snippet}
 * </IconButton.Root>
 * ```
 *
 * @when-to-use Toolbars, table-row actions, anywhere a square icon-only
 *              control is needed and you want the type checker to enforce
 *              the accessible name.
 *
 * @anti-pattern Don't reach for a `<div role="button">` to get a square
 *               click target. Don't pass `children` — IconButton is icon-only
 *               by definition; if you need a label, use `Button.Root`.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */

import Root from './Root.svelte';

export { Root };

export const IconButton = { Root };

export type { Props as IconButtonProps } from './Root.svelte';
