/**
 * `@kumiki/machines/accordion` — pure-TS FSM for Accordion.
 *
 * APG Accordion pattern: a vertical stack of disclosure regions, each with
 * a header button (`role="button"`, `aria-expanded`) that toggles a panel.
 * Two modes:
 *
 * - `single` (default): at most one panel is open at a time. Opening a new
 *   one closes the prior. `collapsible: true` (default) lets the user
 *   close the only-open panel; `collapsible: false` always keeps one open.
 * - `multiple`: any subset of panels may be open simultaneously.
 *
 * Roving focus across the headers — arrow keys move focus between header
 * buttons (skipping disabled), `Home` jumps to first, `End` to last. The
 * machine sees logical `next`/`prev`/`first`/`last` directions; the
 * Layer 3 attachment translates DOM key codes.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 */

import { defineMachine, type Machine } from '@kumiki/runtime';
import {
  getNextEnabledId,
  type CollectionItem,
  type NavigateDirection,
} from '@kumiki/primitives/collection';

export interface AccordionItem<V> extends CollectionItem {
  readonly id: string;
  readonly value: V;
  readonly label?: string;
  readonly disabled?: boolean;
}

export type AccordionMode = 'single' | 'multiple';

export type AccordionEvent<V> =
  | { type: 'TOGGLE'; id: string }
  | { type: 'EXPAND'; id: string }
  | { type: 'COLLAPSE'; id: string }
  | { type: 'FOCUS'; id: string }
  | { type: 'BLUR' }
  | { type: 'NAVIGATE'; direction: NavigateDirection }
  | { type: 'SET.ITEMS'; items: ReadonlyArray<AccordionItem<V>> }
  | { type: 'SET.VALUE'; value: ReadonlyArray<V> | V | null }
  | { type: 'SET.MODE'; mode: AccordionMode }
  | { type: 'SET.COLLAPSIBLE'; value: boolean };

export interface AccordionContext<V> {
  items: ReadonlyArray<AccordionItem<V>>;
  /** Item ids currently in the expanded set. */
  expandedIds: ReadonlyArray<string>;
  /** Item id with keyboard focus, or null. */
  focusedId: string | null;
  mode: AccordionMode;
  /** When mode='single', whether the only-open panel can be collapsed. */
  collapsible: boolean;
}

export type AccordionState = 'idle';

export type AccordionMachine<V> = Machine<AccordionContext<V>, AccordionEvent<V>, AccordionState>;

export interface CreateAccordionInput<V> {
  items: ReadonlyArray<AccordionItem<V>>;
  /** Initial value(s). For `single`, V or null; for `multiple`, V[]. */
  defaultValue?: ReadonlyArray<V> | V | null;
  mode?: AccordionMode;
  /** Whether arrow navigation wraps (default per APG) or clamps. */
  navigation?: 'wrap' | 'clamp';
  /** When mode='single' (default), allow closing the only-open. Default true. */
  collapsible?: boolean;
}

/**
 * Compare two AccordionItem values for "same selection" purposes.
 * Reference equality first (cheap path for primitives + stable object refs),
 * then a shallow structural compare so we still match when Svelte 5's
 * `$bindable` proxies an object: the proxy is a different reference than the
 * original but the shape is unchanged.
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

function idsForValue<V>(
  items: ReadonlyArray<AccordionItem<V>>,
  value: ReadonlyArray<V> | V | null,
): string[] {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) {
    return value
      .map((v) => items.find((it) => valueEquals(it.value, v))?.id)
      .filter((id): id is string => id !== undefined);
  }
  const single = value as V;
  const id = items.find((it) => valueEquals(it.value, single))?.id;
  return id ? [id] : [];
}

/**
 * Construct a fresh Accordion machine.
 *
 * @when-to-use Stacked disclosure regions where users explore one (or a
 *              few) sections at a time — FAQs, settings categories,
 *              terms-and-conditions clauses.
 *
 * @anti-pattern Don't use Accordion for navigation between independent
 *               pages — use Tabs (when relating to one workflow) or links
 *               (when changing context). Don't use Accordion for required
 *               disclosure of legally-mandated content; that should be
 *               always-visible.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 */
export function createAccordionMachine<V>(input: CreateAccordionInput<V>): AccordionMachine<V> {
  const items = input.items;
  const navigation = input.navigation ?? 'wrap';
  const mode: AccordionMode = input.mode ?? 'single';
  const collapsible = input.collapsible ?? true;
  const initialExpanded = idsForValue(items, input.defaultValue ?? null);

  function applyToggle(ctx: AccordionContext<V>, id: string): string[] {
    const item = ctx.items.find((it) => it.id === id);
    if (!item || item.disabled) return [...ctx.expandedIds];
    const isOpen = ctx.expandedIds.includes(id);
    if (ctx.mode === 'multiple') {
      return isOpen ? ctx.expandedIds.filter((x) => x !== id) : [...ctx.expandedIds, id];
    }
    // single mode
    if (isOpen) {
      // Closing the only-open panel — only allowed when collapsible.
      return ctx.collapsible ? [] : [...ctx.expandedIds];
    }
    return [id];
  }

  const factory = defineMachine<AccordionContext<V>, AccordionEvent<V>, AccordionState>({
    id: 'accordion',
    initial: 'idle',
    context: {
      items,
      expandedIds: initialExpanded,
      focusedId: null,
      mode,
      collapsible,
    },
    states: {
      idle: {
        on: {
          TOGGLE: {
            actions: [
              {
                type: 'toggle',
                exec: (ctx, e) => {
                  if (e.type !== 'TOGGLE') return;
                  return { expandedIds: applyToggle(ctx, e.id) };
                },
              },
            ],
          },
          EXPAND: {
            actions: [
              {
                type: 'expand',
                exec: (ctx, e) => {
                  if (e.type !== 'EXPAND') return;
                  const item = ctx.items.find((it) => it.id === e.id);
                  if (!item || item.disabled) return;
                  if (ctx.expandedIds.includes(e.id)) return;
                  if (ctx.mode === 'multiple') {
                    return { expandedIds: [...ctx.expandedIds, e.id] };
                  }
                  return { expandedIds: [e.id] };
                },
              },
            ],
          },
          COLLAPSE: {
            actions: [
              {
                type: 'collapse',
                exec: (ctx, e) => {
                  if (e.type !== 'COLLAPSE') return;
                  if (!ctx.expandedIds.includes(e.id)) return;
                  // single + !collapsible → can't close the only-open.
                  if (ctx.mode === 'single' && !ctx.collapsible && ctx.expandedIds.length === 1) {
                    return;
                  }
                  return { expandedIds: ctx.expandedIds.filter((x) => x !== e.id) };
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
                  return { focusedId: e.id };
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
                  const fromId = ctx.focusedId;
                  const nextId = getNextEnabledId(ctx.items, fromId, e.direction, {
                    mode: navigation,
                  });
                  if (nextId === null) return;
                  return { focusedId: nextId };
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
                  const stillThere = ctx.expandedIds.filter((id) =>
                    e.items.some((it) => it.id === id),
                  );
                  return {
                    items: e.items,
                    expandedIds: stillThere,
                    focusedId:
                      ctx.focusedId !== null && e.items.some((it) => it.id === ctx.focusedId)
                        ? ctx.focusedId
                        : null,
                  };
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
                  return { expandedIds: idsForValue(ctx.items, e.value) };
                },
              },
            ],
          },
          'SET.MODE': {
            actions: [
              {
                type: 'setMode',
                exec: (ctx, e) => {
                  if (e.type !== 'SET.MODE') return;
                  // Switching single → multiple keeps current open set.
                  // Switching multiple → single trims to the first open.
                  if (e.mode === 'single' && ctx.expandedIds.length > 1) {
                    return { mode: e.mode, expandedIds: [ctx.expandedIds[0]!] };
                  }
                  return { mode: e.mode };
                },
              },
            ],
          },
          'SET.COLLAPSIBLE': {
            actions: [
              {
                type: 'setCollapsible',
                exec: (_, e) => {
                  if (e.type !== 'SET.COLLAPSIBLE') return;
                  return { collapsible: e.value };
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
