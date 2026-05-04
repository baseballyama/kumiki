<!--
  @component Tooltip.Trigger — the focusable element the tooltip describes.

  APG requires the trigger to be focusable. Defaults to a `<button>`; if you
  need a different tag (e.g. an icon-only `<a>`), spread it via `{...rest}`
  and ensure `tabindex` is correct.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { TOOLTIP_CONTEXT_KEY, type TooltipContextValue } from './context.js';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();

  const { controller } = getContext<TooltipContextValue>(TOOLTIP_CONTEXT_KEY);
  const initialOpen = controller.open;
</script>

<button
  {...rest}
  type="button"
  aria-describedby={controller.contentId}
  data-component-host="tooltip"
  data-state={initialOpen ? 'open' : 'closed'}
  {@attach controller.trigger}
>
  {#if children}{@render children()}{/if}
</button>
