# Dialog

> Modal or non-modal panel that focus-traps content while open.

| Field                               | Value                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------- |
| **APG pattern**                     | [Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)       |
| **Bundle (Layer 4 target, brotli)** | `3.5 kB` brotli (informational)                                        |
| **Status**                          | `preview` (Phase 1)                                                    |
| **Modes**                           | `modal: true` (default, applies `inert` to siblings) \| `modal: false` |

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

## Drawer variant (Phase 1.5)

A **Drawer** is `Dialog` with side-positioning. Same machine, same
ARIA — only the layout contract differs. Driven by the `side` prop on
`Dialog.Root`.

| Prop value                 | Visual default (atelier)                                   |
| -------------------------- | ---------------------------------------------------------- |
| `side: 'center'` (default) | Centered modal (today's behavior).                         |
| `side: 'left'`             | Slides in from the inline-start edge. RTL: from the right. |
| `side: 'right'`            | Slides in from the inline-end edge. RTL: from the left.    |
| `side: 'top'`              | Slides down from the top.                                  |
| `side: 'bottom'`           | Slides up from the bottom (mobile-sheet flavor).           |

The `side` prop sets `data-side` on `Dialog.Content`; atelier
translates that to the slide-in transform. Layer 4 emits no styles.

Drawer-specific contract:

- `modal: false` is supported (a permanently-pinned side panel) but
  `side: 'center'` + `modal: false` is the only combination where focus-trap
  defaults to `false` — for side drawers, focus-trap defaults to
  `modal`'s value.
- Swipe-to-dismiss on touch devices is **out of scope**; consumers wire
  pointer events themselves (the dismissable primitive will fire
  `CLOSE` on consumer call).
- The `aria-modal` attribute follows `modal` exactly; pinned non-modal
  drawers omit it.

i18n: no new strings; existing Dialog close-button label is reused.

```svelte
<!-- right-side drawer -->
<Dialog.Root side="right" bind:open>
  <Dialog.Trigger>Open settings</Dialog.Trigger>
  <Dialog.Overlay />
  <Dialog.Content>
    <Dialog.Title>Settings</Dialog.Title>
    <!-- ... -->
    <Dialog.Close />
  </Dialog.Content>
</Dialog.Root>
```

Bundle budget impact: +0.3 kB to `@kumiki/components/dialog` for the
`data-side` plumbing. Total budget revised to **3.8 kB** (was 3.5 kB)
— logged in `09-bundle-budget.md`.

## Source

- Machine: [`packages/machines/src/dialog`](../../packages/machines/src/dialog)
- Headless: [`packages/headless/src/dialog`](../../packages/headless/src/dialog)
- Component: [`packages/components/src/dialog`](../../packages/components/src/dialog)
- Sandbox: [`/sandbox/dialog`](../../apps/docs/src/routes/sandbox/dialog)
