<script lang="ts">
  import { Root } from '@kumiki/components/table';
  import type { Snippet } from 'svelte';
  import type { SortState, SelectionMode } from '@kumiki/components/table';

  type Props = {
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
    --kumiki-table-bg: white;
    --kumiki-table-fg: hsl(220 10% 12%);
    --kumiki-table-border: hsl(220 10% 86%);
    --kumiki-table-row-bg-hover: hsl(220 10% 96%);
    --kumiki-table-row-bg-selected: hsl(220 90% 95%);
    --kumiki-table-header-bg: hsl(220 10% 96%);
    --kumiki-table-header-fg: hsl(220 10% 25%);
    --kumiki-table-header-bg-sticky: hsl(220 10% 96%);
    --kumiki-table-cell-padding-x: 0.75rem;
    --kumiki-table-cell-padding-y: 0.5rem;

    width: 100%;
    border-collapse: collapse;
    background: var(--kumiki-table-bg);
    color: var(--kumiki-table-fg);
    font-size: 0.875rem;
  }
  :global(.kumiki-table [data-part='caption']) {
    margin-top: 1rem;
    color: hsl(220 10% 50%);
    font-size: 0.875rem;
    caption-side: bottom;
  }
  :global(.kumiki-table [data-part='header']) {
    background: var(--kumiki-table-header-bg);
  }
  :global(.kumiki-table[data-sticky='header'] [data-part='header']) {
    position: sticky;
    top: 0;
    background: var(--kumiki-table-header-bg-sticky);
    z-index: 1;
  }
  :global(.kumiki-table [data-part='header-cell']) {
    height: 2.5rem;
    padding: var(--kumiki-table-cell-padding-y) var(--kumiki-table-cell-padding-x);
    text-align: left;
    vertical-align: middle;
    color: var(--kumiki-table-header-fg);
    font-weight: 500;
  }
  :global(.kumiki-table [data-part='row']) {
    border-bottom: 1px solid var(--kumiki-table-border);
    transition: background-color 120ms ease;
  }
  :global(.kumiki-table [data-part='row']:hover) {
    background: var(--kumiki-table-row-bg-hover);
  }
  :global(.kumiki-table [data-part='row'][aria-selected='true']) {
    background: var(--kumiki-table-row-bg-selected);
  }
  :global(.kumiki-table [data-part='cell']) {
    padding: var(--kumiki-table-cell-padding-y) var(--kumiki-table-cell-padding-x);
    vertical-align: middle;
  }
  :global(.kumiki-table [data-part='select-all-cell']),
  :global(.kumiki-table [data-part='select-cell']) {
    width: 2.5rem;
    padding-inline: 0.5rem;
    vertical-align: middle;
  }
  :global(.kumiki-table [data-part='expand-cell']) {
    width: 2rem;
    padding-inline: 0.5rem;
  }
  :global(.kumiki-table [data-part='footer']) {
    background: var(--kumiki-table-header-bg);
    color: var(--kumiki-table-header-fg);
    font-weight: 500;
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-table) {
      --kumiki-table-bg: hsl(220 10% 14%);
      --kumiki-table-fg: hsl(220 10% 96%);
      --kumiki-table-border: hsl(220 10% 28%);
      --kumiki-table-row-bg-hover: hsl(220 10% 22%);
      --kumiki-table-row-bg-selected: hsl(220 90% 20%);
      --kumiki-table-header-bg: hsl(220 10% 22%);
      --kumiki-table-header-fg: hsl(220 10% 80%);
      --kumiki-table-header-bg-sticky: hsl(220 10% 22%);
    }
  }
</style>
