/**
 * `@kumiki/headless/number-field` — Layer 3 Svelte 5 attachments for
 * NumberField (spin button).
 *
 * Factories:
 * - `root` — container; paints `data-disabled` and exposes
 *   `data-component-host="number-field"`.
 * - `input` — the editable text input. `role="spinbutton"`, full ARIA
 *   value attributes, keyboard handling per APG.
 * - `increment` / `decrement` — optional buttons to step up / down. Tied
 *   to `aria-controls` so AT users can find them; disabled when machine
 *   is disabled or the value is at the relevant boundary.
 *
 * Keyboard (per APG Spin Button):
 * - ArrowUp = INCREMENT, ArrowDown = DECREMENT
 * - PageUp = PAGE_INCREMENT, PageDown = PAGE_DECREMENT
 * - Home = TO_MIN (when bounded), End = TO_MAX (when bounded)
 * - Typing into the input parses on `change`/blur (Enter or focus loss).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/
 */

import {
  createNumberFieldMachine,
  type CreateNumberFieldInput,
  type NumberFieldContext,
  type NumberFieldEvent,
  type NumberFieldMachine,
  type NumberFieldState,
} from '@kumiki/machines/number-field';
import { uid } from '@kumiki/primitives/id';

export type Attachment = (node: HTMLElement) => void | (() => void);

export interface NumberFieldController {
  readonly id: string;
  readonly state: NumberFieldState;
  readonly context: Readonly<NumberFieldContext>;
  readonly value: number | null;
  readonly disabled: boolean;

  setValue(value: number | null): void;
  setMin(value: number): void;
  setMax(value: number): void;
  setStep(value: number): void;
  setPageStep(value: number): void;
  setDisabled(value: boolean): void;
  increment(): void;
  decrement(): void;
  pageIncrement(): void;
  pageDecrement(): void;
  toMin(): void;
  toMax(): void;
  clear(): void;

  subscribe(
    listener: (snapshot: { state: NumberFieldState; context: NumberFieldContext }) => void,
  ): () => void;

  readonly inputId: string;

  readonly root: Attachment;
  readonly input: Attachment;
  readonly increment_: Attachment;
  readonly decrement_: Attachment;

  readonly machine: NumberFieldMachine;
}

export interface CreateNumberFieldOptions extends CreateNumberFieldInput {
  onValueChange?: (value: number | null) => void;
  id?: string;
  /**
   * Optional formatter. Receives the numeric value (never null) and
   * returns the string to display in the input. Defaults to `String(n)`.
   */
  format?: (value: number) => string;
  /**
   * Optional parser. Receives the raw input string and returns a number,
   * `null` (cleared), or `undefined` (rejected — keep prior value).
   * Defaults to a permissive `Number(...)` after stripping common
   * separators.
   */
  parse?: (raw: string) => number | null | undefined;
}

const DEFAULT_PARSE = (raw: string): number | null | undefined => {
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  // Strip thousands separators and convert localized commas.
  const normalized = trimmed.replace(/[\s,_](?=\d)/g, '');
  const n = Number(normalized);
  if (!Number.isFinite(n)) return undefined;
  return n;
};

export function createNumberField(options: CreateNumberFieldOptions = {}): NumberFieldController {
  const machine = createNumberFieldMachine(options);
  const id = options.id ?? uid('number-field');
  const inputId = `${id}-input`;
  const format = options.format ?? ((n: number) => String(n));
  const parse = options.parse ?? DEFAULT_PARSE;

  let prev = machine.context.value;
  machine.subscribe(({ context }) => {
    if (context.value !== prev) {
      prev = context.value;
      options.onValueChange?.(context.value);
    }
  });

  const root: Attachment = (node) => {
    if (!node.id) node.id = id;
    node.setAttribute('data-component-host', 'number-field');
    const paint = (): void => {
      if (machine.state === 'disabled') node.setAttribute('data-disabled', '');
      else node.removeAttribute('data-disabled');
    };
    paint();
    const unsub = machine.subscribe(paint);
    return () => unsub();
  };

  const input: Attachment = (node) => {
    if (!node.id) node.id = inputId;
    if (!(node instanceof HTMLInputElement)) {
      // Non-input host: still valid (text-mode), but we set role anyway.
    }
    node.setAttribute('role', 'spinbutton');
    if (!node.hasAttribute('tabindex') && !(node instanceof HTMLInputElement)) {
      node.setAttribute('tabindex', '0');
    }
    if (node instanceof HTMLInputElement) {
      // Default to inputmode=numeric so mobile keyboards behave.
      if (!node.hasAttribute('inputmode')) node.setAttribute('inputmode', 'decimal');
      if (!node.type || node.type === 'number') node.type = 'text';
    }

    const paint = (): void => {
      const ctx = machine.context;
      if (Number.isFinite(ctx.min)) node.setAttribute('aria-valuemin', String(ctx.min));
      else node.removeAttribute('aria-valuemin');
      if (Number.isFinite(ctx.max)) node.setAttribute('aria-valuemax', String(ctx.max));
      else node.removeAttribute('aria-valuemax');
      if (ctx.value === null) {
        node.removeAttribute('aria-valuenow');
        node.removeAttribute('aria-valuetext');
      } else {
        node.setAttribute('aria-valuenow', String(ctx.value));
        node.setAttribute('aria-valuetext', format(ctx.value));
      }
      node.setAttribute('data-state', machine.state);
      if (machine.state === 'disabled') node.setAttribute('aria-disabled', 'true');
      else node.removeAttribute('aria-disabled');

      // Reflect the value into the input only if the user isn't typing.
      if (node instanceof HTMLInputElement && document.activeElement !== node) {
        node.value = ctx.value === null ? '' : format(ctx.value);
      }
    };
    paint();

    function commit(): void {
      if (!(node instanceof HTMLInputElement)) return;
      const parsed = parse(node.value);
      if (parsed === undefined) {
        // Reject — restore previous text.
        const ctx = machine.context;
        node.value = ctx.value === null ? '' : format(ctx.value);
        return;
      }
      machine.send({ type: 'SET.VALUE', value: parsed });
      // Re-paint to format the accepted value.
      paint();
    }

    const syncText = (): void => {
      if (node instanceof HTMLInputElement)
        node.value = machine.context.value === null ? '' : format(machine.context.value);
    };

    const onKeydown = (event: KeyboardEvent): void => {
      if (machine.state === 'disabled') return;
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          machine.send({ type: 'INCREMENT' });
          syncText();
          break;
        case 'ArrowDown':
          event.preventDefault();
          machine.send({ type: 'DECREMENT' });
          syncText();
          break;
        case 'PageUp':
          event.preventDefault();
          machine.send({ type: 'PAGE_INCREMENT' });
          syncText();
          break;
        case 'PageDown':
          event.preventDefault();
          machine.send({ type: 'PAGE_DECREMENT' });
          syncText();
          break;
        case 'Home':
          if (Number.isFinite(machine.context.min)) {
            event.preventDefault();
            machine.send({ type: 'TO_MIN' });
            syncText();
          }
          break;
        case 'End':
          if (Number.isFinite(machine.context.max)) {
            event.preventDefault();
            machine.send({ type: 'TO_MAX' });
            syncText();
          }
          break;
        case 'Enter':
          if (node instanceof HTMLInputElement) commit();
          break;
        default:
          break;
      }
    };

    const onBlur = (): void => {
      if (node instanceof HTMLInputElement) commit();
    };

    node.addEventListener('keydown', onKeydown);
    node.addEventListener('blur', onBlur);
    const unsub = machine.subscribe(paint);

    return () => {
      unsub();
      node.removeEventListener('keydown', onKeydown);
      node.removeEventListener('blur', onBlur);
    };
  };

  function makeStepButton(direction: 'increment' | 'decrement'): Attachment {
    return (node) => {
      node.setAttribute('aria-controls', inputId);
      node.setAttribute('tabindex', '-1');
      if (node instanceof HTMLButtonElement && !node.hasAttribute('type')) node.type = 'button';
      const paint = (): void => {
        const ctx = machine.context;
        const atBoundary =
          direction === 'increment'
            ? ctx.value !== null && ctx.value >= ctx.max
            : ctx.value !== null && ctx.value <= ctx.min;
        const disabled = machine.state === 'disabled' || atBoundary;
        if (disabled) {
          node.setAttribute('aria-disabled', 'true');
          if (node instanceof HTMLButtonElement) node.disabled = true;
        } else {
          node.removeAttribute('aria-disabled');
          if (node instanceof HTMLButtonElement) node.disabled = false;
        }
      };
      paint();
      const onClick = (event: MouseEvent): void => {
        if (machine.state === 'disabled') return;
        event.preventDefault();
        machine.send({ type: direction === 'increment' ? 'INCREMENT' : 'DECREMENT' });
      };
      node.addEventListener('click', onClick);
      const unsub = machine.subscribe(paint);
      return () => {
        unsub();
        node.removeEventListener('click', onClick);
      };
    };
  }

  const increment_ = makeStepButton('increment');
  const decrement_ = makeStepButton('decrement');

  return {
    id,
    inputId,
    get state() {
      return machine.state;
    },
    get context() {
      return machine.context;
    },
    get value() {
      return machine.context.value;
    },
    get disabled() {
      return machine.state === 'disabled';
    },
    setValue: (v) => machine.send({ type: 'SET.VALUE', value: v }),
    setMin: (v) => machine.send({ type: 'SET.MIN', value: v }),
    setMax: (v) => machine.send({ type: 'SET.MAX', value: v }),
    setStep: (v) => machine.send({ type: 'SET.STEP', value: v }),
    setPageStep: (v) => machine.send({ type: 'SET.PAGE_STEP', value: v }),
    setDisabled: (v) => machine.send({ type: v ? 'DISABLE' : 'ENABLE' } as NumberFieldEvent),
    increment: () => machine.send({ type: 'INCREMENT' }),
    decrement: () => machine.send({ type: 'DECREMENT' }),
    pageIncrement: () => machine.send({ type: 'PAGE_INCREMENT' }),
    pageDecrement: () => machine.send({ type: 'PAGE_DECREMENT' }),
    toMin: () => machine.send({ type: 'TO_MIN' }),
    toMax: () => machine.send({ type: 'TO_MAX' }),
    clear: () => machine.send({ type: 'CLEAR' }),
    subscribe: machine.subscribe.bind(machine),
    root,
    input,
    increment_,
    decrement_,
    machine,
  };
}

export type { NumberFieldContext, NumberFieldEvent, NumberFieldMachine, NumberFieldState };
