# 07 — Form & Validation

## 7.1 Goals

`@kumiki/components/form-field` covers Field, FieldGroup, and Form in one package. Goals:

| Goal                                                                                                             | How                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Validation works with **any** Standard Schema validator (Zod 3.24+, Valibot 1.x, ArkType 2.0+, Effect Schema, …) | Single `validator` prop typed as `StandardSchemaV1`. No per-validator adapter shipped.                 |
| `aria-invalid` / `aria-describedby` / live region wiring is automatic and correct                                | Field machine owns ARIA wiring; tests assert it across all validators.                                 |
| Async validation works without races                                                                             | Field machine has explicit `validating` state; new edits cancel pending validation.                    |
| Both client-side and server-side validation feed the same error display                                          | A single `errors: ReadonlyArray<Issue>` interface. Form's `submit` path can `setErrors(serverIssues)`. |

## 7.2 Standard Schema as the single integration point

[Standard Schema](https://standardschema.dev/) is a tiny spec that validation libraries implement. Every validator that ships a `~standard` property on its schema is "Standard Schema compliant" (Zod 3.24+, Valibot 1.x, ArkType 2.0+, Effect 3.x).

```ts
// @kumiki/types — sketch of relevant types
export interface StandardSchemaV1<Input = unknown, Output = Input> {
  readonly '~standard': StandardSchemaV1.Props<Input, Output>;
}
export namespace StandardSchemaV1 {
  export interface Props<Input, Output> {
    readonly version: 1;
    readonly vendor: string;
    readonly validate: (value: unknown) => Result<Output> | Promise<Result<Output>>;
  }
  export type Result<Output> =
    | { readonly value: Output; readonly issues?: undefined }
    | { readonly issues: ReadonlyArray<Issue> };
  export interface Issue {
    readonly message: string;
    readonly path?: ReadonlyArray<PropertyKey>;
  }
}
```

`@kumiki/components/form-field` accepts any `StandardSchemaV1<...>` for its `validator` prop. The library does not import `zod` or `valibot`.

## 7.3 The Field machine

States:

```
field
├── pristine                     // user hasn't interacted
├── editing                      // user typing / interacting
├── validating                   // async validation in flight
├── valid                        // last validation passed
└── invalid                      // last validation failed; errors visible
```

Events: `FOCUS`, `INPUT`, `BLUR`, `SUBMIT_REQUEST`, `VALIDATION_RESOLVE`, `VALIDATION_REJECT`, `RESET`.

Transitions of note:

- `INPUT` from any state → `editing`. Cancels any pending validation.
- `BLUR` from `editing` → `validating` if `validateOn` includes `blur`.
- `SUBMIT_REQUEST` → `validating` regardless of state.
- `VALIDATION_RESOLVE` → `valid` if no issues, else `invalid` with `errors`.
- `VALIDATION_REJECT` (a thrown error from the validator's `validate()` itself, not a validation issue) → propagates as a Form-level "validator error" event.

ARIA wiring derived from state:

| State             | `aria-invalid` | `aria-describedby`                           | Live region                                                    |
| ----------------- | -------------- | -------------------------------------------- | -------------------------------------------------------------- |
| pristine, editing | absent         | id of help text if present                   | —                                                              |
| validating        | absent         | id of help text + id of "validating" message | "Validating" announced via polite live region                  |
| valid             | `false`        | id of help text                              | —                                                              |
| invalid           | `true`         | id of help text + id of error                | First error announced via assertive live region (configurable) |

## 7.4 Field API (Layer 4)

```svelte
<script lang="ts">
  import { Field } from '@kumiki/components/form-field';
  import { z } from 'zod';

  const schema = z.string().email('Enter a valid email');
  let email = $state('');
</script>

<Field.Root name="email" validator={schema} bind:value={email}>
  <Field.Label>Email</Field.Label>
  <Field.Input type="email" />
  <Field.Description>We'll only contact you about your account.</Field.Description>
  <Field.ErrorMessage />
</Field.Root>
```

- `Field.Root` owns the machine, exposes context.
- `Field.Label` renders a `<label>` with the right `for=`.
- `Field.Input` is the actual input. Its `aria-invalid`, `aria-describedby`, and `id` are computed.
- `Field.Description` renders help text, registers its id.
- `Field.ErrorMessage` renders only when state is `invalid`. Multiple errors render as a list.

**The user does not pass any `id`s manually.** The Root provides them via context.

### Validation timing

```svelte
<Field.Root validator={schema} validateOn={['blur', 'submit']}>
```

- `change` — every keystroke.
- `blur` — on blur, after editing.
- `submit` — only when Form `submit` is requested.

Default: `['blur', 'submit']`. Most users want this.

## 7.5 FieldGroup (for groups of related inputs)

Used for radio groups, checkbox groups, and address-style multi-input fields:

```svelte
<FieldGroup.Root name="shippingAddress" validator={addressSchema}>
  <FieldGroup.Legend>Shipping address</FieldGroup.Legend>
  <Field.Root name="line1">
    <Field.Label>Line 1</Field.Label>
    <Field.Input />
  </Field.Root>
  <Field.Root name="postcode">
    <Field.Label>Postcode</Field.Label>
    <Field.Input />
  </Field.Root>
  <FieldGroup.ErrorMessage />
</FieldGroup.Root>
```

The group's `validator` validates the combined object. Inner `Field.Root` instances may have their own validators for per-field rules.

## 7.6 Form (top-level orchestrator)

```svelte
<Form.Root onsubmit={handleSubmit}>
  <Field.Root ...>...</Field.Root>
  <Field.Root ...>...</Field.Root>
  <Form.Submit>Save</Form.Submit>
</Form.Root>
```

`Form.Root` collects child fields and exposes:

```ts
type FormState = {
  status: 'pristine' | 'editing' | 'validating' | 'invalid' | 'valid' | 'submitting' | 'submitted';
  values: Record<string, unknown>; // gathered by name from children
  errors: ReadonlyMap<string, ReadonlyArray<Issue>>;
};
```

`onsubmit` receives `{ values, setErrors }`. The user can run async server-side validation and `setErrors(...)` to display server errors using the same UI path:

```ts
async function handleSubmit({ values, setErrors }) {
  const res = await fetch('/api/save', { method: 'POST', body: JSON.stringify(values) });
  if (!res.ok) {
    const { issues } = await res.json(); // server returns Standard Schema issues
    setErrors(issues);
  }
}
```

## 7.7 Composing validation — `withValidation`

For headless layouts where the user doesn't want `Field.Root` (e.g., custom DOM, Layer 3 builders), `withValidation` wraps an attachment:

```ts
import { createCombobox } from '@kumiki/headless/combobox';
import { withValidation } from '@kumiki/headless/combobox/with-validation';
import { z } from 'zod';

const cb = createCombobox({ options });
const validated = withValidation(cb, z.string().min(2));
// validated.errors, validated.state ('pristine' | 'invalid' | 'valid'), …
```

`withValidation` is its own subpath export. Users who don't need it never bundle it. See [11-composition.md](11-composition.md) for the full composition pattern.

## 7.8 Async validation correctness

Common race: user types → blur fires → async validator starts → user types again → second async starts → first resolves → stale error shown.

The Field machine prevents this by:

1. Tagging each `validating` transition with a token.
2. On `INPUT` (which transitions to `editing`), incrementing the token.
3. On `VALIDATION_RESOLVE`, comparing the token; if it doesn't match the current one, ignoring the result.

This is encoded in the machine, not the controller. Tests in `@kumiki/machines/form-field` cover the race conditions in pure-TS without any async UI overhead.

## 7.9 What we do _not_ provide

- **Field arrays** (dynamic add/remove rows). Phase 2.
- **Wizard / multi-step forms.** Phase 2; will likely use a Form-of-Forms composition pattern.
- **File uploads** (file input, drag-drop, progress). Phase 2 Component package.
- **Network state libraries.** The Form is unopinionated about data fetching. Users plug `fetch`, TanStack Query, sveltekit-superforms, anything.

## 7.10 Why Standard Schema, not per-validator adapters

| Alternative                                                                    | Verdict                                                                                                                |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **Standard Schema only** (chosen)                                              | ✅ Same code supports Zod 3.24+, Valibot 1.x, ArkType 2.0+, Effect 3.x; no per-validator surface; bundle stays minimal |
| Ship official `@kumiki/validator-zod`, `-valibot`, `-arktype`, `-yup` adapters | ❌ 4 packages × maintenance × API surface; Standard Schema makes them all redundant for the compliant validators       |
| Adopt a single validator (e.g. Valibot) as a hard dep                          | ❌ couples Kumiki to one library; users have strong opinions on validation; non-starter                                |

Yup is **not** Standard Schema compliant. Users on Yup write a 20-line wrapper:

```ts
function yupToStandard<T>(schema: yup.Schema<T>): StandardSchemaV1<unknown, T> {
  return {
    '~standard': {
      version: 1,
      vendor: 'kumiki-yup-shim',
      validate: async (value) => {
        try {
          return { value: await schema.validate(value) };
        } catch (err) {
          if (err instanceof yup.ValidationError) {
            return { issues: err.errors.map((m) => ({ message: m })) };
          }
          throw err;
        }
      },
    },
  };
}
```

We document this snippet and don't ship a package for it.

## 7.11 Open questions

- **TBD:** Whether `Form.Root` should support nested forms (Form-in-Form). The semantic is fuzzy (HTML forms can't nest). Probably no; defer to a future Wizard component.
- **TBD:** Whether `setErrors` should accept a `Record<string, string>` shorthand for the common case. Lean: yes, but only as a thin overload.
- **TBD:** Do we expose the validation token for users who want to write their own async validators? Probably not at v1.0; advanced users can run `withValidation` and read state directly.
