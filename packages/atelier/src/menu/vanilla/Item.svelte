<script lang="ts">
  import { Item } from '@kumiki/components/menu';
  import type { Snippet } from 'svelte';
  import type { MenuItem as MenuItemType } from '@kumiki/components/menu';

  type Props = { item: MenuItemType; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Item class={className} {...rest}>
  {#if children}{@render children()}{/if}
</Item>
