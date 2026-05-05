# Dialog

> Modal or non-modal panel that focus-traps content while open.

| Field                     | Value                                                                  |
| ------------------------- | ---------------------------------------------------------------------- |
| **APG pattern**           | [Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)       |
| **Bundle (Layer 4 gzip)** | within `3500 B` budget                                                 |
| **Status**                | `preview` (Phase 1)                                                    |
| **Modes**                 | `modal: true` (default, applies `inert` to siblings) \| `modal: false` |

## Anatomy

```
Dialog.Root
  ├── Dialog.Trigger
  ├── Dialog.Overlay      (optional backdrop; clicks dispatch OUTSIDE_CLICK)
  └── Dialog.Content
      ├── Dialog.Title
      ├── Dialog.Description
      └── Dialog.Close
```

| Part          | Responsibility                                                          |
| ------------- | ----------------------------------------------------------------------- |
| `Root`        | Owns machine + controller. Render-only — no DOM wrapper.                |
| `Trigger`     | `<button>` with `aria-haspopup="dialog"`, `aria-expanded`.              |
| `Overlay`     | Backdrop. Click → OUTSIDE_CLICK (gated by policy).                      |
| `Content`     | `role="dialog"`, `aria-modal`, `aria-labelledby`. Activates focus-trap. |
| `Title`       | Accessible name for the dialog (required for modal).                    |
| `Description` | Optional secondary text; wires `aria-describedby` automatically.        |
| `Close`       | `<button>` that dispatches CLOSE on click.                              |

## Keyboard

Source: [APG Dialog keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/#keyboardinteraction). See [`apps/docs/keyboard/dialog.kb.ts`](../../apps/docs/keyboard/dialog.kb.ts).

| Key                 | When                                   | Effect                                |
| ------------------- | -------------------------------------- | ------------------------------------- |
| `Enter` / `Space`   | on trigger, closed                     | Open the dialog                       |
| `Escape`            | open && `closeOnEscape` (default true) | Close                                 |
| `Tab` / `Shift+Tab` | focus inside dialog                    | Cycle through focusables (focus-trap) |

Outside-click on the overlay / document fires `OUTSIDE_CLICK`, gated by `closeOnOutsideClick` (default true). The trigger is in the dismissable's ignore list, so the click that opens the dialog isn't also counted as an outside-click that would close it.

## ARIA

| Element       | Role     | aria-\* attributes                                                   |
| ------------- | -------- | -------------------------------------------------------------------- |
| `Trigger`     | (button) | `aria-haspopup="dialog"`, `aria-controls`, `aria-expanded`           |
| `Content`     | `dialog` | `aria-modal`, `aria-labelledby` (titleId), `aria-describedby` (lazy) |
| `Title`       | —        | `id` referenced by Content's `aria-labelledby`                       |
| `Description` | —        | `id` referenced by Content's `aria-describedby` (lazy on mount)      |

When `modal: true`, every direct child of `<body>` that doesn't contain the Content node receives the `inert` attribute on open and has it removed on close — so screen-readers and keyboard users stay inside the dialog.

## Source

- Machine: [`packages/machines/src/dialog`](../../packages/machines/src/dialog)
- Headless: [`packages/headless/src/dialog`](../../packages/headless/src/dialog)
- Component: [`packages/components/src/dialog`](../../packages/components/src/dialog)
- Sandbox: [`/sandbox/dialog`](../../apps/docs/src/routes/sandbox/dialog)
