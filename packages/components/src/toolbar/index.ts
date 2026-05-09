/**
 * `@kumiki/components/toolbar` — Layer 4 component for the Toolbar.
 *
 * Implements the WAI-ARIA APG `toolbar` pattern: a `<div role="toolbar">`
 * wrapper with a single tab stop and arrow-key navigation between enabled
 * items. The active item retains focus when the user tabs back in.
 *
 * ```svelte
 * <Toolbar.Root aria-label="Text formatting">
 *   <Toolbar.Item onclick={bold}>B</Toolbar.Item>
 *   <Toolbar.Item onclick={italic}>I</Toolbar.Item>
 *   <Toolbar.Separator />
 *   <Toolbar.Item onclick={undo}>Undo</Toolbar.Item>
 * </Toolbar.Root>
 * ```
 *
 * No machine, no Layer 3. The roving-tabindex coordinator is pure DOM
 * bookkeeping; lifting it into Layer 2 would not save bytes.
 *
 * Composition note: `Toolbar.Item` defaults to a `<button>`, but you can
 * place any focusable Kumiki control (Toggle, IconButton, Button) inside the
 * toolbar — just give it `tabindex={-1}` and forward Arrow/Home/End yourself
 * if you want it to participate in the roving group. The dedicated
 * `Toolbar.Item` is the easy path.
 *
 * @when-to-use Editor toolbars, table-row action bars, any horizontal /
 *              vertical strip of controls that should share a single tab stop.
 *
 * @anti-pattern Don't put a Toolbar inside another widget that already
 *               provides roving tabindex (Tabs, Menu, RadioGroup) — the
 *               nested coordinators will fight over focus.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
 */

import Root from './Root.svelte';
import Item from './Item.svelte';
import Separator from './Separator.svelte';

export { Root, Item, Separator };

export const Toolbar = { Root, Item, Separator };

export type { Props as ToolbarProps } from './Root.svelte';
export type { ToolbarOrientation } from './context.js';
