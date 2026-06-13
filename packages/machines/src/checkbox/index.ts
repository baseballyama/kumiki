/**
 * `@kumiki/machines/checkbox` — pure-TS finite state machine for the Checkbox.
 *
 * Tri-state: `unchecked` / `checked` / `mixed` (rendered as `aria-checked="mixed"`,
 * the indeterminate state). Distinct from Toggle/Switch which are strictly
 * binary. The "mixed" state is administrative: clicking always transitions to
 * `checked` — APG explicitly says toggling out of `mixed` lands on a definite
 * state, never cycles `mixed → unchecked → checked → mixed`.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/checkbox-tristate/
 */

import { defineMachine, type Machine } from '@kumiki/runtime';

/** The visible value. `'mixed'` = indeterminate (parent w/ partly-checked children). */
export type CheckboxValue = 'unchecked' | 'checked' | 'mixed';

export type CheckboxEvent =
  | { type: 'TOGGLE' }
  | { type: 'SET'; value: CheckboxValue }
  | { type: 'DISABLE' }
  | { type: 'ENABLE' };

export interface CheckboxContext {
  /** Mirrored as `aria-checked` ("true" / "false" / "mixed"). */
  value: CheckboxValue;
  /** Number of user-initiated toggles since construction. */
  toggles: number;
}

export type CheckboxState = 'unchecked' | 'checked' | 'mixed' | 'disabled';

export type CheckboxMachine = Machine<CheckboxContext, CheckboxEvent, CheckboxState>;

export interface CreateCheckboxInput {
  initial?: CheckboxValue;
  disabled?: boolean;
}

const factory = /* @__PURE__ */ defineMachine<CheckboxContext, CheckboxEvent, CheckboxState>({
  id: 'checkbox',
  initial: 'unchecked',
  context: { value: 'unchecked', toggles: 0 },
  states: {
    unchecked: {
      on: {
        TOGGLE: {
          target: 'checked',
          actions: [
            { type: 'check', exec: (ctx) => ({ value: 'checked', toggles: ctx.toggles + 1 }) },
          ],
        },
        SET: [
          {
            target: 'checked',
            cond: (_, e) => e.type === 'SET' && e.value === 'checked',
            actions: [{ type: 'controlledCheck', exec: () => ({ value: 'checked' as const }) }],
          },
          {
            target: 'mixed',
            cond: (_, e) => e.type === 'SET' && e.value === 'mixed',
            actions: [{ type: 'controlledMix', exec: () => ({ value: 'mixed' as const }) }],
          },
        ],
        DISABLE: 'disabled',
      },
    },
    checked: {
      on: {
        TOGGLE: {
          target: 'unchecked',
          actions: [
            { type: 'uncheck', exec: (ctx) => ({ value: 'unchecked', toggles: ctx.toggles + 1 }) },
          ],
        },
        SET: [
          {
            target: 'unchecked',
            cond: (_, e) => e.type === 'SET' && e.value === 'unchecked',
            actions: [{ type: 'controlledUncheck', exec: () => ({ value: 'unchecked' as const }) }],
          },
          {
            target: 'mixed',
            cond: (_, e) => e.type === 'SET' && e.value === 'mixed',
            actions: [{ type: 'controlledMix', exec: () => ({ value: 'mixed' as const }) }],
          },
        ],
        DISABLE: 'disabled',
      },
    },
    mixed: {
      // Toggling out of `mixed` lands on `checked` per APG tristate guidance.
      on: {
        TOGGLE: {
          target: 'checked',
          actions: [
            { type: 'check', exec: (ctx) => ({ value: 'checked', toggles: ctx.toggles + 1 }) },
          ],
        },
        SET: [
          {
            target: 'checked',
            cond: (_, e) => e.type === 'SET' && e.value === 'checked',
            actions: [{ type: 'controlledCheck', exec: () => ({ value: 'checked' as const }) }],
          },
          {
            target: 'unchecked',
            cond: (_, e) => e.type === 'SET' && e.value === 'unchecked',
            actions: [{ type: 'controlledUncheck', exec: () => ({ value: 'unchecked' as const }) }],
          },
        ],
        DISABLE: 'disabled',
      },
    },
    disabled: {
      // Re-enable restores the visible state matching the preserved `value` so
      // disable→enable never silently changes it.
      on: {
        ENABLE: [
          { target: 'checked', cond: (ctx) => ctx.value === 'checked' },
          { target: 'mixed', cond: (ctx) => ctx.value === 'mixed' },
          { target: 'unchecked' },
        ],
      },
    },
  },
});

/**
 * Construct a fresh Checkbox machine.
 *
 * @when-to-use For a form-level boolean (or tri-state) field. Use
 *              `@kumiki/components/switch` for an immediate-effect setting and
 *              `@kumiki/components/toggle` for a "pressed button" command.
 *
 * @anti-pattern Don't transition into `'mixed'` from user interaction — `'mixed'`
 *               is set programmatically by the controller (e.g. parent of a
 *               group with partly-selected children). User clicks always
 *               commit to a definite value.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
 */
export function createCheckboxMachine(input: CreateCheckboxInput = {}): CheckboxMachine {
  const initial = input.initial ?? 'unchecked';
  const disabled = input.disabled ?? false;
  return factory({
    state: disabled ? 'disabled' : initial,
    context: { value: initial, toggles: 0 },
  });
}
