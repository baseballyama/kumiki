<!--
  @component Tooltip.Content — the popup hint.

  Renders a `<div role="tooltip">` and toggles `hidden` based on tooltip
  state. Position with CSS / Floating UI in user-land — this layer is
  headless.

  Per APG: tooltip content is descriptive and non-interactive. Don't put
  buttons, links, or focusables inside.
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

<div
  {...rest}
  role="tooltip"
  id={controller.contentId}
  data-state={initialOpen ? 'open' : 'closed'}
  hidden={!initialOpen || undefined}
  {@attach controller.content}
>
  {#if children}{@render children()}{/if}
</div>
