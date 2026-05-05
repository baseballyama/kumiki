<!--
  @component RadioGroup.Item — a single radio in the group.

  Default rendering is a `<button role="radio">`. The child snippet receives
  `state` (selected / focused / disabled) so consumers can render custom
  visuals.
-->
<script lang="ts" generics="V">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import {
    RADIO_GROUP_CONTEXT_KEY,
    type RadioGroupContextValue,
    type RadioItem,
  } from './context.js';

  type Props = {
    /** The item this radio represents. Must match an entry in the parent's `items`. */
    value: RadioItem<V>;
    children?: Snippet;
    /** Extra props (`class`, `style`, `data-*`, …) forwarded to the root `<button>`. */
    [key: string]: unknown;
  };

  let { value, children, ...rest }: Props = $props();

  const { controller } = getContext<RadioGroupContextValue<V>>(RADIO_GROUP_CONTEXT_KEY);
  // svelte-ignore state_referenced_locally
  const attachment = controller.item(value);

  // Initial SSR-safe attribute snapshot, captured once at mount. After
  // hydration the attachment paints these via setAttribute on every state
  // change. Reading `value` at top level is intentional — the item's value
  // is part of the constructor input and does not change for an instance.
  // svelte-ignore state_referenced_locally
  const isSelected = controller.value === value.value;
  // svelte-ignore state_referenced_locally
  const isFirstEnabled = controller.items.find((it) => !it.disabled)?.id === value.id;
</script>

<button
  {...rest}
  type="button"
  role="radio"
  aria-checked={isSelected ? 'true' : 'false'}
  aria-disabled={value.disabled ? 'true' : undefined}
  data-state={isSelected ? 'checked' : 'unchecked'}
  tabindex={isFirstEnabled || isSelected ? 0 : -1}
  {@attach attachment}
>
  {#if children}{@render children()}{/if}
</button>
