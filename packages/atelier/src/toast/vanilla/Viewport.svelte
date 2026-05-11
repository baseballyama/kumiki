<script lang="ts">
  import { Viewport } from '@kumiki/components/toast';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Viewport class={`kumiki-toast-viewport ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Viewport>

<style>
  :global(.kumiki-toast-viewport) {
    --kumiki-toast-region-gap: 0.625rem;

    pointer-events: none;
    position: fixed;
    bottom: 1.25rem;
    right: 1.25rem;
    z-index: 50;
    display: flex;
    flex-direction: column-reverse;
    gap: var(--kumiki-toast-region-gap);
    width: 100%;
    max-width: 24rem;
  }
  :global(.kumiki-toast-viewport [data-component-part='item']) {
    --kumiki-toast-bg: var(--kumiki-color-bg);
    --kumiki-toast-fg: var(--kumiki-color-fg);
    --kumiki-toast-border: var(--kumiki-color-line);
    --kumiki-toast-radius: 12px;
    --kumiki-toast-padding: 0.875rem 1rem;
    --kumiki-toast-shadow:
      0 1px 2px oklch(0 0 0 / 0.04),
      0 8px 24px -4px color-mix(in oklab, var(--kumiki-color-accent) 14%, transparent),
      0 16px 40px -8px color-mix(in oklab, var(--kumiki-color-accent) 20%, transparent);

    pointer-events: auto;
    position: relative;
    display: grid;
    gap: 0.1875rem;
    padding: var(--kumiki-toast-padding);
    padding-right: 2.25rem;
    background: var(--kumiki-toast-bg);
    color: var(--kumiki-toast-fg);
    border: 1px solid var(--kumiki-toast-border);
    border-radius: var(--kumiki-toast-radius);
    box-shadow: var(--kumiki-toast-shadow);
    font-size: 0.8125rem;
    letter-spacing: -0.005em;
    animation: kumiki-toast-in 280ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  @keyframes kumiki-toast-in {
    from {
      opacity: 0;
      transform: translateY(8px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  :global(.kumiki-toast-viewport [data-component-part='item'][data-severity='success']) {
    border-left: 3px solid oklch(0.62 0.16 152);
  }
  :global(.kumiki-toast-viewport [data-component-part='item'][data-severity='error']) {
    border-left: 3px solid oklch(0.55 0.22 25);
  }
  :global(.kumiki-toast-viewport [data-component-part='item'][data-severity='warn']) {
    border-left: 3px solid oklch(0.7 0.17 78);
  }
  :global(.kumiki-toast-viewport [data-component-part='item'][data-severity='info']) {
    border-left: 3px solid oklch(0.62 0.17 240);
  }
  :global(.kumiki-toast-viewport [data-component-part='title']) {
    font-weight: 600;
    font-size: 0.8125rem;
    line-height: 1.3;
    letter-spacing: -0.011em;
  }
  :global(.kumiki-toast-viewport [data-component-part='description']) {
    font-size: 0.8125rem;
    line-height: 1.5;
    color: var(--kumiki-color-fg-muted);
  }
  :global(.kumiki-toast-viewport [data-component-part='close']) {
    position: absolute;
    top: 0.4375rem;
    right: 0.4375rem;
    width: 1.625rem;
    height: 1.625rem;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: currentColor;
    cursor: pointer;
    opacity: 0.55;
    transition:
      opacity 140ms cubic-bezier(0.32, 0.72, 0, 1),
      background-color 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-toast-viewport [data-component-part='close']:hover) {
    opacity: 1;
    background: var(--kumiki-color-surface);
  }
  :global {
    :root[data-theme='dark'] .kumiki-toast-viewport [data-component-part='item'] {
      --kumiki-toast-bg: oklch(0.2 0.012 256);
      --kumiki-toast-fg: var(--kumiki-color-surface);
      --kumiki-toast-border: var(--kumiki-color-fg);
      --kumiki-toast-shadow:
        0 1px 2px oklch(0 0 0 / 0.25), 0 8px 24px -4px oklch(0 0 0 / 0.4),
        0 16px 40px -8px oklch(0 0 0 / 0.5);
    }
    :root[data-theme='dark'] .kumiki-toast-viewport [data-component-part='description'] {
      color: var(--kumiki-color-fg-quiet);
    }
    :root[data-theme='dark'] .kumiki-toast-viewport [data-component-part='close']:hover {
      background: oklch(0.26 0.014 256);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-toast-viewport [data-component-part='item']) {
      animation: none;
    }
  }
</style>
