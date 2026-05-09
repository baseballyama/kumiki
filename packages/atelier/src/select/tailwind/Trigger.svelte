<script lang="ts" generics="V">
  import { Trigger } from '@kumiki/components/select';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Trigger
  class={`inline-flex h-9 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 text-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
  <span aria-hidden="true">▾</span>
</Trigger>
