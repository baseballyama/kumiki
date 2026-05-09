/**
 * `@kumiki/components/table` — semantic `<table>` with sortable headers,
 * row selection, and tree-row disclosure.
 *
 * Per ADR 0015: this is a *Table*, not a Data Grid. There is no
 * virtualization, no cell editing, no `role="grid"` cell-keyboard
 * navigation. For those, compose with TanStack Table — see
 * `docs/design/17-integration-boundaries.md`.
 *
 * Anatomy:
 *
 * ```
 * Table.Root
 *   ├── Table.Caption
 *   ├── Table.Header
 *   │     └── Table.HeaderRow
 *   │           ├── Table.SelectAllCell
 *   │           └── Table.HeaderCell sortable?
 *   ├── Table.Body
 *   │     └── Table.Row selectable? expandable? level=N
 *   │           ├── Table.SelectCell
 *   │           ├── Table.ExpandCell
 *   │           └── Table.Cell
 *   └── Table.Footer
 * ```
 *
 * @when-to-use Whenever you'd reach for a `<table>`. The component
 *              handles `aria-sort`, `aria-selected`, tri-state
 *              select-all, `aria-level` for tree rows.
 *
 * @anti-pattern Don't use this for layout. Don't combine with
 *               virtualization — `aria-rowcount`/`aria-rowindex` are
 *               required for that and Table doesn't render them.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/table/
 */

import Root from './Root.svelte';
import Caption from './Caption.svelte';
import Header from './Header.svelte';
import HeaderRow from './HeaderRow.svelte';
import HeaderCell from './HeaderCell.svelte';
import SelectAllCell from './SelectAllCell.svelte';
import Body from './Body.svelte';
import Row from './Row.svelte';
import Cell from './Cell.svelte';
import SelectCell from './SelectCell.svelte';
import ExpandCell from './ExpandCell.svelte';
import Footer from './Footer.svelte';

export {
  Root,
  Caption,
  Header,
  HeaderRow,
  HeaderCell,
  SelectAllCell,
  Body,
  Row,
  Cell,
  SelectCell,
  ExpandCell,
  Footer,
};

export const Table = {
  Root,
  Caption,
  Header,
  HeaderRow,
  HeaderCell,
  SelectAllCell,
  Body,
  Row,
  Cell,
  SelectCell,
  ExpandCell,
  Footer,
};

export type { Props as TableProps, SortState, SelectionMode } from './Root.svelte';
export type { Props as TableRowProps } from './Row.svelte';
