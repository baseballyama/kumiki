/**
 * APG keyboard contract for Chips.
 *
 * - Static chip — no keyboard semantics (just a `<span>`).
 * - Dismissible chip — the Close button uses native button activation
 *   (Enter / Space) and is auto-labelled "Remove {label}".
 * - Selectable chip — `<button aria-pressed>`; Enter / Space toggle it
 *   (native button semantics).
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/button/#keyboardinteraction
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const CHIPS_HOST = '[data-testid="chips-host"]';

export const chipsKeyboardContract: KeyboardContract = {
  component: 'chips',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
  sandbox: '/sandbox/chips?variant=selectable',
  hydrationSelector: `${CHIPS_HOST} button`,
  cases: [
    {
      name: 'Selectable: Space toggles aria-pressed',
      url: '/sandbox/chips?variant=selectable',
      focus: `${CHIPS_HOST} button`,
      press: ' ',
      expect: [{ selector: `${CHIPS_HOST} button`, attribute: 'aria-pressed', value: 'true' }],
    },
    {
      name: 'Selectable: Enter toggles aria-pressed',
      url: '/sandbox/chips?variant=selectable',
      focus: `${CHIPS_HOST} button`,
      press: 'Enter',
      expect: [{ selector: `${CHIPS_HOST} button`, attribute: 'aria-pressed', value: 'true' }],
    },
    {
      name: 'Dismissible: Close has auto aria-label "Remove {label}"',
      url: '/sandbox/chips?variant=dismissible',
      focus: `${CHIPS_HOST} button[data-component-part="close"]`,
      press: 'Tab',
      expect: [
        {
          selector: `${CHIPS_HOST} button[data-component-part="close"]`,
          attribute: 'aria-label',
          value: 'Remove design',
        },
      ],
    },
  ],
};
