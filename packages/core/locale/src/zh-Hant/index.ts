/**
 * `@kumiki/locale/zh-Hant` — Traditional Chinese (CJK, LTR).
 */
import type { Direction, Messages } from '../messages.js';

export const direction: Direction = 'ltr';

export const messages = {
  combobox: {
    listboxLabel: '候選清單',
    noResults: '沒有結果',
    countResults: (n: number) => `${n} 個結果`,
    cleared: '已清除',
    clearLabel: '清除',
  },
  dialog: {
    closeLabel: '關閉',
  },
  tabs: {
    tablistLabel: '索引標籤',
  },
  formField: {
    required: '（必填）',
    requiredError: '此項目為必填。',
    typeMismatch: '請輸入有效的值。',
  },
  alert: {
    dismissLabel: '關閉',
  },
  breadcrumb: {
    label: '麵包屑導覽',
  },
  pagination: {
    label: '分頁',
    prev: '上一頁',
    next: '下一頁',
    first: '第一頁',
    last: '最後一頁',
    page: (n: number) => `第 ${n} 頁`,
    currentPage: (n: number) => `第 ${n} 頁，目前頁`,
  },
  table: {
    sortAscending: '升冪排序',
    sortDescending: '降冪排序',
    sortClear: '清除排序',
    rowExpand: '展開列',
    rowCollapse: '收合列',
    rowSelect: '選取列',
    selectAll: '選取所有列',
  },
} satisfies Messages;
