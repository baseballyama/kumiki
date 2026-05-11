<!--
  @component @kumiki/atelier/button Vanilla variant.

  Reads `--kumiki-button-*` per the §18 contract. Variants stack via
  `[data-variant=...]`. Refined "Calm Editorial Precision" aesthetic:
  OKLCH palette, layered shadows, crafted motion curves, confident
  but quiet focus rings.
-->
<script lang="ts">
  import { Root } from '@kumiki/components/button';
  import type { Snippet } from 'svelte';

  type Props = {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    id?: string;
    icon?: Snippet;
    iconTrailing?: Snippet;
    onclick?: (event: MouseEvent) => void;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    children?: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let {
    variant = 'primary',
    size = 'md',
    icon,
    iconTrailing,
    children,
    class: className = '',
    ...rest
  }: Props = $props();
</script>

<Root
  {icon}
  {iconTrailing}
  class={`kumiki-button ${className}`.trim()}
  data-variant={variant}
  data-size={size}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Root>

<style>
  :global(.kumiki-button) {
    --kumiki-button-bg: var(--kumiki-color-accent);
    --kumiki-button-bg-hover: var(--kumiki-color-accent-hover);
    --kumiki-button-bg-active: oklch(0.4 0.22 35);
    --kumiki-button-bg-disabled: oklch(0.94 0.005 247);
    --kumiki-button-fg: var(--kumiki-color-accent-fg);
    --kumiki-button-fg-disabled: oklch(0.7 0.01 256);
    --kumiki-button-border: transparent;
    --kumiki-button-radius: 8px;
    --kumiki-button-padding-x: 0.875rem;
    --kumiki-button-padding-y: 0;
    --kumiki-button-font-size: 0.8125rem;
    --kumiki-button-font-weight: 550;
    --kumiki-button-icon-gap: 0.5rem;
    --kumiki-button-outline-focus: var(--kumiki-color-accent);
    --kumiki-button-outline-offset: 2px;

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--kumiki-button-icon-gap);
    height: 2.25rem;
    padding-inline: var(--kumiki-button-padding-x);
    padding-block: var(--kumiki-button-padding-y);
    border: 1px solid var(--kumiki-button-border);
    border-radius: var(--kumiki-button-radius);
    background: var(--kumiki-button-bg);
    color: var(--kumiki-button-fg);
    font: inherit;
    font-size: var(--kumiki-button-font-size);
    font-weight: var(--kumiki-button-font-weight);
    letter-spacing: -0.005em;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    box-shadow:
      0 1px 2px color-mix(in oklab, var(--kumiki-color-accent) 18%, transparent),
      inset 0 1px 0 oklch(1 0 0 / 0.08);
    transition:
      background-color 140ms cubic-bezier(0.32, 0.72, 0, 1),
      box-shadow 140ms cubic-bezier(0.32, 0.72, 0, 1),
      transform 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }

  :global(.kumiki-button[data-size='sm']) {
    height: 2rem;
    --kumiki-button-padding-x: 0.6875rem;
    --kumiki-button-font-size: 0.75rem;
    --kumiki-button-icon-gap: 0.375rem;
    --kumiki-button-radius: 7px;
  }
  :global(.kumiki-button[data-size='lg']) {
    height: 2.5rem;
    --kumiki-button-padding-x: 1.125rem;
    --kumiki-button-font-size: 0.9375rem;
    --kumiki-button-icon-gap: 0.5rem;
    --kumiki-button-radius: 9px;
  }

  :global(.kumiki-button[data-variant='secondary']) {
    --kumiki-button-bg: var(--kumiki-color-accent-fg);
    --kumiki-button-bg-hover: var(--kumiki-color-bg);
    --kumiki-button-bg-active: var(--kumiki-color-surface);
    --kumiki-button-fg: var(--kumiki-color-fg);
    --kumiki-button-border: var(--kumiki-color-line);
    box-shadow:
      0 1px 2px oklch(0 0 0 / 0.04),
      0 1px 1px oklch(0 0 0 / 0.02);
  }
  :global(.kumiki-button[data-variant='ghost']) {
    --kumiki-button-bg: transparent;
    --kumiki-button-bg-hover: var(--kumiki-color-surface);
    --kumiki-button-bg-active: oklch(0.93 0.007 247);
    --kumiki-button-fg: var(--kumiki-color-fg);
    box-shadow: none;
  }
  :global(.kumiki-button[data-variant='danger']) {
    --kumiki-button-bg: oklch(0.55 0.22 25);
    --kumiki-button-bg-hover: oklch(0.49 0.23 25);
    --kumiki-button-bg-active: oklch(0.43 0.22 25);
    --kumiki-button-outline-focus: oklch(0.55 0.22 25);
    box-shadow:
      0 1px 2px oklch(0.3 0.08 25 / 0.22),
      inset 0 1px 0 oklch(1 0 0 / 0.08);
  }

  :global(.kumiki-button:hover:not([data-disabled]):not([data-loading])) {
    background: var(--kumiki-button-bg-hover);
  }
  :global(.kumiki-button:active:not([data-disabled]):not([data-loading])) {
    background: var(--kumiki-button-bg-active);
    transform: translateY(0.5px);
  }
  :global(.kumiki-button:focus-visible) {
    outline: 0;
    box-shadow:
      0 0 0 var(--kumiki-button-outline-offset) var(--kumiki-color-accent-fg),
      0 0 0 calc(var(--kumiki-button-outline-offset) + 2px) var(--kumiki-button-outline-focus);
  }
  :global(.kumiki-button[data-disabled]) {
    background: var(--kumiki-button-bg-disabled);
    color: var(--kumiki-button-fg-disabled);
    border-color: transparent;
    box-shadow: none;
    cursor: not-allowed;
  }
  :global(.kumiki-button[data-loading]) {
    cursor: progress;
    color: oklch(1 0 0 / 0);
  }
  :global(.kumiki-button[data-loading])::after {
    content: '';
    position: absolute;
    width: 0.875em;
    height: 0.875em;
    border-radius: 50%;
    border: 1.5px solid currentColor;
    border-top-color: var(--kumiki-button-fg);
    color: var(--kumiki-button-fg);
    opacity: 0.8;
    animation: kumiki-button-spin 720ms linear infinite;
  }

  @keyframes kumiki-button-spin {
    to {
      transform: rotate(360deg);
    }
  }

  :global {
    :root[data-theme='dark'] .kumiki-button {
      --kumiki-button-bg: var(--kumiki-color-accent);
      --kumiki-button-bg-hover: var(--kumiki-color-accent-hover);
      --kumiki-button-bg-active: var(--kumiki-color-accent-hover);
      --kumiki-button-bg-disabled: oklch(0.26 0.012 256);
      --kumiki-button-fg-disabled: oklch(0.5 0.01 256);
    }
    :root[data-theme='dark'] .kumiki-button[data-variant='secondary'] {
      --kumiki-button-bg: var(--kumiki-color-surface);
      --kumiki-button-bg-hover: oklch(0.27 0.015 256);
      --kumiki-button-bg-active: oklch(0.31 0.015 256);
      --kumiki-button-fg: var(--kumiki-color-surface);
      --kumiki-button-border: var(--kumiki-color-fg);
    }
    :root[data-theme='dark'] .kumiki-button[data-variant='ghost'] {
      --kumiki-button-bg-hover: var(--kumiki-color-surface-raised);
      --kumiki-button-bg-active: oklch(0.28 0.014 256);
      --kumiki-button-fg: var(--kumiki-color-surface);
    }
    :root[data-theme='dark'] .kumiki-button:focus-visible {
      box-shadow:
        0 0 0 var(--kumiki-button-outline-offset) var(--kumiki-color-bg),
        0 0 0 calc(var(--kumiki-button-outline-offset) + 2px) var(--kumiki-button-outline-focus);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-button) {
      transition: none;
    }
    :global(.kumiki-button[data-loading])::after {
      animation: none;
    }
  }
</style>
