# Field (Form-Field)

> Single-input form field with Standard Schema validation, race-token guarding, and APG-compliant ARIA wiring.

| Field                     | Value                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Validation contract**   | [Standard Schema v1](https://standardschema.dev/) — Zod 3.24+, Valibot 1.x, ArkType 2.0+, Effect 3.x |
| **Bundle (Layer 4 gzip)** | within `3000 B` budget                                                                               |
| **Status**                | `preview` (Phase 1)                                                                                  |
| **Generics**              | `<V>` — input value type                                                                             |

## Anatomy

```
Field.Root<V>
  ├── Field.Label
  ├── Field.Input
  ├── Field.Description    (optional; wires aria-describedby automatically)
  └── Field.Errors          (live-region, role="alert", aria-live="polite")
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

## Source

- Machine: [`packages/components/form-field/machine`](../../packages/components/form-field/machine)
- Attachment: [`packages/components/form-field/attachment`](../../packages/components/form-field/attachment)
- Component: [`packages/components/form-field/component`](../../packages/components/form-field/component)
- Sandbox: [`/sandbox/form-field`](../../apps/docs/src/routes/sandbox/form-field)
