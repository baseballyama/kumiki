<script lang="ts">
  import { Item } from '@kumiki/components/menu';
  import type { Snippet } from 'svelte';
  import type { MenuItem as MenuItemType } from '@kumiki/components/menu';

  type Props = { item: MenuItemType; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Item
  class={`flex cursor-default select-none items-center rounded px-2 py-1.5 text-sm outline-none data-[active]:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:data-[active]:bg-slate-800 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Item>
