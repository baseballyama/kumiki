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
  alert: {
    dismissLabel: 'تجاهل',
  },
  breadcrumb: {
    label: 'مسار التنقل',
  },
  pagination: {
    label: 'ترقيم الصفحات',
    prev: 'الصفحة السابقة',
    next: 'الصفحة التالية',
    first: 'الصفحة الأولى',
    last: 'الصفحة الأخيرة',
    page: (n: number) => `الصفحة ${n}`,
    currentPage: (n: number) => `الصفحة ${n}، الحالية`,
  },
  table: {
    sortAscending: 'ترتيب تصاعدي',
    sortDescending: 'ترتيب تنازلي',
    sortClear: 'إلغاء الترتيب',
    rowExpand: 'توسيع الصف',
    rowCollapse: 'طي الصف',
    rowSelect: 'تحديد الصف',
    selectAll: 'تحديد جميع الصفوف',
  },
} satisfies Messages;
