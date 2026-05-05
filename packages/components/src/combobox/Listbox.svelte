<!--
  @component Combobox.Listbox — popover container with the option list.

  The default rendering iterates `controller.filtered` and renders the `item`
  snippet for each. For empty results, the `empty` snippet is rendered.
-->
<script lang="ts" generics="T extends ComboboxOption">
  import { getContext, onDestroy } from 'svelte';
  import type { Snippet } from 'svelte';
  import {
    COMBOBOX_CONTEXT_KEY,
    type ComboboxContextValue,
    type ComboboxOption,
  } from './context.js';

  type Props = {
    /** Snippet receiving each option for rendering an Item. */
    item?: Snippet<[option: T, index: number]>;
    /** Snippet rendered when no results. */
    empty?: Snippet;
    /** Snippet rendered while async fetch in flight. */
    loading?: Snippet;
    /** Default content; rendered if `item` snippet not provided. */
    children?: Snippet;
  };

  let { item, empty, loading, children }: Props = $props();

  const { controller } = getContext<ComboboxContextValue<T>>(COMBOBOX_CONTEXT_KEY);

  let snapFiltered = $state(controller.filtered);
  let snapStatus = $state(controller.status);

  const unsub = controller.subscribe(({ context }) => {
    snapFiltered = context.filtered;
    snapStatus = context.status;
  });
  onDestroy(unsub);
</script>

<ul {@attach controller.listbox}>
  {#if snapStatus === 'loading' && loading}
    {@render loading()}
  {:else if snapFiltered.length === 0 && empty}
    {@render empty()}
  {:else if item}
    {#each snapFiltered as opt, index (opt.id)}
      {@render item(opt, index)}
    {/each}
  {:else if children}
    {@render children()}
  {/if}
</ul>
