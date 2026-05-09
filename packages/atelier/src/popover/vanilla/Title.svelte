<script lang="ts">
  import { Title } from '@kumiki/components/popover';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Title class={className} {...rest}>
  {#if children}{@render children()}{/if}
</Title>
