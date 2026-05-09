# 07 — Form & Validation

## 7.1 Goals

`@kumiki/components/form-field` ships a single-input `FormField` primitive. Multi-field aggregation (Form orchestrator, FieldGroup) is intentionally out of scope per [§17.5](17-integration-boundaries.md#175-forms--what-kumiki-ships-and-what-it-doesnt) — pair with `sveltekit-superforms` or use native `<form>` + form actions. Goals:

| Goal                                                                                                             | How                                                                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Validation works with **any** Standard Schema validator (Zod 3.24+, Valibot 1.x, ArkType 2.0+, Effect Schema, …) | Single `validator` prop typed as `StandardSchemaV1`. No per-validator adapter shipped.                                                                           |
| `aria-invalid` / `aria-describedby` / live region wiring is automatic and correct                                | Field machine owns ARIA wiring; tests assert it across all validators.                                                                                           |
| Async validation works without races                                                                             | Field machine has explicit `validating` state; new edits cancel pending validation.                                                                              |
| Both client-side and server-side validation feed the same error display                                          | A single `errors: ReadonlyArray<Issue>` interface. Server-issued errors land via `FormField.Root`'s `serverIssues` prop (§7.6a) or the controller's `setErrors`. |

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

## 7.4 FormField API (Layer 4)

```svelte
<script lang="ts">
  import { FormField } from '@kumiki/components';
  import { z } from 'zod';

  const schema = z.string().email('Enter a valid email');
  let email = $state('');
</script>

<FormField.Root name="email" validator={schema} bind:value={email}>
  <FormField.Label>Email</FormField.Label>
  <FormField.Input type="email" />
  <FormField.Description>We'll only contact you about your account.</FormField.Description>
  <FormField.Errors />
</FormField.Root>
```

- `FormField.Root` owns the machine, exposes context.
- `FormField.Label` renders a `<label>` with the right `for=`.
- `FormField.Input` is the actual input. Its `aria-invalid`, `aria-describedby`, and `id` are computed.
- `FormField.Description` renders help text, registers its id.
- `FormField.Errors` renders only when state is `invalid`. Multiple errors render as a list.

**The user does not pass any `id`s manually.** The Root provides them via context.

### Validation timing

```svelte
<FormField.Root validator={schema} validateOn={['blur', 'submit']}>
```

- `change` — every keystroke.
- `blur` — on blur, after editing.
- `submit` — only when Form `submit` is requested.

Default: `['blur', 'submit']`. Most users want this.

## 7.5 Groups of related inputs — defer to specialized components / superforms

Radio and checkbox groups are covered by their own primitives (`RadioGroup`, `Checkbox` group via parent `name`). For composite multi-input fields (e.g., address line1 / postcode validated as one object), the multi-field aggregation falls under [§17.5](17-integration-boundaries.md#175-forms--what-kumiki-ships-and-what-it-doesnt) — kumiki does not ship a `FieldGroup` orchestrator. Use `sveltekit-superforms` (or any form-state library) and a single `serverIssues` per `FormField.Root`.

## 7.6 Multi-field aggregation — out of scope at v1.0

A top-level `Form.Root` orchestrator (status / values / aggregate errors) is **explicitly out of scope** per [§17.5](17-integration-boundaries.md#175-forms--what-kumiki-ships-and-what-it-doesnt). The pairing recommendation is [`sveltekit-superforms`](https://superforms.rocks/) for SvelteKit users; native `<form>` + form actions is sufficient for the rest.

Per-field server errors flow through `FormField.Root`'s `serverIssues` prop (see §7.6a). Multi-field state — `values`, aggregate `status`, cross-field validation — is the form-state library's job, not kumiki's.

### 7.6a Server-supplied errors per field

`FormField.Root` accepts `serverIssues` for declarative error injection:

```svelte
<FormField.Root
  initialValue={form?.values?.email ?? ''}
  name="email"
  validator={schema}
  serverIssues={form?.fieldErrors?.email}
>
  ...
</FormField.Root>
```

| Value                                   | Effect                                             |
| --------------------------------------- | -------------------------------------------------- |
| `undefined` / `null`                    | No-op — server has not responded.                  |
| `[]`                                    | Clears externally-supplied errors → `valid`.       |
| `string[]` / `FieldIssue[]` (non-empty) | Drives the field to `invalid` with these messages. |

The Layer 3 controller exposes the same as `controller.setErrors(issues)` for imperative use. Both paths share the machine's race-token guard from §7.8 — server errors arriving while a local validator is in flight cancel the validator, not the other way around.

### 7.6b Native `<form>` and FormData

`FormField.Root` accepts a `name` prop. The Root paints it onto the underlying `<input>` so native form submission, `FormData`, and superforms pick the value up by key. A `name` set directly on `FormField.Input` wins over the Root-level value.

```svelte
<form method="POST">
  <FormField.Root initialValue="" name="email" validator={schema}>
    <FormField.Input type="email" />
  </FormField.Root>
</form>
```

## 7.7 Composing validation — `withValidation`

For headless layouts where the user doesn't want `FormField.Root` (e.g., custom DOM, Layer 3 builders), `withValidation` wraps an attachment:

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

Codified in [§17.5](17-integration-boundaries.md#175-forms--what-kumiki-ships-and-what-it-doesnt):

- **Form-state aggregation.** Multi-field `values`, aggregate `status`, cross-field validation — pair with `sveltekit-superforms`.
- **Server-action integration.** No magic `<Form.Root onsubmit>` — use SvelteKit form actions + `use:enhance` directly. `serverIssues` (§7.6a) is the per-field hook into the result.
- **Field arrays** (dynamic add/remove rows). Phase 2 candidate; superforms covers it today.
- **Wizard / multi-step forms.** Out of scope; layout concern, not primitive concern.
- **File uploads / drag-drop zones.** §17.1 boundary — pair with `dnd-kit-svelte`.
- **Network state libraries.** Bring your own `fetch` / TanStack Query / superforms.

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

- **TBD:** Do we expose the validation token for users who want to write their own async validators? Probably not at v1.0; advanced users can run `withValidation` and read state directly.
