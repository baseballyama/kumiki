/**
 * `@kumiki/attachment-combobox/with-validation` — composes a Combobox
 * controller with a Standard Schema validator.
 *
 * The base controller's value still drives behaviour; this layer adds
 * a parallel validation lifecycle. Validation runs on:
 *   - value commit (the same moment `onValueChange` would fire), and
 *   - manual `validate()` for parent-form submit flows.
 *
 * Async validators are race-token guarded: if a new validation starts
 * before the prior one resolves, the prior result is dropped (it cannot
 * stomp the newer one). The token check is the same shape as
 * `@kumiki/machine-form-field`.
 *
 * @see ../../../../../docs/design/11-composition.md §11.4
 * @see ../../../../../docs/design/07-form-validation.md §7.8 (async correctness)
 */

import type { ComboboxController } from '../index.js';
import type { ComboboxOption } from '@kumiki/machines/combobox';

/**
 * Subset of the Standard Schema v1 type surface we depend on. Standard
 * Schema is a TYPE contract, not a runtime dependency — see form-field
 * for the same shape.
 */
export interface StandardSchemaV1<Input = unknown, Output = Input> {
  readonly '~standard': {
    readonly version: 1;
    readonly vendor: string;
    readonly validate: (
      value: unknown,
    ) => StandardSchemaResult<Output> | Promise<StandardSchemaResult<Output>>;
  };
  // Phantom for input type narrowing.
  readonly _input?: Input;
}

export type StandardSchemaResult<Output> =
  | { readonly value: Output; readonly issues?: undefined }
  | {
      readonly issues: ReadonlyArray<{
        readonly message: string;
        readonly path?: ReadonlyArray<PropertyKey>;
      }>;
    };

export type ValidationState = 'pristine' | 'validating' | 'valid' | 'invalid';

export interface ValidationIssue {
  readonly message: string;
  readonly path?: ReadonlyArray<PropertyKey>;
}

export interface ValidatedCombobox<T extends ComboboxOption> extends ComboboxController<T> {
  readonly errors: ReadonlyArray<ValidationIssue>;
  readonly isValid: boolean;
  readonly validation: { readonly state: ValidationState };

  /** Manually run the validator against the current value. Resolves once settled. */
  validate(): Promise<void>;

  subscribeValidation(listener: (snapshot: ValidationSnapshot) => void): () => void;
}

export interface ValidationSnapshot {
  readonly state: ValidationState;
  readonly errors: ReadonlyArray<ValidationIssue>;
  readonly isValid: boolean;
}

/**
 * Wrap any Combobox controller with Standard Schema validation.
 *
 * @when-to-use Forms where the selected combobox value is constrained
 *              (e.g., must belong to an active set, or must be present).
 *
 * @anti-pattern Don't use this for free-text validation — use FormField
 *               for typed string validation.
 */
export function withValidation<T extends ComboboxOption>(
  base: ComboboxController<T>,
  schema: StandardSchemaV1<T | null, T | null>,
): ValidatedCombobox<T> {
  let state: ValidationState = 'pristine';
  let errors: ReadonlyArray<ValidationIssue> = [];
  let isValid = true;
  /** Race-token. Bumped on every validation start. */
  let token = 0;
  const listeners = new Set<(snapshot: ValidationSnapshot) => void>();

  function snapshot(): ValidationSnapshot {
    return { state, errors, isValid };
  }

  function notify(): void {
    const snap = snapshot();
    for (const listener of listeners) listener(snap);
  }

  async function runValidation(value: T | null): Promise<void> {
    const myToken = ++token;
    state = 'validating';
    notify();
    let result: StandardSchemaResult<T | null>;
    try {
      result = await schema['~standard'].validate(value);
    } catch (e) {
      // Treat thrown errors as invalid with a single issue.
      if (myToken !== token) return; // stale
      state = 'invalid';
      errors = [{ message: e instanceof Error ? e.message : String(e) }];
      isValid = false;
      notify();
      return;
    }
    if (myToken !== token) return; // a newer validation has started; drop result
    if ('issues' in result && result.issues !== undefined) {
      state = 'invalid';
      errors = result.issues;
      isValid = false;
    } else {
      state = 'valid';
      errors = [];
      isValid = true;
    }
    notify();
  }

  // React to base value changes — re-validate whenever the selected option
  // (or null) changes. Match the same diff strategy other controllers use.
  let prevValue = base.value;
  base.subscribe(({ context }) => {
    if (context.value !== prevValue) {
      prevValue = context.value;
      void runValidation(context.value);
    }
  });

  // Build the wrapped controller — Object.create preserves the base's
  // accessor prototype so getters like `value` still resolve to the
  // base's reactive snapshot.
  const wrapped: ValidatedCombobox<T> = Object.create(base, {
    errors: { get: () => errors, enumerable: true },
    isValid: { get: () => isValid, enumerable: true },
    validation: { get: () => ({ state }), enumerable: true },
    validate: {
      value: () => runValidation(base.value),
      enumerable: true,
    },
    subscribeValidation: {
      value: (listener: (snap: ValidationSnapshot) => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      enumerable: true,
    },
  }) as ValidatedCombobox<T>;

  return wrapped;
}
