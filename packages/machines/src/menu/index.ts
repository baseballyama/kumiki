/**
 * `@kumiki/machine-menu` — pure-TS FSM for a single-level Menu.
 *
 * Trigger button toggles a popup of items. Inside the open menu, a
 * roving active-descendant cursor (`highlightedId`) tracks keyboard focus;
 * Arrow / Home / End / typeahead move it; Enter / Space activates the
 * highlighted item and closes.
 *
 * Submenus (the `menubar` + nested `menu` shape) are deliberately deferred
 * — single-level Menu ships first, submenu work plugs in later via a
 * `parent` link in `MenuItem`.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/menu/
 */

import { defineMachine, type Machine } from '@kumiki/runtime';
import {
  findByTypeAhead,
  getNextEnabledId,
  type CollectionItem,
  type NavigateDirection,
} from '@kumiki/primitives/collection';

export type MenuItemKind = 'item' | 'separator';

export interface MenuItem extends CollectionItem {
  readonly id: string;
  readonly label?: string;
  readonly disabled?: boolean;
  readonly kind?: MenuItemKind;
}

export type MenuEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'ESCAPE' }
  | { type: 'ACTIVATE'; id: string }
  | { type: 'HIGHLIGHT'; id: string | null }
  | { type: 'NAVIGATE'; direction: NavigateDirection }
  | { type: 'TYPEAHEAD'; char: string }
  | { type: 'TYPEAHEAD.RESET' }
  | { type: 'SET.ITEMS'; items: ReadonlyArray<MenuItem> };

export interface MenuContext {
  items: ReadonlyArray<MenuItem>;
  highlightedId: string | null;
  /** Type-ahead buffer. Layer 3 resets via TYPEAHEAD.RESET after a quiet ms. */
  typeahead: string;
  /**
   * Last activated item id. Bumped on ACTIVATE; the controller observes
   * this and fires the consumer's onSelect callback. Cleared on CLOSE.
   */
  activatedId: string | null;
}

export type MenuState = 'closed' | 'open';

export type MenuMachine = Machine<MenuContext, MenuEvent, MenuState>;

export interface CreateMenuInput {
  items: ReadonlyArray<MenuItem>;
  defaultOpen?: boolean;
  /** Default 'wrap' — APG menus wrap by default. */
  navigation?: 'wrap' | 'clamp';
}

function firstEnabledId(items: ReadonlyArray<MenuItem>): string | null {
  return items.find((it) => !it.disabled && (it.kind ?? 'item') === 'item')?.id ?? null;
}

function lastEnabledId(items: ReadonlyArray<MenuItem>): string | null {
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    if (it && !it.disabled && (it.kind ?? 'item') === 'item') return it.id;
  }
  return null;
}

/** Filter to navigable items (drop separators) for getNextEnabledId. */
function navigableItems(items: ReadonlyArray<MenuItem>): ReadonlyArray<MenuItem> {
  return items.filter((it) => (it.kind ?? 'item') === 'item');
}

/**
 * Construct a fresh Menu machine.
 *
 * @when-to-use Action lists invoked from a button — "Open recent",
 *              "More options", context-menu equivalents. Each item runs
 *              an action and closes the menu.
 *
 * @anti-pattern Don't use Menu for picking a value (Select / Combobox)
 *               or for permanent navigation (Tabs / Sidebar). Don't
 *               nest sub-menus until @kumiki/machine-menu adds an explicit
 *               submenu API.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
 */
export function createMenuMachine(input: CreateMenuInput): MenuMachine {
  const items = input.items;
  const navigation = input.navigation ?? 'wrap';

  const factory = defineMachine<MenuContext, MenuEvent, MenuState>({
    id: 'menu',
    initial: input.defaultOpen ? 'open' : 'closed',
    context: {
      items,
      highlightedId: null,
      typeahead: '',
      activatedId: null,
    },
    states: {
      closed: {
        on: {
          OPEN: {
            target: 'open',
            actions: [
              {
                type: 'highlightFirst',
                exec: (ctx) => ({
                  highlightedId: firstEnabledId(ctx.items),
                  typeahead: '',
                  activatedId: null,
                }),
              },
            ],
          },
          TOGGLE: {
            target: 'open',
            actions: [
              {
                type: 'highlightFirst',
                exec: (ctx) => ({
                  highlightedId: firstEnabledId(ctx.items),
                  typeahead: '',
                  activatedId: null,
                }),
              },
            ],
          },
          'SET.ITEMS': {
            actions: [
              {
                type: 'setItems',
                exec: (_, e) => {
                  if (e.type !== 'SET.ITEMS') return;
                  return { items: e.items };
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
              {
                type: 'clearHighlight',
                exec: () => ({ highlightedId: null, typeahead: '', activatedId: null }),
              },
            ],
          },
          TOGGLE: {
            target: 'closed',
            actions: [
              {
                type: 'clearHighlight',
                exec: () => ({ highlightedId: null, typeahead: '', activatedId: null }),
              },
            ],
          },
          ESCAPE: {
            target: 'closed',
            actions: [
              {
                type: 'clearHighlight',
                exec: () => ({ highlightedId: null, typeahead: '', activatedId: null }),
              },
            ],
          },
          ACTIVATE: {
            target: 'closed',
            actions: [
              {
                type: 'commit',
                exec: (ctx, e) => {
                  if (e.type !== 'ACTIVATE') return;
                  const item = ctx.items.find((it) => it.id === e.id);
                  if (!item || item.disabled || (item.kind ?? 'item') !== 'item') {
                    return { highlightedId: null, typeahead: '', activatedId: null };
                  }
                  return {
                    highlightedId: null,
                    typeahead: '',
                    activatedId: item.id,
                  };
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
                  return { highlightedId: item.id };
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
                  const list = navigableItems(ctx.items);
                  const next = getNextEnabledId(list, ctx.highlightedId, e.direction, {
                    mode: navigation,
                  });
                  if (next === null || next === ctx.highlightedId) return;
                  return { highlightedId: next };
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
                  const list = navigableItems(ctx.items);
                  const match = findByTypeAhead(list, buffer, ctx.highlightedId);
                  if (match === null) return { typeahead: buffer };
                  return { highlightedId: match, typeahead: buffer };
                },
              },
            ],
          },
          'TYPEAHEAD.RESET': {
            actions: [{ type: 'resetTypeahead', exec: () => ({ typeahead: '' }) }],
          },
          'SET.ITEMS': {
            actions: [
              {
                type: 'setItems',
                exec: (ctx, e) => {
                  if (e.type !== 'SET.ITEMS') return;
                  // If currently-highlighted id no longer exists, fall back to first enabled.
                  const existing =
                    ctx.highlightedId !== null && e.items.some((it) => it.id === ctx.highlightedId);
                  return {
                    items: e.items,
                    highlightedId: existing ? ctx.highlightedId : firstEnabledId(e.items),
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

export { lastEnabledId };
