<script lang="ts">
  import { Overflow } from '@kumiki/components/avatar-group';
  import type { Snippet } from 'svelte';

  type Props = { count?: number; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Overflow
  class={`relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-300 text-xs font-medium text-slate-700 ring-2 ring-white dark:bg-slate-600 dark:text-slate-200 dark:ring-slate-900 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Overflow>
