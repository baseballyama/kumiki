<!--
  @component Popover.Close — button that closes the popover.
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

<button type="button" data-component-part="close" {...rest} {@attach controller.close}>
  {#if children}{@render children()}{/if}
</button>
