/**
 * `@kumiki/attachment-checkbox` — Layer 3 Svelte 5 attachment for the Checkbox.
 *
 * Tri-state, per APG: emits `role="checkbox"` + `aria-checked` with one of
 * `'true'`, `'false'`, `'mixed'`. Click and Space/Enter toggle between
 * `unchecked` and `checked` (from `mixed`, lands on `checked`).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/checkbox-tristate/
 */

import {
  createCheckboxMachine,
  type CheckboxContext,
  type CheckboxEvent,
  type CheckboxMachine,
  type CheckboxState,
  type CheckboxValue,
  type CreateCheckboxInput,
} from '@kumiki/machine-checkbox';
import { uid } from '@kumiki/primitives/id';

export type Attachment = (node: HTMLElement) => void | (() => void);

export interface CheckboxController {
  readonly id: string;
  readonly state: CheckboxState;
  readonly context: Readonly<CheckboxContext>;
  readonly value: CheckboxValue;
  readonly checked: boolean;
  readonly indeterminate: boolean;
  readonly disabled: boolean;
  toggle(): void;
  set(value: CheckboxValue): void;
  setDisabled(disabled: boolean): void;
  subscribe(
    listener: (snapshot: { state: CheckboxState; context: CheckboxContext }) => void,
  ): () => void;
  readonly root: Attachment;
  readonly machine: CheckboxMachine;
}

export interface CreateCheckboxOptions extends CreateCheckboxInput {
  /**
   * User-initiated value changes only. NOT called for controlled `set()`
   * updates that came from the parent.
   */
  onCheckedChange?: (value: CheckboxValue) => void;
  id?: string;
}

/**
 * `aria-checked` accepts the string `"mixed"` for indeterminate. The DOM
 * attribute is always one of these three values.
 */
function ariaCheckedFor(value: CheckboxValue): 'true' | 'false' | 'mixed' {
  if (value === 'checked') return 'true';
  if (value === 'mixed') return 'mixed';
  return 'false';
}

/**
 * Create a Checkbox controller plus its `{@attach}`-compatible root attachment.
 *
 * @when-to-use Headless integration of a tri-state form checkbox — when
 *              Layer 4's compound API is too opinionated about markup.
 *
 * @anti-pattern Don't reuse a single controller across multiple `<button>`s —
 *               each checkbox owns its machine.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
 */
export function createCheckbox(options: CreateCheckboxOptions = {}): CheckboxController {
  const machine = createCheckboxMachine(options);
  const id = options.id ?? uid('checkbox');

  function paint(node: HTMLElement, state: CheckboxState, ctx: CheckboxContext): void {
    const isDisabled = state === 'disabled';

    node.setAttribute('aria-checked', ariaCheckedFor(ctx.value));
    if (isDisabled) {
      node.setAttribute('aria-disabled', 'true');
      node.setAttribute('data-disabled', '');
    } else {
      node.removeAttribute('aria-disabled');
      node.removeAttribute('data-disabled');
    }
    node.setAttribute('data-state', ctx.value); // 'unchecked' | 'checked' | 'mixed'
  }

  const root: Attachment = (node) => {
    // Always emit role="checkbox" — even on a native <button>, since browsers
    // map <button> to "button" role by default.
    if (!node.hasAttribute('role')) node.setAttribute('role', 'checkbox');
    if (!node.hasAttribute('type') && node.tagName === 'BUTTON') {
      node.setAttribute('type', 'button');
    }
    if (!node.id) node.id = id;

    paint(node, machine.state, machine.context);

    const onClick = (event: MouseEvent): void => {
      if (machine.state === 'disabled') return;
      event.preventDefault();
      const before = machine.context.value;
      machine.send({ type: 'TOGGLE' });
      const after = machine.context.value;
      if (before !== after) options.onCheckedChange?.(after);
    };

    const onKeydown = (event: KeyboardEvent): void => {
      // <button> handles Space/Enter natively; non-button hosts need this.
      if (node.tagName === 'BUTTON') return;
      if (event.key !== ' ' && event.key !== 'Enter') return;
      if (machine.state === 'disabled') return;
      event.preventDefault();
      const before = machine.context.value;
      machine.send({ type: 'TOGGLE' });
      const after = machine.context.value;
      if (before !== after) options.onCheckedChange?.(after);
    };

    const unsubscribe = machine.subscribe(({ state, context }) => {
      paint(node, state, context);
    });

    node.addEventListener('click', onClick);
    node.addEventListener('keydown', onKeydown);

    return () => {
      unsubscribe();
      node.removeEventListener('click', onClick);
      node.removeEventListener('keydown', onKeydown);
    };
  };

  return {
    id,
    get state() {
      return machine.state;
    },
    get context() {
      return machine.context;
    },
    get value() {
      return machine.context.value;
    },
    get checked() {
      return machine.context.value === 'checked';
    },
    get indeterminate() {
      return machine.context.value === 'mixed';
    },
    get disabled() {
      return machine.state === 'disabled';
    },
    toggle: () => machine.send({ type: 'TOGGLE' }),
    set: (value: CheckboxValue) => machine.send({ type: 'SET', value }),
    setDisabled: (disabled: boolean) =>
      machine.send({ type: disabled ? 'DISABLE' : 'ENABLE' } as CheckboxEvent),
    subscribe: machine.subscribe.bind(machine),
    root,
    machine,
  };
}

export type { CheckboxContext, CheckboxEvent, CheckboxMachine, CheckboxState, CheckboxValue };
