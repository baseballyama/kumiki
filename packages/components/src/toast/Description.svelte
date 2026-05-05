<!--
  @component Toast.Description — accessible description for the current toast.
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
</script>

<div {...rest} id="{controller.id}-{toast.id}-description" data-component-part="description">
  {#if children}{@render children()}{/if}
</div>
