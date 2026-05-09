<script lang="ts">
  import { Decrement } from '@kumiki/components/number-field';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Decrement class={className} {...rest}>
  {#if children}{@render children()}{:else}<span aria-hidden="true">−</span>{/if}
</Decrement>
