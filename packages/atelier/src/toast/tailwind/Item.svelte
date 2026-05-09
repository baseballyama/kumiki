<script lang="ts">
  import { Item } from '@kumiki/components/toast';
  import type { Snippet } from 'svelte';
  import type { ToastItem } from '@kumiki/components/toast';

  type Props = { toast: ToastItem; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Item
  class={`pointer-events-auto relative grid gap-1 rounded-md border border-slate-200 bg-white p-4 pr-8 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Item>
