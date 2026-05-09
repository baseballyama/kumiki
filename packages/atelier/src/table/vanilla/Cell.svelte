<script lang="ts">
  import { Cell } from '@kumiki/components/table';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Cell class={className} {...rest}>
  {#if children}{@render children()}{/if}
</Cell>
