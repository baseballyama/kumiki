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
      name: 'Home jumps to first day of month',
      focus: FOCUSED_DAY,
      press: 'Home',
      expect: [{ selector: FOCUSED_DAY, attribute: 'id', value: 'cal-day-2026-05-01' }],
    },
    {
      name: 'End jumps to last day of month',
      focus: FOCUSED_DAY,
      press: 'End',
      expect: [{ selector: FOCUSED_DAY, attribute: 'id', value: 'cal-day-2026-05-31' }],
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
