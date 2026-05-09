<!--
  @component @kumiki/atelier/dialog Tailwind — Trigger button.
-->
<script lang="ts">
  import * as Dialog from '@kumiki/components/dialog';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();

  const base =
    'inline-flex h-9 items-center justify-center rounded-md bg-slate-900 px-3 text-sm font-medium text-slate-50 shadow-sm transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus-visible:ring-slate-300';
</script>

<Dialog.Trigger class={`${base} ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Dialog.Trigger>
