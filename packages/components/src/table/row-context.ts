export const TABLE_ROW_CONTEXT_KEY = Symbol('kumiki-table-row');

export interface TableRowContextValue {
  readonly rowId: string;
  readonly selectable: boolean;
  readonly expandable: boolean;
  readonly expanded: boolean;
  readonly level: number | undefined;
  toggleExpanded(): void;
}
