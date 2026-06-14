/**
 * APG keyboard contract for IconButton.
 *
 * IconButton is a thin wrapper around Button (same APG button pattern); the
 * extra contract here is type-level (`aria-label` required) which we verify
 * by asserting the rendered button exposes a non-empty accessible name.
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/button/#keyboardinteraction
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const BUTTON = '[data-testid="icon-button-host"] button';

export const iconButtonKeyboardContract: KeyboardContract = {
  component: 'icon-button',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
  sandbox: '/sandbox/icon-button',
  // IconButton delegates to `createButton`, whose attachment paints
  // `id="kumiki-button-…"` on mount (the sandbox passes no id). The SSR
  // markup is a bare `<button>`, so this id is a true post-hydration
  // sentinel — waiting on the bare button raced the activation wiring.
  hydrationSelector: '[data-testid="icon-button-host"] button[id^="kumiki-button-"]',
  cases: [
    {
      name: 'IconButton has the required aria-label',
      focus: BUTTON,
      press: 'Enter',
      expect: [{ selector: BUTTON, attribute: 'aria-label', value: 'Close' }],
    },
    {
      name: 'IconButton sets data-icon-only',
      focus: BUTTON,
      press: 'Enter',
      expect: [{ selector: BUTTON, attribute: 'data-icon-only', value: '' }],
    },
    {
      name: 'Enter activates IconButton',
      focus: BUTTON,
      press: 'Enter',
      expect: [{ selector: '[data-testid="log"] li', visible: true }],
    },
    {
      name: 'Space activates IconButton',
      focus: BUTTON,
      press: ' ',
      expect: [{ selector: '[data-testid="log"] li', visible: true }],
    },
  ],
};
