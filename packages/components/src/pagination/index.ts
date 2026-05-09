/**
 * `@kumiki/components/pagination` — page navigation control surface.
 *
 * `nav[aria-label]` wrapping a Prev / PageList / Next compound.
 * Page-list math (which page numbers + ellipses to show) lives in
 * `@kumiki/headless/pagination` as a pure function so consumers can
 * compute it server-side or in tests without Svelte.
 *
 * ```svelte
 * <Pagination.Root page={p} pageCount={total} onPageChange={setPage}>
 *   <Pagination.Prev />
 *   <Pagination.PageList>
 *     {#snippet item({ page, isCurrent, isEllipsis })}
 *       {#if isEllipsis}
 *         <Pagination.Ellipsis />
 *       {:else}
 *         <Pagination.PageItem {page}>{page}</Pagination.PageItem>
 *       {/if}
 *     {/snippet}
 *   </Pagination.PageList>
 *   <Pagination.Next />
 * </Pagination.Root>
 * ```
 *
 * Pass `asLinks={{ href: (n) => `?p=${n}` }}` to render `<a>` instead of
 * `<button>` for SSR-friendly URL-encoded pagination.
 *
 * @when-to-use Whenever a list / table is paginated server-side, or
 *              client-side virtualization isn't appropriate.
 *
 * @anti-pattern Don't use this for "load more" interactions — use a
 *               regular Button with explicit "Load more" text.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/ — landmark pattern reference.
 */

import Root from './Root.svelte';
import PageList from './PageList.svelte';
import PageItem from './PageItem.svelte';
import Prev from './Prev.svelte';
import Next from './Next.svelte';
import Ellipsis from './Ellipsis.svelte';

export { Root, PageList, PageItem, Prev, Next, Ellipsis };

export const Pagination = { Root, PageList, PageItem, Prev, Next, Ellipsis };

export type { Props as PaginationProps } from './Root.svelte';
export type {
  PaginationItem,
  PaginationItemPage,
  PaginationItemEllipsis,
  CalculatePagesInput,
} from '@kumiki/headless/pagination';
