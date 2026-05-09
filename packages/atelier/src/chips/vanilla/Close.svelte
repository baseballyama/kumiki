<script lang="ts">
  import { Close } from '@kumiki/components/chips';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Close class={className} {...rest}>
  {#if children}{@render children()}{:else}<span aria-hidden="true">×</span>{/if}
</Close>
