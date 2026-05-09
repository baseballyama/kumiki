<!--
  @component @kumiki/atelier/dialog Vanilla — Description.
-->
<script lang="ts">
  import * as Dialog from '@kumiki/components/dialog';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Dialog.Description class={`kumiki-dialog-description ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Dialog.Description>

<style>
  :global(.kumiki-dialog-description) {
    margin: 0;
    font-size: 0.875rem;
    color: var(--kumiki-dialog-muted, oklch(0.55 0 0));
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-dialog-description) {
      --kumiki-dialog-muted: oklch(0.7 0 0);
    }
  }
</style>
