<!--
  @component Select.Listbox — the popup `<ul role="listbox">`.

  Renders a `<ul>` by default. Children are typically a `{#each}` of
  `<Select.Option>` — but any markup is fine; only `role="option"` items
  participate in the active-descendant cursor.
-->
<script lang="ts" generics="V">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { SELECT_CONTEXT_KEY, type SelectContextValue } from './context.js';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();

  const { controller } = getContext<SelectContextValue<V>>(SELECT_CONTEXT_KEY);
  const initialOpen = controller.open;
</script>

<ul
  {...rest}
  role="listbox"
  aria-labelledby={controller.triggerId}
  tabindex="-1"
  data-state={initialOpen ? 'open' : 'closed'}
  hidden={!initialOpen || undefined}
  {@attach controller.listbox}
>
  {#if children}{@render children()}{/if}
</ul>
