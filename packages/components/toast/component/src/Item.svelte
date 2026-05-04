<!--
  @component Toast.Item — wraps one toast. Sets a context entry so that
  Title / Description / Close inside this Item know which toast they
  belong to (for ARIA wiring + dismiss).
-->
<script lang="ts">
  import { getContext, setContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import {
    TOAST_ITEM_CONTEXT_KEY,
    TOASTER_CONTEXT_KEY,
    type ToastItem,
    type ToastItemContextValue,
    type ToasterContextValue,
  } from './context.js';

  type Props = {
    toast: ToastItem;
    children?: Snippet;
    [key: string]: unknown;
  };

  let { toast, children, ...rest }: Props = $props();

  const { controller } = getContext<ToasterContextValue>(TOASTER_CONTEXT_KEY);
  setContext<ToastItemContextValue>(TOAST_ITEM_CONTEXT_KEY, {
    get toast() {
      return toast;
    },
  } as ToastItemContextValue);

  // Each Item is mounted per toast.id in the consumer's #each, so the id
  // is stable for this component's lifetime. svelte-check's generic warning
  // about `state_referenced_locally` doesn't apply here.
  // svelte-ignore state_referenced_locally
  const itemAttach = controller.item(toast.id);
</script>

<div data-component-part="item" {...rest} {@attach itemAttach}>
  {#if children}{@render children()}{/if}
</div>
