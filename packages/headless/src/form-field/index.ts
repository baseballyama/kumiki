/**
 * `@kumiki/headless/form-field` — Layer 3 Svelte 5 attachments for Form Field.
 *
 * Five attachment factories — label, input, errors, description, hint — that
 * together model an accessible form field. The controller runs the
 * StandardSchemaV1 validator on BLUR / SUBMIT_REQUEST and dispatches
 * VALIDATION_RESOLVE / VALIDATION_REJECT with the machine's current
 * validationToken so a stale async validator can't overwrite fresher state.
 *
 * ARIA wiring:
 * - `input` carries `aria-invalid` (true when state is invalid),
 *   `aria-describedby` pointing to the errors element (and the description
 *   element if present).
 * - `errors` is a polite live-region (`role="alert"`) that announces new
 *   errors to screen readers.
 * - `label` paints htmlFor on the input by id.
 *
 * @see https://standardschema.dev/
 * @see https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21
 */

import {
  createFormFieldMachine,
  type CreateFormFieldInput,
  type FieldIssue,
  type FormFieldContext,
  type FormFieldEvent,
  type FormFieldMachine,
  type FormFieldState,
} from '@kumiki/machines/form-field';
import { uid } from '@kumiki/primitives/id';
import type { StandardSchemaV1, StandardSchemaResult } from '@kumiki/types';

export type Attachment = (node: HTMLElement) => void | (() => void);

// Re-export the Standard Schema types from `@kumiki/types` so existing
// consumers that import them from here keep compiling. The canonical
// definition lives in `@kumiki/types` per ADR 0012's cross-layer type
// policy.
export type { StandardSchemaV1, StandardSchemaResult };

export type ValidateOn = 'blur' | 'change' | 'submit';

export interface FormFieldController<T> {
  readonly id: string;
  readonly state: FormFieldState;
  readonly context: Readonly<FormFieldContext<T>>;
  readonly value: T;
  readonly touched: boolean;
  readonly dirty: boolean;
  readonly invalid: boolean;
  readonly validating: boolean;

  setValue(value: T): void;
  /** Manually trigger validation (e.g. from a parent form's submit). */
  validate(): Promise<void>;
  reset(): void;

  subscribe(
    listener: (snapshot: { state: FormFieldState; context: FormFieldContext<T> }) => void,
  ): () => void;

  readonly inputId: string;
  readonly labelId: string;
  readonly errorsId: string;
  readonly descriptionId: string;

  readonly label: Attachment;
  readonly input: Attachment;
  readonly errors: Attachment;
  readonly description: Attachment;

  readonly machine: FormFieldMachine<T>;
}

export interface CreateFormFieldOptions<T> extends CreateFormFieldInput<T> {
  validator?: StandardSchemaV1<T, T> | StandardSchemaV1<unknown, T>;
  /** Default 'blur'. */
  validateOn?: ValidateOn | ReadonlyArray<ValidateOn>;
  onValueChange?: (value: T) => void;
  onValidityChange?: (state: FormFieldState) => void;
  id?: string;
  /**
   * Read the value from the DOM on `INPUT`. Default for `<input>` is
   * `el.value`. Pass a custom reader for richer inputs.
   */
  readValue?: (node: HTMLElement) => T;
  /**
   * Write the value to the DOM when SET.VALUE / RESET fires. Default for
   * `<input>` is `el.value = String(v)`.
   */
  writeValue?: (node: HTMLElement, value: T) => void;
}

function defaultRead<T>(node: HTMLElement): T {
  return (node as HTMLInputElement).value as unknown as T;
}
function defaultWrite<T>(node: HTMLElement, value: T): void {
  (node as HTMLInputElement).value = value == null ? '' : String(value);
}

export function createFormField<T>(options: CreateFormFieldOptions<T>): FormFieldController<T> {
  const machine = createFormFieldMachine(options);
  const id = options.id ?? uid('form-field');
  const inputId = `${id}-input`;
  const labelId = `${id}-label`;
  const errorsId = `${id}-errors`;
  const descriptionId = `${id}-description`;
  const validateOn = Array.isArray(options.validateOn)
    ? new Set<ValidateOn>(options.validateOn)
    : new Set<ValidateOn>([(options.validateOn as ValidateOn) ?? 'blur']);
  const readValue = options.readValue ?? defaultRead;
  const writeValue = options.writeValue ?? defaultWrite;

  let prevState: FormFieldState = machine.state;
  let prevValue: T = machine.context.value;
  machine.subscribe(({ state, context }) => {
    if (state !== prevState) {
      prevState = state;
      options.onValidityChange?.(state);
    }
    if (!Object.is(context.value, prevValue)) {
      prevValue = context.value;
      options.onValueChange?.(context.value);
    }
  });

  let inputEl: HTMLElement | null = null;

  /**
   * Run the validator against the current value, capturing the token at
   * dispatch time and echoing it back via VALIDATION_RESOLVE / REJECT.
   *
   * Synchronous validators dispatch synchronously — important for tests and
   * predictable focus sequencing. Async validators dispatch in their `.then`
   * / `.catch` handlers; the captured token guards staleness.
   */
  function runValidate(): Promise<void> {
    if (!options.validator) {
      machine.send({
        type: 'VALIDATION_RESOLVE',
        token: machine.context.validationToken,
        issues: [],
      });
      return Promise.resolve();
    }
    const token = machine.context.validationToken;
    let result: StandardSchemaResult<unknown> | Promise<StandardSchemaResult<unknown>>;
    try {
      result = options.validator['~standard'].validate(machine.context.value);
    } catch (reason) {
      machine.send({ type: 'VALIDATION_REJECT', token, reason });
      return Promise.resolve();
    }
    if (result instanceof Promise) {
      return result.then(
        (r) => {
          machine.send({ type: 'VALIDATION_RESOLVE', token, issues: r.issues ?? [] });
        },
        (reason: unknown) => {
          machine.send({ type: 'VALIDATION_REJECT', token, reason });
        },
      );
    }
    machine.send({ type: 'VALIDATION_RESOLVE', token, issues: result.issues ?? [] });
    return Promise.resolve();
  }

  function maybeValidate(trigger: ValidateOn): void {
    if (!validateOn.has(trigger)) return;
    // Only run validation if the machine is in a state that can accept
    // VALIDATION_RESOLVE. BLUR from `editing` already lands in `validating`
    // naturally; BLUR from `pristine` is a no-op (user never interacted).
    // For `change`, push the machine into validating via SUBMIT_REQUEST.
    if (machine.state === 'pristine') return;
    if (machine.state !== 'validating') {
      machine.send({ type: 'SUBMIT_REQUEST' });
    }
    void runValidate();
  }

  // ── label ───────────────────────────────────────────────────────────
  const label: Attachment = (node) => {
    if (!node.id) node.id = labelId;
    if (node.tagName === 'LABEL' && !node.hasAttribute('for')) {
      node.setAttribute('for', inputId);
    }
  };

  // ── input ───────────────────────────────────────────────────────────
  const input: Attachment = (node) => {
    if (!node.id) node.id = inputId;
    inputEl = node;

    function describedBy(): string | null {
      const ids: string[] = [];
      if (node.ownerDocument?.getElementById(descriptionId)) ids.push(descriptionId);
      if (machine.state === 'invalid' && node.ownerDocument?.getElementById(errorsId)) {
        ids.push(errorsId);
      }
      return ids.length > 0 ? ids.join(' ') : null;
    }

    const paint = (): void => {
      node.setAttribute('aria-invalid', machine.state === 'invalid' ? 'true' : 'false');
      node.setAttribute('data-state', machine.state);
      if (machine.state === 'invalid') node.setAttribute('data-invalid', '');
      else node.removeAttribute('data-invalid');
      if (machine.context.touched) node.setAttribute('data-touched', '');
      else node.removeAttribute('data-touched');
      if (machine.context.dirty) node.setAttribute('data-dirty', '');
      else node.removeAttribute('data-dirty');
      const desc = describedBy();
      if (desc) node.setAttribute('aria-describedby', desc);
      else node.removeAttribute('aria-describedby');
      // Keep DOM value in sync when the machine value changed externally
      // (SET.VALUE / RESET). For user-input changes the DOM is already set;
      // the read-back is a no-op.
      const current = readValue(node);
      if (!Object.is(current, machine.context.value)) {
        writeValue(node, machine.context.value);
      }
    };
    paint();

    const onFocus = (): void => machine.send({ type: 'FOCUS' });
    const onBlur = (): void => {
      machine.send({ type: 'BLUR' });
      maybeValidate('blur');
    };
    const onInput = (): void => {
      const v = readValue(node);
      machine.send({ type: 'INPUT', value: v });
      maybeValidate('change');
    };

    node.addEventListener('focus', onFocus);
    node.addEventListener('blur', onBlur);
    node.addEventListener('input', onInput);
    const unsub = machine.subscribe(paint);

    return () => {
      unsub();
      node.removeEventListener('focus', onFocus);
      node.removeEventListener('blur', onBlur);
      node.removeEventListener('input', onInput);
      if (inputEl === node) inputEl = null;
    };
  };

  // ── errors ──────────────────────────────────────────────────────────
  const errors: Attachment = (node) => {
    if (!node.id) node.id = errorsId;
    node.setAttribute('role', 'alert');
    node.setAttribute('aria-live', 'polite');

    const paint = (): void => {
      const list = machine.context.errors;
      node.toggleAttribute('hidden', list.length === 0);
      // Render error messages as a plain list. Consumers can override by
      // not using this factory; they get aria-live wiring via the host node.
      node.textContent = list.map((iss) => iss.message).join(' ');
    };
    paint();
    return machine.subscribe(paint);
  };

  // ── description ────────────────────────────────────────────────────
  const description: Attachment = (node) => {
    if (!node.id) node.id = descriptionId;
  };

  return {
    id,
    inputId,
    labelId,
    errorsId,
    descriptionId,
    get state() {
      return machine.state;
    },
    get context() {
      return machine.context;
    },
    get value() {
      return machine.context.value;
    },
    get touched() {
      return machine.context.touched;
    },
    get dirty() {
      return machine.context.dirty;
    },
    get invalid() {
      return machine.state === 'invalid';
    },
    get validating() {
      return machine.state === 'validating';
    },
    setValue: (value) => {
      machine.send({ type: 'SET.VALUE', value });
    },
    validate: async () => {
      machine.send({ type: 'SUBMIT_REQUEST' });
      await runValidate();
    },
    reset: () => machine.send({ type: 'RESET' }),
    subscribe: machine.subscribe.bind(machine),
    label,
    input,
    errors: errors as Attachment,
    description,
    machine,
  } as FormFieldController<T>;
}

export type { FieldIssue, FormFieldContext, FormFieldEvent, FormFieldMachine, FormFieldState };
