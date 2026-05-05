/**
 * `@kumiki/headless/switch` — Layer 3 Svelte 5 attachment for the Switch machine.
 *
 * Mirrors `@kumiki/headless/toggle` but emits `role="switch"` + `aria-checked`
 * instead of `aria-pressed`. The DOM contract differs only in those two
 * attributes; everything else (data-state="on|off", data-disabled, click +
 * Space/Enter handling, teardown) is identical.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 * @see docs/design/02-architecture.md §2.5
 */

import {
  createSwitchMachine,
  type CreateSwitchInput,
  type SwitchContext,
  type SwitchEvent,
  type SwitchMachine,
  type SwitchState,
} from '@kumiki/machines/switch';
import { uid } from '@kumiki/primitives/id';

export type Attachment = (node: HTMLElement) => void | (() => void);

export interface SwitchController {
  readonly id: string;
  readonly state: SwitchState;
  readonly context: Readonly<SwitchContext>;
  readonly checked: boolean;
  readonly disabled: boolean;
  toggle(): void;
  set(checked: boolean): void;
  setDisabled(disabled: boolean): void;
  subscribe(
    listener: (snapshot: { state: SwitchState; context: SwitchContext }) => void,
  ): () => void;
  readonly root: Attachment;
  readonly machine: SwitchMachine;
}

export interface CreateSwitchOptions extends CreateSwitchInput {
  /**
   * Called whenever the checked value changes via user interaction.
   * Not called for controlled `set()` updates that came from the parent.
   */
  onCheckedChange?: (checked: boolean) => void;
  id?: string;
}

/**
 * Create a Switch controller plus its `{@attach}`-compatible root attachment.
 *
 * @when-to-use Headless integration of an on/off setting (dark mode toggle,
 *              feature flag, notifications) — when Layer 4's compound API is
 *              too opinionated about the surrounding markup.
 *
 * @anti-pattern Don't reuse a single controller across multiple `<button>`s —
 *               each switch owns its machine.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 */
export function createSwitch(options: CreateSwitchOptions = {}): SwitchController {
  const machine = createSwitchMachine(options);
  const id = options.id ?? uid('switch');

  function paint(node: HTMLElement, state: SwitchState, ctx: SwitchContext): void {
    const isChecked = ctx.checked;
    const isDisabled = state === 'disabled';

    node.setAttribute('aria-checked', String(isChecked));
    if (isDisabled) {
      node.setAttribute('aria-disabled', 'true');
      node.setAttribute('data-disabled', '');
    } else {
      node.removeAttribute('aria-disabled');
      node.removeAttribute('data-disabled');
    }
    node.setAttribute('data-state', isChecked ? 'on' : 'off');
  }

  const root: Attachment = (node) => {
    // Switches always have role="switch" — even on native <button>.
    if (!node.hasAttribute('role')) node.setAttribute('role', 'switch');
    if (!node.hasAttribute('type') && node.tagName === 'BUTTON') {
      node.setAttribute('type', 'button');
    }
    if (!node.id) node.id = id;

    paint(node, machine.state, machine.context);

    const onClick = (event: MouseEvent): void => {
      if (machine.state === 'disabled') return;
      event.preventDefault();
      const before = machine.context.checked;
      machine.send({ type: 'TOGGLE' });
      const after = machine.context.checked;
      if (before !== after) options.onCheckedChange?.(after);
    };

    const onKeydown = (event: KeyboardEvent): void => {
      // <button> handles Space/Enter natively; non-button hosts need this.
      if (node.tagName === 'BUTTON') return;
      if (event.key !== ' ' && event.key !== 'Enter') return;
      if (machine.state === 'disabled') return;
      event.preventDefault();
      const before = machine.context.checked;
      machine.send({ type: 'TOGGLE' });
      const after = machine.context.checked;
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
    get checked() {
      return machine.context.checked;
    },
    get disabled() {
      return machine.state === 'disabled';
    },
    toggle: () => machine.send({ type: 'TOGGLE' }),
    set: (checked: boolean) => machine.send({ type: 'SET', checked }),
    setDisabled: (disabled: boolean) =>
      machine.send({ type: disabled ? 'DISABLE' : 'ENABLE' } as SwitchEvent),
    subscribe: machine.subscribe.bind(machine),
    root,
    machine,
  };
}

export type { SwitchContext, SwitchEvent, SwitchMachine, SwitchState };
