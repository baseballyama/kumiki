<!--
  @component @kumiki/atelier/dialog Tailwind — Content panel.
-->
<script lang="ts">
  import * as Dialog from '@kumiki/components/dialog';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();

  const base =
    'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-3.5 rounded-[14px] border border-slate-200/80 bg-white/95 backdrop-blur-xl px-7 pt-[1.625rem] pb-6 shadow-[0_1px_1px_rgb(0_0_0_/_0.02),0_4px_8px_-2px_rgb(0_0_0_/_0.04),0_16px_40px_-8px_rgb(30_27_75_/_0.16),0_32px_80px_-16px_rgb(30_27_75_/_0.18)] outline-none ring-1 ring-black/[0.04] tracking-[-0.005em] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-safe:data-[state=open]:duration-[240ms] motion-safe:data-[state=open]:ease-[cubic-bezier(0.32,0.72,0,1)] motion-safe:data-[state=closed]:duration-[160ms] dark:border-slate-800 dark:bg-slate-900/95 dark:ring-white/[0.04]';
</script>

<Dialog.Content class={`${base} ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Dialog.Content>
