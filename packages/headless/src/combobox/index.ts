/**
 * `@kumiki/headless/combobox` — Layer 3 Svelte 5 attachments for Combobox.
 *
 * Unlike Toggle / Switch, Combobox is a **compound** primitive that spans
 * multiple DOM elements (input, listbox, options, optional trigger). The
 * controller exposes one attachment factory per element role, plus
 * `option(item)` which returns a fresh attachment for each option in the list.
 *
 * Floating UI integration is intentionally deferred: we anchor the listbox via
 * plain CSS positioning. `withFloatingUi` is the planned composition for
 * collision-aware placement (Phase 2).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 * @see docs/design/02-architecture.md §2.5
 */

import {
  createComboboxMachine,
  type ComboboxContext,
  type ComboboxEvent,
  type ComboboxMachine,
  type ComboboxOption,
  type ComboboxState,
  type ComboboxStatus,
  type CreateComboboxInput,
  type NavigateDirection,
} from '@kumiki/machines/combobox';
import { uid } from '@kumiki/primitives/id';

export type Attachment = (node: HTMLElement) => void | (() => void);

export interface ComboboxController<T extends ComboboxOption> {
  readonly id: string;
  readonly inputId: string;
  readonly listboxId: string;

  readonly state: ComboboxState;
  readonly context: Readonly<ComboboxContext<T>>;
  readonly isOpen: boolean;
  readonly disabled: boolean;
  readonly query: string;
  readonly filtered: ReadonlyArray<T>;
  readonly highlightedId: string | null;
  readonly value: T | null;
  readonly status: ComboboxStatus;

  open(): void;
  close(): void;
  navigate(direction: NavigateDirection): void;
  /** User-action selection — fires onValueChange and closes the listbox. */
  select(option: T): void;
  /** Programmatic value update — works in any state, does not transition. */
  setValue(value: T | null): void;
  reset(): void;
  setDisabled(disabled: boolean): void;

  optionElementId(optionId: string): string;

  subscribe(
    listener: (snapshot: { state: ComboboxState; context: ComboboxContext<T> }) => void,
  ): () => void;

  readonly root: Attachment;
  readonly input: Attachment;
  readonly listbox: Attachment;
  option(option: T): Attachment;
  readonly trigger: Attachment;

  readonly machine: ComboboxMachine<T>;
}

export interface CreateComboboxOptions<T extends ComboboxOption> extends CreateComboboxInput<T> {
  /** Called when the selected value changes (user-initiated). */
  onValueChange?: (value: T | null) => void;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Called on every input change. */
  onQueryChange?: (query: string) => void;
  id?: string;
}

/**
 * Create a Combobox controller plus its `{@attach}`-compatible attachments.
 *
 * @when-to-use Direct headless integration when Layer 4's compound API is too
 *              opinionated. Custom listbox markup, custom option layouts —
 *              all handled here.
 *
 * @anti-pattern Don't reuse a single controller across multiple inputs. Each
 *               combobox owns its machine.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */
export function createCombobox<T extends ComboboxOption>(
  options: CreateComboboxOptions<T> = {},
): ComboboxController<T> {
  const machine = createComboboxMachine<T>(options);
  const id = options.id ?? uid('combobox');
  const inputId = `${id}-input`;
  const listboxId = `${id}-listbox`;

  function optionElementId(optionId: string): string {
    return `${id}-option-${optionId}`;
  }

  // Track the previous snapshot so we know when to fire change callbacks.
  let prevValue: T | null = machine.context.value;
  let prevOpen = machine.state === 'open';
  let prevQuery = machine.context.query;
  // Set while a programmatic `setValue()` is in flight so the resulting value
  // change does not fire `onValueChange` — that callback reports user-initiated
  // selection only (matching its JSDoc and the controlled-binding contract).
  let programmaticValueSet = false;

  machine.subscribe(({ state, context }) => {
    if (context.value !== prevValue) {
      prevValue = context.value;
      if (!programmaticValueSet) options.onValueChange?.(context.value);
    }
    const open = state === 'open';
    if (open !== prevOpen) {
      prevOpen = open;
      options.onOpenChange?.(open);
    }
    if (context.query !== prevQuery) {
      prevQuery = context.query;
      options.onQueryChange?.(context.query);
    }
  });

  // ── input attachment ─────────────────────────────────────────────────
  const input: Attachment = (node) => {
    if (!node.id) node.id = inputId;
    node.setAttribute('role', 'combobox');
    node.setAttribute('aria-autocomplete', 'list');
    node.setAttribute('aria-controls', listboxId);
    node.setAttribute('aria-expanded', String(machine.state === 'open'));

    const paint = (): void => {
      const isOpen = machine.state === 'open';
      const isDisabled = machine.state === 'disabled';
      node.setAttribute('aria-expanded', String(isOpen));
      const highlightedId = machine.context.highlightedId;
      if (highlightedId) {
        node.setAttribute('aria-activedescendant', optionElementId(highlightedId));
      } else {
        node.removeAttribute('aria-activedescendant');
      }
      if (isDisabled) {
        node.setAttribute('aria-disabled', 'true');
        if (node instanceof HTMLInputElement) node.disabled = true;
      } else {
        node.removeAttribute('aria-disabled');
        if (node instanceof HTMLInputElement) node.disabled = false;
      }
      // Sync input value to query (machine-controlled model).
      if (node instanceof HTMLInputElement && node.value !== machine.context.query) {
        node.value = machine.context.query;
      }
    };
    paint();

    const onFocus = (): void => {
      if (machine.state === 'disabled') return;
      machine.send({ type: 'INPUT.FOCUS' });
    };
    const onBlur = (): void => {
      // Defer slightly so option clicks land first.
      setTimeout(() => {
        if (machine.state === 'open') machine.send({ type: 'INPUT.BLUR' });
      }, 100);
    };
    const onInput = (event: Event): void => {
      if (machine.state === 'disabled') return;
      const value =
        node instanceof HTMLInputElement
          ? node.value
          : ((event.target as HTMLElement).textContent ?? '');
      machine.send({ type: 'INPUT.CHANGE', value });
    };
    const onKeydown = (event: KeyboardEvent): void => {
      if (machine.state === 'disabled') return;
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          machine.send({ type: 'INPUT.NAVIGATE', direction: 'next' });
          break;
        case 'ArrowUp':
          event.preventDefault();
          machine.send({ type: 'INPUT.NAVIGATE', direction: 'prev' });
          break;
        case 'Home':
          if (machine.state === 'open') {
            event.preventDefault();
            machine.send({ type: 'INPUT.NAVIGATE', direction: 'first' });
          }
          break;
        case 'End':
          if (machine.state === 'open') {
            event.preventDefault();
            machine.send({ type: 'INPUT.NAVIGATE', direction: 'last' });
          }
          break;
        case 'PageDown':
          if (machine.state === 'open') {
            event.preventDefault();
            machine.send({ type: 'INPUT.NAVIGATE', direction: 'page-next' });
          }
          break;
        case 'PageUp':
          if (machine.state === 'open') {
            event.preventDefault();
            machine.send({ type: 'INPUT.NAVIGATE', direction: 'page-prev' });
          }
          break;
        case 'Enter':
          if (machine.state === 'open' && machine.context.highlightedId) {
            event.preventDefault();
            machine.send({ type: 'INPUT.ENTER' });
          }
          break;
        case 'Escape':
          if (machine.state === 'open') {
            event.preventDefault();
            machine.send({ type: 'INPUT.ESCAPE' });
          }
          break;
        default:
          break;
      }
    };

    const unsubscribe = machine.subscribe(paint);
    node.addEventListener('focus', onFocus);
    node.addEventListener('blur', onBlur);
    node.addEventListener('input', onInput);
    node.addEventListener('keydown', onKeydown);

    return () => {
      unsubscribe();
      node.removeEventListener('focus', onFocus);
      node.removeEventListener('blur', onBlur);
      node.removeEventListener('input', onInput);
      node.removeEventListener('keydown', onKeydown);
    };
  };

  // ── listbox attachment ───────────────────────────────────────────────
  const listbox: Attachment = (node) => {
    if (!node.id) node.id = listboxId;
    node.setAttribute('role', 'listbox');

    const paint = (): void => {
      node.setAttribute('data-state', machine.state === 'open' ? 'open' : 'closed');
      if (machine.state !== 'open') {
        node.setAttribute('hidden', '');
      } else {
        node.removeAttribute('hidden');
      }
    };
    paint();
    return machine.subscribe(paint);
  };

  // ── option attachment ────────────────────────────────────────────────
  function makeOption(option: T): Attachment {
    return (node) => {
      const elementId = optionElementId(option.id);
      if (!node.id) node.id = elementId;
      node.setAttribute('role', 'option');
      node.setAttribute('data-value', option.id);
      if (option.disabled) node.setAttribute('aria-disabled', 'true');

      const paint = (): void => {
        const isHighlighted = machine.context.highlightedId === option.id;
        const isSelected = machine.context.value?.id === option.id;
        node.setAttribute('aria-selected', String(isSelected));
        node.setAttribute('data-highlighted', String(isHighlighted));
        node.setAttribute('data-selected', String(isSelected));
      };
      paint();

      const onMouseEnter = (): void => {
        if (option.disabled) return;
        machine.send({ type: 'OPTION.HIGHLIGHT', id: option.id });
      };
      const onMouseDown = (event: MouseEvent): void => {
        // Prevent input blur stealing the click.
        event.preventDefault();
      };
      const onClick = (): void => {
        if (option.disabled) return;
        machine.send({ type: 'OPTION.SELECT', option });
      };

      const unsubscribe = machine.subscribe(paint);
      node.addEventListener('mouseenter', onMouseEnter);
      node.addEventListener('mousedown', onMouseDown);
      node.addEventListener('click', onClick);

      return () => {
        unsubscribe();
        node.removeEventListener('mouseenter', onMouseEnter);
        node.removeEventListener('mousedown', onMouseDown);
        node.removeEventListener('click', onClick);
      };
    };
  }

  // ── trigger attachment ───────────────────────────────────────────────
  const trigger: Attachment = (node) => {
    node.setAttribute('aria-controls', listboxId);
    node.setAttribute('aria-haspopup', 'listbox');
    node.setAttribute('tabindex', '-1');
    if (node.tagName === 'BUTTON' && !node.hasAttribute('type')) {
      node.setAttribute('type', 'button');
    }

    const paint = (): void => {
      node.setAttribute('aria-expanded', String(machine.state === 'open'));
      node.setAttribute('data-state', machine.state === 'open' ? 'open' : 'closed');
    };
    paint();

    const onClick = (event: MouseEvent): void => {
      if (machine.state === 'disabled') return;
      event.preventDefault();
      machine.send({ type: 'TRIGGER.CLICK' });
    };

    const unsubscribe = machine.subscribe(paint);
    node.addEventListener('click', onClick);
    return () => {
      unsubscribe();
      node.removeEventListener('click', onClick);
    };
  };

  // ── root attachment (data-state on wrapper) ──────────────────────────
  const root: Attachment = (node) => {
    if (!node.id) node.id = id;
    node.setAttribute('data-component', 'combobox');

    const paint = (): void => {
      node.setAttribute('data-state', machine.state);
      if (machine.context.value) {
        node.setAttribute('data-has-value', '');
      } else {
        node.removeAttribute('data-has-value');
      }
    };
    paint();
    return machine.subscribe(paint);
  };

  return {
    id,
    inputId,
    listboxId,
    optionElementId,
    get state() {
      return machine.state;
    },
    get context() {
      return machine.context;
    },
    get isOpen() {
      return machine.state === 'open';
    },
    get disabled() {
      return machine.state === 'disabled';
    },
    get query() {
      return machine.context.query;
    },
    get filtered() {
      return machine.context.filtered;
    },
    get highlightedId() {
      return machine.context.highlightedId;
    },
    get value() {
      return machine.context.value;
    },
    get status() {
      return machine.context.status;
    },
    open: () => machine.send({ type: 'OPEN' }),
    close: () => machine.send({ type: 'CLOSE' }),
    navigate: (direction: NavigateDirection) => machine.send({ type: 'INPUT.NAVIGATE', direction }),
    select: (option: T) => machine.send({ type: 'OPTION.SELECT', option }),
    setValue: (value: T | null) => {
      programmaticValueSet = true;
      machine.send({ type: 'SET.VALUE', value });
      programmaticValueSet = false;
    },
    reset: () => machine.send({ type: 'RESET' }),
    setDisabled: (disabled: boolean) =>
      machine.send({ type: disabled ? 'DISABLE' : 'ENABLE' } as ComboboxEvent<T>),
    subscribe: machine.subscribe.bind(machine),
    root,
    input,
    listbox,
    option: makeOption,
    trigger,
    machine,
  };
}

export type {
  ComboboxContext,
  ComboboxEvent,
  ComboboxMachine,
  ComboboxOption,
  ComboboxState,
  ComboboxStatus,
  NavigateDirection,
};
