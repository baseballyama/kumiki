<!--
  @component Popover.Title — labels the content via aria-labelledby.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { POPOVER_CONTEXT_KEY, type PopoverContextValue } from './context.js';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();

  const { controller } = getContext<PopoverContextValue>(POPOVER_CONTEXT_KEY);
</script>

<h2 data-component-part="title" {...rest} {@attach controller.title}>
  {#if children}{@render children()}{/if}
</h2>
