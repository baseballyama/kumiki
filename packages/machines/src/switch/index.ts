/**
 * `@kumiki/machines/switch` — pure-TS finite state machine for the Switch component.
 *
 * Identical state shape to Toggle, but the consumer-facing semantic is "on/off
 * setting" rather than "pressed/unpressed action button". The ARIA mapping
 * differs (`role="switch"` + `aria-checked`) and that lives in the attachment.
 *
 * @see docs/design/04-state-machines.md
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 */

import { defineMachine, type Machine } from '@kumiki/runtime';

// ─── Public types ─────────────────────────────────────────────────────────

/** All events the Switch machine can receive. */
export type SwitchEvent =
  | { type: 'TOGGLE' }
  | { type: 'SET'; checked: boolean }
  | { type: 'DISABLE' }
  | { type: 'ENABLE' };

export interface SwitchContext {
  /** Whether the switch is currently on. Mirrored as `aria-checked`. */
  checked: boolean;
  /** Number of user-initiated toggles since construction. */
  toggles: number;
}

export type SwitchState = 'off' | 'on' | 'disabled';

export type SwitchMachine = Machine<SwitchContext, SwitchEvent, SwitchState>;

export interface CreateSwitchInput {
  /** Initial checked value. Defaults to `false`. */
  initial?: boolean;
  /** Construct the machine in the disabled state. Defaults to `false`. */
  disabled?: boolean;
}

// ─── Machine ──────────────────────────────────────────────────────────────

const factory = /* @__PURE__ */ defineMachine<SwitchContext, SwitchEvent, SwitchState>({
  id: 'switch',
  initial: 'off',
  context: { checked: false, toggles: 0 },
  states: {
    off: {
      on: {
        TOGGLE: {
          target: 'on',
          actions: [
            { type: 'check', exec: (ctx) => ({ checked: true, toggles: ctx.toggles + 1 }) },
          ],
        },
        SET: {
          target: 'on',
          cond: (_, e) => e.type === 'SET' && e.checked === true,
          actions: [{ type: 'controlledCheck', exec: () => ({ checked: true }) }],
        },
        DISABLE: 'disabled',
      },
    },
    on: {
      on: {
        TOGGLE: {
          target: 'off',
          actions: [
            { type: 'uncheck', exec: (ctx) => ({ checked: false, toggles: ctx.toggles + 1 }) },
          ],
        },
        SET: {
          target: 'off',
          cond: (_, e) => e.type === 'SET' && e.checked === false,
          actions: [{ type: 'controlledUncheck', exec: () => ({ checked: false }) }],
        },
        DISABLE: 'disabled',
      },
    },
    disabled: {
      on: { ENABLE: 'off' },
    },
  },
});

/**
 * Construct a fresh Switch machine.
 *
 * @when-to-use For an on/off setting that immediately takes effect (e.g. dark
 *              mode, notifications). Use Toggle for a "pressed" command button
 *              and Checkbox for a form field.
 *
 * @anti-pattern Don't use Switch as a stand-in for a checkbox in a form — its
 *               ARIA role doesn't carry checkbox-group semantics.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 */
export function createSwitchMachine(input: CreateSwitchInput = {}): SwitchMachine {
  const initial = input.initial ?? false;
  const disabled = input.disabled ?? false;

  return factory({
    state: disabled ? 'disabled' : initial ? 'on' : 'off',
    context: { checked: initial, toggles: 0 },
  });
}
