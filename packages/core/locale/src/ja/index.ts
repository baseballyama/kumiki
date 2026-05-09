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
  alert: {
    dismissLabel: '閉じる',
  },
  breadcrumb: {
    label: 'パンくずリスト',
  },
  pagination: {
    label: 'ページ送り',
    prev: '前のページ',
    next: '次のページ',
    first: '最初のページ',
    last: '最後のページ',
    page: (n: number) => `${n}ページ目`,
    currentPage: (n: number) => `現在のページ、${n}ページ目`,
  },
  table: {
    sortAscending: '昇順で並べ替え',
    sortDescending: '降順で並べ替え',
    sortClear: '並べ替えを解除',
    rowExpand: '行を展開',
    rowCollapse: '行を折りたたむ',
    rowSelect: '行を選択',
    selectAll: 'すべての行を選択',
  },
  popconfirm: {
    confirm: '確認',
    cancel: 'キャンセル',
  },
  timeField: {
    hour: '時',
    minute: '分',
    second: '秒',
    dayPeriod: '午前/午後',
    placeholder: '––',
    am: '午前',
    pm: '午後',
  },
} satisfies Messages;
