/**
 * `@kumiki/machines/tabs` — pure-TS finite state machine for Tabs.
 *
 * Models a tablist with **roving tabindex** and two activation modes:
 *
 * - `automatic` (default per APG): focusing a tab also activates it. Best for
 *   panels whose contents are cheap to render — content swaps as the user
 *   arrows through the tablist.
 * - `manual`: focus moves with arrow keys but activation requires Enter or
 *   Space. Best when each panel is expensive to render or has side effects.
 *
 * Orientation and RTL inversion **are** the machine's concern. `orientation`
 * and `direction` live in the machine context; the Layer 3 attachment forwards
 * the *physical* arrow key (`ArrowLeft`/`ArrowRight`/`ArrowUp`/`ArrowDown`) via
 * `NAVIGATE`, and the machine resolves it to a logical `next`/`prev` using its
 * own `orientation` + `direction`. This keeps RTL inversion in one auditable,
 * `toJSON`-visible place (the i18n bar in CLAUDE.md).
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

export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsDirection = 'ltr' | 'rtl';

/** A physical arrow key, forwarded verbatim from the keyboard. */
export type PhysicalArrowKey = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown';

/**
 * `NAVIGATE` carries *either* a logical direction (`first`/`last` — these are
 * direction-agnostic, used by Home/End) *or* a physical arrow `key`, which the
 * machine resolves to next/prev using its own `orientation` + `direction`.
 */
export type TabsEvent =
  | { type: 'SELECT'; id: string }
  | { type: 'FOCUS'; id: string }
  | { type: 'BLUR' }
  | { type: 'NAVIGATE'; direction: NavigateDirection }
  | { type: 'NAVIGATE'; key: PhysicalArrowKey }
  | { type: 'ACTIVATE_FOCUSED' }
  | { type: 'SET.VALUE'; value: string | null }
  | { type: 'SET.ITEMS'; items: ReadonlyArray<TabItem> }
  | { type: 'SET.ACTIVATION'; activation: TabsActivation }
  | { type: 'SET.ORIENTATION'; orientation: TabsOrientation }
  | { type: 'SET.DIRECTION'; direction: TabsDirection }
  | { type: 'DISABLE' }
  | { type: 'ENABLE' };

export interface TabsContext {
  items: ReadonlyArray<TabItem>;
  value: string | null;
  focusedId: string | null;
  activation: TabsActivation;
  orientation: TabsOrientation;
  direction: TabsDirection;
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
  /** Visual orientation. Decides which physical arrows navigate. */
  orientation?: TabsOrientation;
  /** Writing direction. Inverts horizontal arrows under `'rtl'`. */
  direction?: TabsDirection;
}

/**
 * Resolve a physical arrow key to a logical `next`/`prev` direction (or `null`
 * if the key isn't a navigation key for this orientation). RTL inversion of the
 * horizontal axis lives here — the single source of truth.
 */
export function resolveArrow(
  key: PhysicalArrowKey,
  orientation: TabsOrientation,
  direction: TabsDirection,
): 'next' | 'prev' | null {
  if (orientation === 'vertical') {
    if (key === 'ArrowDown') return 'next';
    if (key === 'ArrowUp') return 'prev';
    return null;
  }
  if (direction === 'rtl') {
    if (key === 'ArrowLeft') return 'next';
    if (key === 'ArrowRight') return 'prev';
    return null;
  }
  if (key === 'ArrowRight') return 'next';
  if (key === 'ArrowLeft') return 'prev';
  return null;
}

function firstEnabledValue(items: ReadonlyArray<TabItem>): string | null {
  return items.find((it) => !it.disabled)?.value ?? null;
}

export function idForValue(items: ReadonlyArray<TabItem>, value: string | null): string | null {
  if (value === null) return null;
  return items.find((it) => it.value === value)?.id ?? null;
}

/**
 * Construct a fresh Tabs machine.
 *
 * @when-to-use Switching between mutually-exclusive panels of related content
 *              within a single page region — settings panes, dashboard slices,
 *              docs version pickers. Pair with `@kumiki/components/tabs`.
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
  const orientation = input.orientation ?? 'horizontal';
  const direction = input.direction ?? 'ltr';
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
      orientation,
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
                  // Resolve the physical key to a logical direction using the
                  // machine's own orientation + direction (RTL inversion here).
                  const direction =
                    'key' in e ? resolveArrow(e.key, ctx.orientation, ctx.direction) : e.direction;
                  if (direction === null) return;
                  const fromId = ctx.focusedId ?? idForValue(ctx.items, ctx.value);
                  const nextId = getNextEnabledId(ctx.items, fromId, direction, {
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
          'SET.ORIENTATION': {
            actions: [
              {
                type: 'setOrientation',
                exec: (_, e) => {
                  if (e.type !== 'SET.ORIENTATION') return;
                  return { orientation: e.orientation };
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
