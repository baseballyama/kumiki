<script lang="ts">
  import { Tab } from '@kumiki/components/tabs';
  import type { Snippet } from 'svelte';
  import type { TabItem } from '@kumiki/components/tabs';

  type Props = { value: TabItem; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Tab
  class={`-mb-px inline-flex h-9 items-center border-b-2 border-transparent px-3 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 data-[state=active]:border-slate-900 data-[state=active]:text-slate-900 disabled:opacity-50 dark:text-slate-400 dark:hover:text-slate-50 dark:data-[state=active]:border-slate-50 dark:data-[state=active]:text-slate-50 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Tab>
