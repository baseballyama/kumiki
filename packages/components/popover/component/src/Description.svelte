<!--
  @component Popover.Description — describes the content via aria-describedby.
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

<p data-component-part="description" {...rest} {@attach controller.description}>
  {#if children}{@render children()}{/if}
</p>
