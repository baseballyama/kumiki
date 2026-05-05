<!--
  @component Toast.Close — button that dismisses the current toast.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import {
    TOAST_ITEM_CONTEXT_KEY,
    TOASTER_CONTEXT_KEY,
    type ToastItemContextValue,
    type ToasterContextValue,
  } from './context.js';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();

  const { controller } = getContext<ToasterContextValue>(TOASTER_CONTEXT_KEY);
  const { toast } = getContext<ToastItemContextValue>(TOAST_ITEM_CONTEXT_KEY);
  const closeAttach = controller.closeButton(toast.id);
</script>

<button type="button" data-component-part="close" {...rest} {@attach closeAttach}>
  {#if children}{@render children()}{/if}
</button>
