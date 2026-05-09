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
} satisfies Messages;
