/**
 * APG keyboard contract for Toolbar.
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
 *
 * Roving tabindex coordinator. Horizontal: ArrowLeft / ArrowRight (RTL
 * inverted). Vertical: ArrowUp / ArrowDown. Home / End jump to first / last
 * enabled item. The toolbar exposes a single tab stop.
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const HOST = '[data-testid="toolbar-host"]';

export const toolbarKeyboardContract: KeyboardContract = {
  component: 'toolbar',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/',
  sandbox: '/sandbox/toolbar',
  hydrationSelector: `${HOST} button`,
  cases: [
    {
      name: 'Horizontal: ArrowRight moves to next item',
      focus: `${HOST} [data-testid="item-bold"]`,
      press: 'ArrowRight',
      expect: [{ focused: `${HOST} [data-testid="item-italic"]` }],
    },
    {
      name: 'Horizontal: ArrowLeft wraps to last item',
      focus: `${HOST} [data-testid="item-bold"]`,
      press: 'ArrowLeft',
      expect: [{ focused: `${HOST} [data-testid="item-link"]` }],
    },
    {
      name: 'Home jumps to first item',
      focus: `${HOST} [data-testid="item-link"]`,
      press: 'Home',
      expect: [{ focused: `${HOST} [data-testid="item-bold"]` }],
    },
    {
      name: 'End jumps to last item',
      focus: `${HOST} [data-testid="item-bold"]`,
      press: 'End',
      expect: [{ focused: `${HOST} [data-testid="item-link"]` }],
    },
    {
      name: 'Vertical: ArrowDown moves to next item',
      url: '/sandbox/toolbar?orientation=vertical',
      focus: `${HOST} [data-testid="item-bold"]`,
      press: 'ArrowDown',
      expect: [{ focused: `${HOST} [data-testid="item-italic"]` }],
    },
    {
      name: 'Vertical: ArrowUp moves to previous item (wraps)',
      url: '/sandbox/toolbar?orientation=vertical',
      focus: `${HOST} [data-testid="item-bold"]`,
      press: 'ArrowUp',
      expect: [{ focused: `${HOST} [data-testid="item-link"]` }],
    },
    {
      name: 'Enter activates the focused item',
      focus: `${HOST} [data-testid="item-bold"]`,
      press: 'Enter',
      expect: [{ selector: '[data-testid="log"] li', visible: true }],
    },
    {
      name: 'Toolbar exposes role="toolbar" + aria-label',
      focus: `${HOST} [data-testid="item-bold"]`,
      press: 'Tab',
      expect: [
        { selector: `${HOST} [role="toolbar"]`, attribute: 'aria-label', value: 'Editor actions' },
      ],
    },
  ],
};
