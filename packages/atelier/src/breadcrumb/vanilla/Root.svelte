<script lang="ts">
  import { Root } from '@kumiki/components/breadcrumb';
  import type { Snippet } from 'svelte';

  type Props = {
    'aria-label'?: string;
    'aria-labelledby'?: string;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Root class={`kumiki-breadcrumb ${className}`.trim()} {...rest}>{@render children()}</Root>

<style>
  :global(.kumiki-breadcrumb) {
    --kumiki-breadcrumb-link-fg: var(--kumiki-color-fg-muted);
    --kumiki-breadcrumb-link-fg-current: var(--kumiki-color-fg);
    --kumiki-breadcrumb-separator-fg: var(--kumiki-color-line-strong);

    color: var(--kumiki-breadcrumb-link-fg);
    font-size: 0.8125rem;
    letter-spacing: -0.005em;
  }
  :global(.kumiki-breadcrumb ol) {
    list-style: none;
    margin: 0;
    padding: 0;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;
  }
  :global(.kumiki-breadcrumb [data-component-part='item']) {
    display: inline-flex;
    align-items: center;
  }
  :global(.kumiki-breadcrumb [data-component-part='link']),
  :global(.kumiki-breadcrumb [data-component-part='link']:visited) {
    color: var(--kumiki-breadcrumb-link-fg);
    text-decoration: none;
    padding: 0.1875rem 0.4375rem;
    border-radius: 5px;
    transition:
      color 120ms cubic-bezier(0.32, 0.72, 0, 1),
      background-color 120ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-breadcrumb [data-component-part='link']:hover),
  :global(.kumiki-breadcrumb [data-component-part='link']:focus-visible) {
    color: var(--kumiki-breadcrumb-link-fg-current);
    background: var(--kumiki-color-surface);
    text-decoration: none;
  }
  :global(.kumiki-breadcrumb [data-component-part='link'][data-current='page']) {
    color: var(--kumiki-breadcrumb-link-fg-current);
    font-weight: 600;
  }
  :global(.kumiki-breadcrumb [data-component-part='separator']) {
    color: var(--kumiki-breadcrumb-separator-fg);
    user-select: none;
    margin-inline: 0.125rem;
    font-size: 0.75rem;
  }
  :global {
    :root[data-theme='dark'] .kumiki-breadcrumb {
      --kumiki-breadcrumb-link-fg: oklch(0.7 0.012 256);
      --kumiki-breadcrumb-link-fg-current: var(--kumiki-color-surface);
      --kumiki-breadcrumb-separator-fg: oklch(0.42 0.014 256);
    }
    :root[data-theme='dark'] .kumiki-breadcrumb [data-component-part='link']:hover,
    :root[data-theme='dark'] .kumiki-breadcrumb [data-component-part='link']:focus-visible {
      background: var(--kumiki-color-surface-raised);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-breadcrumb [data-component-part='link']) {
      transition: none;
    }
  }
</style>
