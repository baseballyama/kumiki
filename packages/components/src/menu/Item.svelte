<!--
  @component Menu.Item — a single actionable menu item (role="menuitem").

  The attachment paints role + aria-disabled + data-highlighted, wires
  pointerenter to highlight, and click to ACTIVATE (which fires
  Root's onSelect callback).
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { MENU_CONTEXT_KEY, type MenuContextValue, type MenuItem } from './context.js';

  type Props = {
    item: MenuItem;
    children?: Snippet;
    [key: string]: unknown;
  };

  let { item, children, ...rest }: Props = $props();

  const { controller } = getContext<MenuContextValue>(MENU_CONTEXT_KEY);
  // Each Item is keyed by item.id in the consumer's #each, so capturing
  // the per-id attachment factory once is safe for this component's lifetime.
  // svelte-ignore state_referenced_locally
  const itemAttach = controller.item(item);
</script>

<div data-component-part="item" {...rest} {@attach itemAttach}>
  {#if children}{@render children()}{/if}
</div>
