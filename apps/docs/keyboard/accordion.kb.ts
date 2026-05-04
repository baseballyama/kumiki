/**
 * APG keyboard contract for Accordion.
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/#keyboardinteraction
 *
 * Sandbox at /sandbox/accordion uses 4 items (general, billing, team, security).
 * Single mode by default. Triggers form a roving-tabindex set.
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
      name: 'ArrowDown moves focus to next enabled trigger (skip disabled)',
      focus: TRIGGER('general'),
      press: 'ArrowDown',
      expect: [{ focused: TRIGGER('team') }],
    },
    {
      name: 'ArrowUp moves focus to previous enabled trigger',
      focus: TRIGGER('team'),
      press: 'ArrowUp',
      expect: [{ focused: TRIGGER('general') }],
    },
    {
      name: 'Home jumps to first enabled trigger',
      focus: TRIGGER('security'),
      press: 'Home',
      expect: [{ focused: TRIGGER('general') }],
    },
    {
      name: 'End jumps to last enabled trigger',
      focus: TRIGGER('general'),
      press: 'End',
      expect: [{ focused: TRIGGER('security') }],
    },
  ],
};
