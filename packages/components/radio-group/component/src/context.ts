/**
 * Internal context shared between RadioGroup.Root and RadioGroup.Item.
 *
 * The Root is generic over `V`; descendants consume via `getContext` with
 * a single internal cast (per docs/design/08-typescript.md §8.2).
 */

import type { RadioGroupController, RadioItem } from '@kumiki/headless/radio-group';

export const RADIO_GROUP_CONTEXT_KEY = Symbol('kumiki.radio-group');

export interface RadioGroupContextValue<V> {
  controller: RadioGroupController<V>;
}

export type { RadioGroupController, RadioItem } from '@kumiki/headless/radio-group';
