/**
 * APG keyboard contract for Tooltip.
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/#keyboardinteraction
 *
 * Tooltip opens on focus + closes on Escape. The sandbox uses 0 ms delays
 * so we don't have to spin on timers in the harness.
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const TRIGGER = '[data-testid="trigger"]';
const CONTENT = '[data-testid="content"]';

export const tooltipKeyboardContract: KeyboardContract = {
  component: 'tooltip',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/',
  sandbox: '/sandbox/tooltip',
  cases: [
    {
      name: 'Escape closes a focused tooltip',
      focus: TRIGGER,
      // Focus → opens (sandbox uses 0 ms delay). Escape → closes.
      press: 'Escape',
      expect: [{ selector: CONTENT, visible: false }],
    },
  ],
};
