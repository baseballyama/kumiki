/**
 * `@kumiki/headless/pagination` — page-list math for the Pagination component.
 *
 * Pagination has no FSM and no DOM behavior beyond native button clicks.
 * The non-trivial part is computing which page numbers to render given
 * `page`, `pageCount`, `siblingCount`, `boundaryCount`. That math lives
 * here as a pure function so consumers without Svelte (server renderers,
 * tests) can use it directly.
 *
 * @see docs/components/pagination.md
 */

export interface PaginationItemPage {
  type: 'page';
  page: number;
  isCurrent: boolean;
}
export interface PaginationItemEllipsis {
  type: 'ellipsis';
  /** Where the gap is — before the central window (`'start'`) or after (`'end'`). */
  side: 'start' | 'end';
}

export type PaginationItem = PaginationItemPage | PaginationItemEllipsis;

export interface CalculatePagesInput {
  /** 1-indexed current page. */
  page: number;
  pageCount: number;
  /** How many neighbours of the current page to show. Default 1. */
  siblingCount?: number;
  /** How many boundary pages at start/end to always show. Default 1. */
  boundaryCount?: number;
}

/**
 * Compute the page-list to render. Inserts ellipses where gaps appear.
 *
 * ```ts
 * calculatePages({ page: 5, pageCount: 20 })
 * // → [1, …, 4, 5, 6, …, 20]
 * ```
 *
 * @when-to-use Inside the Pagination component or any consumer-rendered
 *              page list. Output is deterministic, dependency-free.
 *
 * @anti-pattern Don't render server-paginated row counts here — this is
 *               for *page navigation*, not row counts.
 */
export function calculatePages({
  page,
  pageCount,
  siblingCount = 1,
  boundaryCount = 1,
}: CalculatePagesInput): PaginationItem[] {
  if (pageCount <= 0) return [];
  const clamp = (n: number): number => Math.max(1, Math.min(n, pageCount));
  const start = Math.max(clamp(page - siblingCount), boundaryCount + 1);
  const end = Math.min(clamp(page + siblingCount), pageCount - boundaryCount);

  const items: PaginationItem[] = [];

  for (let i = 1; i <= Math.min(boundaryCount, pageCount); i += 1) {
    items.push({ type: 'page', page: i, isCurrent: i === page });
  }

  if (start > boundaryCount + 1) {
    items.push({ type: 'ellipsis', side: 'start' });
  } else if (start === boundaryCount + 1 && start <= pageCount - boundaryCount) {
    items.push({ type: 'page', page: start, isCurrent: start === page });
  }

  for (
    let i = Math.max(start, boundaryCount + 1) + (start > boundaryCount + 1 ? 0 : 1);
    i <= end;
    i += 1
  ) {
    items.push({ type: 'page', page: i, isCurrent: i === page });
  }

  if (end < pageCount - boundaryCount) {
    items.push({ type: 'ellipsis', side: 'end' });
  } else if (end === pageCount - boundaryCount && end >= boundaryCount + 1) {
    items.push({ type: 'page', page: end + 1, isCurrent: end + 1 === page });
  }

  for (let i = Math.max(pageCount - boundaryCount + 1, end + 2); i <= pageCount; i += 1) {
    items.push({ type: 'page', page: i, isCurrent: i === page });
  }

  // Deduplicate adjacent identical pages produced by the boundary logic
  // when boundaryCount overlaps the central window.
  const out: PaginationItem[] = [];
  for (const it of items) {
    const prev = out[out.length - 1];
    if (it.type === 'page' && prev && prev.type === 'page' && prev.page === it.page) continue;
    if (it.type === 'ellipsis' && prev && prev.type === 'ellipsis') continue;
    out.push(it);
  }

  return out;
}
