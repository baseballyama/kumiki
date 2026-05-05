# Checkbox

> Tri-state binary input (`unchecked` / `checked` / `mixed`).

| Field                               | Value                                                                                                                                           |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **APG pattern**                     | [Checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) (incl. [tri-state](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox-tristate/)) |
| **Bundle (Layer 4 target, brotli)** | within `1500 B` budget                                                                                                                          |
| **Status**                          | `preview` (Phase 1)                                                                                                                             |
| **Tri-state**                       | yes (`mixed` is programmatic-only — keyboard cycles checked ↔ unchecked)                                                                        |

## Anatomy

```
Checkbox.Root      (role="checkbox", aria-checked = 'true' | 'false' | 'mixed')
```

## Keyboard

Source: [APG Checkbox keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/#keyboardinteraction). See [`apps/docs/keyboard/checkbox.kb.ts`](../../apps/docs/keyboard/checkbox.kb.ts).

| Key     | When        | Effect                             |
| ------- | ----------- | ---------------------------------- |
| `Space` | on checkbox | Toggle between checked ↔ unchecked |

Per APG: `mixed` represents an indeterminate parent (e.g. "select all" reflecting a partially-selected child set). User keyboard input cycles checked ↔ unchecked only; the parent assigns `mixed` programmatically.

## ARIA

| Element | Role       | aria-\* attributes                                             |
| ------- | ---------- | -------------------------------------------------------------- |
| `Root`  | `checkbox` | `aria-checked` ∈ `'true' / 'false' / 'mixed'`, `aria-disabled` |

## Source

- Machine: [`packages/machines/src/checkbox`](../../packages/machines/src/checkbox)
- Headless: [`packages/headless/src/checkbox`](../../packages/headless/src/checkbox)
- Component: [`packages/components/src/checkbox`](../../packages/components/src/checkbox)
- Sandbox: [`/sandbox/checkbox`](../../apps/docs/src/routes/sandbox/checkbox)
