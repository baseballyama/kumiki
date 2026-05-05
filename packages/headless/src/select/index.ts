/**
 * `@kumiki/attachment-select` — Layer 3 Svelte 5 attachments for Select.
 *
 * Three factories: trigger, listbox, option. The trigger is a button that
 * pops the listbox; the listbox holds N option elements with the active-
 * descendant pattern (`aria-activedescendant` rather than rolling tabindex).
 *
 * Keyboard (per APG listbox):
 * - On trigger: Enter / Space / ArrowDown / ArrowUp open the listbox.
 *   Printable chars open the listbox AND seed the type-ahead buffer.
 * - On listbox (still focused on trigger; aria-activedescendant points at
 *   the highlighted option):
 *   - ArrowDown / ArrowUp navigate
 *   - Home / End jump
 *   - Enter / Space commit highlighted option (SELECT)
 *   - Escape close
 *   - Tab close + let focus advance (APG behavior)
 *   - Printable chars feed type-ahead; debounced TYPEAHEAD.RESET fires
 *     500 ms after the last keystroke
 *
 * Outside-click closes via the dismissable primitive. The trigger is in
 * the dismissable's ignore list so the click that toggles the listbox
 * doesn't fire CLOSE simultaneously.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 */

import {
  createSelectMachine,
  type CreateSelectInput,
  type SelectContext,
  type SelectEvent,
  type SelectItem,
  type SelectMachine,
  type SelectState,
} from '@kumiki/machines/select';
import { createDismissable, type Dismissable } from '@kumiki/primitives/dismissable';
import { uid } from '@kumiki/primitives/id';

export type Attachment = (node: HTMLElement) => void | (() => void);

const TYPEAHEAD_DEBOUNCE_MS = 500;

export interface SelectController<V> {
  readonly id: string;
  readonly state: SelectState;
  readonly context: Readonly<SelectContext<V>>;
  readonly value: V | null;
  readonly open: boolean;
  readonly highlightedId: string | null;

  show(): void;
  hide(): void;
  toggle(): void;
  selectId(id: string): void;
  setValue(value: V | null): void;
  setItems(items: ReadonlyArray<SelectItem<V>>): void;

  subscribe(
    listener: (snapshot: { state: SelectState; context: SelectContext<V> }) => void,
  ): () => void;

  readonly triggerId: string;
  readonly listboxId: string;
  optionElementId(itemId: string): string;

  readonly trigger: Attachment;
  readonly listbox: Attachment;
  option(item: SelectItem<V>): Attachment;

  readonly machine: SelectMachine<V>;
}

export interface CreateSelectOptions<V> extends CreateSelectInput<V> {
  onValueChange?: (value: V | null) => void;
  onOpenChange?: (open: boolean) => void;
  id?: string;
}

export function createSelect<V>(options: CreateSelectOptions<V>): SelectController<V> {
  const machine = createSelectMachine<V>(options);
  const id = options.id ?? uid('select');
  const triggerId = `${id}-trigger`;
  const listboxId = `${id}-listbox`;

  function optionElementId(itemId: string): string {
    return `${id}-option-${itemId}`;
  }

  let prevValue: V | null = machine.context.value;
  let prevOpen = machine.state === 'open';
  machine.subscribe(({ state, context }) => {
    if (context.value !== prevValue) {
      prevValue = context.value;
      options.onValueChange?.(context.value);
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

  function ensureDismissable(listboxEl: HTMLElement): void {
    if (dismiss) return;
    dismiss = createDismissable(listboxEl, {
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
    node.setAttribute('aria-haspopup', 'listbox');
    node.setAttribute('aria-controls', listboxId);
    node.setAttribute('data-component-host', 'select');
    triggerEl = node;

    const paint = (): void => {
      node.setAttribute('aria-expanded', String(machine.state === 'open'));
      node.setAttribute('data-state', machine.state);
      const highlight = machine.context.highlightedId;
      if (highlight !== null) {
        node.setAttribute('aria-activedescendant', optionElementId(highlight));
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
          case 'ArrowUp':
            event.preventDefault();
            machine.send({ type: 'OPEN' });
            return;
          default:
            // Printable chars: open and seed typeahead.
            if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
              event.preventDefault();
              machine.send({ type: 'OPEN' });
              machine.send({ type: 'TYPEAHEAD', char: event.key });
              scheduleTypeaheadReset();
            }
            return;
        }
      }

      // Listbox is open — handle navigation + commit.
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
          if (id !== null) machine.send({ type: 'SELECT', id });
          else machine.send({ type: 'CLOSE' });
          break;
        }
        case 'Escape':
          event.preventDefault();
          machine.send({ type: 'ESCAPE' });
          break;
        case 'Tab':
          // Let Tab move focus naturally; just close.
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

  // ── listbox ─────────────────────────────────────────────────────────
  const listbox: Attachment = (node) => {
    if (!node.id) node.id = listboxId;
    node.setAttribute('role', 'listbox');
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

  // ── option ──────────────────────────────────────────────────────────
  function option(item: SelectItem<V>): Attachment {
    return (node) => {
      const elementId = optionElementId(item.id);
      if (!node.id) node.id = elementId;
      node.setAttribute('role', 'option');
      node.setAttribute('data-value', item.id);
      if (item.disabled) node.setAttribute('aria-disabled', 'true');

      const paint = (): void => {
        const isSelected = machine.context.value === item.value;
        const isHighlighted = machine.context.highlightedId === item.id;
        node.setAttribute('aria-selected', String(isSelected));
        node.setAttribute('data-state', isSelected ? 'selected' : 'unselected');
        if (isHighlighted) node.setAttribute('data-highlighted', '');
        else node.removeAttribute('data-highlighted');
      };
      paint();

      const onPointerEnter = (): void => {
        if (item.disabled || machine.state !== 'open') return;
        machine.send({ type: 'HIGHLIGHT', id: item.id });
      };
      const onClick = (event: MouseEvent): void => {
        if (item.disabled) return;
        event.preventDefault();
        machine.send({ type: 'SELECT', id: item.id });
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
    listboxId,
    optionElementId,
    get state() {
      return machine.state;
    },
    get context() {
      return machine.context;
    },
    get value() {
      return machine.context.value;
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
    selectId: (id) => machine.send({ type: 'SELECT', id }),
    setValue: (value) => machine.send({ type: 'SET.VALUE', value }),
    setItems: (items) => machine.send({ type: 'SET.ITEMS', items }),
    subscribe: machine.subscribe.bind(machine),
    trigger,
    listbox,
    option,
    machine,
  };
}

export type { SelectContext, SelectEvent, SelectItem, SelectMachine, SelectState };
