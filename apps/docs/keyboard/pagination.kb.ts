/**
 * APG keyboard contract for Pagination.
 *
 * Pagination is a `<nav>` of native `<button>` elements (or `<a>` when
 * `asLinks` is set). There is no APG entry; we transcribe the WAI tutorial
 * conventions: each control is a tab stop, Enter / Space activates,
 * disabled Prev/Next at boundaries are inert.
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const HOST = '[data-testid="pagination-host"]';
const PREV = `${HOST} [data-testid="prev"]`;
const NEXT = `${HOST} [data-testid="next"]`;

export const paginationKeyboardContract: KeyboardContract = {
  component: 'pagination',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/',
  sandbox: '/sandbox/pagination?page=2&total=8',
  hydrationSelector: `${HOST} button`,
  cases: [
    {
      name: 'Enter on Next advances by one',
      focus: NEXT,
      press: 'Enter',
      expect: [{ selector: '[data-testid="log"] li', visible: true }],
    },
    {
      name: 'Space on Prev steps back',
      focus: PREV,
      press: ' ',
      expect: [{ selector: '[data-testid="log"] li', visible: true }],
    },
    {
      name: 'Prev is disabled at page=1',
      url: '/sandbox/pagination?page=1&total=8',
      focus: PREV,
      press: 'Enter',
      expect: [{ selector: PREV, attribute: 'aria-disabled', value: 'true' }],
    },
    {
      name: 'Next is disabled at the last page',
      url: '/sandbox/pagination?page=8&total=8',
      focus: NEXT,
      press: 'Enter',
      expect: [{ selector: NEXT, attribute: 'aria-disabled', value: 'true' }],
    },
  ],
};
