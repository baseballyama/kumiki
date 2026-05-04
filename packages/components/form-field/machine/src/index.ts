/**
 * `@kumiki/machine-form-field` — pure-TS FSM for Form Field validation.
 *
 * Tracks one input's lifecycle through Standard Schema validation:
 *
 * ```
 *  pristine ──INPUT──▶ editing ──BLUR──▶ validating ──RESOLVE──▶ valid|invalid
 *      │                  │                    │                       │
 *      └─SUBMIT_REQUEST───┴──── ▲ ─────────────┴──INPUT (cancels)──────┘
 * ```
 *
 * The machine doesn't run the validator — that's the Layer 3 attachment's
 * job. Each VALIDATE event bumps an internal token; the attachment's async
 * dispatch must echo that token back via VALIDATION_RESOLVE / REJECT, so a
 * stale resolution from an in-flight validator is dropped if the user
 * already changed the value.
 *
 * @see https://standardschema.dev/    (validator type contract)
 * @see docs/design/07-form-validation.md §7.3
 */

import { defineMachine, type Machine } from '@kumiki/runtime';

/**
 * One validation issue. Aligns with Standard Schema's `Issue` shape so users
 * can pipe `result.issues` straight in without remapping.
 */
export interface FieldIssue {
  readonly message: string;
  readonly path?: ReadonlyArray<PropertyKey>;
}

export type FormFieldEvent<T> =
  | { type: 'FOCUS' }
  | { type: 'INPUT'; value: T }
  | { type: 'BLUR' }
  | { type: 'SUBMIT_REQUEST' }
  | { type: 'VALIDATION_RESOLVE'; token: number; issues: ReadonlyArray<FieldIssue> }
  | { type: 'VALIDATION_REJECT'; token: number; reason: unknown }
  | { type: 'RESET' }
  | { type: 'SET.VALUE'; value: T };

export interface FormFieldContext<T> {
  value: T;
  readonly initialValue: T;
  /**
   * Token emitted with each VALIDATE intent. The attachment uses it to
   * guard async resolutions so a stale validator can't overwrite fresher
   * state. Monotonically increasing across the field's lifetime.
   */
  validationToken: number;
  errors: ReadonlyArray<FieldIssue>;
  /** True once the field has lost focus at least once. */
  touched: boolean;
  /** True when value differs from initialValue. */
  dirty: boolean;
}

export type FormFieldState = 'pristine' | 'editing' | 'validating' | 'valid' | 'invalid';

export type FormFieldMachine<T> = Machine<FormFieldContext<T>, FormFieldEvent<T>, FormFieldState>;

export interface CreateFormFieldInput<T> {
  initialValue: T;
}

function isDirty<T>(a: T, b: T): boolean {
  return !Object.is(a, b);
}

/**
 * Construct a fresh FormField machine.
 *
 * @when-to-use Single-input forms or per-field state in a multi-field form.
 *              The Layer 3 controller wires Standard Schema validators and
 *              dispatches VALIDATION_RESOLVE / REJECT.
 *
 * @anti-pattern Don't try to use one Field machine for multiple inputs —
 *               each input owns its own machine instance.
 *
 * @see https://standardschema.dev/
 */
export function createFormFieldMachine<T>(input: CreateFormFieldInput<T>): FormFieldMachine<T> {
  const initialValue = input.initialValue;

  function inputAction() {
    return {
      type: 'input',
      exec: (ctx: FormFieldContext<T>, e: FormFieldEvent<T>) => {
        if (e.type !== 'INPUT') return;
        return {
          value: e.value,
          dirty: isDirty(e.value, ctx.initialValue),
          errors: [],
          // Bump token so any in-flight validator's resolution is dropped.
          validationToken: ctx.validationToken + 1,
        };
      },
    };
  }
  function setValueAction() {
    return {
      type: 'setValue',
      exec: (ctx: FormFieldContext<T>, e: FormFieldEvent<T>) => {
        if (e.type !== 'SET.VALUE') return;
        return {
          value: e.value,
          dirty: isDirty(e.value, ctx.initialValue),
          errors: [],
          validationToken: ctx.validationToken + 1,
        };
      },
    };
  }
  function startValidating() {
    return {
      type: 'startValidating',
      exec: (ctx: FormFieldContext<T>) => ({ validationToken: ctx.validationToken + 1 }),
    };
  }
  function resolveAction() {
    return {
      type: 'resolve',
      exec: (ctx: FormFieldContext<T>, e: FormFieldEvent<T>) => {
        if (e.type !== 'VALIDATION_RESOLVE') return;
        if (e.token !== ctx.validationToken) return; // stale → drop
        return { errors: e.issues };
      },
    };
  }

  const factory = defineMachine<FormFieldContext<T>, FormFieldEvent<T>, FormFieldState>({
    id: 'form-field',
    initial: 'pristine',
    context: {
      value: initialValue,
      initialValue,
      validationToken: 0,
      errors: [],
      touched: false,
      dirty: false,
    },
    states: {
      pristine: {
        on: {
          FOCUS: 'editing',
          INPUT: { target: 'editing', actions: [inputAction()] },
          BLUR: { actions: [{ type: 'touch', exec: () => ({ touched: true }) }] },
          SUBMIT_REQUEST: { target: 'validating', actions: [startValidating()] },
          'SET.VALUE': { actions: [setValueAction()] },
          RESET: { actions: [resetAction(initialValue)] },
        },
      },
      editing: {
        on: {
          INPUT: { actions: [inputAction()] },
          BLUR: {
            target: 'validating',
            actions: [{ type: 'touch', exec: () => ({ touched: true }) }, startValidating()],
          },
          SUBMIT_REQUEST: { target: 'validating', actions: [startValidating()] },
          'SET.VALUE': { actions: [setValueAction()] },
          RESET: { target: 'pristine', actions: [resetAction(initialValue)] },
        },
      },
      validating: {
        on: {
          INPUT: { target: 'editing', actions: [inputAction()] },
          VALIDATION_RESOLVE: [
            {
              target: 'valid',
              cond: (ctx, e) =>
                e.type === 'VALIDATION_RESOLVE' &&
                e.token === ctx.validationToken &&
                e.issues.length === 0,
              actions: [resolveAction()],
            },
            {
              target: 'invalid',
              cond: (ctx, e) =>
                e.type === 'VALIDATION_RESOLVE' &&
                e.token === ctx.validationToken &&
                e.issues.length > 0,
              actions: [resolveAction()],
            },
          ],
          VALIDATION_REJECT: [
            {
              target: 'invalid',
              cond: (ctx, e) => e.type === 'VALIDATION_REJECT' && e.token === ctx.validationToken,
              actions: [
                {
                  type: 'reject',
                  exec: (_, e) => {
                    if (e.type !== 'VALIDATION_REJECT') return;
                    return {
                      errors: [{ message: 'Validator threw an unexpected error' }],
                    };
                  },
                },
              ],
            },
          ],
          'SET.VALUE': { target: 'editing', actions: [setValueAction()] },
          RESET: { target: 'pristine', actions: [resetAction(initialValue)] },
        },
      },
      valid: {
        on: {
          INPUT: { target: 'editing', actions: [inputAction()] },
          BLUR: { actions: [{ type: 'touch', exec: () => ({ touched: true }) }] },
          SUBMIT_REQUEST: { target: 'validating', actions: [startValidating()] },
          'SET.VALUE': { target: 'editing', actions: [setValueAction()] },
          RESET: { target: 'pristine', actions: [resetAction(initialValue)] },
        },
      },
      invalid: {
        on: {
          INPUT: { target: 'editing', actions: [inputAction()] },
          BLUR: { actions: [{ type: 'touch', exec: () => ({ touched: true }) }] },
          SUBMIT_REQUEST: { target: 'validating', actions: [startValidating()] },
          'SET.VALUE': { target: 'editing', actions: [setValueAction()] },
          RESET: { target: 'pristine', actions: [resetAction(initialValue)] },
        },
      },
    },
  });

  return factory();
}

function resetAction<T>(initialValue: T) {
  return {
    type: 'reset',
    exec: () => ({
      value: initialValue,
      dirty: false,
      touched: false,
      errors: [],
      validationToken: 0,
    }),
  };
}
