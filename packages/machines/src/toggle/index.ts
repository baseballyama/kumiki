/**
 * `@kumiki/machines/toggle` — pure-TS finite state machine for the Toggle component.
 *
 * Behavior matches the WAI-ARIA APG Button (toggle) pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/button/
 *
 * - Two visible states: `unpressed` and `pressed`.
 * - One administrative state: `disabled`. From `disabled`, only `ENABLE` returns
 *   the machine to a usable state (always `unpressed`, matching browser default).
 * - `TOGGLE` is the everyday event (Space / Enter / click); flips the value.
 * - `SET` is for controlled mode (parent component drives the value); guarded
 *   so an idempotent `SET` doesn't fire a transition.
 *
 * The machine is framework-agnostic. Layer 3 (`@kumiki/headless/toggle`)
 * binds it to Svelte runes; Layer 4 (`@kumiki/components/toggle`) wraps it in a
 * compound component.
 *
 * @see docs/components/toggle.md
 * @see docs/design/04-state-machines.md
 */

import { defineMachine, type Machine } from '@kumiki/runtime';

// ─── Public types ─────────────────────────────────────────────────────────

/** All events the Toggle machine can receive. */
export type ToggleEvent =
  | { type: 'TOGGLE' }
  | { type: 'SET'; pressed: boolean }
  | { type: 'DISABLE' }
  | { type: 'ENABLE' };

/** Reactive state surfaced to consumers. */
export interface ToggleContext {
  /** Whether the toggle is currently pressed. Mirrored as `aria-pressed`. */
  pressed: boolean;
  /**
   * Number of user-initiated toggles since construction. Useful for analytics
   * and for detecting infinite-loop bugs in test fixtures.
   */
  toggles: number;
}

/** State names the machine can be in. */
export type ToggleState = 'unpressed' | 'pressed' | 'disabled';

/** A running Toggle machine instance. */
export type ToggleMachine = Machine<ToggleContext, ToggleEvent, ToggleState>;

/** Construction input. */
export interface CreateToggleInput {
  /** Initial pressed value. Defaults to `false`. */
  initial?: boolean;
  /** Construct the machine in the disabled state. Defaults to `false`. */
  disabled?: boolean;
}

// ─── Machine ──────────────────────────────────────────────────────────────

const factory = /* @__PURE__ */ defineMachine<ToggleContext, ToggleEvent, ToggleState>({
  id: 'toggle',
  initial: 'unpressed',
  context: { pressed: false, toggles: 0 },
  states: {
    unpressed: {
      on: {
        TOGGLE: {
          target: 'pressed',
          actions: [
            { type: 'press', exec: (ctx) => ({ pressed: true, toggles: ctx.toggles + 1 }) },
          ],
        },
        SET: {
          target: 'pressed',
          // Only transition when the controlled value actually changes.
          cond: (_, e) => e.type === 'SET' && e.pressed === true,
          actions: [{ type: 'controlledPress', exec: () => ({ pressed: true }) }],
        },
        DISABLE: 'disabled',
      },
    },
    pressed: {
      on: {
        TOGGLE: {
          target: 'unpressed',
          actions: [
            { type: 'release', exec: (ctx) => ({ pressed: false, toggles: ctx.toggles + 1 }) },
          ],
        },
        SET: {
          target: 'unpressed',
          cond: (_, e) => e.type === 'SET' && e.pressed === false,
          actions: [{ type: 'controlledRelease', exec: () => ({ pressed: false }) }],
        },
        DISABLE: 'disabled',
      },
    },
    disabled: {
      // From `disabled`, the only transition is `ENABLE`. `TOGGLE` and `SET`
      // are intentionally no-ops — disabled toggles must not respond to input.
      on: {
        ENABLE: 'unpressed',
      },
    },
  },
});

/**
 * Construct a fresh Toggle machine.
 *
 * @when-to-use Tests, custom integrations, or whenever you need toggle logic
 *              without the Svelte adapter.
 *
 * @anti-pattern Don't share a single machine instance between two `<Toggle>`
 *               components — each component owns its machine. Two simultaneous
 *               `subscribe` calls is fine; two simultaneous `send` callers is
 *               not (the machine is synchronous and not re-entrant).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */
export function createToggleMachine(input: CreateToggleInput = {}): ToggleMachine {
  const initial = input.initial ?? false;
  const disabled = input.disabled ?? false;

  return factory({
    state: disabled ? 'disabled' : initial ? 'pressed' : 'unpressed',
    context: { pressed: initial, toggles: 0 },
  });
}
