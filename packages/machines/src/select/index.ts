/**
 * `@kumiki/machines/select` — pure-TS FSM for Select.
 *
 * "Combobox without free-text input": a button trigger that pops up a
 * listbox with one option selected at a time. Generic over the option
 * value type `V`.
 *
 * Compared to Combobox, Select drops:
 * - The text input + `inputValue` filtering state.
 * - Async fetch + race-token guarding.
 * - Free-text commit (no `creatable: true` analogue).
 *
 * What stays the same:
 * - open / closed state with the same OPEN / CLOSE / TOGGLE / ESCAPE shape
 * - `highlightedId` cursor inside the open listbox
 * - Arrow / Home / End navigation through enabled items
 * - Type-ahead jumping by item label
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/  (combobox-with-listbox)
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/listbox/   (Select-only)
 */

import { defineMachine, type Machine } from '@kumiki/runtime';
import {
  findByTypeAhead,
  getNextEnabledId,
  type CollectionItem,
  type NavigateDirection,
} from '@kumiki/primitives/collection';

export interface SelectItem<V> extends CollectionItem {
  readonly id: string;
  readonly value: V;
  readonly label?: string;
  readonly disabled?: boolean;
}

export type SelectEvent<V> =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'ESCAPE' }
  | { type: 'SELECT'; id: string }
  | { type: 'HIGHLIGHT'; id: string | null }
  | { type: 'NAVIGATE'; direction: NavigateDirection }
  | { type: 'TYPEAHEAD'; char: string }
  | { type: 'TYPEAHEAD.RESET' }
  | { type: 'SET.VALUE'; value: V | null }
  | { type: 'SET.ITEMS'; items: ReadonlyArray<SelectItem<V>> };

export interface SelectContext<V> {
  items: ReadonlyArray<SelectItem<V>>;
  value: V | null;
  highlightedId: string | null;
  /**
   * Buffer for type-ahead search. The Layer 3 attachment resets this
   * after a short timeout (typically 500 ms) by dispatching TYPEAHEAD.RESET.
   */
  typeahead: string;
}

export type SelectState = 'closed' | 'open';

export type SelectMachine<V> = Machine<SelectContext<V>, SelectEvent<V>, SelectState>;

export interface CreateSelectInput<V> {
  items: ReadonlyArray<SelectItem<V>>;
  defaultValue?: V | null;
  defaultOpen?: boolean;
  /** Default 'wrap' — APG listboxes wrap by default. */
  navigation?: 'wrap' | 'clamp';
}

/**
 * Compare two SelectItem values for "same selection" purposes. Reference
 * equality first (cheap path for primitives + stable refs), then a shallow
 * structural compare so we still match when Svelte 5's `$bindable` proxies an
 * object value — the proxy is a different reference than the original but
 * the shape is unchanged.
 */
function valueEquals<V>(a: V, b: V): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  const ka = Object.keys(a as object);
  const kb = Object.keys(b as object);
  if (ka.length !== kb.length) return false;
  for (const k of ka) {
    if ((a as Record<string, unknown>)[k] !== (b as Record<string, unknown>)[k]) return false;
  }
  return true;
}

function idForValue<V>(items: ReadonlyArray<SelectItem<V>>, value: V | null): string | null {
  if (value === null) return null;
  return items.find((it) => valueEquals(it.value, value))?.id ?? null;
}

function firstEnabledId<V>(items: ReadonlyArray<SelectItem<V>>): string | null {
  return items.find((it) => !it.disabled)?.id ?? null;
}

/**
 * Construct a fresh Select machine.
 *
 * @when-to-use Picking one option from a known set when free-text filtering
 *              isn't needed — country picker with ≤30 entries, sort order,
 *              theme, payment method.
 *
 * @anti-pattern If the option list is large enough to need filtering, use
 *               Combobox instead. If the list is exactly 2 boolean values,
 *               use Switch or Checkbox.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 */
export function createSelectMachine<V>(input: CreateSelectInput<V>): SelectMachine<V> {
  const items = input.items;
  const navigation = input.navigation ?? 'wrap';
  const defaultValue = input.defaultValue ?? null;

  const factory = defineMachine<SelectContext<V>, SelectEvent<V>, SelectState>({
    id: 'select',
    initial: input.defaultOpen ? 'open' : 'closed',
    context: {
      items,
      value: defaultValue,
      highlightedId: null,
      typeahead: '',
    },
    states: {
      closed: {
        on: {
          OPEN: {
            target: 'open',
            actions: [
              {
                type: 'highlightSelected',
                exec: (ctx) => ({
                  // On open, highlight the currently-selected item if any,
                  // else the first enabled item — APG: keyboard users land
                  // on a meaningful starting position.
                  highlightedId: idForValue(ctx.items, ctx.value) ?? firstEnabledId(ctx.items),
                  typeahead: '',
                }),
              },
            ],
          },
          TOGGLE: {
            target: 'open',
            actions: [
              {
                type: 'highlightSelected',
                exec: (ctx) => ({
                  highlightedId: idForValue(ctx.items, ctx.value) ?? firstEnabledId(ctx.items),
                  typeahead: '',
                }),
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
                    ctx.value !== null &&
                    e.items.some((it) => valueEquals(it.value, ctx.value as V));
                  return {
                    items: e.items,
                    value: stillThere ? ctx.value : null,
                  };
                },
              },
            ],
          },
        },
      },
      open: {
        on: {
          CLOSE: {
            target: 'closed',
            actions: [
              { type: 'clearHighlight', exec: () => ({ highlightedId: null, typeahead: '' }) },
            ],
          },
          TOGGLE: {
            target: 'closed',
            actions: [
              { type: 'clearHighlight', exec: () => ({ highlightedId: null, typeahead: '' }) },
            ],
          },
          ESCAPE: {
            target: 'closed',
            actions: [
              { type: 'clearHighlight', exec: () => ({ highlightedId: null, typeahead: '' }) },
            ],
          },
          SELECT: {
            target: 'closed',
            actions: [
              {
                type: 'commit',
                exec: (ctx, e) => {
                  if (e.type !== 'SELECT') return;
                  const item = ctx.items.find((it) => it.id === e.id);
                  if (!item || item.disabled) return { highlightedId: null, typeahead: '' };
                  return { value: item.value, highlightedId: null, typeahead: '' };
                },
              },
            ],
          },
          HIGHLIGHT: {
            actions: [
              {
                type: 'highlight',
                exec: (ctx, e) => {
                  if (e.type !== 'HIGHLIGHT') return;
                  if (e.id === null) return { highlightedId: null };
                  const item = ctx.items.find((it) => it.id === e.id);
                  if (!item || item.disabled) return;
                  return { highlightedId: e.id };
                },
              },
            ],
          },
          NAVIGATE: {
            actions: [
              {
                type: 'navigate',
                exec: (ctx, e) => {
                  if (e.type !== 'NAVIGATE') return;
                  const fromId = ctx.highlightedId;
                  const nextId = getNextEnabledId(ctx.items, fromId, e.direction, {
                    mode: navigation,
                  });
                  if (nextId === null) return;
                  return { highlightedId: nextId };
                },
              },
            ],
          },
          TYPEAHEAD: {
            actions: [
              {
                type: 'typeahead',
                exec: (ctx, e) => {
                  if (e.type !== 'TYPEAHEAD') return;
                  const buffer = ctx.typeahead + e.char;
                  // Single-char repeat → cycle through items starting with that char.
                  const startFrom =
                    buffer.length > 1 &&
                    buffer[0] === buffer[buffer.length - 1] &&
                    new Set(buffer).size === 1
                      ? ctx.highlightedId
                      : null;
                  const matchId = findByTypeAhead(ctx.items, buffer, startFrom);
                  if (matchId === null) {
                    return { typeahead: buffer };
                  }
                  return { typeahead: buffer, highlightedId: matchId };
                },
              },
            ],
          },
          'TYPEAHEAD.RESET': {
            actions: [{ type: 'resetTypeahead', exec: () => ({ typeahead: '' }) }],
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
                    ctx.value !== null &&
                    e.items.some((it) => valueEquals(it.value, ctx.value as V));
                  const highlightStillThere =
                    ctx.highlightedId !== null && e.items.some((it) => it.id === ctx.highlightedId);
                  return {
                    items: e.items,
                    value: stillThere ? ctx.value : null,
                    highlightedId: highlightStillThere
                      ? ctx.highlightedId
                      : firstEnabledId(e.items),
                  };
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
