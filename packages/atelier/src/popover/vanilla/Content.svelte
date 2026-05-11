<script lang="ts">
  import { Content } from '@kumiki/components/popover';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Content class={`kumiki-popover-content ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Content>

<style>
  :global(.kumiki-popover-content) {
    --kumiki-popover-bg: var(--kumiki-color-bg);
    --kumiki-popover-fg: var(--kumiki-color-fg);
    --kumiki-panel-border: var(--kumiki-color-line);
    --kumiki-panel-radius: 12px;
    --kumiki-panel-shadow:
      0 1px 2px oklch(0 0 0 / 0.04),
      0 8px 24px -4px color-mix(in oklab, var(--kumiki-color-accent) 12%, transparent),
      0 16px 40px -8px color-mix(in oklab, var(--kumiki-color-accent) 18%, transparent),
      0 0 0 1px oklch(0 0 0 / 0.03);

    position: relative;
    z-index: 50;
    padding: 1rem 1.125rem;
    width: 18rem;
    border: 1px solid var(--kumiki-panel-border);
    border-radius: var(--kumiki-panel-radius);
    background: var(--kumiki-popover-bg);
    color: var(--kumiki-popover-fg);
    box-shadow: var(--kumiki-panel-shadow);
    font-size: 0.8125rem;
    line-height: 1.55;
    letter-spacing: -0.005em;
    outline: none;
    animation: kumiki-popover-in 200ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-popover-content[data-state='closed']) {
    animation: kumiki-popover-out 140ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
  }
  @keyframes kumiki-popover-in {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(-4px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  @keyframes kumiki-popover-out {
    from {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    to {
      opacity: 0;
      transform: scale(0.97) translateY(-2px);
    }
  }
  :global(.kumiki-popover-content [data-component-part='close']) {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 1.5rem;
    height: 1.5rem;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: currentColor;
    cursor: pointer;
    opacity: 0.6;
    transition:
      background-color 140ms cubic-bezier(0.32, 0.72, 0, 1),
      opacity 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-popover-content [data-component-part='close']:hover) {
    background: var(--kumiki-color-surface);
    opacity: 1;
  }
  :global {
    :root[data-theme='dark'] .kumiki-popover-content {
      --kumiki-popover-bg: oklch(0.2 0.012 256);
      --kumiki-popover-fg: var(--kumiki-color-surface);
      --kumiki-panel-border: var(--kumiki-color-fg);
      --kumiki-panel-shadow:
        0 1px 2px oklch(0 0 0 / 0.2), 0 8px 24px -4px oklch(0 0 0 / 0.35),
        0 16px 40px -8px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(1 0 0 / 0.04);
    }
    :root[data-theme='dark'] .kumiki-popover-content [data-component-part='close']:hover {
      background: oklch(0.26 0.014 256);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-popover-content),
    :global(.kumiki-popover-content[data-state='closed']) {
      animation: none;
    }
  }
</style>
