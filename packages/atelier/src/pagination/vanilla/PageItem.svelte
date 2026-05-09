<script lang="ts">
  import { PageItem } from '@kumiki/components/pagination';
  import type { Snippet } from 'svelte';

  type Props = { page: number; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<PageItem class={className} {...rest}>
  {#if children}{@render children()}{/if}
</PageItem>
