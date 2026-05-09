<script lang="ts">
  import { Close } from '@kumiki/components/popover';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Close class={className} {...rest}>
  {#if children}{@render children()}{:else}<span aria-hidden="true">×</span>{/if}
</Close>
