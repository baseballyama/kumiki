<script lang="ts">
  import { Input } from '@kumiki/components/time-field';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Input
  class={`inline-flex h-9 items-center gap-0.5 rounded-md border border-slate-300 bg-white px-2.5 text-sm tabular-nums focus-within:ring-2 focus-within:ring-slate-950 dark:border-slate-700 dark:bg-slate-900 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Input>
