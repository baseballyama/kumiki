/**
 * APG keyboard contract for RadioGroup.
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/radio/#keyboardinteraction
 *
 * Sandbox at /sandbox/radio-group items:
 *   apple   (enabled, default null)
 *   banana  (disabled)
 *   cherry  (enabled)
 *   date    (enabled)
 *
 * APG: arrow keys move AND select (select-on-focus). Disabled items are
 * skipped. Both ArrowDown/Right (next) and ArrowUp/Left (prev) work
 * because RadioGroup defaults to vertical navigation (axis-agnostic).
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const RADIO = (value: string) => `[role="radio"][data-value="${value}"]`;

export const radioGroupKeyboardContract: KeyboardContract = {
  component: 'radio-group',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/radio/',
  sandbox: '/sandbox/radio-group',
  cases: [
    {
      name: 'ArrowDown from focused first → next enabled (skip disabled banana)',
      focus: RADIO('a'),
      press: 'ArrowDown',
      expect: [
        { focused: RADIO('c') },
        { selector: RADIO('c'), attribute: 'aria-checked', value: 'true' },
      ],
    },
    {
      name: 'ArrowRight equivalent to ArrowDown (axis-agnostic per APG)',
      focus: RADIO('a'),
      press: 'ArrowRight',
      expect: [{ focused: RADIO('c') }],
    },
    {
      name: 'ArrowUp from middle → previous enabled',
      focus: RADIO('c'),
      press: 'ArrowUp',
      expect: [{ focused: RADIO('a') }],
    },
    {
      name: 'ArrowDown from last wraps to first',
      focus: RADIO('d'),
      press: 'ArrowDown',
      expect: [{ focused: RADIO('a') }],
    },
    {
      name: 'Home jumps to first enabled',
      focus: RADIO('d'),
      press: 'Home',
      expect: [{ focused: RADIO('a') }],
    },
    {
      name: 'End jumps to last enabled',
      focus: RADIO('a'),
      press: 'End',
      expect: [{ focused: RADIO('d') }],
    },
    {
      name: 'Space on focused radio commits selection',
      focus: RADIO('c'),
      press: ' ',
      expect: [{ selector: RADIO('c'), attribute: 'aria-checked', value: 'true' }],
    },
    {
      name: 'Disabled radio cannot be focused via arrow',
      // Land on apple, then ArrowDown — banana (disabled) is skipped.
      focus: RADIO('a'),
      press: 'ArrowDown',
      expect: [{ focused: RADIO('c') }],
    },
  ],
};
