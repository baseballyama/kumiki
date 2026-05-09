<!--
  @component Pagination.Root — `<nav>` wrapper that owns page-list state.

  Default `aria-label` from LocaleProvider. Computes the page-list via
  the headless `calculatePages` math and shares it with descendants
  through context, so a single `<Pagination.PageList>` snippet can
  render either page buttons / page links / ellipsis cells.

  @see https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/ — reference
       for the `<nav>` landmark pattern (Pagination has no APG entry of
       its own; we follow the WAI tutorial convention).
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte';
  export type Props = {
    /** 1-indexed current page. */
    page: number;
    pageCount: number;
    siblingCount?: number;
    boundaryCount?: number;
    /** Render Pagination.PageItem / Prev / Next as `<a>` instead of `<button>`. */
    asLinks?: { href: (page: number) => string };
    onPageChange?: (page: number) => void;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    children: Snippet;
    [key: string]: unknown;
  };
</script>

<script lang="ts">
  import { setContext } from 'svelte';
  import { calculatePages } from '@kumiki/headless/pagination';
  import { tryUseLocale } from '../locale-provider/use-locale.js';
  import { PAGINATION_CONTEXT_KEY, type PaginationContextValue } from './context.js';

  let {
    page,
    pageCount,
    siblingCount = 1,
    boundaryCount = 1,
    asLinks,
    onPageChange,
    'aria-label': ariaLabelProp,
    'aria-labelledby': ariaLabelledBy,
    children,
    ...rest
  }: Props = $props();

  const locale = tryUseLocale();

  const items = $derived(calculatePages({ page, pageCount, siblingCount, boundaryCount }));

  const ariaLabel = $derived(
    ariaLabelledBy
      ? undefined
      : (ariaLabelProp ?? locale?.messages.pagination.label ?? 'Pagination'),
  );

  setContext<PaginationContextValue>(PAGINATION_CONTEXT_KEY, {
    get page() {
      return page;
    },
    get pageCount() {
      return pageCount;
    },
    get items() {
      return items;
    },
    get hrefFor() {
      return asLinks ? asLinks.href : undefined;
    },
    goto(p) {
      const clamped = Math.max(1, Math.min(p, pageCount));
      if (clamped !== page) onPageChange?.(clamped);
    },
  } as PaginationContextValue);
</script>

<nav {...rest} data-part="root" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}>
  {@render children()}
</nav>
