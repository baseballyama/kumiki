<!--
  @component Menu.Separator — visual + ARIA separator between items.

  Same factory as Item; the attachment recognises kind === 'separator'
  and renders role="separator" without click / pointerenter handlers.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import { MENU_CONTEXT_KEY, type MenuContextValue, type MenuItem } from './context.js';

  type Props = {
    item: MenuItem;
    [key: string]: unknown;
  };

  let { item, ...rest }: Props = $props();

  const { controller } = getContext<MenuContextValue>(MENU_CONTEXT_KEY);
  // svelte-ignore state_referenced_locally
  const sepAttach = controller.item({ ...item, kind: 'separator' });
</script>

<div data-component-part="separator" {...rest} {@attach sepAttach}></div>
