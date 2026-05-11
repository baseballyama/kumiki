<script lang="ts" generics="V">
  import { Trigger } from '@kumiki/components/select';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Trigger
  class={`inline-flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white pl-3 pr-2.5 text-[0.8125rem] tracking-[-0.005em] text-slate-900 shadow-[inset_0_1px_1px_rgb(0_0_0_/_0.025),0_1px_1px_rgb(0_0_0_/_0.02)] transition-[border-color,box-shadow] duration-150 hover:border-slate-300 focus-visible:border-orange-500 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-orange-500/[0.18] data-[state=open]:[&_>_span:last-child]:rotate-180 [&_>_span:last-child]:text-[0.6875rem] [&_>_span:last-child]:text-slate-500 [&_>_span:last-child]:transition-transform dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:hover:border-slate-600 dark:focus-visible:border-orange-500 dark:focus-visible:ring-orange-500/25 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
  <span aria-hidden="true">▾</span>
</Trigger>
