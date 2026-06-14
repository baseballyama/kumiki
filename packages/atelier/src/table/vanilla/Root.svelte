<script lang="ts">
  import { Root } from '@kumiki/components/table';
  import type { Snippet } from 'svelte';
  import type { SortState, SelectionMode } from '@kumiki/components/table';

  type BaseProps = {
    sort?: SortState | null;
    onSortChange?: (sort: SortState | null) => void;
    selection?: Set<string>;
    onSelectionChange?: (selection: Set<string>) => void;
    selectionMode?: SelectionMode;
    stickyHeader?: boolean;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  type Props = (BaseProps & { 'aria-label': string }) | (BaseProps & { 'aria-labelledby': string });

  let {
    selection = $bindable(new Set<string>()),
    stickyHeader = false,
    children,
    class: className = '',
    ...rest
  }: Props = $props();
</script>

<Root
  bind:selection
  class={`kumiki-table ${className}`.trim()}
  data-sticky={stickyHeader ? 'header' : undefined}
  {...rest}
>
  {@render children()}
</Root>

<style>
  :global(.kumiki-table) {
    --kumiki-table-bg: var(--kumiki-color-bg);
    --kumiki-table-fg: var(--kumiki-color-fg);
    --kumiki-table-border: var(--kumiki-color-line);
    --kumiki-table-row-bg-hover: oklch(0.97 0.005 247);
    --kumiki-table-row-bg-selected: oklch(0.95 0.04 35);
    --kumiki-table-header-bg: oklch(0.97 0.005 247);
    --kumiki-table-header-fg: var(--kumiki-color-fg);
    --kumiki-table-header-bg-sticky: oklch(0.97 0.005 247);
    --kumiki-table-cell-padding-x: 0.875rem;
    --kumiki-table-cell-padding-y: 0.6875rem;

    width: 100%;
    border-collapse: collapse;
    background: var(--kumiki-table-bg);
    color: var(--kumiki-table-fg);
    font-size: 0.8125rem;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.005em;
  }
  :global(.kumiki-table [data-component-part='caption']) {
    margin-top: 1rem;
    color: var(--kumiki-color-fg-muted);
    font-size: 0.75rem;
    caption-side: bottom;
    text-align: left;
  }
  :global(.kumiki-table [data-component-part='header']) {
    background: var(--kumiki-table-header-bg);
  }
  :global(.kumiki-table[data-sticky='header'] [data-component-part='header']) {
    position: sticky;
    top: 0;
    background: var(--kumiki-table-header-bg-sticky);
    box-shadow: 0 1px 0 var(--kumiki-table-border);
    z-index: 1;
  }
  :global(.kumiki-table [data-component-part='header-cell']) {
    height: 2.5rem;
    padding: var(--kumiki-table-cell-padding-y) var(--kumiki-table-cell-padding-x);
    text-align: left;
    vertical-align: middle;
    color: var(--kumiki-table-header-fg);
    font-weight: 600;
    font-size: 0.6875rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    border-bottom: 1px solid var(--kumiki-table-border);
  }
  :global(.kumiki-table [data-component-part='row']) {
    border-bottom: 1px solid var(--kumiki-table-border);
    transition: background-color 120ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-table [data-component-part='row']:hover) {
    background: var(--kumiki-table-row-bg-hover);
  }
  :global(.kumiki-table [data-component-part='row'][aria-selected='true']) {
    background: var(--kumiki-table-row-bg-selected);
  }
  :global(.kumiki-table [data-component-part='row']:last-child) {
    border-bottom: 0;
  }
  :global(.kumiki-table [data-component-part='cell']) {
    padding: var(--kumiki-table-cell-padding-y) var(--kumiki-table-cell-padding-x);
    vertical-align: middle;
  }
  :global(.kumiki-table [data-component-part='select-all-cell']),
  :global(.kumiki-table [data-component-part='select-cell']) {
    width: 2.5rem;
    padding-inline: 0.5rem;
    vertical-align: middle;
  }
  :global(.kumiki-table [data-component-part='expand-cell']) {
    width: 2rem;
    padding-inline: 0.5rem;
  }

  /* Row-select / select-all checkbox buttons. Render as a small square
     with an inner accent fill when checked. */
  :global(.kumiki-table [data-component-part='select-button']),
  :global(.kumiki-table [data-component-part='select-all-button']) {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.0625rem;
    height: 1.0625rem;
    padding: 0;
    border: 1px solid var(--kumiki-color-line-strong);
    border-radius: 4px;
    background: var(--kumiki-color-accent-fg);
    cursor: pointer;
    box-shadow: inset 0 1px 0 oklch(1 0 0 / 0.5);
    transition:
      background-color 120ms cubic-bezier(0.32, 0.72, 0, 1),
      border-color 120ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-table [data-component-part='select-button']:hover),
  :global(.kumiki-table [data-component-part='select-all-button']:hover) {
    border-color: var(--kumiki-color-fg-quiet);
  }
  :global(.kumiki-table [data-component-part='select-button'][aria-checked='true']),
  :global(.kumiki-table [data-component-part='select-all-button'][aria-checked='true']),
  :global(.kumiki-table [data-component-part='select-all-button'][aria-checked='mixed']) {
    background: var(--kumiki-color-accent);
    border-color: var(--kumiki-color-accent);
  }
  :global(.kumiki-table [data-component-part='select-button'][aria-checked='true'])::after,
  :global(.kumiki-table [data-component-part='select-all-button'][aria-checked='true'])::after {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    background: var(--kumiki-color-accent-fg);
    clip-path: polygon(14% 44%, 0% 60%, 40% 100%, 100% 20%, 84% 8%, 40% 70%);
  }
  :global(.kumiki-table [data-component-part='select-all-button'][aria-checked='mixed'])::after {
    content: '';
    width: 0.5rem;
    height: 0.125rem;
    background: var(--kumiki-color-accent-fg);
    border-radius: 1px;
  }
  :global(.kumiki-table [data-component-part='select-button']:focus-visible),
  :global(.kumiki-table [data-component-part='select-all-button']:focus-visible) {
    outline: 0;
    box-shadow:
      0 0 0 2px var(--kumiki-color-bg),
      0 0 0 4px var(--kumiki-color-accent);
  }

  /* Sort button — minimal, embedded in header cell. */
  :global(.kumiki-table [data-component-part='sort-button']) {
    appearance: none;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0;
  }
  :global(.kumiki-table [data-component-part='sort-button']:hover) {
    color: var(--kumiki-color-accent);
  }
  :global(.kumiki-table [data-component-part='sort-button']:focus-visible) {
    outline: 0;
    color: var(--kumiki-color-accent);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  /* Expand-row chevron. */
  :global(.kumiki-table [data-component-part='expand-button']) {
    appearance: none;
    border: 0;
    background: transparent;
    color: var(--kumiki-color-fg-quiet);
    width: 1.5rem;
    height: 1.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 120ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-table [data-component-part='expand-button']:hover) {
    background: var(--kumiki-color-surface);
    color: var(--kumiki-color-fg);
  }
  :global(.kumiki-table [data-component-part='footer']) {
    background: var(--kumiki-table-header-bg);
    color: var(--kumiki-table-header-fg);
    font-weight: 600;
    border-top: 1px solid var(--kumiki-table-border);
  }
  :global {
    :root[data-theme='dark'] .kumiki-table {
      --kumiki-table-bg: oklch(0.2 0.012 256);
      --kumiki-table-fg: var(--kumiki-color-surface);
      --kumiki-table-border: var(--kumiki-color-surface-raised);
      --kumiki-table-row-bg-hover: var(--kumiki-color-surface-raised);
      --kumiki-table-row-bg-selected: oklch(0.3 0.06 35);
      --kumiki-table-header-bg: var(--kumiki-color-surface-raised);
      --kumiki-table-header-fg: oklch(0.78 0.012 256);
      --kumiki-table-header-bg-sticky: var(--kumiki-color-surface-raised);
    }
    :root[data-theme='dark'] .kumiki-table [data-component-part='caption'] {
      color: var(--kumiki-color-fg-quiet);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-table [data-component-part='row']) {
      transition: none;
    }
  }
</style>
