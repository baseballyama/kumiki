<script lang="ts">
  import { Root } from '@kumiki/components/toolbar';
  import type { Snippet } from 'svelte';

  type Base = {
    orientation?: 'horizontal' | 'vertical';
    disabled?: boolean;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };
  type Props = Base & ({ 'aria-label': string } | { 'aria-labelledby': string });

  let { orientation = 'horizontal', children, class: className = '', ...rest }: Props = $props();
</script>

<Root {orientation} class={`kumiki-toolbar ${className}`.trim()} {...rest}>
  {@render children()}
</Root>

<style>
  :global(.kumiki-toolbar) {
    --kumiki-toolbar-bg: var(--kumiki-color-bg);
    --kumiki-toolbar-border: var(--kumiki-color-line);
    --kumiki-toolbar-radius: 10px;
    --kumiki-toolbar-padding: 0.3125rem;
    --kumiki-toolbar-gap: 0.125rem;

    display: inline-flex;
    align-items: center;
    gap: var(--kumiki-toolbar-gap);
    padding: var(--kumiki-toolbar-padding);
    border: 1px solid var(--kumiki-toolbar-border);
    border-radius: var(--kumiki-toolbar-radius);
    background: var(--kumiki-toolbar-bg);
    box-shadow:
      0 1px 2px oklch(0 0 0 / 0.04),
      0 1px 1px oklch(0 0 0 / 0.02);
  }
  :global(.kumiki-toolbar[data-orientation='vertical']) {
    flex-direction: column;
    align-items: stretch;
  }
  :global(.kumiki-toolbar [data-component-part='item']) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 1.875rem;
    padding: 0 0.625rem;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--kumiki-color-fg);
    font: inherit;
    font-size: 0.8125rem;
    font-weight: 550;
    letter-spacing: -0.005em;
    cursor: pointer;
    transition: background-color 120ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-toolbar [data-component-part='item']:hover:not([data-disabled])) {
    background: var(--kumiki-color-surface);
    color: var(--kumiki-color-fg);
  }
  :global(.kumiki-toolbar [data-component-part='item'][data-state='on']),
  :global(.kumiki-toolbar [data-component-part='item'][aria-pressed='true']) {
    background: var(--kumiki-color-fg);
    color: var(--kumiki-color-accent-fg);
    box-shadow:
      0 1px 2px oklch(0 0 0 / 0.12),
      inset 0 1px 0 oklch(1 0 0 / 0.08);
  }
  :global(.kumiki-toolbar [data-component-part='item'][data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }
  :global(.kumiki-toolbar [data-component-part='separator']) {
    width: 1px;
    height: 1.25rem;
    background: var(--kumiki-color-line);
    margin-inline: 0.3125rem;
  }
  :global(.kumiki-toolbar[data-orientation='vertical'] [data-component-part='separator']) {
    width: 100%;
    height: 1px;
    margin-inline: 0;
    margin-block: 0.3125rem;
  }
  :global {
    :root[data-theme='dark'] .kumiki-toolbar {
      --kumiki-toolbar-bg: oklch(0.2 0.012 256);
      --kumiki-toolbar-border: var(--kumiki-color-fg);
    }
    :root[data-theme='dark'] .kumiki-toolbar [data-component-part='item'] {
      color: var(--kumiki-color-fg-muted);
    }
    :root[data-theme='dark']
      .kumiki-toolbar
      [data-component-part='item']:hover:not([data-disabled]) {
      background: var(--kumiki-color-surface-raised);
      color: var(--kumiki-color-surface);
    }
    :root[data-theme='dark'] .kumiki-toolbar [data-component-part='item'][data-state='on'],
    :root[data-theme='dark'] .kumiki-toolbar [data-component-part='item'][aria-pressed='true'] {
      background: var(--kumiki-color-surface);
      color: var(--kumiki-color-bg);
    }
    :root[data-theme='dark'] .kumiki-toolbar [data-component-part='separator'] {
      background: var(--kumiki-color-fg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-toolbar [data-component-part='item']) {
      transition: none;
    }
  }
</style>
