/**
 * APG keyboard contract for Button.
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/button/#keyboardinteraction
 *
 * Native `<button>` activation: Space and Enter both fire `onclick`. Disabled
 * buttons receive no synthetic activation. Loading buttons keep their name
 * but are inert (aria-busy="true"); we don't try to assert a click happened
 * since the suppression is up to the consumer's `onclick`.
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const BUTTON = '[data-testid="button-host"] button';
const LOG_FIRST = '[data-testid="log"] li';

export const buttonKeyboardContract: KeyboardContract = {
  component: 'button',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
  sandbox: '/sandbox/button',
  // `createButton`'s attachment paints `id="kumiki-button-…"` on mount (only
  // when the host has no id — the sandbox passes none). The SSR markup has a
  // bare `<button>` with no id, so this is a true post-hydration sentinel:
  // waiting on the bare button raced the capture-phase keydown/click wiring.
  hydrationSelector: '[data-testid="button-host"] button[id^="kumiki-button-"]',
  cases: [
    {
      name: 'Enter activates the button',
      focus: BUTTON,
      press: 'Enter',
      expect: [{ selector: LOG_FIRST, visible: true }],
    },
    {
      name: 'Space activates the button',
      focus: BUTTON,
      press: ' ',
      expect: [{ selector: LOG_FIRST, visible: true }],
    },
    {
      name: 'Disabled button keeps aria-disabled true',
      url: '/sandbox/button?disabled=1',
      focus: BUTTON,
      press: 'Enter',
      expect: [{ selector: BUTTON, attribute: 'aria-disabled', value: 'true' }],
    },
    {
      name: 'Loading button keeps aria-busy true',
      url: '/sandbox/button?loading=1',
      focus: BUTTON,
      press: 'Enter',
      expect: [{ selector: BUTTON, attribute: 'aria-busy', value: 'true' }],
    },
  ],
};
