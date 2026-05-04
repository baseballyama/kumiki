<!--
  @component Dialog.Close — a button that closes the dialog when clicked.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { DIALOG_CONTEXT_KEY, type DialogContextValue } from './context.js';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();

  const { controller } = getContext<DialogContextValue>(DIALOG_CONTEXT_KEY);
</script>

<button {...rest} type="button" data-component-part="close" {@attach controller.close}>
  {#if children}{@render children()}{/if}
</button>
