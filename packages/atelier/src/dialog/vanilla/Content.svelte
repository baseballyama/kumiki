<!--
  @component @kumiki/atelier/dialog Vanilla — Content panel.
-->
<script lang="ts">
  import * as Dialog from '@kumiki/components/dialog';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Dialog.Content class={`kumiki-dialog-content ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Dialog.Content>

<style>
  :global(.kumiki-dialog-content) {
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 50;
    width: 100%;
    max-width: 32rem;
    transform: translate(-50%, -50%);
    display: grid;
    gap: 1rem;
    padding: 1.5rem;
    border: 1px solid var(--kumiki-dialog-border, oklch(0.9 0 0));
    border-radius: 0.5rem;
    background: var(--kumiki-dialog-bg, oklch(1 0 0));
    color: var(--kumiki-dialog-fg, inherit);
    box-shadow:
      0 25px 50px -12px rgb(0 0 0 / 0.25),
      0 0 0 1px rgb(0 0 0 / 0.05);
    animation: kumiki-content-in 180ms ease-out;
  }
  :global(.kumiki-dialog-content[data-state='closed']) {
    animation: kumiki-content-out 120ms ease-out forwards;
  }

  @keyframes kumiki-content-in {
    from {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
  @keyframes kumiki-content-out {
    from {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    to {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.97);
    }
  }

  @media (prefers-color-scheme: dark) {
    :global(.kumiki-dialog-content) {
      --kumiki-dialog-bg: oklch(0.18 0 0);
      --kumiki-dialog-border: oklch(0.28 0 0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-dialog-content),
    :global(.kumiki-dialog-content[data-state='closed']) {
      animation: none;
    }
  }
</style>
