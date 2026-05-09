<script lang="ts">
  import { Overflow } from '@kumiki/components/avatar-group';
  import type { Snippet } from 'svelte';

  type Props = { count?: number; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Overflow class={className} {...rest}>
  {#if children}{@render children()}{/if}
</Overflow>
