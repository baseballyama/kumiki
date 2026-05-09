export const TABLE_CONTEXT_KEY = Symbol('kumiki-table');

export type SortDirection = 'ascending' | 'descending';
export interface SortState {
  column: string;
  direction: SortDirection;
}

export type SelectionMode = 'none' | 'single' | 'multiple';

export interface TableContextValue {
  // Sort
  readonly sort: SortState | null;
  setSort(next: SortState | null): void;
  cycleSort(column: string): void;

  // Selection
  readonly selectionMode: SelectionMode;
  readonly selection: ReadonlySet<string>;
  toggleRow(rowId: string): void;
  selectAllRows(rowIds: ReadonlyArray<string>): void;
  clearSelection(): void;
  /**
   * Aggregate state for the select-all checkbox: 'unchecked' / 'mixed' / 'checked'.
   * Computed against `registeredRowIds` so partial selection registers as 'mixed'.
   */
  readonly selectAllState: 'unchecked' | 'mixed' | 'checked';

  /** Each Row registers + unregisters its rowId for select-all aggregation. */
  registerRow(rowId: string): void;
  unregisterRow(rowId: string): void;
}
