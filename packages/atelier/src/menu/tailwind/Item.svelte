<script lang="ts">
  import { Item } from '@kumiki/components/menu';
  import type { Snippet } from 'svelte';
  import type { MenuItem as MenuItemType } from '@kumiki/components/menu';

  type Props = { item: MenuItemType; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Item
  class={`flex cursor-default select-none items-center rounded-md px-2.5 py-[0.4375rem] text-[0.8125rem] font-medium tracking-[-0.005em] text-slate-900 outline-none transition-colors duration-100 data-[active]:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-45 dark:text-slate-50 dark:data-[active]:bg-slate-800 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Item>
