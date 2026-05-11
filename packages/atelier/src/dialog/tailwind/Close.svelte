<!--
  @component @kumiki/atelier/dialog Tailwind — Close button.
-->
<script lang="ts">
  import * as Dialog from '@kumiki/components/dialog';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();

  const base =
    'inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 text-[0.8125rem] font-[550] tracking-[-0.005em] text-slate-900 shadow-sm transition-colors duration-150 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-50 active:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 focus-visible:ring-offset-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700 dark:focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none';
</script>

<Dialog.Close class={`${base} ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Dialog.Close>
