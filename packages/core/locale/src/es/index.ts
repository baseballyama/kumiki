/**
 * `@kumiki/locale/es` — Spanish (Latin, LTR).
 */
import type { Direction, Messages } from '../messages.js';

export const direction: Direction = 'ltr';

export const messages = {
  combobox: {
    listboxLabel: 'Sugerencias',
    noResults: 'Sin resultados',
    countResults: (n: number) => (n === 1 ? '1 resultado' : `${n} resultados`),
    cleared: 'Borrado',
    clearLabel: 'Borrar',
  },
  dialog: {
    closeLabel: 'Cerrar',
  },
  tabs: {
    tablistLabel: 'Pestañas',
  },
  formField: {
    required: '(obligatorio)',
    requiredError: 'Este campo es obligatorio.',
    typeMismatch: 'Introduce un valor válido.',
  },
  alert: {
    dismissLabel: 'Cerrar',
  },
} satisfies Messages;
