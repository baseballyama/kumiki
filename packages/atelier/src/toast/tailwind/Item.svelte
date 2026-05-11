<script lang="ts">
  import { Item } from '@kumiki/components/toast';
  import type { Snippet } from 'svelte';
  import type { ToastItem } from '@kumiki/components/toast';

  type Props = { toast: ToastItem; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Item
  class={`pointer-events-auto relative grid gap-[0.1875rem] rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-9 text-[0.8125rem] tracking-[-0.005em] shadow-[0_1px_2px_rgb(0_0_0_/_0.04),0_8px_24px_-4px_rgb(30_27_75_/_0.14),0_16px_40px_-8px_rgb(30_27_75_/_0.20)] data-[severity=success]:border-l-[3px] data-[severity=success]:border-l-emerald-500 data-[severity=error]:border-l-[3px] data-[severity=error]:border-l-rose-500 data-[severity=warn]:border-l-[3px] data-[severity=warn]:border-l-amber-500 data-[severity=info]:border-l-[3px] data-[severity=info]:border-l-sky-500 motion-safe:animate-in motion-safe:slide-in-from-bottom-2 motion-safe:fade-in-0 motion-safe:duration-300 dark:border-slate-700 dark:bg-slate-900 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Item>
