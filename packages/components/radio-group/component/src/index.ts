/**
 * `@kumiki/component-radio-group` — Layer 4 compound component for RadioGroup.
 *
 * Generic over the item value type `V`. Pass `V` to `<Root<V>>`; `<Item>`
 * receives a typed `RadioItem<V>` for its `value` prop.
 *
 * The Root + Item pair is the smallest API; tag rendering can be customised
 * by spreading attributes (`class`, `style`) onto either.
 *
 * @when-to-use Mutually-exclusive option group with arrow-key navigation —
 *              survey ratings, payment-method picker, theme picker.
 *
 * @anti-pattern Don't model a single boolean as a group of two radios — use
 *               Checkbox or Switch.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/radio/
 */

import Root from './Root.svelte';
import Item from './Item.svelte';

// Generic Svelte components emit `$$IsomorphicComponent` in their .d.ts which
// can't cross module boundaries (sveltejs/svelte#12785). We only export named;
// `import * as RadioGroup from '@kumiki/component-radio-group'` covers the
// namespace style.
export { Root, Item };

export type {
  RadioGroupController,
  RadioGroupContext,
  RadioGroupEvent,
  RadioGroupState,
  RadioItem,
  CreateRadioGroupOptions,
} from '@kumiki/attachment-radio-group';
