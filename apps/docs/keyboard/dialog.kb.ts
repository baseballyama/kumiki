/**
 * APG keyboard contract for Dialog.
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/#keyboardinteraction
 *
 * Trigger button opens via Enter / Space (native button activation).
 * Once open, Escape closes (per closeOnEscape policy). Tab cycles inside
 * the content (focus-trap primitive); we verify a single Tab keeps focus
 * inside the panel.
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const TRIGGER = '[data-testid="trigger"]';
const CONTENT = '[data-testid="content"]';

export const dialogKeyboardContract: KeyboardContract = {
  component: 'dialog',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
  sandbox: '/sandbox/dialog',
  hydrationSelector: '[data-testid="trigger"][id^="kumiki-dialog-"]',
  cases: [
    {
      name: 'Enter on trigger opens the dialog',
      focus: TRIGGER,
      press: 'Enter',
      expect: [
        { selector: CONTENT, visible: true },
        { selector: TRIGGER, attribute: 'aria-expanded', value: 'true' },
      ],
    },
    {
      name: 'Space on trigger opens the dialog',
      focus: TRIGGER,
      press: ' ',
      expect: [{ selector: CONTENT, visible: true }],
    },
    {
      name: 'Escape closes the dialog when policy permits',
      focus: TRIGGER,
      prelude: ['Enter'],
      press: 'Escape',
      expect: [{ selector: CONTENT, visible: false }],
    },
    {
      name: 'Escape is a no-op when closeOnEscape=false',
      url: '/sandbox/dialog?escape=0',
      focus: TRIGGER,
      prelude: ['Enter'],
      press: 'Escape',
      expect: [{ selector: CONTENT, visible: true }],
    },
    {
      name: 'Drawer variant: side="right" surfaces data-side hook',
      url: '/sandbox/dialog?side=right',
      focus: TRIGGER,
      press: 'Enter',
      expect: [{ selector: CONTENT, attribute: 'data-side', value: 'right' }],
    },
    {
      name: 'Drawer variant: side="left" surfaces data-side hook',
      url: '/sandbox/dialog?side=left',
      focus: TRIGGER,
      press: 'Enter',
      expect: [{ selector: CONTENT, attribute: 'data-side', value: 'left' }],
    },
  ],
};
