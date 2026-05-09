<script lang="ts">
  import { Panel } from '@kumiki/components/tabs';
  import type { Snippet } from 'svelte';
  import type { TabItem } from '@kumiki/components/tabs';

  type Props = { value: TabItem; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Panel
  class={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Panel>
