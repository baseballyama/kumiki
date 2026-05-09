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
  breadcrumb: {
    label: '탐색 경로',
  },
  pagination: {
    label: '페이지 이동',
    prev: '이전 페이지',
    next: '다음 페이지',
    first: '첫 페이지',
    last: '마지막 페이지',
    page: (n: number) => `${n}페이지`,
    currentPage: (n: number) => `${n}페이지, 현재 페이지`,
  },
  table: {
    sortAscending: '오름차순 정렬',
    sortDescending: '내림차순 정렬',
    sortClear: '정렬 해제',
    rowExpand: '행 펼치기',
    rowCollapse: '행 접기',
    rowSelect: '행 선택',
    selectAll: '모든 행 선택',
  },
} satisfies Messages;
