/**
 * APG keyboard contract for NumberField (spin button).
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/
 *
 * Sandbox at /sandbox/number-field has min=0, max=10, step=1, initial=5,
 * default pageStep=10. Tests verify ARIA value attributes after each press.
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const INPUT = '[data-testid="input"]';

export const numberFieldKeyboardContract: KeyboardContract = {
  component: 'number-field',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/',
  sandbox: '/sandbox/number-field',
  hydrationSelector: '[data-testid="input"][id^="kumiki-number-field-"]',
  cases: [
    {
      name: 'ArrowUp increments',
      focus: INPUT,
      press: 'ArrowUp',
      expect: [{ selector: INPUT, attribute: 'aria-valuenow', value: '6' }],
    },
    {
      name: 'ArrowDown decrements',
      focus: INPUT,
      press: 'ArrowDown',
      expect: [{ selector: INPUT, attribute: 'aria-valuenow', value: '4' }],
    },
    {
      name: 'PageUp uses pageStep (capped at max=10)',
      focus: INPUT,
      press: 'PageUp',
      expect: [{ selector: INPUT, attribute: 'aria-valuenow', value: '10' }],
    },
    {
      name: 'PageDown uses pageStep (capped at min=0)',
      focus: INPUT,
      press: 'PageDown',
      expect: [{ selector: INPUT, attribute: 'aria-valuenow', value: '0' }],
    },
    {
      name: 'Home jumps to min',
      focus: INPUT,
      press: 'Home',
      expect: [{ selector: INPUT, attribute: 'aria-valuenow', value: '0' }],
    },
    {
      name: 'End jumps to max',
      focus: INPUT,
      press: 'End',
      expect: [{ selector: INPUT, attribute: 'aria-valuenow', value: '10' }],
    },
  ],
};
