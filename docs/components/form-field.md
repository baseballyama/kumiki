# FormField

> Single-input form field with Standard Schema validation, race-token guarding, and APG-compliant ARIA wiring.

| Field                       | Value                                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Validation contract**     | [Standard Schema v1](https://standardschema.dev/) — Zod 3.24+, Valibot 1.x, ArkType 2.0+, Effect 3.x |
| **Bundle (Layer 4 target)** | 2 kB brotli (informational; Layer 4 is gated indirectly via Layer 3 + Lighthouse)                    |
| **Status**                  | `preview` (Phase 1)                                                                                  |
| **Generics**                | `<V>` — input value type                                                                             |

```svelte
<script lang="ts">
  import { FormField } from '@kumiki/components';
  import { z } from 'zod';

  const schema = z.string().email();
  let email = $state('');
</script>

<FormField.Root name="email" validator={schema} bind:value={email}>
  <FormField.Label>Email</FormField.Label>
  <FormField.Input type="email" />
  <FormField.Errors />
</FormField.Root>
```

## Anatomy

```
FormField.Root<V>
  ├── FormField.Label
  ├── FormField.Input
  ├── FormField.Description    (optional; wires aria-describedby automatically)
  └── FormField.Errors         (live-region, role="alert", aria-live="polite")
```

| Part          | Responsibility                                                         |
| ------------- | ---------------------------------------------------------------------- |
| `Root`        | Owns the machine + controller; mirrors `bind:value`.                   |
| `Label`       | `<label for={inputId}>`; auto-wires htmlFor.                           |
| `Input`       | `<input>`; the controller paints id / aria-invalid / aria-describedby. |
| `Description` | Supplemental help text. Picked up by Input's `aria-describedby`.       |
| `Errors`      | Polite live-region; renders validation messages on transition.         |

## States

The machine has five states:

```
pristine ──INPUT──▶ editing ──BLUR──▶ validating ──RESOLVE──▶ valid|invalid
```

- `pristine` — user hasn't typed; FOCUS alone is a no-op (don't validate before interaction).
- `editing` — user is actively changing the value.
- `validating` — async validator in flight.
- `valid` / `invalid` — last validation outcome.

## Validation

Any [Standard Schema](https://standardschema.dev/) validator works — sync or async:

```ts
import * as v from 'valibot';
const schema = v.pipe(v.string(), v.email());
```

The controller dispatches `VALIDATION_RESOLVE` / `VALIDATION_REJECT` with the machine's current `validationToken`. Stale validations (when the user has typed since the validator was kicked off) are dropped — no flicker, no stale errors.

`validateOn`: `'blur'` (default) | `'change'` | `'submit'` | array combination.

## Keyboard

Form-Field uses native HTML input semantics — Tab moves focus, the validator runs on `blur` by default. There are no component-specific keys.

## ARIA

| Element       | Role    | aria-\* attributes                                                       |
| ------------- | ------- | ------------------------------------------------------------------------ |
| `Label`       | —       | `for` (htmlFor → inputId)                                                |
| `Input`       | (input) | `aria-invalid`, `aria-describedby` (gathers description + errors)        |
| `Description` | —       | `id` referenced by Input's `aria-describedby`                            |
| `Errors`      | `alert` | `aria-live="polite"`, `id` referenced by `aria-describedby` when invalid |

## Server-side errors (`serverIssues`)

When errors come from outside the local validator — a SvelteKit form action, a fetch call, sveltekit-superforms — pass them through `serverIssues`. The Root drives the field through the same `validating → invalid` path the validator uses, so the live region announces and `aria-invalid` flips identically.

```svelte
<FormField.Root
  initialValue=""
  name="email"
  validator={schema}
  serverIssues={form?.fieldErrors?.email}
>
  <FormField.Label>Email</FormField.Label>
  <FormField.Input type="email" />
  <FormField.Errors />
</FormField.Root>
```

Semantics:

| Value passed                             | Result                                |
| ---------------------------------------- | ------------------------------------- |
| `undefined` / `null`                     | No-op (server hasn't responded yet).  |
| `[]`                                     | Clears server errors → `valid`.       |
| `string[]` or `FieldIssue[]` (non-empty) | `invalid` with the supplied messages. |

`serverIssues` is reactive — re-pass a fresh array per server response. Typing into the field clears the server error immediately (the next `INPUT` event invalidates the token), so the user is never stuck on a stale message.

For imperative access (e.g. running `controller.validate()` before manual submit, or calling `controller.setErrors([...])` from a JS handler), use `oncontroller`:

```svelte
<script lang="ts">
  import type { FormFieldController } from '@kumiki/components/form-field';
  let ctrl: FormFieldController<string>;
</script>

<FormField.Root oncontroller={(c) => (ctrl = c)} initialValue="" name="email">...</FormField.Root>
```

## SvelteKit form actions

Same Standard Schema runs on both sides. `+page.server.ts`:

```ts
import { fail } from '@sveltejs/kit';
import * as v from 'valibot';

const schema = v.object({
  email: v.pipe(v.string(), v.email()),
});

export const actions = {
  default: async ({ request }) => {
    const data = Object.fromEntries(await request.formData());
    const result = schema['~standard'].validate(data);
    if (result.issues) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of result.issues) {
        const key = String(issue.path?.[0] ?? '_');
        (fieldErrors[key] ??= []).push(issue.message);
      }
      return fail(400, { fieldErrors, values: data });
    }
    // …persist…
  },
};
```

`+page.svelte`:

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import { FormField } from '@kumiki/components';
  import { schema } from './schema'; // shared with server
  let { form } = $props();
</script>

<form method="POST" use:enhance>
  <FormField.Root
    initialValue={form?.values?.email ?? ''}
    name="email"
    validator={schema.entries.email}
    serverIssues={form?.fieldErrors?.email}
  >
    <FormField.Label>Email</FormField.Label>
    <FormField.Input type="email" />
    <FormField.Errors />
  </FormField.Root>
  <button type="submit">Save</button>
</form>
```

The `name="email"` on `FormField.Root` is what makes the value land in `formData.email` on the server.

## sveltekit-superforms

superforms manages form state; kumiki paints the field. Disable the kumiki validator (superforms already runs the same Standard Schema) and pipe `$errors` through `serverIssues`:

```svelte
<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { valibot } from 'sveltekit-superforms/adapters';
  import { FormField } from '@kumiki/components';
  import { schema } from './schema';

  let { data } = $props();
  const { form, errors, enhance } = superForm(data.form, { validators: valibot(schema) });
</script>

<form method="POST" use:enhance>
  <FormField.Root
    initialValue={$form.email}
    bind:value={$form.email}
    name="email"
    serverIssues={$errors.email}
  >
    <FormField.Label>Email</FormField.Label>
    <FormField.Input type="email" />
    <FormField.Errors />
  </FormField.Root>
</form>
```

Two rules:

1. **Don't pass `validator`** — superforms already validates against the same Standard Schema. Adding it would double-run.
2. `bind:value={$form.email}` keeps superforms' state and the field's local state in sync.

## Yup (non-Standard-Schema) wrapper

Yup is not Standard Schema-compliant. A 20-line shim is the supported path:

```ts
import * as yup from 'yup';
import type { StandardSchemaV1 } from '@kumiki/components/form-field';

export function yupToStandard<T>(schema: yup.Schema<T>): StandardSchemaV1<unknown, T> {
  return {
    '~standard': {
      version: 1,
      vendor: 'kumiki-yup-shim',
      validate: async (value) => {
        try {
          return { value: await schema.validate(value, { abortEarly: false }) };
        } catch (err) {
          if (err instanceof yup.ValidationError) {
            return { issues: err.errors.map((message) => ({ message })) };
          }
          throw err;
        }
      },
    },
  };
}
```

Use it like any other validator — kumiki cannot tell the difference.

## Source

- Machine: [`packages/machines/src/form-field`](../../packages/machines/src/form-field)
- Headless: [`packages/headless/src/form-field`](../../packages/headless/src/form-field)
- Component: [`packages/components/src/form-field`](../../packages/components/src/form-field)
- Sandbox: [`/sandbox/form-field`](../../apps/docs/src/routes/sandbox/form-field)
