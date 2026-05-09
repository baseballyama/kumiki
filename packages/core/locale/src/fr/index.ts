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
  alert: {
    dismissLabel: 'Ignorer',
  },
  breadcrumb: {
    label: "Fil d'Ariane",
  },
  pagination: {
    label: 'Pagination',
    prev: 'Page précédente',
    next: 'Page suivante',
    first: 'Première page',
    last: 'Dernière page',
    page: (n: number) => `Page ${n}`,
    currentPage: (n: number) => `Page ${n}, actuelle`,
  },
  table: {
    sortAscending: 'Trier par ordre croissant',
    sortDescending: 'Trier par ordre décroissant',
    sortClear: 'Effacer le tri',
    rowExpand: 'Développer la ligne',
    rowCollapse: 'Réduire la ligne',
    rowSelect: 'Sélectionner la ligne',
    selectAll: 'Sélectionner toutes les lignes',
  },
} satisfies Messages;
