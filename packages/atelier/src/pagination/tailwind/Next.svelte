<script lang="ts">
  import { Next } from '@kumiki/components/pagination';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Next
  class={`inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40 dark:hover:bg-slate-800 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{:else}Next <span aria-hidden="true">›</span>{/if}
</Next>
