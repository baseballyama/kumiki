/**
 * `@kumiki/machines/radio-group` — pure-TS finite state machine for RadioGroup.
 *
 * Models a group of mutually-exclusive items with **roving tabindex** focus
 * management. Per APG RadioGroup pattern, arrow keys move focus AND select
 * the focused item (select-on-focus). Tabbing into the group lands on the
 * *selected* item — or the first enabled item if no selection.
 *
 * Generic over the item value type `V`. Most consumers pass strings; richer
 * shapes work too as long as the value is referentially comparable.
 *
 * `direction` lives in the machine context. The Layer 3 attachment forwards the
 * *physical* arrow key via `NAVIGATE`; the machine resolves it to next/prev,
 * inverting the horizontal axis under RTL. This keeps RTL inversion in one
 * `toJSON`-visible place (the i18n bar in CLAUDE.md). The vertical axis
 * (ArrowUp/ArrowDown) is never inverted.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/radio/
 */

import { defineMachine, type Machine } from '@kumiki/runtime';
import {
  getNextEnabledId,
  type CollectionItem,
  type NavigateDirection,
} from '@kumiki/primitives/collection';

export interface RadioItem<V> extends CollectionItem {
  readonly id: string;
  readonly value: V;
  readonly label?: string;
  readonly disabled?: boolean;
}

export type RadioGroupDirection = 'ltr' | 'rtl';

/** A physical arrow key, forwarded verbatim from the keyboard. */
export type PhysicalArrowKey = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown';

/**
 * `NAVIGATE` carries *either* a logical direction (`first`/`last` — for
 * Home/End, direction-agnostic) *or* a physical arrow `key`, which the machine
 * resolves to next/prev using its own `direction` (RTL inverts the horizontal
 * axis).
 */
export type RadioGroupEvent<V> =
  | { type: 'SELECT'; id: string }
  | { type: 'FOCUS'; id: string }
  | { type: 'BLUR' }
  | { type: 'NAVIGATE'; direction: NavigateDirection }
  | { type: 'NAVIGATE'; key: PhysicalArrowKey }
  | { type: 'SET.VALUE'; value: V | null }
  | { type: 'SET.ITEMS'; items: ReadonlyArray<RadioItem<V>> }
  | { type: 'SET.DIRECTION'; direction: RadioGroupDirection }
  | { type: 'DISABLE' }
  | { type: 'ENABLE' };

export interface RadioGroupContext<V> {
  items: ReadonlyArray<RadioItem<V>>;
  value: V | null;
  focusedId: string | null;
  direction: RadioGroupDirection;
}

/**
 * Resolve a physical arrow key to a logical `next`/`prev` direction. The
 * vertical axis (ArrowDown=next, ArrowUp=prev) is never inverted; the
 * horizontal axis inverts under RTL. The single source of truth for RadioGroup
 * RTL inversion — used inside the machine's `NAVIGATE` action.
 */
function resolveArrow(key: PhysicalArrowKey, direction: RadioGroupDirection): 'next' | 'prev' {
  const next = key === 'ArrowDown' || key === (direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
  return next ? 'next' : 'prev';
}

export type RadioGroupState = 'idle' | 'disabled';

export type RadioGroupMachine<V> = Machine<
  RadioGroupContext<V>,
  RadioGroupEvent<V>,
  RadioGroupState
>;

export interface CreateRadioGroupInput<V> {
  items: ReadonlyArray<RadioItem<V>>;
  defaultValue?: V | null;
  disabled?: boolean;
  /** Whether arrow navigation wraps (default) or clamps. */
  navigation?: 'wrap' | 'clamp';
  /** Writing direction. Inverts horizontal arrows under `'rtl'`. */
  direction?: RadioGroupDirection;
}

/**
 * Reference equality (cheap path for primitives + stable refs), falling back
 * to a JSON-shape compare so Svelte 5's `$bindable` proxy (different
 * reference, same shape) still matches.
 */
const valueEquals = (a: unknown, b: unknown): boolean =>
  a === b || JSON.stringify(a) === JSON.stringify(b);

export function idForValue<V>(items: ReadonlyArray<RadioItem<V>>, value: V | null): string | null {
  if (value === null) return null;
  return items.find((it) => valueEquals(it.value, value))?.id ?? null;
}

/**
 * Construct a fresh RadioGroup machine.
 *
 * @when-to-use Mutually-exclusive option group with arrow-key navigation —
 *              survey ratings, payment method picker, theme picker. Use
 *              Combobox for free-text filtering, Select for popup semantics.
 *
 * @anti-pattern Don't model a single boolean as a RadioGroup of two items —
 *               use Checkbox or Switch. RadioGroup carries an "exactly one
 *               of N" affordance that's misleading for binary choices.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/radio/
 */
export function createRadioGroupMachine<V>(input: CreateRadioGroupInput<V>): RadioGroupMachine<V> {
  const items = input.items;
  const navigation = input.navigation ?? 'wrap';
  const defaultValue = input.defaultValue ?? null;
  const disabled = input.disabled ?? false;
  const direction = input.direction ?? 'ltr';

  const factory = defineMachine<RadioGroupContext<V>, RadioGroupEvent<V>, RadioGroupState>({
    id: 'radio-group',
    initial: disabled ? 'disabled' : 'idle',
    context: {
      items,
      value: defaultValue,
      focusedId: null,
      direction,
    },
    states: {
      idle: {
        on: {
          SELECT: {
            actions: [
              {
                type: 'select',
                exec: (ctx, e) => {
                  if (e.type !== 'SELECT') return;
                  const item = ctx.items.find((it) => it.id === e.id);
                  if (!item || item.disabled) return;
                  return { value: item.value, focusedId: item.id };
                },
              },
            ],
          },
          FOCUS: {
            actions: [
              {
                type: 'focus',
                exec: (ctx, e) => {
                  if (e.type !== 'FOCUS') return;
                  const item = ctx.items.find((it) => it.id === e.id);
                  if (!item || item.disabled) return;
                  // Focus moves the roving anchor only — it must NOT select.
                  // Tabbing into an unselected group would otherwise silently
                  // commit the first option (an APG violation + form mutation).
                  // Selection-follows-focus for arrow keys is handled by
                  // NAVIGATE; pointer/Space selection by SELECT.
                  return { focusedId: item.id };
                },
              },
            ],
          },
          BLUR: {
            actions: [{ type: 'blur', exec: () => ({ focusedId: null }) }],
          },
          NAVIGATE: {
            actions: [
              {
                type: 'navigate',
                exec: (ctx, e) => {
                  if (e.type !== 'NAVIGATE') return;
                  // Resolve the physical key using the machine's own direction
                  // (RTL inverts the horizontal axis). Home/End pass a logical
                  // direction directly.
                  const direction = 'key' in e ? resolveArrow(e.key, ctx.direction) : e.direction;
                  const fromId = ctx.focusedId ?? idForValue(ctx.items, ctx.value);
                  const nextId = getNextEnabledId(ctx.items, fromId, direction, {
                    mode: navigation,
                  });
                  if (nextId === null) return;
                  const next = ctx.items.find((it) => it.id === nextId);
                  if (!next) return;
                  // APG: arrow keys move focus AND select (select-on-focus).
                  return { focusedId: nextId, value: next.value };
                },
              },
            ],
          },
          'SET.VALUE': {
            actions: [
              {
                type: 'setValue',
                exec: (_, e) => {
                  if (e.type !== 'SET.VALUE') return;
                  return { value: e.value };
                },
              },
            ],
          },
          'SET.DIRECTION': {
            actions: [
              {
                type: 'setDirection',
                exec: (_, e) => {
                  if (e.type !== 'SET.DIRECTION') return;
                  return { direction: e.direction };
                },
              },
            ],
          },
          'SET.ITEMS': {
            actions: [
              {
                type: 'setItems',
                exec: (ctx, e) => {
                  if (e.type !== 'SET.ITEMS') return;
                  const stillThere =
                    ctx.value !== null &&
                    e.items.some((it) => valueEquals(it.value, ctx.value as V));
                  return {
                    items: e.items,
                    value: stillThere ? ctx.value : null,
                    focusedId:
                      ctx.focusedId !== null && e.items.some((it) => it.id === ctx.focusedId)
                        ? ctx.focusedId
                        : null,
                  };
                },
              },
            ],
          },
          DISABLE: 'disabled',
        },
      },
      disabled: {
        on: {
          ENABLE: 'idle',
        },
      },
    },
  });

  return factory();
}
