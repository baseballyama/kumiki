/**
 * APG keyboard contract for Accordion.
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/#keyboardinteraction
 *
 * Sandbox at /sandbox/accordion uses 4 items (general, billing, team, security).
 * Single mode by default. Every trigger is in the page Tab sequence — APG
 * removed the optional Arrow / Home / End header navigation, so the
 * disabled (`aria-disabled`) billing trigger stays focusable.
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const TRIGGER = (v: string) => `[data-testid="trigger-${v}"]`;

export const accordionKeyboardContract: KeyboardContract = {
  component: 'accordion',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/accordion/',
  sandbox: '/sandbox/accordion',
  hydrationSelector: '[data-component-host="accordion"][id^="kumiki-accordion-"]',
  cases: [
    {
      name: 'Space on trigger toggles expanded',
      focus: TRIGGER('general'),
      press: 'Space',
      expect: [{ selector: TRIGGER('general'), attribute: 'aria-expanded', value: 'true' }],
    },
    {
      name: 'Enter on trigger toggles expanded',
      focus: TRIGGER('general'),
      press: 'Enter',
      expect: [{ selector: TRIGGER('general'), attribute: 'aria-expanded', value: 'true' }],
    },
    {
      name: 'Tab moves focus to the next trigger (all triggers tabbable)',
      focus: TRIGGER('general'),
      press: 'Tab',
      expect: [{ focused: TRIGGER('billing') }],
    },
    {
      name: 'Shift+Tab moves focus to the previous trigger',
      focus: TRIGGER('team'),
      press: 'Shift+Tab',
      expect: [{ focused: TRIGGER('billing') }],
    },
    {
      name: 'ArrowDown does not move focus between triggers',
      focus: TRIGGER('general'),
      press: 'ArrowDown',
      expect: [{ focused: TRIGGER('general') }],
    },
  ],
};
