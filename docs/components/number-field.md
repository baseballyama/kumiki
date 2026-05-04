# NumberField

> Precise numeric input with `role="spinbutton"`. Arrow / page / Home / End keys nudge by `step` / `pageStep`; typing parses on blur with format/parse hooks for currency etc.

| Field                     | Value                                                               |
| ------------------------- | ------------------------------------------------------------------- |
| **APG pattern**           | [Spin Button](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/) |
| **Bundle (Layer 4 gzip)** | within `3000 B` budget                                              |
| **Status**                | `preview` (Phase 2)                                                 |

## Anatomy

```
NumberField.Root           (owns the controller; bindable value: number | null)
├─ NumberField.Decrement   (optional step-down button; auto-disabled at min)
├─ NumberField.Input       (the editable text input with role="spinbutton")
└─ NumberField.Increment   (optional step-up button; auto-disabled at max)
```

The bindable `value` is `number | null` — `null` represents an empty field. `format(value)` and `parse(raw)` are optional hooks (default `String(n)` / permissive `Number(...)`); use them for currency, locale-aware separators, or restricted formats.

## Keyboard

Source: [APG Spin Button keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/#keyboardinteraction). See [`apps/docs/keyboard/number-field.kb.ts`](../../apps/docs/keyboard/number-field.kb.ts).

| Key                   | When     | Effect                                            |
| --------------------- | -------- | ------------------------------------------------- |
| `ArrowUp`             | on input | Increment by `step`                               |
| `ArrowDown`           | on input | Decrement by `step`                               |
| `PageUp` / `PageDown` | on input | Increment / decrement by `pageStep`               |
| `Home` / `End`        | on input | Jump to `min` / `max` (only when bounded)         |
| `Enter`               | on input | Parse the typed value via `parse(raw)` and commit |
| (blur)                | on input | Same as `Enter`; invalid → restore previous value |

## ARIA

| Element     | Role         | aria-\* attributes                                                                   |
| ----------- | ------------ | ------------------------------------------------------------------------------------ |
| `Root`      | (none)       | `data-disabled`                                                                      |
| `Input`     | `spinbutton` | `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`, `aria-disabled` |
| `Increment` | (button)     | `aria-controls=<input id>`, `aria-disabled` (at max), `disabled`                     |
| `Decrement` | (button)     | `aria-controls=<input id>`, `aria-disabled` (at min), `disabled`                     |

## Source

- Machine: [`packages/components/number-field/machine`](../../packages/components/number-field/machine)
- Attachment: [`packages/components/number-field/attachment`](../../packages/components/number-field/attachment)
- Component: [`packages/components/number-field/component`](../../packages/components/number-field/component)
- Sandbox: [`/sandbox/number-field`](../../apps/docs/src/routes/sandbox/number-field)
