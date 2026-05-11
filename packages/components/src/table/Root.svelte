<!--
  @component Table.Root — semantic `<table>` with sortable headers, row
  selection, and tree-row disclosure.

  Per ADR 0015, Table is intentionally NOT a Data Grid:
  - No virtualization.
  - No cell editing.
  - No `role="grid"` cell-keyboard navigation.
  - Sort is single-column only.

  Anatomy: Root > Caption / Header / Body / Footer.

  @see https://www.w3.org/WAI/ARIA/apg/patterns/table/
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { SortState, SelectionMode } from './context.js';
  export type { SortState, SelectionMode };

  type CommonProps = {
    sort?: SortState | null;
    onSortChange?: (next: SortState | null) => void;
    selection?: Set<string>;
    onSelectionChange?: (selection: Set<string>) => void;
    selectionMode?: SelectionMode;
    children: Snippet;
    [key: string]: unknown;
  };

  // The accessible name comes from either an explicit aria-labelledby
  // (if the consumer renders Table.Caption with their own id, or refers
  // to a heading elsewhere) or the Caption text itself. Both are valid;
  // we don't enforce one at the type level.
  export type Props = CommonProps;
</script>

<script lang="ts">
  import { setContext, untrack } from 'svelte';
  import { TABLE_CONTEXT_KEY, type TableContextValue } from './context.js';

  let {
    sort = null,
    onSortChange,
    selection = $bindable(new Set<string>()),
    onSelectionChange,
    selectionMode = 'none',
    children,
    ...rest
  }: Props = $props();

  let snapSort = $state<SortState | null>(untrack(() => sort));
  $effect(() => {
    snapSort = sort;
  });

  // Track which rows are currently registered, so select-all can address them.
  const registeredRowIds = $state(new Set<string>());

  const selectAllState = $derived.by<'unchecked' | 'mixed' | 'checked'>(() => {
    if (selection.size === 0) return 'unchecked';
    let allRegisteredSelected = true;
    let anySelected = false;
    for (const id of registeredRowIds) {
      if (selection.has(id)) anySelected = true;
      else allRegisteredSelected = false;
    }
    if (allRegisteredSelected && registeredRowIds.size > 0) return 'checked';
    if (anySelected) return 'mixed';
    return 'unchecked';
  });

  function applySelection(next: Set<string>): void {
    selection = next;
    onSelectionChange?.(next);
  }

  setContext<TableContextValue>(TABLE_CONTEXT_KEY, {
    get sort() {
      return snapSort;
    },
    setSort(next) {
      snapSort = next;
      onSortChange?.(next);
    },
    cycleSort(column) {
      if (!snapSort || snapSort.column !== column) {
        const next = { column, direction: 'ascending' as const };
        snapSort = next;
        onSortChange?.(next);
        return;
      }
      if (snapSort.direction === 'ascending') {
        const next = { column, direction: 'descending' as const };
        snapSort = next;
        onSortChange?.(next);
        return;
      }
      snapSort = null;
      onSortChange?.(null);
    },
    get selectionMode() {
      return selectionMode;
    },
    get selection() {
      return selection;
    },
    toggleRow(rowId) {
      if (selectionMode === 'none') return;
      const next = new Set(selection);
      if (selectionMode === 'single') {
        if (next.has(rowId)) next.delete(rowId);
        else {
          next.clear();
          next.add(rowId);
        }
      } else {
        if (next.has(rowId)) next.delete(rowId);
        else next.add(rowId);
      }
      applySelection(next);
    },
    selectAllRows(rowIds) {
      if (selectionMode !== 'multiple') return;
      const next = new Set(selection);
      for (const id of rowIds) next.add(id);
      applySelection(next);
    },
    clearSelection() {
      if (selection.size === 0) return;
      applySelection(new Set());
    },
    get selectAllState() {
      return selectAllState;
    },
    registerRow(rowId) {
      registeredRowIds.add(rowId);
    },
    unregisterRow(rowId) {
      registeredRowIds.delete(rowId);
    },
  } as TableContextValue);
</script>

<table {...rest} data-component-part="root" data-selection-mode={selectionMode}>
  {@render children()}
</table>
