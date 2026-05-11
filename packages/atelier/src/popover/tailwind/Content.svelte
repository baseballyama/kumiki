<script lang="ts">
  import { Content } from '@kumiki/components/popover';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Content
  class={`z-50 w-72 rounded-xl border border-slate-200 bg-white px-[1.125rem] py-4 text-[0.8125rem] leading-relaxed tracking-[-0.005em] text-slate-900 shadow-[0_1px_2px_rgb(0_0_0_/_0.04),0_8px_24px_-4px_rgb(30_27_75_/_0.12),0_16px_40px_-8px_rgb(30_27_75_/_0.18)] outline-none ring-1 ring-black/[0.03] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-safe:data-[state=open]:duration-200 motion-safe:data-[state=closed]:duration-150 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:ring-white/[0.04] ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Content>
