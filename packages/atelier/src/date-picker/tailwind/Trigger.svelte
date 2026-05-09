<script lang="ts">
  import { Trigger } from '@kumiki/components/date-picker';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet<[label: string]>; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Trigger
  class={`inline-flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 ${className}`.trim()}
  {...rest}
>
  {#snippet children(label: string)}
    <span aria-hidden="true">📅</span>
    <span>{label}</span>
  {/snippet}
</Trigger>
