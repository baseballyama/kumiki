<!--
  @component @kumiki/atelier/badge Vanilla variant.
-->
<script lang="ts">
  import { Root } from '@kumiki/components/badge';
  import type { Snippet } from 'svelte';

  type Props = {
    variant?: 'neutral' | 'info' | 'success' | 'warn' | 'error';
    size?: 'sm' | 'md';
    decorative?: boolean;
    'aria-label'?: string;
    children?: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let {
    variant = 'neutral',
    size = 'md',
    children,
    class: className = '',
    ...rest
  }: Props = $props();
</script>

<Root class={`kumiki-badge ${className}`.trim()} data-variant={variant} data-size={size} {...rest}>
  {#if children}{@render children()}{/if}
</Root>

<style>
  :global(.kumiki-badge) {
    --kumiki-badge-bg: oklch(0.94 0.005 247);
    --kumiki-badge-fg: var(--kumiki-color-fg);
    --kumiki-badge-radius: 6px;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.5rem;
    border: 1px solid oklch(0 0 0 / 0.04);
    border-radius: var(--kumiki-badge-radius);
    background: var(--kumiki-badge-bg);
    color: var(--kumiki-badge-fg);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.005em;
    line-height: 1.25rem;
    white-space: nowrap;
  }
  :global(.kumiki-badge[data-size='sm']) {
    font-size: 0.625rem;
    line-height: 1rem;
    padding: 0 0.375rem;
    border-radius: 5px;
  }
  :global(.kumiki-badge[data-variant='info']) {
    --kumiki-badge-bg: oklch(0.94 0.04 240);
    --kumiki-badge-fg: oklch(0.34 0.13 240);
  }
  :global(.kumiki-badge[data-variant='success']) {
    --kumiki-badge-bg: oklch(0.92 0.05 152);
    --kumiki-badge-fg: oklch(0.32 0.1 152);
  }
  :global(.kumiki-badge[data-variant='warn']) {
    --kumiki-badge-bg: oklch(0.93 0.06 78);
    --kumiki-badge-fg: oklch(0.38 0.11 78);
  }
  :global(.kumiki-badge[data-variant='error']) {
    --kumiki-badge-bg: oklch(0.93 0.06 25);
    --kumiki-badge-fg: oklch(0.42 0.16 25);
  }
  :global {
    :root[data-theme='dark'] .kumiki-badge {
      --kumiki-badge-bg: var(--kumiki-color-surface-raised);
      --kumiki-badge-fg: var(--kumiki-color-fg-muted);
      border-color: oklch(1 0 0 / 0.04);
    }
    :root[data-theme='dark'] .kumiki-badge[data-variant='info'] {
      --kumiki-badge-bg: oklch(0.3 0.06 240);
      --kumiki-badge-fg: oklch(0.78 0.1 240);
    }
    :root[data-theme='dark'] .kumiki-badge[data-variant='success'] {
      --kumiki-badge-bg: oklch(0.3 0.06 152);
      --kumiki-badge-fg: oklch(0.8 0.1 152);
    }
    :root[data-theme='dark'] .kumiki-badge[data-variant='warn'] {
      --kumiki-badge-bg: oklch(0.32 0.08 78);
      --kumiki-badge-fg: oklch(0.82 0.12 78);
    }
    :root[data-theme='dark'] .kumiki-badge[data-variant='error'] {
      --kumiki-badge-bg: oklch(0.3 0.1 25);
      --kumiki-badge-fg: oklch(0.78 0.14 25);
    }
  }
</style>
