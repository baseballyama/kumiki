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
  :global(.kumiki-pagination) {
    --kumiki-pagination-item-bg-current: hsl(220 10% 12%);
    --kumiki-pagination-item-fg: hsl(220 10% 25%);
    --kumiki-pagination-item-fg-current: white;

    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
  }
  :global(.kumiki-pagination [data-component-part='page-list']) {
    list-style: none;
    margin: 0;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }
  :global(.kumiki-pagination [data-component-part='page-item'] button),
  :global(.kumiki-pagination [data-component-part='page-item'] a),
  :global(.kumiki-pagination [data-component-part='prev']),
  :global(.kumiki-pagination [data-component-part='next']) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 2.25rem;
    min-width: 2.25rem;
    padding-inline: 0.5rem;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--kumiki-pagination-item-fg);
    font: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: background-color 120ms ease;
  }
  :global(.kumiki-pagination [data-component-part='page-item'] button:hover),
  :global(.kumiki-pagination [data-component-part='page-item'] a:hover),
  :global(.kumiki-pagination [data-component-part='prev']:hover),
  :global(.kumiki-pagination [data-component-part='next']:hover) {
    background: hsl(220 10% 92%);
  }
  :global(.kumiki-pagination [data-component-part='page-item'] [aria-current='page']),
  :global(.kumiki-pagination [data-component-part='page-item'] [data-current='page']) {
    background: var(--kumiki-pagination-item-bg-current);
    color: var(--kumiki-pagination-item-fg-current);
  }
  :global(.kumiki-pagination [data-component-part='prev'][aria-disabled='true']),
  :global(.kumiki-pagination [data-component-part='next'][aria-disabled='true']) {
    opacity: 0.4;
    cursor: not-allowed;
  }
  :global(.kumiki-pagination [data-component-part='ellipsis']) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2.25rem;
    height: 2.25rem;
    color: hsl(220 10% 50%);
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-pagination) {
      --kumiki-pagination-item-bg-current: hsl(220 10% 96%);
      --kumiki-pagination-item-fg: hsl(220 10% 80%);
      --kumiki-pagination-item-fg-current: hsl(220 10% 12%);
    }
    :global(.kumiki-pagination [data-component-part='page-item'] button:hover),
    :global(.kumiki-pagination [data-component-part='page-item'] a:hover),
    :global(.kumiki-pagination [data-component-part='prev']:hover),
    :global(.kumiki-pagination [data-component-part='next']:hover) {
      background: hsl(220 10% 22%);
    }
  }
</style>
