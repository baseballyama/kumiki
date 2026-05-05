# Toggle

> Two-state on/off button (`aria-pressed`).

| Field                               | Value                                                               |
| ----------------------------------- | ------------------------------------------------------------------- |
| **APG pattern**                     | [Button (toggle)](https://www.w3.org/WAI/ARIA/apg/patterns/button/) |
| **Bundle (Layer 4 target, brotli)** | within `1500 B` budget                                              |
| **Status**                          | `preview` (Phase 1; the Phase 0a pilot)                             |

## Anatomy

```
Toggle.Root        (a native <button> with aria-pressed)
```

`Toggle.Root` accepts a `child` snippet for render delegation per the APG-aligned pattern (replaces `asChild` from older libraries). Pass it to render any focusable element instead of the default button.

## Keyboard

Source: [APG Button keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/button/#keyboardinteraction). See [`apps/docs/keyboard/toggle.kb.ts`](../../apps/docs/keyboard/toggle.kb.ts).

| Key     | When      | Effect         |
| ------- | --------- | -------------- |
| `Space` | on toggle | Toggle pressed |
| `Enter` | on toggle | Toggle pressed |

## ARIA

| Element | Role     | aria-\* attributes                                   |
| ------- | -------- | ---------------------------------------------------- |
| `Root`  | (button) | `aria-pressed` ∈ `'true' / 'false'`, `aria-disabled` |

## Source

- Machine: [`packages/machines/src/toggle`](../../packages/machines/src/toggle)
- Headless: [`packages/headless/src/toggle`](../../packages/headless/src/toggle)
- Component: [`packages/components/src/toggle`](../../packages/components/src/toggle)
- Sandbox: [`/sandbox/toggle`](../../apps/docs/src/routes/sandbox/toggle)
