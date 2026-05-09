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
  alert: {
    dismissLabel: '关闭',
  },
  breadcrumb: {
    label: '面包屑导航',
  },
  pagination: {
    label: '分页',
    prev: '上一页',
    next: '下一页',
    first: '首页',
    last: '末页',
    page: (n: number) => `第 ${n} 页`,
    currentPage: (n: number) => `第 ${n} 页，当前页`,
  },
  table: {
    sortAscending: '升序排序',
    sortDescending: '降序排序',
    sortClear: '清除排序',
    rowExpand: '展开行',
    rowCollapse: '折叠行',
    rowSelect: '选择行',
    selectAll: '选择所有行',
  },
} satisfies Messages;
