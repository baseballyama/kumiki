/**
 * `@kumiki/attachment-menu` — Layer 3 Svelte 5 attachments for a
 * single-level Menu.
 *
 * Three factories: `trigger`, `menu`, `item(item)`. The trigger is a
 * button that pops the menu; the menu element uses `aria-activedescendant`
 * to track keyboard focus across items without rolling tabindex.
 *
 * Keyboard (per APG Menubar):
 * - On trigger: Enter / Space / ArrowDown opens the menu and highlights
 *   the first enabled item. ArrowUp opens and highlights the last.
 *   Printable chars open + seed the typeahead buffer.
 * - On open menu (focus stays on trigger; aria-activedescendant points
 *   at the highlighted item):
 *   - ArrowDown / ArrowUp navigate (wrap)
 *   - Home / End jump
 *   - Enter / Space activate the highlighted item
 *   - Escape close (returns focus to trigger)
 *   - Tab close + let focus advance (APG behavior)
 *   - Printable chars feed typeahead (debounced 500 ms reset)
 *
 * Outside-click closes via `@kumiki/primitives/dismissable`. The trigger
 * is in the dismissable's ignore list so the click that toggles the menu
 * doesn't immediately fire OUTSIDE_CLICK.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
 */

import {
  createMenuMachine,
  type CreateMenuInput,
  type MenuContext,
  type MenuEvent,
  type MenuItem,
  type MenuMachine,
  type MenuState,
  lastEnabledId,
} from '@kumiki/machines/menu';
import { createDismissable, type Dismissable } from '@kumiki/primitives/dismissable';
import { uid } from '@kumiki/primitives/id';

export type Attachment = (node: HTMLElement) => void | (() => void);

const TYPEAHEAD_DEBOUNCE_MS = 500;

export interface MenuController {
  readonly id: string;
  readonly state: MenuState;
  readonly context: Readonly<MenuContext>;
  readonly open: boolean;
  readonly highlightedId: string | null;

  show(): void;
  hide(): void;
  toggle(): void;
  activate(itemId: string): void;
  setItems(items: ReadonlyArray<MenuItem>): void;

  subscribe(listener: (snapshot: { state: MenuState; context: MenuContext }) => void): () => void;

  readonly triggerId: string;
  readonly menuId: string;
  itemElementId(itemId: string): string;

  readonly trigger: Attachment;
  readonly menu: Attachment;
  item(item: MenuItem): Attachment;

  readonly machine: MenuMachine;
}

export interface CreateMenuOptions extends CreateMenuInput {
  /** Fired with the item object whenever ACTIVATE succeeds for that item. */
  onSelect?: (item: MenuItem) => void;
  onOpenChange?: (open: boolean) => void;
  id?: string;
}

export function createMenu(options: CreateMenuOptions): MenuController {
  const machine = createMenuMachine(options);
  const id = options.id ?? uid('menu');
  const triggerId = `${id}-trigger`;
  const menuId = `${id}-menu`;

  function itemElementId(itemId: string): string {
    return `${id}-item-${itemId}`;
  }

  let prevActivated: string | null = null;
  let prevOpen = machine.state === 'open';
  machine.subscribe(({ state, context }) => {
    if (context.activatedId !== null && context.activatedId !== prevActivated) {
      prevActivated = context.activatedId;
      const item = context.items.find((it) => it.id === context.activatedId);
      if (item) options.onSelect?.(item);
    } else if (context.activatedId === null) {
      prevActivated = null;
    }
    const nextOpen = state === 'open';
    if (nextOpen !== prevOpen) {
      prevOpen = nextOpen;
      options.onOpenChange?.(nextOpen);
    }
  });

  let triggerEl: HTMLElement | null = null;
  let dismiss: Dismissable | null = null;
  let typeaheadTimer: ReturnType<typeof setTimeout> | null = null;

  function clearTypeaheadTimer(): void {
    if (typeaheadTimer !== null) {
      clearTimeout(typeaheadTimer);
      typeaheadTimer = null;
    }
  }
  function scheduleTypeaheadReset(): void {
    clearTypeaheadTimer();
    typeaheadTimer = setTimeout(() => {
      typeaheadTimer = null;
      machine.send({ type: 'TYPEAHEAD.RESET' });
    }, TYPEAHEAD_DEBOUNCE_MS);
  }

  function ensureDismissable(menuEl: HTMLElement): void {
    if (dismiss) return;
    dismiss = createDismissable(menuEl, {
      ignore: triggerEl ? [() => triggerEl] : [],
      onEscape: () => machine.send({ type: 'ESCAPE' }),
      onOutsideClick: () => machine.send({ type: 'CLOSE' }),
    });
  }

  // ── trigger ─────────────────────────────────────────────────────────
  const trigger: Attachment = (node) => {
    if (!node.id) node.id = triggerId;
    if (node.tagName === 'BUTTON' && !node.hasAttribute('type')) {
      node.setAttribute('type', 'button');
    }
    node.setAttribute('aria-haspopup', 'menu');
    node.setAttribute('aria-controls', menuId);
    node.setAttribute('data-component-host', 'menu');
    triggerEl = node;

    const paint = (): void => {
      node.setAttribute('aria-expanded', String(machine.state === 'open'));
      node.setAttribute('data-state', machine.state);
      const highlight = machine.context.highlightedId;
      if (highlight !== null) {
        node.setAttribute('aria-activedescendant', itemElementId(highlight));
      } else {
        node.removeAttribute('aria-activedescendant');
      }
    };
    paint();

    const onClick = (): void => machine.send({ type: 'TOGGLE' });
    const onKeydown = (event: KeyboardEvent): void => {
      const open = machine.state === 'open';
      if (!open) {
        switch (event.key) {
          case 'Enter':
          case ' ':
          case 'ArrowDown':
            event.preventDefault();
            machine.send({ type: 'OPEN' });
            return;
          case 'ArrowUp': {
            event.preventDefault();
            machine.send({ type: 'OPEN' });
            // Highlight the LAST enabled item (APG: ArrowUp opens to bottom).
            const last = lastEnabledId(machine.context.items);
            if (last) machine.send({ type: 'HIGHLIGHT', id: last });
            return;
          }
          default:
            if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
              event.preventDefault();
              machine.send({ type: 'OPEN' });
              machine.send({ type: 'TYPEAHEAD', char: event.key });
              scheduleTypeaheadReset();
            }
            return;
        }
      }

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          machine.send({ type: 'NAVIGATE', direction: 'next' });
          break;
        case 'ArrowUp':
          event.preventDefault();
          machine.send({ type: 'NAVIGATE', direction: 'prev' });
          break;
        case 'Home':
          event.preventDefault();
          machine.send({ type: 'NAVIGATE', direction: 'first' });
          break;
        case 'End':
          event.preventDefault();
          machine.send({ type: 'NAVIGATE', direction: 'last' });
          break;
        case 'Enter':
        case ' ': {
          event.preventDefault();
          const id = machine.context.highlightedId;
          if (id !== null) machine.send({ type: 'ACTIVATE', id });
          else machine.send({ type: 'CLOSE' });
          break;
        }
        case 'Escape':
          event.preventDefault();
          machine.send({ type: 'ESCAPE' });
          // Restore focus to trigger when ESC closes from inside the menu.
          break;
        case 'Tab':
          machine.send({ type: 'CLOSE' });
          break;
        default:
          if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
            machine.send({ type: 'TYPEAHEAD', char: event.key });
            scheduleTypeaheadReset();
          }
          break;
      }
    };

    node.addEventListener('click', onClick);
    node.addEventListener('keydown', onKeydown);
    const unsub = machine.subscribe(paint);

    return () => {
      unsub();
      clearTypeaheadTimer();
      node.removeEventListener('click', onClick);
      node.removeEventListener('keydown', onKeydown);
      if (triggerEl === node) triggerEl = null;
    };
  };

  // ── menu ────────────────────────────────────────────────────────────
  const menu: Attachment = (node) => {
    if (!node.id) node.id = menuId;
    node.setAttribute('role', 'menu');
    node.setAttribute('tabindex', '-1');
    node.setAttribute('aria-labelledby', triggerId);

    const paint = (): void => {
      node.setAttribute('data-state', machine.state);
      node.toggleAttribute('hidden', machine.state !== 'open');
      if (machine.state === 'open') {
        ensureDismissable(node);
        dismiss?.activate();
      } else {
        dismiss?.deactivate();
      }
    };
    paint();
    const unsub = machine.subscribe(paint);

    return () => {
      unsub();
      dismiss?.deactivate();
      dismiss = null;
    };
  };

  // ── item ────────────────────────────────────────────────────────────
  function item(it: MenuItem): Attachment {
    return (node) => {
      const elementId = itemElementId(it.id);
      if (!node.id) node.id = elementId;
      const kind = it.kind ?? 'item';
      node.setAttribute('role', kind === 'separator' ? 'separator' : 'menuitem');
      node.setAttribute('data-component-part', kind);
      if (it.disabled) node.setAttribute('aria-disabled', 'true');

      const paint = (): void => {
        const isHighlighted = machine.context.highlightedId === it.id;
        if (isHighlighted) node.setAttribute('data-highlighted', '');
        else node.removeAttribute('data-highlighted');
      };
      paint();

      // Separators don't react to pointer / click.
      if (kind === 'separator') {
        const unsub = machine.subscribe(paint);
        return () => unsub();
      }

      const onPointerEnter = (): void => {
        if (it.disabled || machine.state !== 'open') return;
        machine.send({ type: 'HIGHLIGHT', id: it.id });
      };
      const onClick = (event: MouseEvent): void => {
        if (it.disabled) return;
        event.preventDefault();
        machine.send({ type: 'ACTIVATE', id: it.id });
        triggerEl?.focus();
      };

      node.addEventListener('pointerenter', onPointerEnter);
      node.addEventListener('click', onClick);
      const unsub = machine.subscribe(paint);

      return () => {
        unsub();
        node.removeEventListener('pointerenter', onPointerEnter);
        node.removeEventListener('click', onClick);
      };
    };
  }

  return {
    id,
    triggerId,
    menuId,
    itemElementId,
    get state() {
      return machine.state;
    },
    get context() {
      return machine.context;
    },
    get open() {
      return machine.state === 'open';
    },
    get highlightedId() {
      return machine.context.highlightedId;
    },
    show: () => machine.send({ type: 'OPEN' }),
    hide: () => machine.send({ type: 'CLOSE' }),
    toggle: () => machine.send({ type: 'TOGGLE' }),
    activate: (itemId) => machine.send({ type: 'ACTIVATE', id: itemId }),
    setItems: (items) => machine.send({ type: 'SET.ITEMS', items } as MenuEvent),
    subscribe: machine.subscribe.bind(machine),
    trigger,
    menu,
    item,
    machine,
  };
}

export type { MenuContext, MenuEvent, MenuItem, MenuMachine, MenuState };
