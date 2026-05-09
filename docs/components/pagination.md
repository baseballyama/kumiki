# Pagination

> Page navigation controls (`nav[aria-label="Pagination"]`).

| Field                               | Value                                                                                                      |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **APG pattern**                     | (no APG entry — convention from [WAI Tutorials](https://www.w3.org/WAI/tutorials/page-structure/regions/)) |
| **Bundle (Layer 4 target, brotli)** | `1.4 kB` brotli (target)                                                                                   |
| **Status**                          | `unreleased` (Phase 1.5)                                                                                   |

## Anatomy

```
Pagination.Root         (<nav aria-label>)
  ├── Pagination.Prev
  ├── Pagination.PageList
  │     ├── Pagination.PageItem (page=N, current?)
  │     └── Pagination.Ellipsis (decorative gap)
  └── Pagination.Next
  (optional) Pagination.First / Pagination.Last
```

The current page is marked with `aria-current="page"`. The component
handles ellipsis sizing (e.g. show 1 … 4 5 6 … 99) but the consumer
chooses the truncation strategy via props.

## ARIA

| Element    | Role          | aria-\* attributes                                                  |
| ---------- | ------------- | ------------------------------------------------------------------- |
| `Root`     | (`nav`)       | `aria-label` (i18n: "Pagination")                                   |
| `Prev`     | (Button)      | `aria-label` (i18n: "Previous page"); `aria-disabled` at page 1     |
| `Next`     | (Button)      | `aria-label` (i18n: "Next page"); `aria-disabled` at last page      |
| `PageItem` | (Button or a) | `aria-label` (i18n: "Page {N}"); `aria-current="page"` when current |
| `Ellipsis` | (none)        | `aria-hidden="true"` — decorative                                   |

## Keyboard

Native button / link semantics throughout. `Tab` cycles controls.

## API

```ts
// Pagination.Root
type RootProps = {
  page: number; // 1-indexed
  pageCount: number;
  /** How many sibling pages to show on each side of current. Default 1. */
  siblingCount?: number;
  /** How many boundary pages to show at start/end. Default 1. */
  boundaryCount?: number;
  /** Use `<a>` with hrefs instead of `<button>`. */
  asLinks?: { href: (page: number) => string };
  onPageChange?: (page: number) => void;
  children: Snippet;
};
```

The component computes which pages and ellipses to render from
`page`, `pageCount`, `siblingCount`, `boundaryCount` and exposes the
result via context to `PageList` so the consumer can opt into a fully
custom rendering by reading the `pages()` derived array.

## i18n strings

| Key                      | en                  | ja                          |
| ------------------------ | ------------------- | --------------------------- |
| `pagination.label`       | `Pagination`        | `ページ送り`                |
| `pagination.prev`        | `Previous page`     | `前のページ`                |
| `pagination.next`        | `Next page`         | `次のページ`                |
| `pagination.first`       | `First page`        | `最初のページ`              |
| `pagination.last`        | `Last page`         | `最後のページ`              |
| `pagination.page`        | `Page {n}`          | `{n}ページ目`               |
| `pagination.currentPage` | `Page {n}, current` | `現在のページ、{n}ページ目` |

`@kumiki/locale/<lang>/pagination`.

## Examples

```svelte
<Pagination.Root page={p} pageCount={total} onPageChange={setPage}>
  <Pagination.Prev />
  <Pagination.PageList>
    {#snippet item({ page, isCurrent, isEllipsis })}
      {#if isEllipsis}<Pagination.Ellipsis />{:else}
        <Pagination.PageItem {page}>{page}</Pagination.PageItem>
      {/if}
    {/snippet}
  </Pagination.PageList>
  <Pagination.Next />
</Pagination.Root>
```

### As links (SSR-friendly)

```svelte
<Pagination.Root page={p} pageCount={total} asLinks={{ href: (n) => `?page=${n}` }}>
  ...
</Pagination.Root>
```

### RTL

Prev/Next labels and arrow direction flip automatically per
`LocaleProvider`. Page numbers are localized with `Intl.NumberFormat`
when the locale uses non-ASCII digits (e.g. `ar`).

## Source

- Headless: [`packages/headless/src/pagination`](../../packages/headless/src/pagination)
- Component: [`packages/components/src/pagination`](../../packages/components/src/pagination)

## Anti-patterns

- Don't render Prev/Next as `<a>` to a "javascript:" — use button semantics or pass `asLinks`.
- Don't omit the `aria-label` on the nav; multiple nav landmarks need disambiguation.
- Don't add a custom `aria-current` value other than `"page"` — screen readers don't recognize alternates here.
