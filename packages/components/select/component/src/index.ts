/**
 * `@kumiki/component-select` — Layer 4 compound component for Select.
 *
 * Generic over the option value type `V`. Pass `V` to `<Root<V>>`; `<Option>`
 * receives a typed `SelectItem<V>` for its `value` prop. Listbox uses the
 * active-descendant pattern — focus stays on the trigger, the listbox just
 * renders the options.
 *
 * Minimal usage:
 *
 * ```svelte
 * <script lang="ts">
 *   import { Root, Trigger, Listbox, Option, type SelectItem } from '@kumiki/component-select';
 *
 *   type Plan = 'free' | 'pro' | 'enterprise';
 *   const plans: SelectItem<Plan>[] = [
 *     { id: 'free', value: 'free', label: 'Free' },
 *     { id: 'pro', value: 'pro', label: 'Pro' },
 *     { id: 'enterprise', value: 'enterprise', label: 'Enterprise' },
 *   ];
 *   let value = $state<Plan | null>('free');
 * </script>
 *
 * <Root items={plans} bind:value>
 *   <Trigger>{value ?? 'Pick a plan'}</Trigger>
 *   <Listbox>
 *     {#each plans as plan (plan.id)}
 *       <Option value={plan}>{plan.label}</Option>
 *     {/each}
 *   </Listbox>
 * </Root>
 * ```
 *
 * @when-to-use Picking one option from a known set when free-text filtering
 *              isn't needed.
 *
 * @anti-pattern If filtering is needed, use Combobox instead. If the choice
 *               is binary, use Switch / Checkbox.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 */

import Root from './Root.svelte';
import Trigger from './Trigger.svelte';
import Listbox from './Listbox.svelte';
import Option from './Option.svelte';

// Generic Svelte components emit `$$IsomorphicComponent` in their .d.ts which
// can't cross module boundaries (sveltejs/svelte#12785). We only export named;
// `import * as Select from '@kumiki/component-select'` covers the namespace
// style.
export { Root, Trigger, Listbox, Option };

export type {
  SelectController,
  SelectContext,
  SelectEvent,
  SelectState,
  SelectItem,
  CreateSelectOptions,
} from '@kumiki/headless/select';
