<!--
  @component @kumiki/atelier/icon-button Vanilla variant.
-->
<script lang="ts">
  import { Root } from '@kumiki/components/icon-button';
  import type { Snippet } from 'svelte';

  type Props = {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    id?: string;
    icon: Snippet;
    onclick?: (event: MouseEvent) => void;
    class?: string;
    [k: string]: unknown;
  } & ({ 'aria-label': string } | { 'aria-labelledby': string });

  let { variant = 'ghost', size = 'md', icon, class: className = '', ...rest }: Props = $props();
</script>

<Root
  {icon}
  class={`kumiki-icon-button ${className}`.trim()}
  data-variant={variant}
  data-size={size}
  {...rest}
/>

<style>
  :global(.kumiki-icon-button) {
    --kumiki-icon-button-bg: transparent;
    --kumiki-icon-button-bg-hover: var(--kumiki-color-surface);
    --kumiki-icon-button-fg: var(--kumiki-color-fg);
    --kumiki-icon-button-radius: 8px;
    --kumiki-icon-button-size: 2.25rem;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--kumiki-icon-button-size);
    height: var(--kumiki-icon-button-size);
    flex-shrink: 0;
    border: 0;
    border-radius: var(--kumiki-icon-button-radius);
    background: var(--kumiki-icon-button-bg);
    color: var(--kumiki-icon-button-fg);
    cursor: pointer;
    transition:
      background-color 140ms cubic-bezier(0.32, 0.72, 0, 1),
      color 140ms cubic-bezier(0.32, 0.72, 0, 1),
      transform 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-icon-button[data-size='sm']) {
    --kumiki-icon-button-size: 2rem;
    --kumiki-icon-button-radius: 7px;
  }
  :global(.kumiki-icon-button[data-size='lg']) {
    --kumiki-icon-button-size: 2.5rem;
    --kumiki-icon-button-radius: 9px;
  }
  :global(.kumiki-icon-button[data-variant='primary']) {
    --kumiki-icon-button-bg: var(--kumiki-color-accent);
    --kumiki-icon-button-bg-hover: var(--kumiki-color-accent-hover);
    --kumiki-icon-button-fg: var(--kumiki-color-accent-fg);
  }
  :global(.kumiki-icon-button[data-variant='secondary']) {
    --kumiki-icon-button-bg: var(--kumiki-color-accent-fg);
    --kumiki-icon-button-bg-hover: var(--kumiki-color-bg);
    --kumiki-icon-button-fg: var(--kumiki-color-fg);
    border: 1px solid var(--kumiki-color-line);
    box-shadow: 0 1px 2px oklch(0 0 0 / 0.04);
  }
  :global(.kumiki-icon-button[data-variant='danger']) {
    --kumiki-icon-button-bg-hover: oklch(0.94 0.04 25);
    --kumiki-icon-button-fg: oklch(0.5 0.22 25);
  }
  :global(.kumiki-icon-button:hover:not([data-disabled])) {
    background: var(--kumiki-icon-button-bg-hover);
  }
  :global(.kumiki-icon-button:active:not([data-disabled])) {
    transform: scale(0.96);
  }
  :global(.kumiki-icon-button:focus-visible) {
    outline: 0;
    box-shadow:
      0 0 0 2px var(--kumiki-color-accent-fg),
      0 0 0 4px var(--kumiki-color-accent);
  }
  :global(.kumiki-icon-button[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global {
    :root[data-theme='dark'] .kumiki-icon-button {
      --kumiki-icon-button-bg-hover: var(--kumiki-color-surface-raised);
      --kumiki-icon-button-fg: var(--kumiki-color-fg-muted);
    }
    :root[data-theme='dark'] .kumiki-icon-button[data-variant='primary'] {
      --kumiki-icon-button-bg: var(--kumiki-color-accent);
      --kumiki-icon-button-bg-hover: var(--kumiki-color-accent-hover);
    }
    :root[data-theme='dark'] .kumiki-icon-button[data-variant='secondary'] {
      --kumiki-icon-button-bg: var(--kumiki-color-surface);
      --kumiki-icon-button-bg-hover: oklch(0.27 0.015 256);
      --kumiki-icon-button-fg: var(--kumiki-color-surface);
      border-color: var(--kumiki-color-fg);
    }
    :root[data-theme='dark'] .kumiki-icon-button[data-variant='danger'] {
      --kumiki-icon-button-bg-hover: oklch(0.28 0.08 25);
      --kumiki-icon-button-fg: oklch(0.72 0.18 25);
    }
    :root[data-theme='dark'] .kumiki-icon-button:focus-visible {
      box-shadow:
        0 0 0 2px var(--kumiki-color-bg),
        0 0 0 4px var(--kumiki-color-accent);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-icon-button) {
      transition: none;
    }
  }
</style>
