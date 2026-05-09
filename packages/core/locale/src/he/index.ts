/**
 * `@kumiki/locale/he` — Hebrew (Hebrew script, **RTL**).
 */
import type { Direction, Messages } from '../messages.js';

export const direction: Direction = 'rtl';

export const messages = {
  combobox: {
    listboxLabel: 'הצעות',
    noResults: 'אין תוצאות',
    countResults: (n: number) => (n === 1 ? 'תוצאה אחת' : `${n} תוצאות`),
    cleared: 'נמחק',
    clearLabel: 'נקה',
  },
  dialog: {
    closeLabel: 'סגור',
  },
  tabs: {
    tablistLabel: 'כרטיסיות',
  },
  formField: {
    required: '(חובה)',
    requiredError: 'שדה זה הוא חובה.',
    typeMismatch: 'נא להזין ערך חוקי.',
  },
} satisfies Messages;
