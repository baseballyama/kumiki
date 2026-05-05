/**
 * `@kumiki/component-combobox` — Layer 4 compound combobox component.
 *
 * Generic over option type `T extends ComboboxOption`. Pass `T` to
 * `<Combobox.Root<T> ...>`; `Combobox.Item`'s `value` prop is then typed.
 *
 * @when-to-use Single-select with a free-text input + popover listbox.
 *              Compose with `withAsyncSearch` (Phase 2) for network-backed
 *              option fetching, `withMultiSelect` for arrays, and
 *              `withVirtualization` for large lists.
 *
 * @anti-pattern For a static dropdown without filtering, use `<Select>`.
 *               For a multi-tag input, compose `withMultiSelect`.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */

import Root from './Root.svelte';
import Input from './Input.svelte';
import Listbox from './Listbox.svelte';
import Item from './Item.svelte';
import Trigger from './Trigger.svelte';

// Generic Svelte components (`<script generics="T">`) emit
// `$$IsomorphicComponent` in their .d.ts which TypeScript can't reference
// across module boundaries (sveltejs/svelte#12785). We therefore expose
// Root/Input/Listbox/Item/Trigger as named exports only. Users who prefer
// the dot-namespace style use the standard:
//
//     import * as Combobox from '@kumiki/component-combobox';
//     <Combobox.Root> … </Combobox.Root>
//
// which works without declaration-emit pain.
export { Root, Input, Listbox, Item, Trigger };

export type {
  ComboboxController,
  ComboboxContext,
  ComboboxEvent,
  ComboboxOption,
  ComboboxState,
  ComboboxStatus,
  CreateComboboxOptions,
  NavigateDirection,
} from '@kumiki/headless/combobox';
