/**
 * `@kumiki/attachment-radio-group` — Layer 3 Svelte 5 attachments for RadioGroup.
 *
 * RadioGroup is a **compound primitive** spanning multiple DOM elements:
 * - one group container (`role="radiogroup"`)
 * - N item buttons (`role="radio"` each), with roving tabindex semantics
 *
 * Per APG: only ONE item has `tabindex="0"` at a time; the rest have `-1`.
 * Arrow keys move focus AND select. Disabled items are skipped.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/radio/
 */

import {
  createRadioGroupMachine,
  type CreateRadioGroupInput,
  type RadioGroupContext,
  type RadioGroupEvent,
  type RadioGroupMachine,
  type RadioGroupState,
  type RadioItem,
} from '@kumiki/machines/radio-group';
import { tabindexFor } from '@kumiki/primitives/collection';
import { uid } from '@kumiki/primitives/id';

export type Attachment = (node: HTMLElement) => void | (() => void);

export interface RadioGroupController<V> {
  readonly id: string;
  readonly state: RadioGroupState;
  readonly context: Readonly<RadioGroupContext<V>>;
  readonly value: V | null;
  readonly focusedId: string | null;
  readonly disabled: boolean;
  readonly items: ReadonlyArray<RadioItem<V>>;

  /** User-action selection. */
  select(id: string): void;
  /** Programmatic value update. */
  setValue(value: V | null): void;
  /** Replace the group's items (e.g., when filtered). */
  setItems(items: ReadonlyArray<RadioItem<V>>): void;
  setDisabled(disabled: boolean): void;

  subscribe(
    listener: (snapshot: { state: RadioGroupState; context: RadioGroupContext<V> }) => void,
  ): () => void;

  /** Compute the DOM id for a given item. */
  itemElementId(itemId: string): string;

  /** Attach to the group container. */
  readonly root: Attachment;
  /**
   * Attach to one item element. Returns an attachment closure that wires
   * click + keyboard for that specific item.
   */
  item(item: RadioItem<V>): Attachment;

  /** Underlying machine — exposed for advanced use, debugging, tests. */
  readonly machine: RadioGroupMachine<V>;
}

export interface CreateRadioGroupOptions<V> extends CreateRadioGroupInput<V> {
  onValueChange?: (value: V | null) => void;
  id?: string;
}

/**
 * Create a RadioGroup controller plus the group + item attachment factories.
 *
 * @when-to-use Direct headless integration when Layer 4's compound API is
 *              too opinionated about markup. Custom radio rendering, exotic
 *              layouts, integration with form libraries.
 *
 * @anti-pattern Don't reuse one controller across multiple RadioGroups —
 *               each group owns its machine.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/radio/
 */
export function createRadioGroup<V>(options: CreateRadioGroupOptions<V>): RadioGroupController<V> {
  const machine = createRadioGroupMachine<V>(options);
  const id = options.id ?? uid('radio-group');

  function itemElementId(itemId: string): string {
    return `${id}-item-${itemId}`;
  }

  // Track previous value so we only fire onValueChange on actual transitions.
  let prevValue: V | null = machine.context.value;
  machine.subscribe(({ context }) => {
    if (context.value !== prevValue) {
      prevValue = context.value;
      options.onValueChange?.(context.value);
    }
  });

  // ── group root attachment ────────────────────────────────────────────
  const root: Attachment = (node) => {
    if (!node.id) node.id = id;
    node.setAttribute('role', 'radiogroup');
    node.setAttribute('data-component', 'radio-group');

    const paint = (): void => {
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

  // ── item attachment ──────────────────────────────────────────────────
  function makeItem(item: RadioItem<V>): Attachment {
    return (node) => {
      const elementId = itemElementId(item.id);
      if (!node.id) node.id = elementId;
      node.setAttribute('role', 'radio');
      node.setAttribute('data-value', item.id);
      if (node.tagName === 'BUTTON' && !node.hasAttribute('type')) {
        node.setAttribute('type', 'button');
      }
      if (item.disabled) node.setAttribute('aria-disabled', 'true');

      const paint = (): void => {
        const isSelected = machine.context.value === item.value;
        const tab = tabindexFor(machine.context.items, item.id, machine.context.focusedId);
        node.setAttribute('aria-checked', String(isSelected));
        node.setAttribute('data-state', isSelected ? 'checked' : 'unchecked');
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
      const onClick = (event: MouseEvent): void => {
        if (item.disabled || machine.state === 'disabled') return;
        event.preventDefault();
        machine.send({ type: 'SELECT', id: item.id });
      };
      const onKeydown = (event: KeyboardEvent): void => {
        if (machine.state === 'disabled') return;
        switch (event.key) {
          case 'ArrowDown':
          case 'ArrowRight':
            event.preventDefault();
            machine.send({ type: 'NAVIGATE', direction: 'next' });
            focusCurrentItem(machine, itemElementId);
            break;
          case 'ArrowUp':
          case 'ArrowLeft':
            event.preventDefault();
            machine.send({ type: 'NAVIGATE', direction: 'prev' });
            focusCurrentItem(machine, itemElementId);
            break;
          case 'Home':
            event.preventDefault();
            machine.send({ type: 'NAVIGATE', direction: 'first' });
            focusCurrentItem(machine, itemElementId);
            break;
          case 'End':
            event.preventDefault();
            machine.send({ type: 'NAVIGATE', direction: 'last' });
            focusCurrentItem(machine, itemElementId);
            break;
          case ' ':
          case 'Enter':
            // APG: Space activates the focused radio (idempotent if already
            // selected). Enter is sometimes treated the same; we accept both.
            event.preventDefault();
            machine.send({ type: 'SELECT', id: item.id });
            break;
          default:
            break;
        }
      };

      const unsubscribe = machine.subscribe(paint);
      node.addEventListener('focus', onFocus);
      node.addEventListener('click', onClick);
      node.addEventListener('keydown', onKeydown);

      return () => {
        unsubscribe();
        node.removeEventListener('focus', onFocus);
        node.removeEventListener('click', onClick);
        node.removeEventListener('keydown', onKeydown);
      };
    };
  }

  return {
    id,
    itemElementId,
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
    select: (id) => machine.send({ type: 'SELECT', id }),
    setValue: (value) => machine.send({ type: 'SET.VALUE', value }),
    setItems: (items) => machine.send({ type: 'SET.ITEMS', items }),
    setDisabled: (disabled) =>
      machine.send({ type: disabled ? 'DISABLE' : 'ENABLE' } as RadioGroupEvent<V>),
    subscribe: machine.subscribe.bind(machine),
    root,
    item: makeItem,
    machine,
  };
}

/**
 * After NAVIGATE updates `focusedId`, move actual DOM focus to that item so
 * the keyboard can keep operating without the user re-tabbing in. The radio
 * pattern requires this — without it, the visible "selected" radio drifts
 * away from the focused element.
 */
function focusCurrentItem<V>(
  machine: RadioGroupMachine<V>,
  itemElementId: (id: string) => string,
): void {
  const id = machine.context.focusedId;
  if (id === null) return;
  const el = typeof document !== 'undefined' ? document.getElementById(itemElementId(id)) : null;
  if (el && typeof (el as HTMLElement).focus === 'function') {
    (el as HTMLElement).focus();
  }
}

export type { RadioGroupContext, RadioGroupEvent, RadioGroupMachine, RadioGroupState, RadioItem };
