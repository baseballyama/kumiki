/**
 * `@kumiki/locale/ko` — Korean (Hangul, LTR).
 */
import type { Direction, Messages } from '../messages.js';

export const direction: Direction = 'ltr';

export const messages = {
  combobox: {
    listboxLabel: '제안 목록',
    noResults: '결과 없음',
    countResults: (n: number) => `${n}개 결과`,
    cleared: '지워짐',
    clearLabel: '지우기',
  },
  dialog: {
    closeLabel: '닫기',
  },
  tabs: {
    tablistLabel: '탭',
  },
  formField: {
    required: '(필수)',
    requiredError: '이 항목은 필수입니다.',
    typeMismatch: '올바른 값을 입력하세요.',
  },
  alert: {
    dismissLabel: '닫기',
  },
} satisfies Messages;
