<script lang="ts">
  import { Header } from '@kumiki/components/calendar';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Header class={className} {...rest}>
  {#if children}{@render children()}{/if}
</Header>
