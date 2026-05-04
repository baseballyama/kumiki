/**
 * `@kumiki/machine-dialog` — pure-TS FSM for Dialog.
 *
 * Models the open / closed lifecycle of a modal or non-modal dialog.
 * Behavior that needs DOM (focus trapping, outside-click detection, applying
 * `inert` to siblings, scroll lock) lives in the Layer 3 attachment — the
 * machine emits **intentions** through state, not side effects.
 *
 * Three policy flags shape what dismissal does:
 * - `modal`: when true the attachment paints `aria-modal="true"` and applies
 *   `inert` to background siblings. Doesn't change machine logic.
 * - `closeOnEscape`: ESCAPE event triggers CLOSE only when this is true.
 * - `closeOnOutsideClick`: OUTSIDE_CLICK event triggers CLOSE only when this
 *   is true.
 *
 * Per APG modal-dialog and non-modal-dialog patterns:
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog/
 */

import { defineMachine, type Machine } from '@kumiki/runtime';

export type DialogEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'SET.OPEN'; open: boolean }
  | { type: 'ESCAPE' }
  | { type: 'OUTSIDE_CLICK' }
  | { type: 'SET.MODAL'; modal: boolean }
  | { type: 'SET.CLOSE_ON_ESCAPE'; value: boolean }
  | { type: 'SET.CLOSE_ON_OUTSIDE_CLICK'; value: boolean };

export interface DialogContext {
  modal: boolean;
  closeOnEscape: boolean;
  closeOnOutsideClick: boolean;
}

export type DialogState = 'closed' | 'open';

export type DialogMachine = Machine<DialogContext, DialogEvent, DialogState>;

export interface CreateDialogInput {
  defaultOpen?: boolean;
  modal?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
}

/**
 * Construct a fresh Dialog machine.
 *
 * @when-to-use Modal forms, confirmation prompts, "more info" panels, sheets.
 *              Use `modal: true` for content that should block interaction
 *              with the rest of the page; `false` for sheets that overlay
 *              but allow interaction (e.g. Slack threads).
 *
 * @anti-pattern Don't use Dialog for transient announcements — use Toast or
 *               LiveRegion. Don't reuse one machine across multiple dialogs.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 */
export function createDialogMachine(input: CreateDialogInput = {}): DialogMachine {
  const defaultOpen = input.defaultOpen ?? false;
  const modal = input.modal ?? true;
  const closeOnEscape = input.closeOnEscape ?? true;
  const closeOnOutsideClick = input.closeOnOutsideClick ?? true;

  const factory = defineMachine<DialogContext, DialogEvent, DialogState>({
    id: 'dialog',
    initial: defaultOpen ? 'open' : 'closed',
    context: {
      modal,
      closeOnEscape,
      closeOnOutsideClick,
    },
    states: {
      closed: {
        on: {
          OPEN: 'open',
          TOGGLE: 'open',
          'SET.OPEN': [
            { target: 'open', cond: (_, e) => e.type === 'SET.OPEN' && e.open === true },
          ],
          'SET.MODAL': {
            actions: [
              {
                type: 'setModal',
                exec: (_, e) => {
                  if (e.type !== 'SET.MODAL') return;
                  return { modal: e.modal };
                },
              },
            ],
          },
          'SET.CLOSE_ON_ESCAPE': {
            actions: [
              {
                type: 'setCloseOnEscape',
                exec: (_, e) => {
                  if (e.type !== 'SET.CLOSE_ON_ESCAPE') return;
                  return { closeOnEscape: e.value };
                },
              },
            ],
          },
          'SET.CLOSE_ON_OUTSIDE_CLICK': {
            actions: [
              {
                type: 'setCloseOnOutsideClick',
                exec: (_, e) => {
                  if (e.type !== 'SET.CLOSE_ON_OUTSIDE_CLICK') return;
                  return { closeOnOutsideClick: e.value };
                },
              },
            ],
          },
        },
      },
      open: {
        on: {
          CLOSE: 'closed',
          TOGGLE: 'closed',
          'SET.OPEN': [
            { target: 'closed', cond: (_, e) => e.type === 'SET.OPEN' && e.open === false },
          ],
          ESCAPE: [{ target: 'closed', cond: (ctx) => ctx.closeOnEscape }],
          OUTSIDE_CLICK: [{ target: 'closed', cond: (ctx) => ctx.closeOnOutsideClick }],
          'SET.MODAL': {
            actions: [
              {
                type: 'setModal',
                exec: (_, e) => {
                  if (e.type !== 'SET.MODAL') return;
                  return { modal: e.modal };
                },
              },
            ],
          },
          'SET.CLOSE_ON_ESCAPE': {
            actions: [
              {
                type: 'setCloseOnEscape',
                exec: (_, e) => {
                  if (e.type !== 'SET.CLOSE_ON_ESCAPE') return;
                  return { closeOnEscape: e.value };
                },
              },
            ],
          },
          'SET.CLOSE_ON_OUTSIDE_CLICK': {
            actions: [
              {
                type: 'setCloseOnOutsideClick',
                exec: (_, e) => {
                  if (e.type !== 'SET.CLOSE_ON_OUTSIDE_CLICK') return;
                  return { closeOnOutsideClick: e.value };
                },
              },
            ],
          },
        },
      },
    },
  });

  return factory();
}
