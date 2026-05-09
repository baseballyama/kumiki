<script lang="ts">
  import { Item } from '@kumiki/components/toolbar';
  import type { Snippet } from 'svelte';

  type Props = { disabled?: boolean; children: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Item
  class={`inline-flex h-8 items-center justify-center rounded px-2 text-sm font-medium hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-slate-800 ${className}`.trim()}
  {...rest}
>
  {@render children()}
</Item>
