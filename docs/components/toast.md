# Toast

> Transient non-modal feedback — "Saved", "Failed to send", "Update available". A `role="region"` viewport with per-toast `role="status"` (polite) or `role="alert"` (assertive) items, auto-dismiss, and hover/focus pause.

| Field                               | Value                                                                       |
| ----------------------------------- | --------------------------------------------------------------------------- |
| **APG pattern**                     | [Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)                    |
| **Live-region pattern**             | [WAI-ARIA Live Regions](https://www.w3.org/TR/wai-aria-practices-1.2/#live) |
| **Bundle (Layer 4 target, brotli)** | within `3000 B` budget                                                      |
| **Status**                          | `preview` (Phase 2)                                                         |

## Anatomy

```
Toast.Toaster               (owns the queue + controller; one per app)
└─ Toast.Viewport           (role="region", aria-live="polite", hover/focus pauses timers)
   └─ Toast.Item × N        (per-toast wrapper, role="status" | role="alert")
      ├─ Toast.Title
      ├─ Toast.Description  (optional)
      └─ Toast.Close        (dismiss button)
```

```svelte
<script>
  import { Toast } from '@kumiki/components';
  // or, via the subpath:
  // import { Toaster, Viewport, Item, Title, Description, Close } from '@kumiki/components/toast';
</script>
```

`Toaster`'s `children` snippet receives `{ toasts, controller }` so the consumer iterates the queue in their own template and calls `controller.add({ ... })` from any handler. The per-toast `Close` button is keyboard-accessible — Tab into it, Enter dismisses (APG keyboard contract at [`apps/docs/keyboard/toast.kb.ts`](../../apps/docs/keyboard/toast.kb.ts)); the toast bodies themselves are not focused.

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

- Machine: [`packages/machines/src/toast`](../../packages/machines/src/toast)
- Headless: [`packages/headless/src/toast`](../../packages/headless/src/toast)
- Component: [`packages/components/src/toast`](../../packages/components/src/toast)
- Sandbox: [`/sandbox/toast`](../../apps/docs/src/routes/sandbox/toast)
