<script lang="ts">
  import { Content } from '@kumiki/components/popover';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Content
  class={`z-50 w-72 rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-900 shadow-lg outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Content>
