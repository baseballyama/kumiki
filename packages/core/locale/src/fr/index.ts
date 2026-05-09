/**
 * `@kumiki/locale/fr` — French (Latin, LTR).
 */
import type { Direction, Messages } from '../messages.js';

export const direction: Direction = 'ltr';

export const messages = {
  combobox: {
    listboxLabel: 'Suggestions',
    noResults: 'Aucun résultat',
    countResults: (n: number) => (n <= 1 ? `${n} résultat` : `${n} résultats`),
    cleared: 'Effacé',
    clearLabel: 'Effacer',
  },
  dialog: {
    closeLabel: 'Fermer',
  },
  tabs: {
    tablistLabel: 'Onglets',
  },
  formField: {
    required: '(obligatoire)',
    requiredError: 'Ce champ est obligatoire.',
    typeMismatch: 'Veuillez entrer une valeur valide.',
  },
} satisfies Messages;
