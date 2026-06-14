/**
 * APG keyboard contract for DateTimeField.
 *
 * DateTimeField is composed of `DatePicker` (popover-anchored calendar) and
 * `TimeField` (segmented spinbutton) — keyboard semantics of each half are
 * tested by their own contracts. This file verifies the wiring:
 * - The Time half's hour segment exists and is focusable.
 * - The Date half exposes a calendar trigger that opens on Enter.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const HOST = '[data-testid="datetime-field-host"]';
const DATE_TRIGGER = `${HOST} button[aria-haspopup]`;
const TIME_HOUR = `${HOST} [data-segment-kind="hour"]`;

export const datetimeFieldKeyboardContract: KeyboardContract = {
  component: 'datetime-field',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/',
  sandbox: '/sandbox/datetime-field',
  // The time half is a single tab stop: the hour segment (first focusable
  // segment) only gains `tabindex="0"` after the roving coordinator runs in an
  // attachment, so this is a true post-hydration sentinel.
  hydrationSelector: `${TIME_HOUR}[tabindex="0"]`,
  cases: [
    {
      name: 'Time-half hour segment is focusable',
      focus: TIME_HOUR,
      press: 'ArrowUp',
      expect: [{ selector: TIME_HOUR, attribute: 'aria-valuenow', value: '10' }],
    },
    {
      name: 'Date-half trigger is the popover anchor',
      focus: DATE_TRIGGER,
      press: 'Enter',
      expect: [{ selector: DATE_TRIGGER, attribute: 'aria-expanded', value: 'true' }],
    },
  ],
};
