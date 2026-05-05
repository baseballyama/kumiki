/**
 * Internal context shared between Combobox.Root and its descendants.
 *
 * Per `docs/design/08-typescript.md` §8.2, the generic `T` is held by the
 * outermost component (Root) and consumed by descendants via Svelte's
 * `getContext`. The cast happens at exactly one place per descendant — that's
 * the price of Svelte 5's "generics on script tag" not propagating through
 * compound APIs.
 */

import type { ComboboxController, ComboboxOption } from '@kumiki/headless/combobox';

export const COMBOBOX_CONTEXT_KEY = Symbol('kumiki.combobox');

export interface ComboboxContextValue<T extends ComboboxOption> {
  controller: ComboboxController<T>;
}

// Re-export option type so subcomponents can declare typed snippet args without
// double-importing @kumiki/headless/combobox alongside this file.
export type { ComboboxOption } from '@kumiki/headless/combobox';
