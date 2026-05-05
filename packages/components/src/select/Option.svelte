<!--
  @component Select.Option — a single option inside `<Select.Listbox>`.

  Renders an `<li>` by default with `role="option"`. The `value` prop is
  the matching `SelectItem<V>` from the parent's `items`.
-->
<script lang="ts" generics="V">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { SELECT_CONTEXT_KEY, type SelectContextValue, type SelectItem } from './context.js';

  type Props = {
    value: SelectItem<V>;
    children?: Snippet;
    [key: string]: unknown;
  };

  let { value, children, ...rest }: Props = $props();

  const { controller } = getContext<SelectContextValue<V>>(SELECT_CONTEXT_KEY);
  // svelte-ignore state_referenced_locally
  const attachment = controller.option(value);

  // svelte-ignore state_referenced_locally
  const isSelected = controller.value === value.value;
</script>

<li
  {...rest}
  role="option"
  aria-selected={isSelected ? 'true' : 'false'}
  aria-disabled={value.disabled ? 'true' : undefined}
  data-state={isSelected ? 'selected' : 'unselected'}
  {@attach attachment}
>
  {#if children}{@render children()}{/if}
</li>
