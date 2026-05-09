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
  alert: {
    dismissLabel: 'סגירה',
  },
  breadcrumb: {
    label: 'נתיב ניווט',
  },
  pagination: {
    label: 'דפדוף',
    prev: 'הדף הקודם',
    next: 'הדף הבא',
    first: 'הדף הראשון',
    last: 'הדף האחרון',
    page: (n: number) => `דף ${n}`,
    currentPage: (n: number) => `דף ${n}, הנוכחי`,
  },
  table: {
    sortAscending: 'מיון בסדר עולה',
    sortDescending: 'מיון בסדר יורד',
    sortClear: 'נקה מיון',
    rowExpand: 'הרחב שורה',
    rowCollapse: 'כווץ שורה',
    rowSelect: 'בחר שורה',
    selectAll: 'בחר את כל השורות',
  },
} satisfies Messages;
