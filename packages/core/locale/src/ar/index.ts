/**
 * `@kumiki/locale/ar` — Arabic (Arabic script, **RTL**).
 */
import type { Direction, Messages } from '../messages.js';

export const direction: Direction = 'rtl';

export const messages = {
  combobox: {
    listboxLabel: 'اقتراحات',
    noResults: 'لا توجد نتائج',
    countResults: (n: number) => `${n} نتيجة`,
    cleared: 'تم المسح',
    clearLabel: 'مسح',
  },
  dialog: {
    closeLabel: 'إغلاق',
  },
  tabs: {
    tablistLabel: 'علامات تبويب',
  },
  formField: {
    required: '(مطلوب)',
    requiredError: 'هذا الحقل مطلوب.',
    typeMismatch: 'الرجاء إدخال قيمة صالحة.',
  },
} satisfies Messages;
