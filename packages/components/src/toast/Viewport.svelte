<!--
  @component Toast.Viewport — the live-region container hosting all toasts.

  Hover or focus inside the viewport pauses every active timer; leave
  resumes them with elapsed-ms preserved.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { TOASTER_CONTEXT_KEY, type ToasterContextValue } from './context.js';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();

  const { controller } = getContext<ToasterContextValue>(TOASTER_CONTEXT_KEY);
</script>

<div data-component-part="viewport" {...rest} {@attach controller.viewport}>
  {#if children}{@render children()}{/if}
</div>
