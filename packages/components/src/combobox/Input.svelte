<!--
  @component Combobox.Input — the text input that drives the combobox.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import {
    COMBOBOX_CONTEXT_KEY,
    type ComboboxContextValue,
    type ComboboxOption,
  } from './context.js';

  type Props = {
    placeholder?: string;
    /** Spread onto the underlying <input>. Useful for class, style, etc. */
    [key: string]: unknown;
  };

  let { placeholder, ...rest }: Props = $props();

  // The cast lives at one well-known place — the boundary where the generic
  // is consumed inside this child component.
  const { controller } = getContext<ComboboxContextValue<ComboboxOption>>(COMBOBOX_CONTEXT_KEY);
</script>

<input type="text" {placeholder} {...rest} {@attach controller.input} />
