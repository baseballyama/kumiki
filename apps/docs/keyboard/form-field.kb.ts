/**
 * APG keyboard contract for Form Field.
 *
 * Form Field has no component-specific keys — it uses native HTML input
 * semantics. The component-level interest is the side-effect chain:
 * blur → validation, type → editing, Tab → leaves the field. The harness
 * verifies blur-after-typing produces the expected `aria-invalid` / errors
 * surface from the controller.
 *
 * Sandbox /sandbox/form-field uses a sync validator that requires ≥3 chars.
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const INPUT = '[data-testid="input"]';
const ERRORS = '[data-testid="errors"]';

export const formFieldKeyboardContract: KeyboardContract = {
  component: 'form-field',
  apg: 'https://www.w3.org/WAI/ARIA/apg/practices/forms/',
  sandbox: '/sandbox/form-field',
  hydrationSelector: '[data-testid="input"][id^="kumiki-form-field-"]',
  cases: [
    {
      // Tab away from a touched-but-too-short input → validates → invalid.
      name: 'Tab after typing too-short value triggers blur-validation → invalid',
      focus: INPUT,
      // Pre-load 'ab' (under the 3-char minimum) before pressing Tab.
      prelude: ['a', 'b'],
      press: 'Tab',
      expect: [
        { selector: INPUT, attribute: 'aria-invalid', value: 'true' },
        { selector: ERRORS, visible: true },
      ],
    },
    {
      // Tab away from a valid input → no error visible.
      name: 'Tab after typing valid value → valid',
      focus: INPUT,
      prelude: ['a', 'b', 'c', 'd', 'e'],
      press: 'Tab',
      expect: [
        { selector: INPUT, attribute: 'aria-invalid', value: 'false' },
        { selector: ERRORS, visible: false },
      ],
    },
  ],
};
