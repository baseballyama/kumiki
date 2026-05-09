<script lang="ts">
  import { Trigger } from '@kumiki/components/combobox';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; 'aria-label'?: string; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Trigger
  class={`absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{:else}<span aria-hidden="true">▾</span>{/if}
</Trigger>
