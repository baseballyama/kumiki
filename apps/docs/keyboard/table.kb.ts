/**
 * APG keyboard contract for Table.
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/table/
 *
 * Per ADR 0015 this is a semantic table, not a Data Grid — there is no
 * cell-keyboard navigation (`role="grid"`). Keyboard interactions are
 * limited to the sortable header buttons and the per-row checkboxes; both
 * are native button activation.
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const HOST = '[data-testid="table-host"]';
const SORT_BUTTON = `${HOST} th[data-sortable] button[data-component-part="sort-button"]`;
const FIRST_HEADER_CELL = `${HOST} th[data-sortable]`;

export const tableKeyboardContract: KeyboardContract = {
  component: 'table',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/table/',
  sandbox: '/sandbox/table',
  hydrationSelector: HOST,
  cases: [
    {
      name: 'Enter on sortable header cycles to ascending',
      focus: SORT_BUTTON,
      press: 'Enter',
      expect: [{ selector: FIRST_HEADER_CELL, attribute: 'aria-sort', value: 'ascending' }],
    },
    {
      name: 'Enter twice cycles ascending → descending',
      focus: SORT_BUTTON,
      prelude: ['Enter'],
      press: 'Enter',
      expect: [{ selector: FIRST_HEADER_CELL, attribute: 'aria-sort', value: 'descending' }],
    },
    {
      name: 'Space on sortable header cycles to ascending',
      focus: SORT_BUTTON,
      press: ' ',
      expect: [{ selector: FIRST_HEADER_CELL, attribute: 'aria-sort', value: 'ascending' }],
    },
    {
      name: 'Multiple-selection: Space on row checkbox toggles aria-checked',
      url: '/sandbox/table?selection=multiple',
      focus: `${HOST} tbody tr:first-child [role="checkbox"]`,
      press: ' ',
      expect: [
        {
          selector: `${HOST} tbody tr:first-child [role="checkbox"]`,
          attribute: 'aria-checked',
          value: 'true',
        },
      ],
    },
  ],
};
