/**
 * `@kumiki/attachment-tabs` — Layer 3 Svelte 5 attachments for Tabs.
 *
 * Tabs is a **compound primitive** spanning three element kinds:
 * - one tablist (`role="tablist"`)
 * - N tab buttons (`role="tab"`), with roving tabindex
 * - N tabpanels (`role="tabpanel"`), each labelled by its tab
 *
 * Per APG: only the **active** tab has `tabindex="0"` and
 * `aria-selected="true"`. The rest get `tabindex="-1"` and
 * `aria-selected="false"`. Each panel is hidden when its tab is inactive.
 *
 * Orientation and RTL key inversion live here, **not** in the machine — the
 * machine receives logical `next` / `prev` directions only.
 *
 * - `horizontal` (default): ArrowLeft / ArrowRight move (inverted under RTL).
 * - `vertical`: ArrowUp / ArrowDown move; ArrowLeft/Right ignored.
 * - `Home` / `End` jump regardless of orientation or direction.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 */

import {
  createTabsMachine,
  type CreateTabsInput,
  type TabItem,
  type TabsActivation,
  type TabsContext,
  type TabsEvent,
  type TabsMachine,
  type TabsState,
} from '@kumiki/machines/tabs';
import { tabindexFor } from '@kumiki/primitives/collection';
import { uid } from '@kumiki/primitives/id';

export type Attachment = (node: HTMLElement) => void | (() => void);

export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsDirection = 'ltr' | 'rtl';

export interface TabsController {
  readonly id: string;
  readonly state: TabsState;
  readonly context: Readonly<TabsContext>;
  readonly value: string | null;
  readonly focusedId: string | null;
  readonly disabled: boolean;
  readonly items: ReadonlyArray<TabItem>;
  readonly activation: TabsActivation;

  select(id: string): void;
  setValue(value: string | null): void;
  setItems(items: ReadonlyArray<TabItem>): void;
  setActivation(activation: TabsActivation): void;
  setDisabled(disabled: boolean): void;
  /**
   * Update the visual orientation. The machine doesn't care; this only
   * changes which arrow keys the controller listens for.
   */
  setOrientation(orientation: TabsOrientation): void;
  /**
   * Update writing direction. RTL only affects horizontal orientation:
   * ArrowLeft becomes `next`, ArrowRight becomes `prev`.
   */
  setDirection(direction: TabsDirection): void;

  subscribe(listener: (snapshot: { state: TabsState; context: TabsContext }) => void): () => void;

  /** DOM id for a tab button by its item id. */
  tabElementId(itemId: string): string;
  /** DOM id for a panel by its item id. */
  panelElementId(itemId: string): string;

  /** Attach to the tablist container. */
  readonly list: Attachment;
  /** Attach to one tab button. */
  tab(item: TabItem): Attachment;
  /** Attach to one tabpanel. */
  panel(item: TabItem): Attachment;

  readonly machine: TabsMachine;
}

export interface CreateTabsOptions extends CreateTabsInput {
  onValueChange?: (value: string | null) => void;
  id?: string;
  orientation?: TabsOrientation;
  direction?: TabsDirection;
}

/**
 * Create a Tabs controller plus list / tab / panel attachment factories.
 *
 * @when-to-use Direct headless integration when Layer 4's compound API is
 *              too rigid — custom panel layouts, integration with router-
 *              backed tabs, or hand-rolled focus management.
 *
 * @anti-pattern Don't share one controller across multiple Tabs instances —
 *               each owns its machine and its DOM ids.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 */
export function createTabs(options: CreateTabsOptions): TabsController {
  const machine = createTabsMachine(options);
  const id = options.id ?? uid('tabs');
  let orientation: TabsOrientation = options.orientation ?? 'horizontal';
  let direction: TabsDirection = options.direction ?? 'ltr';

  function tabElementId(itemId: string): string {
    return `${id}-tab-${itemId}`;
  }
  function panelElementId(itemId: string): string {
    return `${id}-panel-${itemId}`;
  }

  let prevValue: string | null = machine.context.value;
  machine.subscribe(({ context }) => {
    if (context.value !== prevValue) {
      prevValue = context.value;
      options.onValueChange?.(context.value);
    }
  });

  // ── tablist root attachment ──────────────────────────────────────────
  const list: Attachment = (node) => {
    if (!node.id) node.id = id;
    node.setAttribute('role', 'tablist');
    node.setAttribute('data-component', 'tabs');

    const paint = (): void => {
      node.setAttribute('aria-orientation', orientation);
      const isDisabled = machine.state === 'disabled';
      if (isDisabled) {
        node.setAttribute('aria-disabled', 'true');
        node.setAttribute('data-disabled', '');
      } else {
        node.removeAttribute('aria-disabled');
        node.removeAttribute('data-disabled');
      }
    };
    paint();
    return machine.subscribe(paint);
  };

  // ── tab button attachment ────────────────────────────────────────────
  function makeTab(item: TabItem): Attachment {
    return (node) => {
      const elementId = tabElementId(item.id);
      if (!node.id) node.id = elementId;
      node.setAttribute('role', 'tab');
      node.setAttribute('data-value', item.value);
      node.setAttribute('aria-controls', panelElementId(item.id));
      if (node.tagName === 'BUTTON' && !node.hasAttribute('type')) {
        node.setAttribute('type', 'button');
      }
      if (item.disabled) node.setAttribute('aria-disabled', 'true');

      const paint = (): void => {
        const isSelected = machine.context.value === item.value;
        const tab = tabindexFor(machine.context.items, item.id, machine.context.focusedId);
        node.setAttribute('aria-selected', String(isSelected));
        node.setAttribute('data-state', isSelected ? 'active' : 'inactive');
        node.setAttribute('tabindex', String(tab));
        if (machine.context.focusedId === item.id) {
          node.setAttribute('data-focused', '');
        } else {
          node.removeAttribute('data-focused');
        }
      };
      paint();

      const onFocus = (): void => {
        if (item.disabled || machine.state === 'disabled') return;
        machine.send({ type: 'FOCUS', id: item.id });
      };
      const onBlur = (): void => {
        if (machine.state === 'disabled') return;
        if (machine.context.focusedId === item.id) {
          machine.send({ type: 'BLUR' });
        }
      };
      const onClick = (event: MouseEvent): void => {
        if (item.disabled || machine.state === 'disabled') return;
        event.preventDefault();
        machine.send({ type: 'SELECT', id: item.id });
      };
      const onKeydown = (event: KeyboardEvent): void => {
        if (machine.state === 'disabled') return;

        // Decide which keys count as next/prev for this orientation+dir.
        const horiz = orientation === 'horizontal';
        const isPrev = horiz
          ? direction === 'rtl'
            ? event.key === 'ArrowRight'
            : event.key === 'ArrowLeft'
          : event.key === 'ArrowUp';
        const isNext = horiz
          ? direction === 'rtl'
            ? event.key === 'ArrowLeft'
            : event.key === 'ArrowRight'
          : event.key === 'ArrowDown';

        if (isPrev) {
          event.preventDefault();
          machine.send({ type: 'NAVIGATE', direction: 'prev' });
          focusCurrent(machine, tabElementId);
          return;
        }
        if (isNext) {
          event.preventDefault();
          machine.send({ type: 'NAVIGATE', direction: 'next' });
          focusCurrent(machine, tabElementId);
          return;
        }
        switch (event.key) {
          case 'Home':
            event.preventDefault();
            machine.send({ type: 'NAVIGATE', direction: 'first' });
            focusCurrent(machine, tabElementId);
            break;
          case 'End':
            event.preventDefault();
            machine.send({ type: 'NAVIGATE', direction: 'last' });
            focusCurrent(machine, tabElementId);
            break;
          case ' ':
          case 'Enter':
            event.preventDefault();
            if (machine.context.activation === 'manual') {
              machine.send({ type: 'ACTIVATE_FOCUSED' });
            } else {
              machine.send({ type: 'SELECT', id: item.id });
            }
            break;
          default:
            break;
        }
      };

      const unsubscribe = machine.subscribe(paint);
      node.addEventListener('focus', onFocus);
      node.addEventListener('blur', onBlur);
      node.addEventListener('click', onClick);
      node.addEventListener('keydown', onKeydown);

      return () => {
        unsubscribe();
        node.removeEventListener('focus', onFocus);
        node.removeEventListener('blur', onBlur);
        node.removeEventListener('click', onClick);
        node.removeEventListener('keydown', onKeydown);
      };
    };
  }

  // ── panel attachment ─────────────────────────────────────────────────
  function makePanel(item: TabItem): Attachment {
    return (node) => {
      const elementId = panelElementId(item.id);
      if (!node.id) node.id = elementId;
      node.setAttribute('role', 'tabpanel');
      node.setAttribute('aria-labelledby', tabElementId(item.id));
      // Per APG: keep the panel keyboard-reachable when its content has no
      // focusable descendant. tabindex="0" is safe across renderings.
      if (!node.hasAttribute('tabindex')) {
        node.setAttribute('tabindex', '0');
      }

      const paint = (): void => {
        const isSelected = machine.context.value === item.value;
        node.setAttribute('data-state', isSelected ? 'active' : 'inactive');
        if (isSelected) {
          node.removeAttribute('hidden');
        } else {
          node.setAttribute('hidden', '');
        }
      };
      paint();
      return machine.subscribe(paint);
    };
  }

  return {
    id,
    tabElementId,
    panelElementId,
    get state() {
      return machine.state;
    },
    get context() {
      return machine.context;
    },
    get value() {
      return machine.context.value;
    },
    get focusedId() {
      return machine.context.focusedId;
    },
    get disabled() {
      return machine.state === 'disabled';
    },
    get items() {
      return machine.context.items;
    },
    get activation() {
      return machine.context.activation;
    },
    select: (id) => machine.send({ type: 'SELECT', id }),
    setValue: (value) => machine.send({ type: 'SET.VALUE', value }),
    setItems: (items) => machine.send({ type: 'SET.ITEMS', items }),
    setActivation: (activation) => machine.send({ type: 'SET.ACTIVATION', activation }),
    setDisabled: (disabled) => machine.send({ type: disabled ? 'DISABLE' : 'ENABLE' } as TabsEvent),
    setOrientation: (next) => {
      orientation = next;
    },
    setDirection: (next) => {
      direction = next;
    },
    subscribe: machine.subscribe.bind(machine),
    list,
    tab: makeTab,
    panel: makePanel,
    machine,
  };
}

function focusCurrent(machine: TabsMachine, tabElementId: (id: string) => string): void {
  const id = machine.context.focusedId;
  if (id === null) return;
  const el = typeof document !== 'undefined' ? document.getElementById(tabElementId(id)) : null;
  if (el && typeof (el as HTMLElement).focus === 'function') {
    (el as HTMLElement).focus();
  }
}

export type { TabItem, TabsActivation, TabsContext, TabsEvent, TabsMachine, TabsState };
