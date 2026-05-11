<!--
  @component @kumiki/atelier/dialog Tailwind — Trigger button.
-->
<script lang="ts">
  import * as Dialog from '@kumiki/components/dialog';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();

  const base =
    'inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-orange-600 px-3.5 text-[0.8125rem] font-[550] tracking-[-0.005em] text-white shadow-[0_1px_2px_rgb(67_56_202_/_0.18),inset_0_1px_0_rgb(255_255_255_/_0.08)] transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-orange-700 active:translate-y-[0.5px] active:bg-orange-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 focus-visible:ring-offset-white dark:bg-orange-500 dark:hover:bg-orange-400 dark:focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none';
</script>

<Dialog.Trigger class={`${base} ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Dialog.Trigger>
