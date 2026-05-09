<script lang="ts">
  import { Fallback } from '@kumiki/components/avatar';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Fallback class={className} {...rest}>
  {#if children}{@render children()}{/if}
</Fallback>
