<!--
  @component Popover.Trigger — the button that toggles the popover.
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
  const initialOpen = controller.open;
</script>

<button
  {...rest}
  type="button"
  aria-haspopup="dialog"
  aria-expanded={initialOpen ? 'true' : 'false'}
  aria-controls={controller.contentId}
  data-state={initialOpen ? 'open' : 'closed'}
  {@attach controller.trigger}
>
  {#if children}{@render children()}{/if}
</button>
