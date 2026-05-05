/**
 * `@kumiki/machines/tooltip` — pure-TS FSM for Tooltip.
 *
 * Models the open / closed lifecycle of an APG tooltip. The **timing**
 * (openDelay / closeDelay) is described as data in context but the timers
 * themselves run in the Layer 3 attachment, which schedules debounced OPEN
 * and CLOSE dispatches. Keeping setTimeout out of the machine lets the
 * machine import in Node and stay deterministic in tests.
 *
 * `prefers-reduced-motion` handling lives entirely in the attachment too —
 * it ignores delays when the media query matches.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
 */

import { defineMachine, type Machine } from '@kumiki/runtime';

export type TooltipEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'SET.OPEN'; open: boolean }
  | { type: 'ESCAPE' }
  | { type: 'SET.OPEN_DELAY'; ms: number }
  | { type: 'SET.CLOSE_DELAY'; ms: number }
  | { type: 'SET.DISABLE_HOVERABLE_CONTENT'; value: boolean };

export interface TooltipContext {
  /** Milliseconds before the tooltip appears after pointer-enter / focus. */
  openDelay: number;
  /** Milliseconds before the tooltip disappears after pointer-leave / blur. */
  closeDelay: number;
  /**
   * When true, leaving the trigger always closes — pointer-entering the
   * tooltip content does NOT keep it open. Useful when the content is
   * decorative-only and shouldn't be a hit target.
   */
  disableHoverableContent: boolean;
}

export type TooltipState = 'closed' | 'open';

export type TooltipMachine = Machine<TooltipContext, TooltipEvent, TooltipState>;

export interface CreateTooltipInput {
  defaultOpen?: boolean;
  /** Default 700 ms (matches macOS / Chrome devtools default tooltip lag). */
  openDelay?: number;
  /** Default 300 ms (short, but enough for trigger → content pointer transit). */
  closeDelay?: number;
  disableHoverableContent?: boolean;
}

const DEFAULT_OPEN_DELAY = 700;
const DEFAULT_CLOSE_DELAY = 300;

/**
 * Construct a fresh Tooltip machine.
 *
 * @when-to-use Brief, supplemental hints attached to a focused/hovered
 *              control — keyboard shortcuts, icon-button labels, terse
 *              definitions. The trigger MUST already be focusable; tooltip
 *              is a hint, not a primary affordance.
 *
 * @anti-pattern Don't put interactive content inside a tooltip — that's
 *               Popover / Dialog territory. APG explicitly forbids it.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
 */
export function createTooltipMachine(input: CreateTooltipInput = {}): TooltipMachine {
  const factory = defineMachine<TooltipContext, TooltipEvent, TooltipState>({
    id: 'tooltip',
    initial: input.defaultOpen ? 'open' : 'closed',
    context: {
      openDelay: input.openDelay ?? DEFAULT_OPEN_DELAY,
      closeDelay: input.closeDelay ?? DEFAULT_CLOSE_DELAY,
      disableHoverableContent: input.disableHoverableContent ?? false,
    },
    states: {
      closed: {
        on: {
          OPEN: 'open',
          TOGGLE: 'open',
          'SET.OPEN': [
            { target: 'open', cond: (_, e) => e.type === 'SET.OPEN' && e.open === true },
          ],
          'SET.OPEN_DELAY': {
            actions: [
              {
                type: 'setOpenDelay',
                exec: (_, e) => {
                  if (e.type !== 'SET.OPEN_DELAY') return;
                  return { openDelay: e.ms };
                },
              },
            ],
          },
          'SET.CLOSE_DELAY': {
            actions: [
              {
                type: 'setCloseDelay',
                exec: (_, e) => {
                  if (e.type !== 'SET.CLOSE_DELAY') return;
                  return { closeDelay: e.ms };
                },
              },
            ],
          },
          'SET.DISABLE_HOVERABLE_CONTENT': {
            actions: [
              {
                type: 'setDisableHoverableContent',
                exec: (_, e) => {
                  if (e.type !== 'SET.DISABLE_HOVERABLE_CONTENT') return;
                  return { disableHoverableContent: e.value };
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
          ESCAPE: 'closed',
          'SET.OPEN': [
            { target: 'closed', cond: (_, e) => e.type === 'SET.OPEN' && e.open === false },
          ],
          'SET.OPEN_DELAY': {
            actions: [
              {
                type: 'setOpenDelay',
                exec: (_, e) => {
                  if (e.type !== 'SET.OPEN_DELAY') return;
                  return { openDelay: e.ms };
                },
              },
            ],
          },
          'SET.CLOSE_DELAY': {
            actions: [
              {
                type: 'setCloseDelay',
                exec: (_, e) => {
                  if (e.type !== 'SET.CLOSE_DELAY') return;
                  return { closeDelay: e.ms };
                },
              },
            ],
          },
          'SET.DISABLE_HOVERABLE_CONTENT': {
            actions: [
              {
                type: 'setDisableHoverableContent',
                exec: (_, e) => {
                  if (e.type !== 'SET.DISABLE_HOVERABLE_CONTENT') return;
                  return { disableHoverableContent: e.value };
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
