/**
 * APG keyboard contract for Switch.
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/switch/#keyboardinteraction
 *
 * Same activation surface as a button: Space and Enter both toggle.
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const SWITCH = '[role="switch"]';

export const switchKeyboardContract: KeyboardContract = {
  component: 'switch',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/switch/',
  sandbox: '/sandbox/switch',
  hydrationSelector: '[role="switch"][id^="kumiki-switch-"]',
  cases: [
    {
      name: 'Space on Off → checked=true',
      focus: SWITCH,
      press: ' ',
      expect: [{ selector: SWITCH, attribute: 'aria-checked', value: 'true' }],
    },
    {
      name: 'Enter on Off → checked=true',
      focus: SWITCH,
      press: 'Enter',
      expect: [{ selector: SWITCH, attribute: 'aria-checked', value: 'true' }],
    },
  ],
};
