/**
 * `@kumiki/machine-tabs` — pure-TS finite state machine for Tabs.
 *
 * Models a tablist with **roving tabindex** and two activation modes:
 *
 * - `automatic` (default per APG): focusing a tab also activates it. Best for
 *   panels whose contents are cheap to render — content swaps as the user
 *   arrows through the tablist.
 * - `manual`: focus moves with arrow keys but activation requires Enter or
 *   Space. Best when each panel is expensive to render or has side effects.
 *
 * Orientation and RTL inversion are **not** the machine's concern — Layer 3
 * (the attachment) translates physical key events (`ArrowLeft`/`ArrowRight`/
 * `ArrowUp`/`ArrowDown`) into logical `next` / `prev` directions before
 * dispatching `NAVIGATE`. The machine is pure logical navigation.
 *
 * Defaults to selecting the first enabled item if no `defaultValue` is given —
 * an APG tablist *should* always have an active tab.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 */

import { defineMachine, type Machine } from '@kumiki/runtime';
import {
  getNextEnabledId,
  type CollectionItem,
  type NavigateDirection,
} from '@kumiki/primitives/collection';

export interface TabItem extends CollectionItem {
  readonly id: string;
  readonly value: string;
  readonly label?: string;
  readonly disabled?: boolean;
}

export type TabsActivation = 'automatic' | 'manual';

export type TabsEvent =
  | { type: 'SELECT'; id: string }
  | { type: 'FOCUS'; id: string }
  | { type: 'BLUR' }
  | { type: 'NAVIGATE'; direction: NavigateDirection }
  | { type: 'ACTIVATE_FOCUSED' }
  | { type: 'SET.VALUE'; value: string | null }
  | { type: 'SET.ITEMS'; items: ReadonlyArray<TabItem> }
  | { type: 'SET.ACTIVATION'; activation: TabsActivation }
  | { type: 'DISABLE' }
  | { type: 'ENABLE' };

export interface TabsContext {
  items: ReadonlyArray<TabItem>;
  value: string | null;
  focusedId: string | null;
  activation: TabsActivation;
}

export type TabsState = 'idle' | 'disabled';

export type TabsMachine = Machine<TabsContext, TabsEvent, TabsState>;

export interface CreateTabsInput {
  items: ReadonlyArray<TabItem>;
  defaultValue?: string | null;
  activation?: TabsActivation;
  disabled?: boolean;
  /** Whether arrow navigation wraps (default per APG) or clamps. */
  navigation?: 'wrap' | 'clamp';
}

function firstEnabledValue(items: ReadonlyArray<TabItem>): string | null {
  return items.find((it) => !it.disabled)?.value ?? null;
}

function idForValue(items: ReadonlyArray<TabItem>, value: string | null): string | null {
  if (value === null) return null;
  return items.find((it) => it.value === value)?.id ?? null;
}

/**
 * Construct a fresh Tabs machine.
 *
 * @when-to-use Switching between mutually-exclusive panels of related content
 *              within a single page region — settings panes, dashboard slices,
 *              docs version pickers. Pair with `@kumiki/component-tabs`.
 *
 * @anti-pattern Don't use Tabs for navigation that changes the URL or page
 *               context — use links / a router. Don't use Tabs to disclose
 *               unrelated content — use Accordion or stacked sections.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 */
export function createTabsMachine(input: CreateTabsInput): TabsMachine {
  const items = input.items;
  const navigation = input.navigation ?? 'wrap';
  const activation = input.activation ?? 'automatic';
  const disabled = input.disabled ?? false;
  const initialValue =
    input.defaultValue !== undefined ? input.defaultValue : firstEnabledValue(items);

  const factory = defineMachine<TabsContext, TabsEvent, TabsState>({
    id: 'tabs',
    initial: disabled ? 'disabled' : 'idle',
    context: {
      items,
      value: initialValue,
      focusedId: null,
      activation,
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
                  // Automatic activation: focus also selects.
                  if (ctx.activation === 'automatic') {
                    return { focusedId: item.id, value: item.value };
                  }
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
                  const fromId = ctx.focusedId ?? idForValue(ctx.items, ctx.value);
                  const nextId = getNextEnabledId(ctx.items, fromId, e.direction, {
                    mode: navigation,
                  });
                  if (nextId === null) return;
                  const next = ctx.items.find((it) => it.id === nextId);
                  if (!next) return;
                  if (ctx.activation === 'automatic') {
                    return { focusedId: nextId, value: next.value };
                  }
                  return { focusedId: nextId };
                },
              },
            ],
          },
          ACTIVATE_FOCUSED: {
            actions: [
              {
                type: 'activateFocused',
                exec: (ctx) => {
                  if (ctx.focusedId === null) return;
                  const item = ctx.items.find((it) => it.id === ctx.focusedId);
                  if (!item || item.disabled) return;
                  if (item.value === ctx.value) return;
                  return { value: item.value };
                },
              },
            ],
          },
          'SET.VALUE': {
            actions: [
              {
                type: 'setValue',
                exec: (ctx, e) => {
                  if (e.type !== 'SET.VALUE') return;
                  if (e.value === null) return { value: null };
                  const target = ctx.items.find((it) => it.value === e.value);
                  if (!target || target.disabled) return;
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
                    e.items.some((it) => it.value === ctx.value && !it.disabled);
                  return {
                    items: e.items,
                    value: stillThere ? ctx.value : firstEnabledValue(e.items),
                    focusedId:
                      ctx.focusedId !== null && e.items.some((it) => it.id === ctx.focusedId)
                        ? ctx.focusedId
                        : null,
                  };
                },
              },
            ],
          },
          'SET.ACTIVATION': {
            actions: [
              {
                type: 'setActivation',
                exec: (_, e) => {
                  if (e.type !== 'SET.ACTIVATION') return;
                  return { activation: e.activation };
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
