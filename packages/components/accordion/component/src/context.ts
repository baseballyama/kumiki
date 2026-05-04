/**
 * Internal context shared between Accordion.Root and the leaf components
 * (Item / Trigger / Panel).
 *
 * Generic over the item value type `V`; descendants consume via getContext
 * with a single internal cast (per docs/design/08-typescript.md §8.2).
 */

import type { AccordionController, AccordionItem } from '@kumiki/attachment-accordion';

export const ACCORDION_CONTEXT_KEY = Symbol('kumiki.accordion');

export interface AccordionContextValue<V> {
  controller: AccordionController<V>;
}

export type { AccordionController, AccordionItem } from '@kumiki/attachment-accordion';
