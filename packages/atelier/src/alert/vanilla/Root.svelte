<script lang="ts">
  import { Root } from '@kumiki/components/alert';
  import type { Snippet } from 'svelte';

  type Props = {
    severity?: 'info' | 'success' | 'warn' | 'error';
    live?: 'polite' | 'assertive' | 'off';
    dismissible?: boolean;
    onDismiss?: () => void;
    id?: string;
    icon?: Snippet;
    children?: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { severity = 'info', children, class: className = '', ...rest }: Props = $props();
</script>

<Root {severity} class={`kumiki-alert ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Root>

<style>
  :global(.kumiki-alert) {
    --kumiki-alert-bg: oklch(0.97 0.025 240);
    --kumiki-alert-fg: oklch(0.32 0.13 240);
    --kumiki-alert-border: oklch(0.82 0.08 240);
    --kumiki-alert-radius: 12px;
    --kumiki-alert-padding: 1rem 1.125rem;

    position: relative;
    display: grid;
    gap: 0.25rem;
    padding: var(--kumiki-alert-padding);
    border: 1px solid var(--kumiki-alert-border);
    border-left-width: 3px;
    border-radius: var(--kumiki-alert-radius);
    background: var(--kumiki-alert-bg);
    color: var(--kumiki-alert-fg);
    font-size: 0.8125rem;
    line-height: 1.5;
    letter-spacing: -0.005em;
    box-shadow: 0 1px 2px oklch(0 0 0 / 0.03);
  }
  :global(.kumiki-alert[data-severity='success']) {
    --kumiki-alert-bg: oklch(0.95 0.04 152);
    --kumiki-alert-fg: oklch(0.3 0.1 152);
    --kumiki-alert-border: oklch(0.74 0.13 152);
  }
  :global(.kumiki-alert[data-severity='warn']) {
    --kumiki-alert-bg: oklch(0.95 0.05 78);
    --kumiki-alert-fg: oklch(0.38 0.11 78);
    --kumiki-alert-border: oklch(0.78 0.14 78);
  }
  :global(.kumiki-alert[data-severity='error']) {
    --kumiki-alert-bg: oklch(0.95 0.04 25);
    --kumiki-alert-fg: oklch(0.4 0.16 25);
    --kumiki-alert-border: oklch(0.78 0.14 25);
  }
  :global(.kumiki-alert [data-component-part='title']) {
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.3;
    letter-spacing: -0.011em;
  }
  :global(.kumiki-alert [data-component-part='description']) {
    opacity: 0.92;
  }
  :global(.kumiki-alert [data-component-part='close']) {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
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
  :global(.kumiki-alert [data-component-part='close']:hover) {
    background: color-mix(in oklch, currentColor 8%, transparent);
    opacity: 1;
  }
  :global {
    :root[data-theme='dark'] .kumiki-alert {
      --kumiki-alert-bg: oklch(0.27 0.05 240);
      --kumiki-alert-fg: oklch(0.82 0.1 240);
      --kumiki-alert-border: oklch(0.4 0.1 240);
    }
    :root[data-theme='dark'] .kumiki-alert[data-severity='success'] {
      --kumiki-alert-bg: oklch(0.27 0.06 152);
      --kumiki-alert-fg: oklch(0.85 0.1 152);
      --kumiki-alert-border: oklch(0.4 0.1 152);
    }
    :root[data-theme='dark'] .kumiki-alert[data-severity='warn'] {
      --kumiki-alert-bg: oklch(0.28 0.08 78);
      --kumiki-alert-fg: oklch(0.85 0.12 78);
      --kumiki-alert-border: oklch(0.42 0.12 78);
    }
    :root[data-theme='dark'] .kumiki-alert[data-severity='error'] {
      --kumiki-alert-bg: oklch(0.28 0.08 25);
      --kumiki-alert-fg: oklch(0.82 0.14 25);
      --kumiki-alert-border: oklch(0.42 0.14 25);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-alert [data-component-part='close']) {
      transition: none;
    }
  }
</style>
