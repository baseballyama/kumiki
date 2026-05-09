# ADR 0015 — Table primitive scope: ship semantic Table, defer Data Grid

**Status:** Accepted
**Date:** 2026-05-09

## Context

[`15-roadmap.md`](../15-roadmap.md) §15.8 lists "Data Grid /
virtualized tables" as deferred — _"Significant project; not a hosted
Phase 1 / 2 priority. Tracked."_ That entry conflated **two different
things**:

1. **Semantic, accessible `<table>`** with sortable headers, row selection,
   tree-rows, and sticky headers — a wide-spread pattern in business UIs.
2. **Data Grid** — virtualized rendering, cell editing, column resize /
   reorder / pin, keyboard cell navigation per ARIA `role="grid"`,
   filter bars. A genuine large project.

The flyle-nexus design system (the migration target prompting this
review) ships both: `Table` + `DataTable` with sortable headers,
checkbox row selection, tree rows, sticky cells, `CellEditPopover`,
`TableHeaderColumnDropdown`, and `TableOpenerButton`. Roughly one third
of those features are (1); the rest are (2).

If kumiki defers all of "table," migration onto kumiki forces
flyle-nexus to keep maintaining two parallel systems for what is
ultimately a semantic-`<table>` accessibility surface plus a layer of
business-grade grid behavior. That is the wrong split for kumiki's
positioning.

## Decision

Split table support into **two scopes**:

### In scope for kumiki — `@kumiki/components/table` (Phase 1.5)

A **semantic, accessible `<table>` primitive** covering the patterns
that 80% of business UIs need without a virtualization layer:

| Feature                                                                       | In v1.0/v1.5 |
| ----------------------------------------------------------------------------- | :----------: |
| Native `<table>` / `<thead>` / `<tbody>` / `<tr>` / `<th>` / `<td>` markup    |      ✅      |
| `caption`-required type-level (or `aria-labelledby`)                          |      ✅      |
| Sortable column header (button-in-header, `aria-sort`)                        |      ✅      |
| Row selection (single + multi) with checkbox cell, `aria-selected` per row    |      ✅      |
| Tree-row disclosure (parent / child rows, `aria-expanded`, `aria-level`)      |      ✅      |
| Sticky header / sticky leading column (CSS-only, `position: sticky` recipe)   |      ✅      |
| Empty-state slot                                                              |      ✅      |
| Keyboard: header sort buttons, row-checkbox, expand/collapse via APG patterns |      ✅      |
| RTL — column order auto-flips per `LocaleProvider`                            |      ✅      |
| i18n strings: "Sort ascending / descending", "Expand row", "Select all rows"  |      ✅      |

Anatomy:

```
Table.Root              -- <table>; takes caption | aria-labelledby; sets sort/select state
  ├── Table.Header      -- <thead>
  │     └── Table.HeaderRow
  │           ├── Table.HeaderCell sortable?       -- <th>; renders sort button when sortable
  │           └── Table.SelectAllCell              -- <th>; checkbox-tri-state
  ├── Table.Body        -- <tbody>
  │     └── Table.Row selectable? expandable?      -- <tr>; aria-selected, aria-expanded
  │           ├── Table.SelectCell                 -- <td>; row checkbox
  │           ├── Table.ExpandCell                 -- <td>; disclosure button
  │           └── Table.Cell                       -- <td>
  └── Table.Footer      -- <tfoot>
```

State machine (Layer 2): **none**. Table state is fully derivable
from props (`sort`, `selection`, `expanded`) — no FSM is justified.
Layer 3 (`@kumiki/headless/table`) supplies attachments for header
sort, row selection, row expand, with state held in plain
`$state` getters wrapped by `withSortable`, `withSelection`,
`withTreeRows` composers (Phase 2).

Bundle budget: **2.5 KB** brotli for `@kumiki/components/table`
including all four base parts; the `with*` composers add ≤ 800 B
each. Logged in `09-bundle-budget.md`.

### Out of scope for kumiki — Data Grid features

Explicitly **not** in kumiki at v1.0 / v1.5 / v2.0:

- Virtualization (windowed row rendering).
- Cell editing (inline `contenteditable`, popover-cell-edit, etc.).
- Column resize, reorder, pin / freeze beyond the simple sticky CSS recipe.
- Filter UIs at the table level (consumers compose Combobox + own state).
- Pivot / aggregate rows.
- Server-driven pagination control wired into the table (consumers compose
  Pagination + own state — see `pagination.md`).
- ARIA `role="grid"` keyboard cell navigation. We render a semantic
  `<table>` only, not a grid; consumers needing grid navigation reach for
  TanStack Table / AG Grid / glide-data-grid.

If a consumer needs all of the above, kumiki Table is the wrong tool —
the consumer should compose with TanStack Table (headless) directly and
use kumiki only for the surrounding controls (Combobox, Toggle,
Pagination). This boundary is documented in
[`docs/design/17-integration-boundaries.md`](../17-integration-boundaries.md).

## Alternatives considered

| Option                                        | Verdict                                                                                                                                                           |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Defer all table support                       | ❌ Forces every consumer to hand-roll `<table>` accessibility — exactly the kind of problem kumiki exists to solve. flyle migration would be substantially worse. |
| Ship semantic table + data grid in v1.0       | ❌ Data Grid is a multi-quarter project (per §15.8). Sinks v1.0 timeline. Maintenance burden is high.                                                             |
| **Ship semantic table only; defer data grid** | ✅ Covers the 80% case. Bundle budget tractable. Data Grid revisited in Phase 3 with measured demand.                                                             |
| Recommend TanStack Table for everything       | ❌ Even the "simple sortable table" case forces consumers into a headless adapter library; kumiki's value (accessible-by-default markup) is lost.                 |

## Consequences

**Easier:**

- flyle-nexus migration: their `Table`, `TableCell`, `TableRowColumn`,
  `TableHeaderCell`, `TableHeaderCellText`, `TableCellCheckbox`,
  `TreeTableHeader` map onto kumiki Table parts directly. Their
  `CellEditPopover`, `DataTable`, `TableOpenerButton`, and dropdown
  filter cells stay flyle-internal (composing kumiki Popover / Menu /
  Combobox).
- The accessibility-hard parts (`aria-sort`, `aria-selected`,
  tri-state select-all, `aria-level` for tree rows) live in one tested
  place.

**Harder:**

- Kumiki now has to maintain a Table component with non-trivial test
  surface (sort + select + expand interaction matrices).
- Roadmap §15.8 needs amending: split "Data Grid / virtualized tables"
  into two entries (in-scope semantic Table → Phase 1.5; deferred Data
  Grid → Phase 3 if at all).
- A new component spec (`docs/components/table.md`) and APG keyboard
  YAML are required.

## References

- [`docs/design/15-roadmap.md`](../15-roadmap.md) §15.8 — to be updated to
  reflect the split.
- [`docs/design/17-integration-boundaries.md`](../17-integration-boundaries.md)
  — where to send users who need a real Data Grid.
- WAI-ARIA APG: [Table pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/)
  (the semantic-`<table>` pattern, not Grid).
- WAI-ARIA APG: [Grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
  (intentionally **not** what we ship).
- TanStack Table — recommended pairing for consumers that need grid
  features kumiki Table doesn't cover.
