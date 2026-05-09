# Table

> Semantic `<table>` with sortable headers, row selection, and tree-row disclosure.

| Field                               | Value                                                                                                                               |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **APG pattern**                     | [Table](https://www.w3.org/WAI/ARIA/apg/patterns/table/) — semantic, **not** [Grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) |
| **Bundle (Layer 4 target, brotli)** | `2.5 kB` brotli (target) — see ADR 0015                                                                                             |
| **Status**                          | `unreleased` (Phase 1.5)                                                                                                            |

## Scope

Per [ADR 0015](../design/16-decisions/0015-table-primitive-scope.md):

- ✅ Semantic markup, sort, select, tree rows, sticky header (CSS recipe).
- ❌ Virtualization, cell editing, column resize / reorder / pin (beyond sticky), filter UIs, `role="grid"` cell-nav, server pagination wiring.

For data-grid use cases, compose with TanStack Table; see the
[integration boundaries doc](../design/17-integration-boundaries.md).

## Anatomy

```
Table.Root                         (<table>; caption | aria-labelledby required at type level)
  ├── Table.Caption                (<caption>; or omit if aria-labelledby provided)
  ├── Table.Header                 (<thead>)
  │     └── Table.HeaderRow        (<tr>)
  │           ├── Table.SelectAllCell    (<th>; tri-state checkbox; only when selection)
  │           └── Table.HeaderCell sortable? (<th>; renders sort button when sortable)
  ├── Table.Body                   (<tbody>)
  │     └── Table.Row selectable? expandable? level=N (<tr>)
  │           ├── Table.SelectCell       (<td>; row checkbox)
  │           ├── Table.ExpandCell       (<td>; disclosure toggle)
  │           └── Table.Cell             (<td>)
  └── Table.Footer                 (<tfoot>; optional)
```

## State

Three orthogonal piles of state, all derivable from props (no FSM):

| State     | Owned by                                       | Surfaces as                                           |
| --------- | ---------------------------------------------- | ----------------------------------------------------- |
| Sort      | `Table.Root` `sort` / `onSortChange`           | `aria-sort` on the active header                      |
| Selection | `Table.Root` `selection` / `onSelectionChange` | `aria-selected` on rows; tri-state on `SelectAllCell` |
| Expanded  | `Table.Row` `expanded` / `onExpandedChange`    | `aria-expanded` on row; `aria-level` for tree depth   |

Each can be controlled or uncontrolled. Sort and selection are
single-source-of-truth at the Root; expansion is per-row to avoid an
expanded-set prop on Root.

## ARIA

| Element            | Role / element               | aria-\* attributes                                                                    |
| ------------------ | ---------------------------- | ------------------------------------------------------------------------------------- |
| `Root`             | (`<table>`)                  | `aria-labelledby` (or `<caption>` provides accessible name)                           |
| `Caption`          | (`<caption>`)                | —                                                                                     |
| `Header`           | (`<thead>`)                  | —                                                                                     |
| `HeaderCell`       | (`<th scope="col">`)         | `aria-sort` ∈ `'ascending' / 'descending' / 'none'` when sortable                     |
| `Body`             | (`<tbody>`)                  | —                                                                                     |
| `Row` (selectable) | (`<tr>`)                     | `aria-selected`                                                                       |
| `Row` (tree)       | (`<tr>`)                     | `aria-level` ≥ 1; `aria-expanded` when has-children; `aria-posinset` + `aria-setsize` |
| `SelectAllCell`    | (`<th>` containing checkbox) | inherits `aria-checked` (mixed when partial)                                          |
| `SelectCell`       | (`<td>` containing checkbox) | —                                                                                     |
| `ExpandCell`       | (`<td>` containing button)   | Button: `aria-expanded`, `aria-controls={rowId}`                                      |

## Keyboard

Native button / checkbox semantics inside cells. No grid-style cell
navigation.

| Key             | When                   | Effect                                |
| --------------- | ---------------------- | ------------------------------------- |
| `Tab`           | always                 | Cycles to next focusable cell content |
| `Space`/`Enter` | on header sort button  | Cycle sort direction                  |
| `Space`         | on row checkbox        | Toggle row selection                  |
| `Space`         | on select-all checkbox | Toggle all (respects tri-state)       |
| `Enter`         | on expand button       | Toggle row expand                     |

## API

### `Table.Root`

```ts
type RootProps =
  | (BaseProps & { children: Snippet }) // children include Caption
  | (BaseProps & { 'aria-labelledby': string; children: Snippet });

type BaseProps = {
  /** Multi-column sort not supported in v1.5 — single column only. */
  sort?: { column: string; direction: 'ascending' | 'descending' } | null;
  onSortChange?: (sort: SortState | null) => void;

  /** Controlled set of selected row ids. */
  selection?: Set<string>;
  onSelectionChange?: (selection: Set<string>) => void;
  /** When 'multiple' (default), select-all cell renders. */
  selectionMode?: 'single' | 'multiple' | 'none';

  /** Sticky header. Default false. CSS-only recipe — Layer 4 sets the data-* hook. */
  stickyHeader?: boolean;
};
```

### `Table.HeaderCell`

```ts
type Props = {
  /** Column id; required when sortable so the Root can attribute sort to a column. */
  column?: string;
  sortable?: boolean;
  children: Snippet;
};
```

### `Table.Row`

```ts
type RowProps = {
  rowId: string;
  selectable?: boolean;
  expandable?: boolean;
  expanded?: boolean;
  onExpandedChange?: (v: boolean) => void;
  /** 1-based depth for tree rows. Sets aria-level. */
  level?: number;
  children: Snippet;
};
```

## i18n strings

| Key                     | en                | ja                 |
| ----------------------- | ----------------- | ------------------ |
| `table.sort.ascending`  | `Sort ascending`  | `昇順で並べ替え`   |
| `table.sort.descending` | `Sort descending` | `降順で並べ替え`   |
| `table.sort.clear`      | `Clear sort`      | `並べ替えを解除`   |
| `table.row.expand`      | `Expand row`      | `行を展開`         |
| `table.row.collapse`    | `Collapse row`    | `行を折りたたむ`   |
| `table.row.select`      | `Select row`      | `行を選択`         |
| `table.selectAll`       | `Select all rows` | `すべての行を選択` |

`@kumiki/locale/<lang>/table`.

## Examples

### Sortable + selectable

```svelte
<Table.Root bind:sort bind:selection selectionMode="multiple">
  <Table.Caption>Active campaigns</Table.Caption>
  <Table.Header>
    <Table.HeaderRow>
      <Table.SelectAllCell />
      <Table.HeaderCell column="name" sortable>Name</Table.HeaderCell>
      <Table.HeaderCell column="impressions" sortable>Impressions</Table.HeaderCell>
    </Table.HeaderRow>
  </Table.Header>
  <Table.Body>
    {#each rows as row (row.id)}
      <Table.Row rowId={row.id} selectable>
        <Table.SelectCell />
        <Table.Cell>{row.name}</Table.Cell>
        <Table.Cell>{row.impressions}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
```

### Tree rows

```svelte
<Table.Row rowId={parent.id} expandable bind:expanded={parent.open} level={1}>
  <Table.ExpandCell />
  <Table.Cell>{parent.name}</Table.Cell>
</Table.Row>
{#if parent.open}
  {#each parent.children as child}
    <Table.Row rowId={child.id} level={2}>
      <Table.Cell>{child.name}</Table.Cell>
    </Table.Row>
  {/each}
{/if}
```

### Sticky header

```svelte
<Table.Root stickyHeader>...</Table.Root>
```

The component sets `data-sticky="header"`; atelier (and consumer
styles) supply `position: sticky; top: 0`.

## Source

- Headless: [`packages/headless/src/table`](../../packages/headless/src/table)
- Component: [`packages/components/src/table`](../../packages/components/src/table)

## Anti-patterns

- Don't use Table for layout. Use CSS Grid. Tables are for tabular data.
- Don't put interactive controls in `<th>` other than the sort button — that's a Grid pattern, which we don't ship.
- Don't render `aria-rowcount` / `aria-rowindex`. Those are Grid-pattern attributes; for semantic Table, native row count is sufficient.
- Don't combine virtualization with this component — `aria-rowcount`/`aria-rowindex` are required and Table doesn't render them. Use TanStack Table or a Data Grid library instead.

## Related

- ADR 0015 — scope decision (semantic Table in, Data Grid out).
- [Pagination](pagination.md) — paired control for paged tables.
- [Checkbox](checkbox.md) — selection cells use this internally.
