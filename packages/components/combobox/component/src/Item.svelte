<!--
  @component Combobox.Item — a single option in the listbox.
-->
<script lang="ts" generics="T extends ComboboxOption">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import {
    COMBOBOX_CONTEXT_KEY,
    type ComboboxContextValue,
    type ComboboxOption,
  } from './context.js';

  type Props = {
    /** The option this item represents. Spread on `data-value`. */
    value: T;
    children: Snippet;
  };

  let { value, children }: Props = $props();

  const { controller } = getContext<ComboboxContextValue<T>>(COMBOBOX_CONTEXT_KEY);
  // The attachment closes over `value` at construction time. `value` here is
  // the option this Item represents — it does not change for the lifetime of
  // the component instance (different option → different Item key in {#each}).
  // svelte-ignore state_referenced_locally
  const attachment = controller.option(value);
</script>

<li {@attach attachment}>{@render children()}</li>
