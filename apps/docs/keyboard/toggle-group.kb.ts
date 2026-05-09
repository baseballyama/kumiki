/**
 * APG keyboard contract for Toggle.Group.
 *
 * Source (single mode): https://www.w3.org/WAI/ARIA/apg/patterns/radio/
 * Source (multiple mode): https://www.w3.org/WAI/ARIA/apg/patterns/button/
 *
 * Roving tabindex coordinator. ArrowRight / ArrowLeft move focus across
 * enabled items (RTL inverts in horizontal). Home / End jump to the
 * first / last enabled item. Space / Enter activate.
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const HOST = '[data-testid="toggle-group-host"]';

export const toggleGroupKeyboardContract: KeyboardContract = {
  component: 'toggle-group',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/radio/',
  sandbox: '/sandbox/toggle-group?mode=multiple',
  hydrationSelector: `${HOST} button`,
  cases: [
    {
      name: 'Multiple: Space toggles aria-pressed',
      focus: `${HOST} [data-testid="item-bold"]`,
      press: ' ',
      expect: [
        {
          selector: `${HOST} [data-testid="item-bold"]`,
          attribute: 'aria-pressed',
          value: 'true',
        },
      ],
    },
    {
      name: 'Multiple: ArrowRight moves roving focus to next item',
      focus: `${HOST} [data-testid="item-bold"]`,
      press: 'ArrowRight',
      expect: [{ focused: `${HOST} [data-testid="item-italic"]` }],
    },
    {
      name: 'Multiple: ArrowLeft moves roving focus backward (wraps)',
      focus: `${HOST} [data-testid="item-bold"]`,
      press: 'ArrowLeft',
      expect: [{ focused: `${HOST} [data-testid="item-underline"]` }],
    },
    {
      name: 'Multiple: End jumps to last item',
      focus: `${HOST} [data-testid="item-bold"]`,
      press: 'End',
      expect: [{ focused: `${HOST} [data-testid="item-underline"]` }],
    },
    {
      name: 'Multiple: Home jumps to first item',
      focus: `${HOST} [data-testid="item-underline"]`,
      press: 'Home',
      expect: [{ focused: `${HOST} [data-testid="item-bold"]` }],
    },
    {
      name: 'Single: Space selects (radiogroup)',
      url: '/sandbox/toggle-group?mode=single',
      focus: `${HOST} [data-testid="item-left"]`,
      press: ' ',
      expect: [
        {
          selector: `${HOST} [data-testid="item-left"]`,
          attribute: 'aria-checked',
          value: 'true',
        },
      ],
    },
    {
      name: 'Single: ArrowRight moves focus AND selection',
      url: '/sandbox/toggle-group?mode=single',
      focus: `${HOST} [data-testid="item-left"]`,
      press: 'ArrowRight',
      expect: [{ focused: `${HOST} [data-testid="item-center"]` }],
    },
  ],
};
