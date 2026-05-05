/**
 * APG keyboard contract for Popover (non-modal dialog).
 *
 * APG doesn't ship a standalone "popover" pattern — the closest fit is
 * Disclosure, which describes the Enter/Space activation cycle and how
 * a triggered widget can be dismissed. We anchor the snapshot there.
 *
 * Trigger button opens via Enter / Space (native button activation).
 * Once open, Escape closes (per closeOnEscape policy). Unlike a modal
 * dialog, focus is NOT trapped — Tab can move out of the popover.
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const TRIGGER = '[data-testid="trigger"]';
const CONTENT = '[data-testid="content"]';

export const popoverKeyboardContract: KeyboardContract = {
  component: 'popover',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/',
  sandbox: '/sandbox/popover',
  hydrationSelector: '[data-testid="trigger"][id^="kumiki-popover-"]',
  cases: [
    {
      name: 'Enter on trigger opens the popover',
      focus: TRIGGER,
      press: 'Enter',
      expect: [
        { selector: CONTENT, visible: true },
        { selector: TRIGGER, attribute: 'aria-expanded', value: 'true' },
      ],
    },
    {
      name: 'Space on trigger opens the popover',
      focus: TRIGGER,
      press: ' ',
      expect: [{ selector: CONTENT, visible: true }],
    },
    {
      name: 'Escape closes the popover when policy permits',
      focus: TRIGGER,
      prelude: ['Enter'],
      press: 'Escape',
      expect: [{ selector: CONTENT, visible: false }],
    },
    {
      name: 'Escape is a no-op when closeOnEscape=false',
      url: '/sandbox/popover?escape=0',
      focus: TRIGGER,
      prelude: ['Enter'],
      press: 'Escape',
      expect: [{ selector: CONTENT, visible: true }],
    },
  ],
};
