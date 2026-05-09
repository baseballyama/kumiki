<script lang="ts">
  import { Tab } from '@kumiki/components/tabs';
  import type { Snippet } from 'svelte';
  import type { TabItem } from '@kumiki/components/tabs';

  type Props = { value: TabItem; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Tab class={className} {...rest}>
  {#if children}{@render children()}{/if}
</Tab>
