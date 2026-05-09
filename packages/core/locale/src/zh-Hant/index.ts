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
} satisfies Messages;
