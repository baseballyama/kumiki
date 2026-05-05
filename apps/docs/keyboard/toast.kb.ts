/**
 * APG keyboard contract for Toast.
 *
 * Toast follows the WAI-ARIA Alert pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/alert/
 *
 * Toasts themselves are not focusable; the visible interactive surface
 * is the per-toast Close button (a native `<button>`). Native button
 * activation (Enter / Space) dismisses the toast.
 *
 * Sandbox /sandbox/toast has three "Add ..." buttons. The cases below
 * exercise the create path (Enter / Space on the Add button makes a
 * toast appear) and the dismiss path (focus the Add, prelude creates
 * the toast and Tabs into its Close button, then Enter dismisses it).
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const ADD_INFO = '[data-testid="add-info"]';
const TOAST = '[data-testid="toast"]';
const TOAST_CLOSE = '[data-testid="toast-close"]';

export const toastKeyboardContract: KeyboardContract = {
  component: 'toast',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/alert/',
  sandbox: '/sandbox/toast?duration=-1',
  cases: [
    {
      name: 'Enter on Add Info creates a visible toast',
      focus: ADD_INFO,
      press: 'Enter',
      expect: [{ selector: TOAST, visible: true }],
    },
    {
      name: 'Space on Add Info creates a visible toast',
      focus: ADD_INFO,
      press: ' ',
      expect: [{ selector: TOAST, visible: true }],
    },
    {
      name: 'Enter on the toast Close button dismisses it',
      // Prelude: Enter on Add (creates toast) → Tab × 4 lands on Close.
      // (Tab order: add-info → add-error → add-sticky → clear → toast-close.)
      focus: ADD_INFO,
      prelude: ['Enter', 'Tab', 'Tab', 'Tab', 'Tab'],
      press: 'Enter',
      expect: [{ selector: TOAST_CLOSE, visible: false }],
    },
  ],
};
