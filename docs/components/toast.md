# Toast

> Transient non-modal feedback — "Saved", "Failed to send", "Update available". A `role="region"` viewport with per-toast `role="status"` (polite) or `role="alert"` (assertive) items, auto-dismiss, and hover/focus pause.

| Field                     | Value                                                                       |
| ------------------------- | --------------------------------------------------------------------------- |
| **APG pattern**           | [Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)                    |
| **Live-region pattern**   | [WAI-ARIA Live Regions](https://www.w3.org/TR/wai-aria-practices-1.2/#live) |
| **Bundle (Layer 4 gzip)** | within `3000 B` budget                                                      |
| **Status**                | `preview` (Phase 2)                                                         |

## Anatomy

```
Toaster (Root)              (owns the queue + controller; one per app)
└─ Toaster.Viewport         (role="region", aria-live="polite", hover/focus pauses timers)
   └─ Toaster.Item × N      (per-toast wrapper, role="status" | role="alert")
      ├─ Toaster.Title
      ├─ Toaster.Description (optional)
      └─ Toaster.Close       (dismiss button)
```

`Toaster`'s `children` snippet receives `{ toasts, controller }` so the consumer iterates the queue in their own template and calls `controller.add({ ... })` from any handler. There is **no** keyboard contract — toasts don't capture focus.

## Behaviour

| Concept           | Effect                                                                  |
| ----------------- | ----------------------------------------------------------------------- |
| `defaultDuration` | ms before auto-dismiss; per-toast `duration` overrides; `-1` = sticky.  |
| `max`             | Hard limit on visible toasts; oldest dropped when full (default 5).     |
| Hover / focus     | Pauses every active timer with elapsed-ms preserved; leave resumes.     |
| `politeness`      | `'polite'` → `role="status"` (default); `'assertive'` → `role="alert"`. |
| `type`            | `'info' / 'success' / 'warning' / 'error'` painted as `data-type`.      |

## ARIA

| Element    | Role               | aria-\* attributes                                                                   |
| ---------- | ------------------ | ------------------------------------------------------------------------------------ |
| `Viewport` | `region`           | `aria-label="Notifications"`, `aria-live="polite"`, `aria-relevant="additions text"` |
| `Item`     | `status` / `alert` | `aria-live` (per politeness), `aria-atomic="true"`, `data-type`                      |
| `Close`    | (button)           | `aria-label="Dismiss notification"`                                                  |

## Source

- Machine: [`packages/components/toast/machine`](../../packages/components/toast/machine)
- Attachment: [`packages/components/toast/attachment`](../../packages/components/toast/attachment)
- Component: [`packages/components/toast/component`](../../packages/components/toast/component)
- Sandbox: [`/sandbox/toast`](../../apps/docs/src/routes/sandbox/toast)
