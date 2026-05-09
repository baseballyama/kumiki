import type { PaginationItem } from '@kumiki/headless/pagination';

export const PAGINATION_CONTEXT_KEY = Symbol('kumiki-pagination');

export interface PaginationContextValue {
  readonly page: number;
  readonly pageCount: number;
  readonly items: ReadonlyArray<PaginationItem>;
  /** Returns the href for a given page when `asLinks` is configured. */
  readonly hrefFor: ((p: number) => string) | undefined;
  goto(page: number): void;
}
