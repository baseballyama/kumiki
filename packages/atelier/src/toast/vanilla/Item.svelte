<script lang="ts">
  import { Item } from '@kumiki/components/toast';
  import type { Snippet } from 'svelte';
  import type { ToastItem } from '@kumiki/components/toast';

  type Props = { toast: ToastItem; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Item class={className} {...rest}>
  {#if children}{@render children()}{/if}
</Item>
