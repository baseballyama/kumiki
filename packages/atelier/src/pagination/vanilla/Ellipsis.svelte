<script lang="ts">
  import { Ellipsis } from '@kumiki/components/pagination';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Ellipsis class={className} {...rest}>
  {#if children}{@render children()}{:else}…{/if}
</Ellipsis>
