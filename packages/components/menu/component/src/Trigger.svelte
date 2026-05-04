<!--
  @component Menu.Trigger — the button that opens the menu.
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

<button
  {...rest}
  type="button"
  aria-haspopup="menu"
  aria-expanded={initialOpen ? 'true' : 'false'}
  aria-controls={controller.menuId}
  data-state={initialOpen ? 'open' : 'closed'}
  {@attach controller.trigger}
>
  {#if children}{@render children()}{/if}
</button>
