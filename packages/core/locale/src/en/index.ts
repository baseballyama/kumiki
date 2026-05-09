/**
 * `@kumiki/locale/en` — English (Latin, LTR).
 *
 * Source of truth for the `Messages` shape. Every other locale conforms to
 * the keys this file declares; `pnpm check:locale-shape` enforces it.
 */
import type { Direction, Messages } from '../messages.js';

export const direction: Direction = 'ltr';

export const messages = {
  combobox: {
    listboxLabel: 'Suggestions',
    noResults: 'No results',
    countResults: (n: number) => (n === 1 ? '1 result' : `${n} results`),
    cleared: 'Cleared',
    clearLabel: 'Clear',
  },
  dialog: {
    closeLabel: 'Close',
  },
  tabs: {
    tablistLabel: 'Tabs',
  },
  formField: {
    required: '(required)',
    requiredError: 'This field is required.',
    typeMismatch: 'Please enter a valid value.',
  },
  alert: {
    dismissLabel: 'Dismiss',
  },
  breadcrumb: {
    label: 'Breadcrumb',
  },
  pagination: {
    label: 'Pagination',
    prev: 'Previous page',
    next: 'Next page',
    first: 'First page',
    last: 'Last page',
    page: (n: number) => `Page ${n}`,
    currentPage: (n: number) => `Page ${n}, current`,
  },
  table: {
    sortAscending: 'Sort ascending',
    sortDescending: 'Sort descending',
    sortClear: 'Clear sort',
    rowExpand: 'Expand row',
    rowCollapse: 'Collapse row',
    rowSelect: 'Select row',
    selectAll: 'Select all rows',
  },
} satisfies Messages;
