<!--
  @component Combobox.Trigger — optional toggle button that opens / closes the
  listbox. Most consumers won't need this; clicking the input alone is enough.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import {
    COMBOBOX_CONTEXT_KEY,
    type ComboboxContextValue,
    type ComboboxOption,
  } from './context.js';

  type Props = {
    children?: Snippet;
    'aria-label'?: string;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();

  const { controller } = getContext<ComboboxContextValue<ComboboxOption>>(COMBOBOX_CONTEXT_KEY);
</script>

<button type="button" {...rest} {@attach controller.trigger}>
  {#if children}{@render children()}{/if}
</button>
