<script lang="ts">
  import { Increment } from '@kumiki/components/number-field';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Increment class={className} {...rest}>
  {#if children}{@render children()}{:else}<span aria-hidden="true">+</span>{/if}
</Increment>
