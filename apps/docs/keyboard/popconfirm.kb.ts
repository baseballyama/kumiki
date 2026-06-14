/**
 * APG keyboard contract for Popconfirm (Popover/with-confirm).
 *
 * Source: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
 *
 * Behaviour delta vs. Popover:
 * - Initial focus moves to **Cancel** on open (less-destructive default).
 * - Content is `role="alertdialog"` with `aria-describedby` wired to Message.
 * - Escape closes (per `closeOnEscape` policy).
 */

import type { KeyboardContract } from '../tests/keyboard/_harness.js';

const HOST = '[data-testid="popconfirm-host"]';
const TRIGGER = `${HOST} [data-testid="trigger"]`;
const CONTENT = `${HOST} [data-testid="content"]`;
const CANCEL = `${HOST} [data-testid="cancel"]`;
const CONFIRM = `${HOST} [data-testid="confirm"]`;

export const popconfirmKeyboardContract: KeyboardContract = {
  component: 'popconfirm',
  apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/',
  sandbox: '/sandbox/popconfirm',
  // The trigger gets its `id="kumiki-popover-…"` only after the attachment
  // runs, so this is a true post-hydration sentinel — keying before then
  // (the bare data-testid is in SSR) would race the keydown wiring.
  hydrationSelector: `${TRIGGER}[id^="kumiki-popover-"]`,
  cases: [
    {
      name: 'Enter on trigger opens the popconfirm',
      focus: TRIGGER,
      press: 'Enter',
      expect: [
        { selector: CONTENT, visible: true },
        { selector: CONTENT, attribute: 'role', value: 'alertdialog' },
      ],
    },
    {
      name: 'Initial focus lands on Cancel',
      focus: TRIGGER,
      press: 'Enter',
      expect: [{ focused: CANCEL }],
    },
    {
      name: 'Enter on Confirm fires onConfirm and closes',
      focus: TRIGGER,
      prelude: ['Enter', 'Tab'],
      press: 'Enter',
      expect: [
        { selector: CONTENT, visible: false },
        { selector: '[data-testid="log"] li:first-child', visible: true },
      ],
    },
    {
      name: 'Escape closes the popconfirm when policy permits',
      focus: TRIGGER,
      prelude: ['Enter'],
      press: 'Escape',
      expect: [{ selector: CONTENT, visible: false }],
    },
    {
      name: 'Escape is a no-op when closeOnEscape=false',
      url: '/sandbox/popconfirm?escape=0',
      focus: TRIGGER,
      prelude: ['Enter'],
      press: 'Escape',
      expect: [{ selector: CONTENT, visible: true }],
    },
    {
      name: 'Confirm/Cancel both have visible accessible names',
      focus: TRIGGER,
      prelude: ['Enter'],
      press: 'Tab',
      expect: [
        { selector: CONFIRM, visible: true },
        { selector: CANCEL, visible: true },
      ],
    },
  ],
};
