<!--
  @component Toast.Title — accessible title for the current toast.
  Sets `id` so AT can label the item if needed.
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

<div {...rest} id="{controller.id}-{toast.id}-title" data-component-part="title">
  {#if children}{@render children()}{/if}
</div>
