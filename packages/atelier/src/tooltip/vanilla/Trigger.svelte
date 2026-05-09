<script lang="ts">
  import { Trigger } from '@kumiki/components/tooltip';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Trigger class={className} {...rest}>
  {#if children}{@render children()}{/if}
</Trigger>
