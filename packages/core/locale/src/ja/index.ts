/**
 * `@kumiki/locale/ja` — Japanese (CJK, LTR).
 */
import type { Direction, Messages } from '../messages.js';

export const direction: Direction = 'ltr';

export const messages = {
  combobox: {
    listboxLabel: '候補一覧',
    noResults: '候補がありません',
    countResults: (n: number) => `${n} 件の候補`,
    cleared: '入力をクリアしました',
    clearLabel: 'クリア',
  },
  dialog: {
    closeLabel: '閉じる',
  },
  tabs: {
    tablistLabel: 'タブ',
  },
  formField: {
    required: '（必須）',
    requiredError: 'この項目は必須です。',
    typeMismatch: '正しい値を入力してください。',
  },
} satisfies Messages;
