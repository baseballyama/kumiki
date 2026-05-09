<script lang="ts">
  import { PageItem } from '@kumiki/components/pagination';
  import type { Snippet } from 'svelte';

  type Props = { page: number; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<PageItem
  class={`inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm font-medium hover:bg-slate-100 data-[current=page]:bg-slate-900 data-[current=page]:text-white dark:hover:bg-slate-800 dark:data-[current=page]:bg-slate-100 dark:data-[current=page]:text-slate-900 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</PageItem>
