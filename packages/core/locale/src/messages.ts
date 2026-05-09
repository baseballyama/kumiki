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
}

/** Layout direction tag exported by every locale subpath. RTL for ar/he, LTR otherwise. */
export type Direction = 'ltr' | 'rtl';
