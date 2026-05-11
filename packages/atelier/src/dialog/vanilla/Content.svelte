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
    max-width: var(--kumiki-dialog-content-max-width, 32rem);
    transform: translate(-50%, -50%);
    display: grid;
    gap: 0.875rem;
    padding: var(--kumiki-dialog-content-padding, 1.625rem 1.75rem 1.5rem);
    border: 1px solid var(--kumiki-dialog-border, var(--kumiki-color-line));
    border-radius: var(--kumiki-dialog-content-radius, 14px);
    background: var(--kumiki-dialog-bg, var(--kumiki-color-bg));
    color: var(--kumiki-dialog-fg, var(--kumiki-color-fg));
    letter-spacing: -0.005em;
    box-shadow:
      0 1px 1px oklch(0 0 0 / 0.02),
      0 4px 8px -2px oklch(0 0 0 / 0.04),
      0 16px 40px -8px color-mix(in oklab, var(--kumiki-color-accent) 16%, transparent),
      0 32px 80px -16px color-mix(in oklab, var(--kumiki-color-accent) 18%, transparent),
      0 0 0 1px oklch(0 0 0 / 0.04);
    animation: kumiki-content-in 240ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-dialog-content[data-state='closed']) {
    animation: kumiki-content-out 160ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
  }

  @keyframes kumiki-content-in {
    from {
      opacity: 0;
      transform: translate(-50%, -47%) scale(0.96);
      filter: blur(2px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
      filter: blur(0);
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

  :global {
    :root[data-theme='dark'] .kumiki-dialog-content {
      --kumiki-dialog-bg: oklch(0.2 0.012 256);
      --kumiki-dialog-fg: var(--kumiki-color-surface);
      --kumiki-dialog-border: var(--kumiki-color-fg);
      box-shadow:
        0 1px 1px oklch(0 0 0 / 0.2),
        0 4px 8px -2px oklch(0 0 0 / 0.3),
        0 24px 48px -12px oklch(0 0 0 / 0.45),
        0 0 0 1px oklch(1 0 0 / 0.04);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-dialog-content),
    :global(.kumiki-dialog-content[data-state='closed']) {
      animation: none;
    }
  }
</style>
