<script lang="ts">
  import { Root } from '@kumiki/components/pagination';
  import type { Snippet } from 'svelte';

  type Props = {
    page: number;
    pageCount: number;
    siblingCount?: number;
    boundaryCount?: number;
    asLinks?: { href: (page: number) => string };
    onPageChange?: (page: number) => void;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Root class={`kumiki-pagination ${className}`.trim()} {...rest}>{@render children()}</Root>

<style>
  /* ─── Tokens ───────────────────────────────────────────────────────────
     A vermillion (朱) accent identifies the current page; an off-white
     parchment (生成り) surface separates the rest from the page chrome. */
  :global(.kumiki-pagination) {
    --kumiki-pagination-fg: var(--kumiki-color-fg);
    --kumiki-pagination-fg-quiet: var(--kumiki-color-fg-quiet);
    --kumiki-pagination-fg-hover: oklch(0.16 0.014 256);
    --kumiki-pagination-bg-hover: var(--kumiki-color-surface);
    --kumiki-pagination-bg-current: var(--kumiki-color-accent);
    --kumiki-pagination-bg-current-hover: var(--kumiki-color-accent-hover);
    --kumiki-pagination-fg-current: var(--kumiki-color-accent-fg);
    --kumiki-pagination-ring: var(--kumiki-color-accent);

    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem;
    font-family: inherit;
    font-size: 0.875rem;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.005em;
  }

  /* ─── Page list ───────────────────────────────────────────────────── */
  :global(.kumiki-pagination [data-component-part='page-list']) {
    list-style: none;
    margin: 0;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.125rem;
  }
  :global(.kumiki-pagination [data-component-part='page-list-item']) {
    display: inline-flex;
  }

  /* ─── Tiles (page items + prev / next) ─────────────────────────────
     `<button data-component-part='page-item'>` and the prev/next buttons
     are themselves the styled targets. */
  :global(.kumiki-pagination [data-component-part='page-item']),
  :global(.kumiki-pagination [data-component-part='page-item']:visited),
  :global(.kumiki-pagination [data-component-part='prev']),
  :global(.kumiki-pagination [data-component-part='next']),
  :global(.kumiki-pagination [data-component-part='prev']:visited),
  :global(.kumiki-pagination [data-component-part='next']:visited) {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    height: 2.375rem;
    min-width: 2.375rem;
    padding-inline: 0.625rem;
    border: 0;
    border-radius: 9999px;
    background: transparent;
    color: var(--kumiki-pagination-fg);
    font: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    user-select: none;
    transition:
      background-color 160ms cubic-bezier(0.32, 0.72, 0, 1),
      color 160ms cubic-bezier(0.32, 0.72, 0, 1),
      transform 200ms cubic-bezier(0.32, 0.72, 0, 1),
      box-shadow 200ms cubic-bezier(0.32, 0.72, 0, 1);
  }

  /* Prev / next have a quieter foreground so they read as auxiliary. */
  :global(.kumiki-pagination [data-component-part='prev']),
  :global(.kumiki-pagination [data-component-part='next']) {
    color: var(--kumiki-pagination-fg-quiet);
    font-size: 1.125rem;
    line-height: 1;
  }

  /* Hover — soft cream wash. */
  :global(.kumiki-pagination [data-component-part='page-item']:hover:not([aria-current='page'])),
  :global(.kumiki-pagination [data-component-part='prev']:not([aria-disabled='true']):hover),
  :global(.kumiki-pagination [data-component-part='next']:not([aria-disabled='true']):hover) {
    background: var(--kumiki-pagination-bg-hover);
    color: var(--kumiki-pagination-fg-hover);
  }
  :global(.kumiki-pagination [data-component-part='page-item']:active:not([aria-current='page'])),
  :global(.kumiki-pagination [data-component-part='prev']:not([aria-disabled='true']):active),
  :global(.kumiki-pagination [data-component-part='next']:not([aria-disabled='true']):active) {
    transform: scale(0.96);
  }

  /* Focus ring honours theme accent. */
  :global(.kumiki-pagination [data-component-part='page-item']:focus-visible),
  :global(.kumiki-pagination [data-component-part='prev']:focus-visible),
  :global(.kumiki-pagination [data-component-part='next']:focus-visible) {
    outline: 0;
    box-shadow:
      0 0 0 2px var(--kumiki-color-bg),
      0 0 0 4px var(--kumiki-pagination-ring);
  }

  /* Current page — vermillion fill, subtle ink shadow for depth. */
  :global(.kumiki-pagination [data-component-part='page-item'][aria-current='page']),
  :global(.kumiki-pagination [data-component-part='page-item'][data-current='page']) {
    background: var(--kumiki-pagination-bg-current);
    color: var(--kumiki-pagination-fg-current);
    font-weight: 600;
    box-shadow:
      inset 0 0 0 1px color-mix(in oklab, var(--kumiki-pagination-bg-current) 60%, transparent),
      0 1px 0 color-mix(in oklab, var(--kumiki-color-accent) 18%, transparent),
      0 4px 14px -6px color-mix(in oklab, var(--kumiki-color-accent) 55%, transparent);
  }
  :global(.kumiki-pagination [data-component-part='page-item'][aria-current='page']:hover),
  :global(.kumiki-pagination [data-component-part='page-item'][data-current='page']:hover) {
    background: var(--kumiki-pagination-bg-current-hover);
    color: var(--kumiki-pagination-fg-current);
  }

  /* Disabled prev / next — faded, not interactive. */
  :global(.kumiki-pagination [data-component-part='prev'][aria-disabled='true']),
  :global(.kumiki-pagination [data-component-part='next'][aria-disabled='true']) {
    opacity: 0.32;
    cursor: not-allowed;
  }

  /* Ellipsis — typographic, never a focusable target. */
  :global(.kumiki-pagination [data-component-part='ellipsis']) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.75rem;
    height: 2.375rem;
    color: var(--kumiki-pagination-fg-quiet);
    letter-spacing: 0.15em;
    font-size: 0.875rem;
  }

  /* ─── Dark theme ──────────────────────────────────────────────────── */
  :global {
    :root[data-theme='dark'] .kumiki-pagination {
      --kumiki-pagination-fg: var(--kumiki-color-fg-muted);
      --kumiki-pagination-fg-quiet: var(--kumiki-color-fg-quiet);
      --kumiki-pagination-fg-hover: var(--kumiki-color-surface);
      --kumiki-pagination-bg-hover: var(--kumiki-color-surface-raised);
      --kumiki-pagination-bg-current: var(--kumiki-color-accent);
      --kumiki-pagination-bg-current-hover: var(--kumiki-color-accent-hover);
      --kumiki-pagination-fg-current: oklch(0.12 0.014 280);
    }
    :root[data-theme='dark']
      .kumiki-pagination
      [data-component-part='page-item'][aria-current='page'],
    :root[data-theme='dark']
      .kumiki-pagination
      [data-component-part='page-item'][data-current='page'] {
      box-shadow:
        inset 0 0 0 1px color-mix(in oklab, var(--kumiki-pagination-bg-current) 50%, transparent),
        0 1px 0 color-mix(in oklab, var(--kumiki-color-accent) 40%, transparent),
        0 4px 14px -6px color-mix(in oklab, var(--kumiki-color-accent) 60%, transparent);
    }
    :root[data-theme='dark'] .kumiki-pagination [data-component-part='page-item']:focus-visible,
    :root[data-theme='dark'] .kumiki-pagination [data-component-part='prev']:focus-visible,
    :root[data-theme='dark'] .kumiki-pagination [data-component-part='next']:focus-visible {
      box-shadow:
        0 0 0 2px var(--kumiki-color-bg),
        0 0 0 4px var(--kumiki-pagination-ring);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-pagination [data-component-part='page-item']),
    :global(.kumiki-pagination [data-component-part='prev']),
    :global(.kumiki-pagination [data-component-part='next']) {
      transition: none;
    }
  }
</style>
