/**
 * Internal context shared between Tabs.Root and the leaf components
 * (Tabs.List, Tabs.Tab, Tabs.Panel).
 *
 * Tabs are not generic — `value` is always a string keyed off `TabItem.value` —
 * so the context is plain (no `<V>` parameterisation needed).
 */

import type { TabItem, TabsController } from '@kumiki/attachment-tabs';

export const TABS_CONTEXT_KEY = Symbol('kumiki.tabs');

export interface TabsContextValue {
  controller: TabsController;
}

export type { TabItem, TabsController } from '@kumiki/attachment-tabs';
