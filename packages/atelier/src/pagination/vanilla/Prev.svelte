<script lang="ts">
  import { Prev } from '@kumiki/components/pagination';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Prev class={className} {...rest}>
  {#if children}{@render children()}{:else}<span aria-hidden="true">‹</span> Prev{/if}
</Prev>
