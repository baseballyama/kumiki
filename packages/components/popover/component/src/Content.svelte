<!--
  @component Popover.Content — the panel that holds the popover body.

  Activates dismissable + focus-on-open via the attachment. Non-modal:
  no focus trap, no inert background.
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

<div
  {...rest}
  role="dialog"
  aria-labelledby={controller.titleId}
  data-component-host="popover"
  data-state={initialOpen ? 'open' : 'closed'}
  hidden={!initialOpen || undefined}
  {@attach controller.content}
>
  {#if children}{@render children()}{/if}
</div>
