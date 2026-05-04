/**
 * APG keyboard contract for Tabs.
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/#keyboardinteraction
 *
 * The Tabs sandbox at /sandbox/tabs uses these items:
 *   account  (enabled, default value)
 *   billing  (disabled)
 *   team     (enabled)
 *   security (enabled)
 *
 * In automatic activation (default), arrow keys activate as they navigate.
 * In manual activation (?activation=manual), arrows move focus only;
 * Enter/Space commits the selection.
 *
 * Each Tab attachment paints `data-value`; we anchor selectors on it so
 * the contract is robust against svelte hydration markers and sibling
 * re-ordering.
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const TAB = (value: string) => `[role="tab"][data-value="${value}"]`;
const ACCOUNT = TAB('account');
const TEAM = TAB('team');
const SECURITY = TAB('security');

export const tabsKeyboardContract: KeyboardContract = {
  component: 'tabs',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/',
  sandbox: '/sandbox/tabs',
  cases: [
    {
      name: 'ArrowRight from first tab → next enabled tab (skip disabled)',
      focus: ACCOUNT,
      press: 'ArrowRight',
      expect: [{ focused: TEAM }, { selector: TEAM, attribute: 'aria-selected', value: 'true' }],
    },
    {
      name: 'ArrowLeft from first tab wraps to last enabled tab',
      focus: ACCOUNT,
      press: 'ArrowLeft',
      expect: [{ focused: SECURITY }],
    },
    {
      name: 'ArrowRight from last tab wraps to first',
      focus: SECURITY,
      press: 'ArrowRight',
      expect: [{ focused: ACCOUNT }],
    },
    {
      name: 'Home jumps to first enabled tab',
      focus: SECURITY,
      press: 'Home',
      expect: [{ focused: ACCOUNT }],
    },
    {
      name: 'End jumps to last enabled tab',
      focus: ACCOUNT,
      press: 'End',
      expect: [{ focused: SECURITY }],
    },
    // RTL inversion — horizontal arrows are flipped.
    {
      name: 'RTL: ArrowLeft is the next-direction key',
      url: '/sandbox/tabs?dir=rtl',
      focus: ACCOUNT,
      press: 'ArrowLeft',
      expect: [{ focused: TEAM }],
    },
    {
      name: 'RTL: ArrowRight is the prev-direction key',
      url: '/sandbox/tabs?dir=rtl',
      focus: ACCOUNT,
      press: 'ArrowRight',
      expect: [{ focused: SECURITY }],
    },
    // Vertical orientation — ArrowUp/Down navigate; horizontal arrows ignored.
    {
      name: 'Vertical: ArrowDown advances to next enabled',
      url: '/sandbox/tabs?orientation=vertical',
      focus: ACCOUNT,
      press: 'ArrowDown',
      expect: [{ focused: TEAM }],
    },
    {
      name: 'Vertical: ArrowRight is a no-op (no horizontal nav)',
      url: '/sandbox/tabs?orientation=vertical',
      focus: ACCOUNT,
      press: 'ArrowRight',
      expect: [{ focused: ACCOUNT }],
    },
    // Manual activation — arrows move focus, Enter commits.
    {
      name: 'Manual: ArrowRight moves focus but does not change value',
      url: '/sandbox/tabs?activation=manual',
      focus: ACCOUNT,
      press: 'ArrowRight',
      expect: [{ focused: TEAM }, { selector: ACCOUNT, attribute: 'aria-selected', value: 'true' }],
    },
    {
      name: 'Manual: Enter on focused tab commits the selection',
      url: '/sandbox/tabs?activation=manual',
      focus: ACCOUNT,
      prelude: ['ArrowRight'], // move focus to "team"
      press: 'Enter',
      expect: [{ selector: TEAM, attribute: 'aria-selected', value: 'true' }],
    },
  ],
};
