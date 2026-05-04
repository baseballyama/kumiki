/**
 * APG keyboard contract for Checkbox.
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/#keyboardinteraction
 *
 * Checkbox supports a single key — Space — which toggles the value.
 * Tri-state cycling is the responsibility of the parent (e.g. a "select
 * all" parent that programmatically sets `mixed`); user keyboard input
 * goes only between checked ↔ unchecked.
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const CHECKBOX = '[role="checkbox"]';

export const checkboxKeyboardContract: KeyboardContract = {
  component: 'checkbox',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/',
  sandbox: '/sandbox/checkbox',
  hydrationSelector: '[role="checkbox"][id^="kumiki-checkbox-"]',
  cases: [
    {
      name: 'Space on unchecked → checked',
      focus: CHECKBOX,
      press: ' ',
      expect: [{ selector: CHECKBOX, attribute: 'aria-checked', value: 'true' }],
    },
    {
      name: 'Space on checked → unchecked',
      focus: CHECKBOX,
      prelude: [' '],
      press: ' ',
      expect: [{ selector: CHECKBOX, attribute: 'aria-checked', value: 'false' }],
    },
  ],
};
