/**
 * APG keyboard contract for Select.
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/#keyboardinteraction
 *
 * Sandbox at /sandbox/select items:
 *   apple   (enabled, default null)
 *   banana  (disabled)
 *   cherry  (enabled)
 *   date    (enabled)
 *
 * Trigger button is the focusable element. Open via Enter / Space /
 * ArrowDown / ArrowUp / printable. Active descendant pattern: focus
 * stays on the trigger; aria-activedescendant points at the highlighted
 * option.
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const TRIGGER = '[data-testid="trigger"]';
const LISTBOX = '[data-testid="listbox"]';
const OPT = (v: string) => `[data-testid="opt-${v}"]`;

export const selectKeyboardContract: KeyboardContract = {
  component: 'select',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/',
  sandbox: '/sandbox/select',
  // Listbox id is painted by the attachment, not the SSR template.
  hydrationSelector: '[data-testid="listbox"][id^="kumiki-select-"]',
  cases: [
    {
      name: 'Enter on closed trigger opens the listbox',
      focus: TRIGGER,
      press: 'Enter',
      expect: [
        { selector: LISTBOX, visible: true },
        { selector: TRIGGER, attribute: 'aria-expanded', value: 'true' },
      ],
    },
    {
      name: 'ArrowDown on closed trigger opens the listbox',
      focus: TRIGGER,
      press: 'ArrowDown',
      expect: [{ selector: LISTBOX, visible: true }],
    },
    {
      name: 'Space on closed trigger opens',
      focus: TRIGGER,
      press: ' ',
      expect: [{ selector: LISTBOX, visible: true }],
    },
    {
      name: 'ArrowDown while open advances to next enabled (skip disabled)',
      focus: TRIGGER,
      prelude: ['Enter'], // open first
      press: 'ArrowDown',
      expect: [{ selector: OPT('cherry'), attribute: 'data-highlighted', value: '' }],
    },
    {
      name: 'Enter while open with highlight commits and closes',
      focus: TRIGGER,
      prelude: ['Enter', 'ArrowDown'], // open + advance to cherry
      press: 'Enter',
      expect: [
        { selector: LISTBOX, visible: false },
        { selector: TRIGGER, attribute: 'aria-expanded', value: 'false' },
      ],
    },
    {
      name: 'Escape while open closes',
      focus: TRIGGER,
      prelude: ['Enter'],
      press: 'Escape',
      expect: [{ selector: LISTBOX, visible: false }],
    },
    {
      name: 'Tab while open closes (focus advances naturally)',
      focus: TRIGGER,
      prelude: ['Enter'],
      press: 'Tab',
      expect: [{ selector: LISTBOX, visible: false }],
    },
    {
      name: 'Home while open jumps to first enabled',
      focus: TRIGGER,
      prelude: ['Enter', 'End'], // open + go to last
      press: 'Home',
      expect: [{ selector: OPT('apple'), attribute: 'data-highlighted', value: '' }],
    },
    {
      name: 'End while open jumps to last enabled',
      focus: TRIGGER,
      prelude: ['Enter'],
      press: 'End',
      expect: [{ selector: OPT('date'), attribute: 'data-highlighted', value: '' }],
    },
    {
      name: 'Type-ahead "c" highlights cherry',
      focus: TRIGGER,
      press: 'c',
      expect: [
        { selector: LISTBOX, visible: true },
        { selector: OPT('cherry'), attribute: 'data-highlighted', value: '' },
      ],
    },
  ],
};
