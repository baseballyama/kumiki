<script lang="ts">
  import { Decrement } from '@kumiki/components/number-field';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Decrement
  class={`inline-flex w-[1.875rem] items-center justify-center border-r border-slate-200 text-sm text-slate-500 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{:else}<span aria-hidden="true">−</span>{/if}
</Decrement>
