/**
 * `@kumiki/locale/zh-Hans` — Simplified Chinese (CJK, LTR).
 */
import type { Direction, Messages } from '../messages.js';

export const direction: Direction = 'ltr';

export const messages = {
  combobox: {
    listboxLabel: '候选列表',
    noResults: '无结果',
    countResults: (n: number) => `${n} 个结果`,
    cleared: '已清除',
    clearLabel: '清除',
  },
  dialog: {
    closeLabel: '关闭',
  },
  tabs: {
    tablistLabel: '标签',
  },
  formField: {
    required: '（必填）',
    requiredError: '此项为必填。',
    typeMismatch: '请输入有效的值。',
  },
} satisfies Messages;
