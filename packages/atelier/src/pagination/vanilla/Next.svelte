<script lang="ts">
  import { Next } from '@kumiki/components/pagination';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Next class={className} {...rest}>
  {#if children}{@render children()}{:else}Next <span aria-hidden="true">›</span>{/if}
</Next>
