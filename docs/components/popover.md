# Popover

> Click-anchored non-modal disclosure. Opens to a `role="dialog"` panel; Escape and outside-click dismiss (both gated by policy flags). Focus moves into the content on open and returns to the trigger on close.

| Field                     | Value                                                                  |
| ------------------------- | ---------------------------------------------------------------------- |
| **APG pattern**           | [Dialog (non-modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog/) |
| **Bundle (Layer 4 gzip)** | within `3000 B` budget                                                 |
| **Status**                | `preview` (Phase 2)                                                    |

## Anatomy

```
Popover.Root           (owns the controller; bindable open: boolean)
├─ Popover.Trigger     (button with aria-haspopup="dialog")
└─ Popover.Content     (role="dialog" panel)
   ├─ Popover.Title          (id wired to content's aria-labelledby)
   ├─ Popover.Description    (id wired to content's aria-describedby)
   └─ Popover.Close          (button that closes the popover)
```

Popover differs from Dialog in being **non-modal**: focus is not trapped, the page stays interactive (`Tab` moves out normally). For modal interruptions use `@kumiki/components/dialog`.

## Keyboard

Source: [APG Dialog keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/dialog/#keyboardinteraction). See [`apps/docs/keyboard/popover.kb.ts`](../../apps/docs/keyboard/popover.kb.ts).

| Key               | When       | Effect                                             |
| ----------------- | ---------- | -------------------------------------------------- |
| `Enter` / `Space` | on trigger | Open the popover (native button activation)        |
| `Escape`          | on content | Close the popover (when `closeOnEscape` is true)   |
| `Tab`             | on content | Focus moves to next focusable normally (non-modal) |
| outside-click     | document   | Close (when `closeOnOutsideClick` is true)         |

## ARIA

| Element       | Role      | aria-\* attributes                                                |
| ------------- | --------- | ----------------------------------------------------------------- |
| `Trigger`     | (button)  | `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`        |
| `Content`     | `dialog`  | `aria-labelledby` (Title id), `aria-describedby` (Description id) |
| `Title`       | (heading) | provides `aria-labelledby` target                                 |
| `Description` | (none)    | provides `aria-describedby` target                                |

## Source

- Machine: [`packages/machines/src/popover`](../../packages/machines/src/popover)
- Headless: [`packages/headless/src/popover`](../../packages/headless/src/popover)
- Component: [`packages/components/src/popover`](../../packages/components/src/popover)
- Sandbox: [`/sandbox/popover`](../../apps/docs/src/routes/sandbox/popover)
