<!--
  @component Menu.Root — owns the controller, exposes children with
  reactive items + controller via snippet args.

  Renders no DOM itself. Iterating happens in the consumer's template.
-->
<script lang="ts">
  import { onDestroy, setContext, untrack } from 'svelte';
  import { createMenu, type MenuController, type MenuItem } from '@kumiki/attachment-menu';
  import type { Snippet } from 'svelte';
  import { MENU_CONTEXT_KEY, type MenuContextValue } from './context.js';

  type Props = {
    items: ReadonlyArray<MenuItem>;
    defaultOpen?: boolean;
    navigation?: 'wrap' | 'clamp';
    onSelect?: (item: MenuItem) => void;
    onOpenChange?: (open: boolean) => void;
    id?: string;
    children: Snippet<[{ items: ReadonlyArray<MenuItem>; controller: MenuController }]>;
  };

  let { items, defaultOpen, navigation, onSelect, onOpenChange, id, children }: Props = $props();

  const controller: MenuController = untrack(() =>
    createMenu({ items, defaultOpen, navigation, onSelect, onOpenChange, id }),
  );

  // Mirror items into a reactive snapshot so consumer #each tracks updates.
  let liveItems = $state.raw<ReadonlyArray<MenuItem>>(controller.context.items);
  const unsub = controller.subscribe(({ context }) => {
    liveItems = context.items;
  });
  onDestroy(unsub);

  $effect(() => {
    if (items !== controller.context.items) {
      controller.setItems(items);
    }
  });

  setContext<MenuContextValue>(MENU_CONTEXT_KEY, { controller });
</script>

{@render children({ items: liveItems, controller })}
