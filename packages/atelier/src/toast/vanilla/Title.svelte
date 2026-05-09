<script lang="ts">
  import { Title } from '@kumiki/components/toast';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Title class={className} {...rest}>
  {#if children}{@render children()}{/if}
</Title>
