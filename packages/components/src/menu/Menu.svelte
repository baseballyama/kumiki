<!--
  @component Menu.Menu — the popup container with role="menu".

  The attachment activates dismissable on open (outside-click + Escape
  close) and toggles `hidden` based on machine state.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { MENU_CONTEXT_KEY, type MenuContextValue } from './context.js';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();

  const { controller } = getContext<MenuContextValue>(MENU_CONTEXT_KEY);
  const initialOpen = controller.open;
</script>

<div
  {...rest}
  role="menu"
  aria-labelledby={controller.triggerId}
  data-component-host="menu"
  data-state={initialOpen ? 'open' : 'closed'}
  hidden={!initialOpen || undefined}
  {@attach controller.menu}
>
  {#if children}{@render children()}{/if}
</div>
