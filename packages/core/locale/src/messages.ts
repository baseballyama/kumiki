/**
 * Shared message shape every `@kumiki/locale/<lang>` subpath conforms to.
 *
 * Type-only — never imported at runtime, never bundled into the per-locale
 * output. Each locale's `messages` is declared with `satisfies Messages` so
 * literal types stay narrow while the shape is enforced.
 *
 * @see docs/design/06-i18n.md §6.3 Locale data structure
 * @see docs/design/06-i18n.md §6.9 What's in the v1.0 strings
 */
export interface Messages {
  /** Combobox component messages — listbox label, no-results / count-results announcements, clear-input feedback. */
  combobox: {
    /** `aria-label` for the listbox when the consumer didn't supply one. */
    listboxLabel: string;
    /** Status text + SR announcement when the filtered set is empty. */
    noResults: string;
    /** SR announcement for the result count after filtering. */
    countResults: (n: number) => string;
    /** SR announcement after the input is cleared. */
    cleared: string;
    /** `aria-label` for the clear button. */
    clearLabel: string;
  };
  /** Dialog component messages — close-button accessible name. */
  dialog: {
    /** `aria-label` for the close button. */
    closeLabel: string;
  };
  /** Tabs component messages — tablist accessible-name fallback. */
  tabs: {
    /** Fallback `aria-label` for the tablist when the consumer didn't supply one. */
    tablistLabel: string;
  };
  /** FormField component messages — required indicator + generic validation messages. */
  formField: {
    /** Visual indicator appended to the label when the field is required. */
    required: string;
    /** Generic error when a required field is empty. */
    requiredError: string;
    /** Generic error when the value's type is wrong (e.g. text in a number input). */
    typeMismatch: string;
  };
  /** Alert component messages — close button accessible name. */
  alert: {
    /** `aria-label` for the close button on a dismissible alert. */
    dismissLabel: string;
  };
  /** Breadcrumb component messages. */
  breadcrumb: {
    /** Default `aria-label` on the surrounding `<nav>`. */
    label: string;
  };
  /** Pagination component messages. */
  pagination: {
    /** Default `aria-label` on the surrounding `<nav>`. */
    label: string;
    /** `aria-label` for the previous-page button. */
    prev: string;
    /** `aria-label` for the next-page button. */
    next: string;
    /** `aria-label` for the first-page button. */
    first: string;
    /** `aria-label` for the last-page button. */
    last: string;
    /** `aria-label` for an inactive page button (`{n}` is the page number). */
    page: (n: number) => string;
    /** `aria-label` for the current-page indicator. */
    currentPage: (n: number) => string;
  };
  /** Table component messages — sort, expand, select. */
  table: {
    sortAscending: string;
    sortDescending: string;
    sortClear: string;
    rowExpand: string;
    rowCollapse: string;
    rowSelect: string;
    selectAll: string;
  };
}

/** Layout direction tag exported by every locale subpath. RTL for ar/he, LTR otherwise. */
export type Direction = 'ltr' | 'rtl';
