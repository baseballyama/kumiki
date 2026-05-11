<!--
  @component @kumiki/atelier/dialog Vanilla — Close button.

  Renders the L4 `Dialog.Close` (a `<button>`) with a Kumiki-styled
  appearance. Pass `variant="primary"` for the accent-filled style,
  `variant="ghost"` for a quiet outline. Avoid wrapping `<Button.Root>`
  inside — that produces invalid nested `<button>` HTML.
-->
<script lang="ts">
  import * as Dialog from '@kumiki/components/dialog';
  import type { Snippet } from 'svelte';

  type Props = {
    variant?: 'primary' | 'ghost';
    class?: string;
    children?: Snippet;
    [k: string]: unknown;
  };
  let { variant = 'ghost', class: className = '', children, ...rest }: Props = $props();
</script>

<Dialog.Close class={`kumiki-dialog-close ${className}`.trim()} data-variant={variant} {...rest}>
  {#if children}{@render children()}{/if}
</Dialog.Close>

<style>
  :global(.kumiki-dialog-close) {
    display: inline-flex;
    height: 2.25rem;
    align-items: center;
    justify-content: center;
    padding-inline: 0.875rem;
    border: 1px solid transparent;
    border-radius: 8px;
    font: inherit;
    font-size: 0.8125rem;
    font-weight: 550;
    letter-spacing: -0.005em;
    cursor: pointer;
    transition:
      background-color 140ms cubic-bezier(0.32, 0.72, 0, 1),
      box-shadow 140ms cubic-bezier(0.32, 0.72, 0, 1),
      color 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-dialog-close[data-variant='ghost']) {
    background: transparent;
    color: var(--kumiki-color-fg-muted);
    border-color: var(--kumiki-color-line);
  }
  :global(.kumiki-dialog-close[data-variant='ghost']:hover) {
    background: var(--kumiki-color-surface);
    color: var(--kumiki-color-fg);
  }
  :global(.kumiki-dialog-close[data-variant='primary']) {
    background: var(--kumiki-color-accent);
    color: var(--kumiki-color-accent-fg);
    border-color: var(--kumiki-color-accent);
    box-shadow:
      0 1px 2px color-mix(in oklab, var(--kumiki-color-accent) 22%, transparent),
      inset 0 1px 0 oklch(1 0 0 / 0.1);
  }
  :global(.kumiki-dialog-close[data-variant='primary']:hover) {
    background: var(--kumiki-color-accent-hover);
    border-color: var(--kumiki-color-accent-hover);
  }
  :global(.kumiki-dialog-close:focus-visible) {
    outline: 0;
    box-shadow:
      0 0 0 2px var(--kumiki-color-bg),
      0 0 0 4px var(--kumiki-color-accent);
  }
</style>
