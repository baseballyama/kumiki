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

export type RadioGroupEvent<V> =
  | { type: 'SELECT'; id: string }
  | { type: 'FOCUS'; id: string }
  | { type: 'BLUR' }
  | { type: 'NAVIGATE'; direction: NavigateDirection }
  | { type: 'SET.VALUE'; value: V | null }
  | { type: 'SET.ITEMS'; items: ReadonlyArray<RadioItem<V>> }
  | { type: 'DISABLE' }
  | { type: 'ENABLE' };

export interface RadioGroupContext<V> {
  items: ReadonlyArray<RadioItem<V>>;
  value: V | null;
  focusedId: string | null;
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
}

function idForValue<V>(items: ReadonlyArray<RadioItem<V>>, value: V | null): string | null {
  if (value === null) return null;
  return items.find((it) => it.value === value)?.id ?? null;
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

  const factory = defineMachine<RadioGroupContext<V>, RadioGroupEvent<V>, RadioGroupState>({
    id: 'radio-group',
    initial: disabled ? 'disabled' : 'idle',
    context: {
      items,
      value: defaultValue,
      focusedId: null,
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
                  // APG: focusing a radio also selects it.
                  return { focusedId: item.id, value: item.value };
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
                  const fromId = ctx.focusedId ?? idForValue(ctx.items, ctx.value);
                  const nextId = getNextEnabledId(ctx.items, fromId, e.direction, {
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
          'SET.ITEMS': {
            actions: [
              {
                type: 'setItems',
                exec: (ctx, e) => {
                  if (e.type !== 'SET.ITEMS') return;
                  const stillThere =
                    ctx.value !== null && e.items.some((it) => it.value === ctx.value);
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
