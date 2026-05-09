<script lang="ts">
  import { Root } from '@kumiki/components/menu';
  import type { Snippet } from 'svelte';
  import type { MenuItem, MenuController } from '@kumiki/components/menu';

  type Props = {
    items: ReadonlyArray<MenuItem>;
    defaultOpen?: boolean;
    navigation?: 'wrap' | 'clamp';
    onSelect?: (item: MenuItem) => void;
    onOpenChange?: (open: boolean) => void;
    id?: string;
    children: Snippet<[{ items: ReadonlyArray<MenuItem>; controller: MenuController }]>;
  };

  let { children, ...rest }: Props = $props();
</script>

<Root {children} {...rest} />
