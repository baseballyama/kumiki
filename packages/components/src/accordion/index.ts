/**
 * `@kumiki/components/accordion` — Layer 4 compound component for Accordion.
 *
 * Generic over the item value type `V`. Pass `V` to `<Root<V>>`; `<Item>`
 * receives a typed `AccordionItem<V>` for its `value` prop.
 *
 * Minimal usage:
 *
 * ```svelte
 * <script lang="ts">
 *   import { Root, Item, Trigger, Panel, type AccordionItem } from '@kumiki/components/accordion';
 *
 *   const items: AccordionItem<string>[] = [
 *     { id: 'general', value: 'general', label: 'General' },
 *     { id: 'team', value: 'team', label: 'Team' },
 *   ];
 *   let value = $state<string | null>(null);
 * </script>
 *
 * <Root {items} bind:value>
 *   {#each items as item (item.id)}
 *     <Item value={item}>
 *       <Trigger value={item}>{item.label}</Trigger>
 *       <Panel value={item}>…panel content…</Panel>
 *     </Item>
 *   {/each}
 * </Root>
 * ```
 *
 * @when-to-use Stacked disclosure regions where users explore one (or a few)
 *              sections at a time — FAQs, settings categories.
 *
 * @anti-pattern Don't use Accordion for navigation between independent
 *               pages — use Tabs (within a workflow) or links (changing
 *               context).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 */

import Root from './Root.svelte';
import Item from './Item.svelte';
import Trigger from './Trigger.svelte';
import Panel from './Panel.svelte';

// Generic Svelte components emit `$$IsomorphicComponent` in their .d.ts which
// can't cross module boundaries (sveltejs/svelte#12785). We only export named;
// `import * as Accordion from '@kumiki/components/accordion'` covers the
// namespace style.
export { Root, Item, Trigger, Panel };

export type {
  AccordionContext,
  AccordionController,
  AccordionEvent,
  AccordionItem,
  AccordionMachine,
  AccordionMode,
  AccordionState,
  CreateAccordionOptions,
} from '@kumiki/headless/accordion';
