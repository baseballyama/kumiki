/**
 * `@kumiki/headless/accordion` — Layer 3 Svelte 5 attachments for Accordion.
 *
 * Compound primitive across **four** factories:
 * - `root` — outer container; data-component-host
 * - `item(item)` — per-item wrapper; data-state reflects open/closed
 * - `trigger(item)` — the focusable header button; aria-expanded,
 *   aria-controls, click + keyboard handling
 * - `panel(item)` — the disclosure region; role="region",
 *   aria-labelledby, hidden when collapsed
 *
 * Triggers form a roving-tabindex set within the accordion. Arrow keys
 * move focus between enabled triggers; Home / End jump. Click and
 * Enter / Space toggle the item per machine policy.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 */

import {
  createAccordionMachine,
  type AccordionContext,
  type AccordionEvent,
  type AccordionItem,
  type AccordionMachine,
  type AccordionMode,
  type AccordionState,
  type CreateAccordionInput,
} from '@kumiki/machines/accordion';
import { tabindexFor } from '@kumiki/primitives/collection';
import { uid } from '@kumiki/primitives/id';

export type Attachment = (node: HTMLElement) => void | (() => void);

export interface AccordionController<V> {
  readonly id: string;
  readonly state: AccordionState;
  readonly context: Readonly<AccordionContext<V>>;
  readonly expandedIds: ReadonlyArray<string>;
  readonly focusedId: string | null;
  readonly mode: AccordionMode;

  toggle(id: string): void;
  expand(id: string): void;
  collapse(id: string): void;
  setItems(items: ReadonlyArray<AccordionItem<V>>): void;
  setValue(value: ReadonlyArray<V> | V | null): void;
  setMode(mode: AccordionMode): void;
  setCollapsible(value: boolean): void;

  subscribe(
    listener: (snapshot: { state: AccordionState; context: AccordionContext<V> }) => void,
  ): () => void;

  /** DOM ids for ARIA wiring. */
  triggerElementId(itemId: string): string;
  panelElementId(itemId: string): string;

  readonly root: Attachment;
  item(item: AccordionItem<V>): Attachment;
  trigger(item: AccordionItem<V>): Attachment;
  panel(item: AccordionItem<V>): Attachment;

  readonly machine: AccordionMachine<V>;
}

export interface CreateAccordionOptions<V> extends CreateAccordionInput<V> {
  onValueChange?: (expandedIds: ReadonlyArray<string>) => void;
  id?: string;
}

export function createAccordion<V>(options: CreateAccordionOptions<V>): AccordionController<V> {
  const machine = createAccordionMachine<V>(options);
  const id = options.id ?? uid('accordion');

  function triggerElementId(itemId: string): string {
    return `${id}-trigger-${itemId}`;
  }
  function panelElementId(itemId: string): string {
    return `${id}-panel-${itemId}`;
  }

  let prevExpanded: ReadonlyArray<string> = machine.context.expandedIds;
  const sameIds = (a: ReadonlyArray<string>, b: ReadonlyArray<string>): boolean =>
    a === b || (a.length === b.length && a.every((x, i) => x === b[i]));
  machine.subscribe(({ context }) => {
    if (!sameIds(context.expandedIds, prevExpanded)) {
      prevExpanded = context.expandedIds;
      options.onValueChange?.(context.expandedIds);
    }
  });

  // ── root ────────────────────────────────────────────────────────────
  const root: Attachment = (node) => {
    if (!node.id) node.id = id;
    node.setAttribute('data-component-host', 'accordion');
    const paint = (): void => {
      node.setAttribute('data-mode', machine.context.mode);
    };
    paint();
    return machine.subscribe(paint);
  };

  // ── item wrapper ────────────────────────────────────────────────────
  function makeItem(item: AccordionItem<V>): Attachment {
    return (node) => {
      node.setAttribute('data-component-part', 'item');
      node.setAttribute('data-value', String(item.value));
      const paint = (): void => {
        const open = machine.context.expandedIds.includes(item.id);
        node.setAttribute('data-state', open ? 'open' : 'closed');
        if (item.disabled) node.setAttribute('data-disabled', '');
      };
      paint();
      return machine.subscribe(paint);
    };
  }

  // ── trigger ─────────────────────────────────────────────────────────
  function makeTrigger(item: AccordionItem<V>): Attachment {
    return (node) => {
      const elementId = triggerElementId(item.id);
      if (!node.id) node.id = elementId;
      if (node.tagName === 'BUTTON' && !node.hasAttribute('type')) {
        node.setAttribute('type', 'button');
      }
      node.setAttribute('data-component-part', 'trigger');
      node.setAttribute('aria-controls', panelElementId(item.id));

      // Read the live disabled flag from machine context so a `setItems` update
      // that toggles `disabled` on an item with the same id is reflected (the
      // captured `item` closure would otherwise go stale).
      const isDisabled = (): boolean =>
        machine.context.items.find((it) => it.id === item.id)?.disabled ?? item.disabled ?? false;

      const paint = (): void => {
        const open = machine.context.expandedIds.includes(item.id);
        node.setAttribute('aria-expanded', String(open));
        node.setAttribute('data-state', open ? 'open' : 'closed');
        if (isDisabled()) node.setAttribute('aria-disabled', 'true');
        else node.removeAttribute('aria-disabled');
        const tab = tabindexFor(machine.context.items, item.id, machine.context.focusedId);
        node.setAttribute('tabindex', String(tab));
        if (machine.context.focusedId === item.id) {
          node.setAttribute('data-focused', '');
        } else {
          node.removeAttribute('data-focused');
        }
      };
      paint();

      const onFocus = (): void => {
        if (isDisabled()) return;
        machine.send({ type: 'FOCUS', id: item.id });
      };
      const onBlur = (): void => {
        if (machine.context.focusedId === item.id) machine.send({ type: 'BLUR' });
      };
      const onClick = (event: MouseEvent): void => {
        if (isDisabled()) return;
        event.preventDefault();
        machine.send({ type: 'TOGGLE', id: item.id });
      };
      const onKeydown = (event: KeyboardEvent): void => {
        // Native button handles Space/Enter via click — no extra handler.
        const direction = NAV_KEYS[event.key];
        if (!direction) return;
        event.preventDefault();
        machine.send({ type: 'NAVIGATE', direction });
        focusCurrent(machine, triggerElementId);
      };

      const unsub = machine.subscribe(paint);
      node.addEventListener('focus', onFocus);
      node.addEventListener('blur', onBlur);
      node.addEventListener('click', onClick);
      node.addEventListener('keydown', onKeydown);

      return () => {
        unsub();
        node.removeEventListener('focus', onFocus);
        node.removeEventListener('blur', onBlur);
        node.removeEventListener('click', onClick);
        node.removeEventListener('keydown', onKeydown);
      };
    };
  }

  // ── panel ───────────────────────────────────────────────────────────
  function makePanel(item: AccordionItem<V>): Attachment {
    return (node) => {
      const elementId = panelElementId(item.id);
      if (!node.id) node.id = elementId;
      node.setAttribute('data-component-part', 'panel');
      node.setAttribute('role', 'region');
      node.setAttribute('aria-labelledby', triggerElementId(item.id));

      const paint = (): void => {
        const open = machine.context.expandedIds.includes(item.id);
        node.setAttribute('data-state', open ? 'open' : 'closed');
        node.toggleAttribute('hidden', !open);
      };
      paint();
      return machine.subscribe(paint);
    };
  }

  return {
    id,
    triggerElementId,
    panelElementId,
    get state() {
      return machine.state;
    },
    get context() {
      return machine.context;
    },
    get expandedIds() {
      return machine.context.expandedIds;
    },
    get focusedId() {
      return machine.context.focusedId;
    },
    get mode() {
      return machine.context.mode;
    },
    toggle: (id) => machine.send({ type: 'TOGGLE', id } as AccordionEvent<V>),
    expand: (id) => machine.send({ type: 'EXPAND', id } as AccordionEvent<V>),
    collapse: (id) => machine.send({ type: 'COLLAPSE', id } as AccordionEvent<V>),
    setItems: (items) => machine.send({ type: 'SET.ITEMS', items }),
    setValue: (value) => machine.send({ type: 'SET.VALUE', value }),
    setMode: (mode) => machine.send({ type: 'SET.MODE', mode }),
    setCollapsible: (value) => machine.send({ type: 'SET.COLLAPSIBLE', value }),
    subscribe: machine.subscribe.bind(machine),
    root,
    item: makeItem,
    trigger: makeTrigger,
    panel: makePanel,
    machine,
  };
}

const NAV_KEYS: Record<string, 'next' | 'prev' | 'first' | 'last'> = {
  ArrowDown: 'next',
  ArrowUp: 'prev',
  Home: 'first',
  End: 'last',
};

function focusCurrent<V>(
  machine: AccordionMachine<V>,
  triggerElementId: (id: string) => string,
): void {
  const id = machine.context.focusedId;
  if (id === null || typeof document === 'undefined') return;
  const el = document.getElementById(triggerElementId(id)) as HTMLElement | null;
  el?.focus?.();
}

export type {
  AccordionContext,
  AccordionEvent,
  AccordionItem,
  AccordionMachine,
  AccordionMode,
  AccordionState,
};
