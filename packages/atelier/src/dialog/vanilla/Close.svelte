<!--
  @component @kumiki/atelier/dialog Vanilla — Close button.
-->
<script lang="ts">
  import * as Dialog from '@kumiki/components/dialog';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Dialog.Close class={`kumiki-dialog-close ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Dialog.Close>

<style>
  :global(.kumiki-dialog-close) {
    display: inline-flex;
    height: 2.25rem;
    align-items: center;
    justify-content: center;
    padding-inline: 0.75rem;
    border: 1px solid var(--kumiki-dialog-border, oklch(0.9 0 0));
    border-radius: 0.375rem;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 120ms ease;
  }
  :global(.kumiki-dialog-close:hover) {
    background: var(--kumiki-dialog-close-hover, oklch(0.95 0 0));
  }
  :global(.kumiki-dialog-close:focus-visible) {
    outline: 0;
    box-shadow:
      0 0 0 2px var(--kumiki-dialog-ring-offset, oklch(1 0 0)),
      0 0 0 4px var(--kumiki-dialog-ring, oklch(0.55 0.18 252));
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-dialog-close) {
      --kumiki-dialog-border: oklch(0.28 0 0);
      --kumiki-dialog-close-hover: oklch(0.25 0 0);
    }
  }
</style>
