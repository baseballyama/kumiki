/**
 * Internal context shared between Select.Root and the leaf components.
 *
 * The Root is generic over `V`; descendants consume via `getContext` with a
 * single internal cast (per docs/design/08-typescript.md §8.2).
 */

import type { SelectController, SelectItem } from '@kumiki/attachment-select';

export const SELECT_CONTEXT_KEY = Symbol('kumiki.select');

export interface SelectContextValue<V> {
  controller: SelectController<V>;
}

export type { SelectController, SelectItem } from '@kumiki/attachment-select';
