/**
 * APG keyboard contract for Calendar (date-picker grid).
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 *         https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/#example-datepicker-dialog
 *
 * Sandbox is pinned to 2026-05-09 so test selectors are deterministic.
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const FOCUSED_DAY = '[role="grid"] button[tabindex="0"]';
const SANDBOX = '/sandbox/calendar?initial=2026-05-09';

export const calendarKeyboardContract: KeyboardContract = {
  component: 'calendar',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/grid/',
  sandbox: SANDBOX,
  hydrationSelector: '[role="grid"] button[id^="cal-day-"][tabindex="0"]',
  cases: [
    {
      name: 'ArrowRight moves focus +1 day',
      focus: FOCUSED_DAY,
      press: 'ArrowRight',
      expect: [{ selector: FOCUSED_DAY, attribute: 'id', value: 'cal-day-2026-05-10' }],
    },
    {
      name: 'ArrowLeft moves focus -1 day',
      focus: FOCUSED_DAY,
      press: 'ArrowLeft',
      expect: [{ selector: FOCUSED_DAY, attribute: 'id', value: 'cal-day-2026-05-08' }],
    },
    {
      name: 'ArrowDown moves focus +7 days',
      focus: FOCUSED_DAY,
      press: 'ArrowDown',
      expect: [{ selector: FOCUSED_DAY, attribute: 'id', value: 'cal-day-2026-05-16' }],
    },
    {
      name: 'ArrowUp moves focus -7 days',
      focus: FOCUSED_DAY,
      press: 'ArrowUp',
      expect: [{ selector: FOCUSED_DAY, attribute: 'id', value: 'cal-day-2026-05-02' }],
    },
    {
      // APG grid spec: Home moves to the first day of the CURRENT WEEK ROW
      // (not the month). Sandbox is pinned to 2026-05-09 (Saturday).
      // en-US week starts on Sunday, so the week row is 2026-05-03…09.
      // First day of that week = 2026-05-03.
      name: 'Home jumps to first day of the current week row',
      focus: FOCUSED_DAY,
      press: 'Home',
      expect: [{ selector: FOCUSED_DAY, attribute: 'id', value: 'cal-day-2026-05-03' }],
    },
    {
      // APG grid spec: End moves to the last day of the CURRENT WEEK ROW
      // (not the month). 2026-05-09 is a Saturday (last day of en-US week).
      // Last day of that week = 2026-05-09 (focused date itself).
      name: 'End jumps to last day of the current week row',
      focus: FOCUSED_DAY,
      press: 'End',
      expect: [{ selector: FOCUSED_DAY, attribute: 'id', value: 'cal-day-2026-05-09' }],
    },
    {
      name: 'PageDown moves focus +1 month',
      focus: FOCUSED_DAY,
      press: 'PageDown',
      expect: [{ selector: FOCUSED_DAY, attribute: 'id', value: 'cal-day-2026-06-09' }],
    },
    {
      name: 'PageUp moves focus -1 month',
      focus: FOCUSED_DAY,
      press: 'PageUp',
      expect: [{ selector: FOCUSED_DAY, attribute: 'id', value: 'cal-day-2026-04-09' }],
    },
    {
      name: 'Enter selects the focused date',
      focus: FOCUSED_DAY,
      press: 'Enter',
      expect: [{ selector: FOCUSED_DAY, attribute: 'aria-selected', value: 'true' }],
    },
    {
      name: 'Space selects the focused date',
      focus: FOCUSED_DAY,
      press: ' ',
      expect: [{ selector: FOCUSED_DAY, attribute: 'aria-selected', value: 'true' }],
    },
  ],
};
