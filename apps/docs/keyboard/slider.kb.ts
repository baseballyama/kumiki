/**
 * APG keyboard contract for Slider.
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/slider/#keyboardinteraction
 *
 * Sandbox at /sandbox/slider has min=0, max=100, step=1, defaultValue=50,
 * pageStep=10. Tests verify ARIA value attributes after each press.
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const THUMB = '[data-testid="thumb"]';

export const sliderKeyboardContract: KeyboardContract = {
  component: 'slider',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/slider/',
  sandbox: '/sandbox/slider',
  hydrationSelector: '[data-testid="thumb"][id^="kumiki-slider-"]',
  cases: [
    {
      name: 'horizontal LTR: ArrowRight increments',
      focus: THUMB,
      press: 'ArrowRight',
      expect: [{ selector: THUMB, attribute: 'aria-valuenow', value: '51' }],
    },
    {
      name: 'horizontal LTR: ArrowLeft decrements',
      focus: THUMB,
      press: 'ArrowLeft',
      expect: [{ selector: THUMB, attribute: 'aria-valuenow', value: '49' }],
    },
    {
      name: 'horizontal RTL: ArrowLeft increments (inverted)',
      url: '/sandbox/slider?dir=rtl',
      focus: THUMB,
      press: 'ArrowLeft',
      expect: [{ selector: THUMB, attribute: 'aria-valuenow', value: '51' }],
    },
    {
      name: 'vertical: ArrowUp increments',
      url: '/sandbox/slider?orientation=vertical',
      focus: THUMB,
      press: 'ArrowUp',
      expect: [{ selector: THUMB, attribute: 'aria-valuenow', value: '51' }],
    },
    {
      name: 'PageUp uses pageStep (10)',
      focus: THUMB,
      press: 'PageUp',
      expect: [{ selector: THUMB, attribute: 'aria-valuenow', value: '60' }],
    },
    {
      name: 'PageDown uses pageStep (10)',
      focus: THUMB,
      press: 'PageDown',
      expect: [{ selector: THUMB, attribute: 'aria-valuenow', value: '40' }],
    },
    {
      name: 'Home jumps to min',
      focus: THUMB,
      press: 'Home',
      expect: [{ selector: THUMB, attribute: 'aria-valuenow', value: '0' }],
    },
    {
      name: 'End jumps to max',
      focus: THUMB,
      press: 'End',
      expect: [{ selector: THUMB, attribute: 'aria-valuenow', value: '100' }],
    },
  ],
};
