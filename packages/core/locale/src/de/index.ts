/**
 * `@kumiki/locale/de` — German (Latin, LTR).
 */
import type { Direction, Messages } from '../messages.js';

export const direction: Direction = 'ltr';

export const messages = {
  combobox: {
    listboxLabel: 'Vorschläge',
    noResults: 'Keine Ergebnisse',
    countResults: (n: number) => (n === 1 ? '1 Ergebnis' : `${n} Ergebnisse`),
    cleared: 'Gelöscht',
    clearLabel: 'Löschen',
  },
  dialog: {
    closeLabel: 'Schließen',
  },
  tabs: {
    tablistLabel: 'Registerkarten',
  },
  formField: {
    required: '(erforderlich)',
    requiredError: 'Dieses Feld ist erforderlich.',
    typeMismatch: 'Bitte geben Sie einen gültigen Wert ein.',
  },
  alert: {
    dismissLabel: 'Schließen',
  },
  breadcrumb: {
    label: 'Brotkrümelnavigation',
  },
  pagination: {
    label: 'Seitennavigation',
    prev: 'Vorherige Seite',
    next: 'Nächste Seite',
    first: 'Erste Seite',
    last: 'Letzte Seite',
    page: (n: number) => `Seite ${n}`,
    currentPage: (n: number) => `Seite ${n}, aktuelle`,
  },
  table: {
    sortAscending: 'Aufsteigend sortieren',
    sortDescending: 'Absteigend sortieren',
    sortClear: 'Sortierung aufheben',
    rowExpand: 'Zeile erweitern',
    rowCollapse: 'Zeile einklappen',
    rowSelect: 'Zeile auswählen',
    selectAll: 'Alle Zeilen auswählen',
  },
} satisfies Messages;
