/**
 * APG keyboard contract for TimeField.
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/
 *
 * Each segment is `role="spinbutton"`. ArrowUp/Down increment/decrement
 * with wrap. ArrowLeft/Right navigate between segments (RTL inverted).
 * 0–9 type into numeric segments with auto-advance. Backspace clears.
 * On dayPeriod, A/P toggle AM/PM.
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const HOST = '[data-testid="time-field-host"]';
const SEG_HOUR = `${HOST} [data-testid="seg-hour"]`;
const SEG_MINUTE = `${HOST} [data-testid="seg-minute"]`;

export const timeFieldKeyboardContract: KeyboardContract = {
  component: 'time-field',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/',
  sandbox: '/sandbox/time-field',
  hydrationSelector: `${HOST} [role="spinbutton"]`,
  cases: [
    {
      name: 'ArrowDown decrements the hour segment',
      focus: SEG_HOUR,
      press: 'ArrowDown',
      expect: [{ selector: SEG_HOUR, attribute: 'aria-valuenow', value: '8' }],
    },
    {
      name: 'ArrowUp increments the hour segment',
      focus: SEG_HOUR,
      press: 'ArrowUp',
      expect: [{ selector: SEG_HOUR, attribute: 'aria-valuenow', value: '10' }],
    },
    {
      name: 'ArrowRight moves focus to the next segment',
      focus: SEG_HOUR,
      press: 'ArrowRight',
      expect: [{ focused: SEG_MINUTE }],
    },
    {
      name: 'ArrowLeft from minute moves back to hour',
      focus: SEG_MINUTE,
      press: 'ArrowLeft',
      expect: [{ focused: SEG_HOUR }],
    },
    {
      name: 'Backspace clears the segment',
      focus: SEG_MINUTE,
      press: 'Backspace',
      expect: [{ selector: SEG_MINUTE, attribute: 'data-empty', value: '' }],
    },
    {
      name: 'Field group is labelled',
      focus: SEG_HOUR,
      press: 'Tab',
      expect: [{ selector: `${HOST} [role="group"]`, visible: true }],
    },
    {
      name: '12-hour cycle exposes a dayPeriod segment',
      url: '/sandbox/time-field?cycle=12',
      focus: `${HOST} [data-testid="seg-day-period"]`,
      press: 'Tab',
      expect: [
        {
          selector: `${HOST} [data-testid="seg-day-period"]`,
          attribute: 'aria-label',
          value: 'AM/PM',
        },
      ],
    },
  ],
};
