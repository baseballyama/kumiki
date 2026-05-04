/**
 * APG keyboard contract for Menu (single-level).
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/#keyboardinteraction
 *
 * Sandbox at /sandbox/menu has 6 items (one disabled, one separator).
 * Tests verify state transitions + active-descendant after each press.
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const TRIGGER = '[data-testid="trigger"]';
const MENU = '[data-testid="menu"]';
const NEW = '[data-testid="item-new"]';
const QUIT = '[data-testid="item-quit"]';

export const menuKeyboardContract: KeyboardContract = {
  component: 'menu',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/menubar/',
  sandbox: '/sandbox/menu',
  hydrationSelector: '[data-testid="trigger"][id^="kumiki-menu-"]',
  cases: [
    {
      name: 'Enter on trigger opens the menu and highlights first item',
      focus: TRIGGER,
      press: 'Enter',
      expect: [
        { selector: MENU, visible: true },
        { selector: TRIGGER, attribute: 'aria-expanded', value: 'true' },
        { selector: NEW, attribute: 'data-highlighted', value: '' },
      ],
    },
    {
      name: 'Space on trigger opens the menu',
      focus: TRIGGER,
      press: ' ',
      expect: [{ selector: MENU, visible: true }],
    },
    {
      name: 'ArrowDown on trigger opens with first highlighted',
      focus: TRIGGER,
      press: 'ArrowDown',
      expect: [
        { selector: MENU, visible: true },
        { selector: NEW, attribute: 'data-highlighted', value: '' },
      ],
    },
    {
      name: 'ArrowUp on trigger opens with last highlighted',
      focus: TRIGGER,
      press: 'ArrowUp',
      expect: [
        { selector: MENU, visible: true },
        { selector: QUIT, attribute: 'data-highlighted', value: '' },
      ],
    },
    {
      name: 'Escape closes the menu',
      focus: TRIGGER,
      prelude: ['Enter'],
      press: 'Escape',
      expect: [{ selector: MENU, visible: false }],
    },
    {
      name: 'Tab closes the menu (focus moves naturally)',
      focus: TRIGGER,
      prelude: ['Enter'],
      press: 'Tab',
      expect: [{ selector: MENU, visible: false }],
    },
  ],
};
