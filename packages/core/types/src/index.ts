/**
 * `@kumiki/types` — shared type-only definitions used across Kumiki layers.
 *
 * Zero runtime cost — every export is `type` or `interface`. Importing from
 * here in your own code adds nothing to the bundle. Currently exposes the
 * Standard Schema v1 contract that drives validation across Form Field,
 * Combobox `withValidation`, and any other surface that takes a validator.
 *
 * @see https://standardschema.dev/
 */

/**
 * Subset of the Standard Schema v1 type surface that Kumiki depends on.
 *
 * Standard Schema is a **type contract**, not a runtime dependency — the
 * validator implementation is supplied by the consumer (Zod 3.24+,
 * Valibot 1.x, ArkType 2.0+, Effect Schema 3.x, …).
 *
 * @see [docs/design/07-form-validation.md](../../../docs/design/07-form-validation.md)
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

/** Result from a Standard Schema validator's `validate()` call. */
export type StandardSchemaResult<Output> =
  | { readonly value: Output; readonly issues?: undefined }
  | {
      readonly issues: ReadonlyArray<{
        readonly message: string;
        readonly path?: ReadonlyArray<PropertyKey>;
      }>;
    };
