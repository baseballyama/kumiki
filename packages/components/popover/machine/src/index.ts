/**
 * `@kumiki/machine-popover` — pure-TS FSM for Popover.
 *
 * Models the open / closed lifecycle of a non-modal popover. DOM concerns
 * — anchor positioning, focus management on open/close, outside-click
 * detection, ESC capture — live in the Layer 3 attachment; this machine
 * emits intentions through state, not side effects.
 *
 * Two policy flags shape what dismissal does:
 * - `closeOnEscape`: ESCAPE event triggers CLOSE only when this is true.
 * - `closeOnOutsideClick`: OUTSIDE_CLICK event triggers CLOSE only when
 *   this is true.
 *
 * Popover is **non-modal** — there is no `modal` flag. If you want a
 * modal, use Dialog. If you want hover-driven disclosure, use Tooltip.
 */

import { defineMachine, type Machine } from '@kumiki/runtime';

export type PopoverEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'SET.OPEN'; open: boolean }
  | { type: 'ESCAPE' }
  | { type: 'OUTSIDE_CLICK' }
  | { type: 'SET.CLOSE_ON_ESCAPE'; value: boolean }
  | { type: 'SET.CLOSE_ON_OUTSIDE_CLICK'; value: boolean };

export interface PopoverContext {
  closeOnEscape: boolean;
  closeOnOutsideClick: boolean;
}

export type PopoverState = 'closed' | 'open';

export type PopoverMachine = Machine<PopoverContext, PopoverEvent, PopoverState>;

export interface CreatePopoverInput {
  defaultOpen?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
}

/**
 * Construct a fresh Popover machine.
 *
 * @when-to-use Click-anchored auxiliary content — date pickers, color
 *              swatches, "more options" panels, share menus. The trigger
 *              gets `aria-expanded` / `aria-controls`; content is a
 *              labeled region (or `role="dialog"` if you prefer).
 *
 * @anti-pattern Don't use Popover for modal interruptions (use Dialog),
 *               for hover-only disclosure (use Tooltip), or for selecting
 *               one of N options (use Select / Combobox / Menu).
 */
export function createPopoverMachine(input: CreatePopoverInput = {}): PopoverMachine {
  const defaultOpen = input.defaultOpen ?? false;
  const closeOnEscape = input.closeOnEscape ?? true;
  const closeOnOutsideClick = input.closeOnOutsideClick ?? true;

  const factory = defineMachine<PopoverContext, PopoverEvent, PopoverState>({
    id: 'popover',
    initial: defaultOpen ? 'open' : 'closed',
    context: { closeOnEscape, closeOnOutsideClick },
    states: {
      closed: {
        on: {
          OPEN: 'open',
          TOGGLE: 'open',
          'SET.OPEN': [
            { target: 'open', cond: (_, e) => e.type === 'SET.OPEN' && e.open === true },
          ],
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
