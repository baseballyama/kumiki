/**
 * `@kumiki/components/chips` — Layer 4 Chips / tag.
 *
 * Three variants:
 * - `static` — passive label.
 * - `dismissible` — label + Close button (Close has aria-label "Remove {label}").
 * - `selectable` — `<button>` with `aria-pressed` (filter chip pattern).
 *
 * ```svelte
 * <Chips.Root variant="dismissible" label="design" onDismiss={...}>
 *   <Chips.Label>design</Chips.Label>
 *   <Chips.Close />
 * </Chips.Root>
 * ```
 *
 * @when-to-use Tag rows, filter selections, multi-combobox-selected items.
 *              For chip-row keyboard navigation (left/right between chips),
 *              wrap in `Toolbar.Root` (Phase 1.5+).
 *
 * @anti-pattern Don't make the entire dismissible chip clickable; users hit
 *               Close by accident. Don't put a chip inside a button.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */

import Root from './Root.svelte';
import Label from './Label.svelte';
import Close from './Close.svelte';

export { Root, Label, Close };

export const Chips = { Root, Label, Close };

export type { Props as ChipsProps } from './Root.svelte';
export type { ChipsVariant } from './context.js';
