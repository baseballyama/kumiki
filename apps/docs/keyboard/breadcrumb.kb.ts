/**
 * APG keyboard contract for Breadcrumb.
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
 *
 * Breadcrumb has no APG-specified keyboard interactions — it's a `<nav>`
 * landmark of `<a>` links. The contract verifies the structural hooks SR
 * users rely on (`nav[aria-label]`, current page rendered with
 * `aria-current="page"` rather than as a link).
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const HOST = '[data-testid="breadcrumb-host"]';

export const breadcrumbKeyboardContract: KeyboardContract = {
  component: 'breadcrumb',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/',
  sandbox: '/sandbox/breadcrumb',
  cases: [
    {
      name: 'Tab moves focus from one link to the next',
      focus: `${HOST} [data-testid="link-home"]`,
      press: 'Tab',
      expect: [{ focused: `${HOST} [data-testid="link-products"]` }],
    },
    {
      name: 'Current item is rendered with aria-current="page" (no <a>)',
      focus: `${HOST} [data-testid="link-home"]`,
      press: 'Tab',
      expect: [{ selector: `${HOST} [aria-current="page"]`, visible: true }],
    },
  ],
};
