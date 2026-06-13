/**
 * Internal context shared between Tabs.Root and the leaf components
 * (Tabs.List, Tabs.Tab, Tabs.Panel).
 *
 * Tabs are not generic — `value` is always a string keyed off `TabItem.value` —
 * so the context is plain (no `<V>` parameterisation needed).
 */

import type { TabItem, TabsController, TabsOrientation } from '@kumiki/headless/tabs';

export const TABS_CONTEXT_KEY = Symbol('kumiki.tabs');

export interface TabsContextValue {
  controller: TabsController;
  /** Current visual orientation, for `Tabs.List`'s `child` declarative props. */
  readonly orientation: TabsOrientation;
}

export type { TabItem, TabsController, TabsOrientation } from '@kumiki/headless/tabs';
