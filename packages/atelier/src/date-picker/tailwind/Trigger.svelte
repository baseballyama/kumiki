<script lang="ts">
  import { Trigger } from '@kumiki/components/date-picker';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet<[label: string]>; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Trigger
  class={`inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-[0.8125rem] font-medium tracking-[-0.005em] text-slate-900 shadow-sm transition-colors duration-150 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 focus-visible:ring-offset-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950 ${className}`.trim()}
  {...rest}
>
  {#snippet children(label: string)}
    <span aria-hidden="true">📅</span>
    <span>{label}</span>
  {/snippet}
</Trigger>
