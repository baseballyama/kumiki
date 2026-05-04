/**
 * APG keyboard contract for Combobox.
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/#keyboardinteraction
 *
 * Sandbox at /sandbox/combobox uses 5 users (Alice, Bob, Carol, Dan, Eve).
 * The input is `role="combobox"`, the listbox is `role="listbox"`. Filter
 * is applied as the user types — typing 'b' narrows to ['Bob'].
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const INPUT = '[data-testid="combobox-host"] input[role="combobox"]';
const LISTBOX = '[data-testid="combobox-host"] ul[role="listbox"]';
const OPTION = (i: number) => `${LISTBOX} li[role="option"]:nth-of-type(${i})`;

export const comboboxKeyboardContract: KeyboardContract = {
  component: 'combobox',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/',
  sandbox: '/sandbox/combobox',
  hydrationSelector: '[data-testid="combobox-host"] ul[role="listbox"][id^="kumiki-combobox-"]',
  cases: [
    {
      name: 'ArrowDown on closed input opens the listbox',
      focus: INPUT,
      press: 'ArrowDown',
      expect: [
        { selector: LISTBOX, visible: true },
        { selector: INPUT, attribute: 'aria-expanded', value: 'true' },
      ],
    },
    {
      name: 'Escape on open listbox closes',
      focus: INPUT,
      prelude: ['ArrowDown'],
      press: 'Escape',
      expect: [{ selector: LISTBOX, visible: false }],
    },
    {
      name: 'ArrowDown advances to next option (active-descendant)',
      focus: INPUT,
      prelude: ['ArrowDown'], // open + highlight first
      press: 'ArrowDown',
      expect: [{ selector: OPTION(2), attribute: 'data-highlighted', value: 'true' }],
    },
    {
      name: 'Home jumps to first option while open',
      focus: INPUT,
      prelude: ['ArrowDown', 'End'],
      press: 'Home',
      expect: [{ selector: OPTION(1), attribute: 'data-highlighted', value: 'true' }],
    },
    {
      name: 'End jumps to last option while open',
      focus: INPUT,
      prelude: ['ArrowDown'],
      press: 'End',
      expect: [{ selector: OPTION(5), attribute: 'data-highlighted', value: 'true' }],
    },
    {
      name: 'Enter on highlighted option commits and closes',
      focus: INPUT,
      prelude: ['ArrowDown', 'ArrowDown'], // open + advance to Bob
      press: 'Enter',
      expect: [{ selector: LISTBOX, visible: false }],
    },
  ],
};
