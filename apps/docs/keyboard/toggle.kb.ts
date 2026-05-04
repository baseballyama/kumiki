/**
 * APG keyboard contract for Toggle (button with `aria-pressed`).
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/button/#keyboardinteraction
 *
 * Toggle is a native button — Space and Enter both fire activation.
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const TOGGLE = '[data-testid="toggle-host"] button';

export const toggleKeyboardContract: KeyboardContract = {
  component: 'toggle',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
  sandbox: '/sandbox/toggle',
  hydrationSelector: '[data-testid="toggle-host"] button[id^="kumiki-toggle-"]',
  cases: [
    {
      name: 'Space on Off → pressed=true',
      focus: TOGGLE,
      press: ' ',
      expect: [{ selector: TOGGLE, attribute: 'aria-pressed', value: 'true' }],
    },
    {
      name: 'Enter on Off → pressed=true',
      focus: TOGGLE,
      press: 'Enter',
      expect: [{ selector: TOGGLE, attribute: 'aria-pressed', value: 'true' }],
    },
    {
      name: 'Space toggles Off → On → Off',
      focus: TOGGLE,
      prelude: [' '],
      press: ' ',
      expect: [{ selector: TOGGLE, attribute: 'aria-pressed', value: 'false' }],
    },
  ],
};
