# Popover

> Click-anchored non-modal disclosure. Opens to a `role="dialog"` panel; Escape and outside-click dismiss (both gated by policy flags). Focus moves into the content on open and returns to the trigger on close.

| Field                               | Value                                                                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **APG pattern**                     | [Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) (APG has no dedicated popover pattern; closest fit) |
| **Bundle (Layer 4 target, brotli)** | `2.5 kB` brotli (informational)                                                                                        |
| **Status**                          | `preview` (Phase 2)                                                                                                    |

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

Source: [APG Disclosure keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/#keyboardinteraction). See [`apps/docs/keyboard/popover.kb.ts`](../../apps/docs/keyboard/popover.kb.ts).

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

## Popconfirm pattern (Phase 1.5)

A "click → confirm in a popover" pattern (delete buttons, destructive
toggles) ships as a **recipe** under `popover/with-confirm`, not as a
new component. Rationale: it's a composition of Popover + Button + i18n
strings; promoting to a new top-level component would dilute the
single-responsibility model.

The recipe wires:

- A trigger Button.
- A Popover.Content with `role="alertdialog"` (the only ARIA
  difference from a vanilla popover) and `aria-describedby` pointing
  at the message.
- Two action Buttons (`confirm`, `cancel`) with i18n-supplied default
  labels.
- Initial focus on the **cancel** button (less-destructive default,
  per APG `alertdialog` guidance).
- `Escape` resolves `cancel`.

Anatomy:

```
Popconfirm.Root            (Popover.Root + role escalation)
  ├── Popconfirm.Trigger
  └── Popconfirm.Content   (role="alertdialog")
        ├── Popconfirm.Message
        ├── Popconfirm.Confirm
        └── Popconfirm.Cancel
```

API:

```ts
type RootProps = {
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  /** Defaults via i18n: "Confirm" / "Cancel". */
  confirmLabel?: string;
  cancelLabel?: string;
  /** Visual emphasis (e.g. "danger" → atelier paints confirm red). */
  variant?: 'neutral' | 'danger';
};
```

i18n strings:

| Key                  | en        | ja           |
| -------------------- | --------- | ------------ |
| `popconfirm.confirm` | `Confirm` | `確認`       |
| `popconfirm.cancel`  | `Cancel`  | `キャンセル` |

`@kumiki/locale/<lang>/popconfirm`.

Lives at `@kumiki/components/popover/with-confirm` to make the
"recipe, not component" relationship explicit. Bundle: ≤ 0.6 kB on
top of Popover.

## Source

- Machine: [`packages/machines/src/popover`](../../packages/machines/src/popover)
- Headless: [`packages/headless/src/popover`](../../packages/headless/src/popover)
- Component: [`packages/components/src/popover`](../../packages/components/src/popover)
- Sandbox: [`/sandbox/popover`](../../apps/docs/src/routes/sandbox/popover)
