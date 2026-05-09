<script lang="ts">
  import { Increment } from '@kumiki/components/number-field';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Increment
  class={`inline-flex w-7 items-center justify-center border-l border-slate-300 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{:else}<span aria-hidden="true">+</span>{/if}
</Increment>
