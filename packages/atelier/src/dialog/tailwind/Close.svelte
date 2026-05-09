<!--
  @component @kumiki/atelier/dialog Tailwind — Close button.
-->
<script lang="ts">
  import * as Dialog from '@kumiki/components/dialog';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();

  const base =
    'inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-transparent px-3 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:hover:bg-slate-800 dark:focus-visible:ring-slate-300';
</script>

<Dialog.Close class={`${base} ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Dialog.Close>
