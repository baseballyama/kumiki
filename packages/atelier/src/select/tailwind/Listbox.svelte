<script lang="ts" generics="V">
  import { Listbox } from '@kumiki/components/select';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Listbox
  class={`z-50 min-w-[11rem] list-none overflow-auto rounded-[10px] border border-slate-200 bg-white p-[0.3125rem] shadow-[0_1px_2px_rgb(0_0_0_/_0.04),0_8px_24px_-4px_rgb(30_27_75_/_0.12),0_16px_40px_-8px_rgb(30_27_75_/_0.18)] outline-none ring-1 ring-black/[0.03] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 dark:border-slate-700 dark:bg-slate-900 dark:ring-white/[0.04] ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Listbox>
