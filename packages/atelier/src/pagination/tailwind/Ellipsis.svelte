<script lang="ts">
  import { Ellipsis } from '@kumiki/components/pagination';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Ellipsis
  class={`inline-flex h-9 min-w-9 items-center justify-center text-slate-500 dark:text-slate-400 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{:else}…{/if}
</Ellipsis>
