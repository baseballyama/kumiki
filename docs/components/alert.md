# Alert

> Static or live message surface (`role="status"` / `role="alert"`).

| Field                               | Value                                                    |
| ----------------------------------- | -------------------------------------------------------- |
| **APG pattern**                     | [Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) |
| **Bundle (Layer 4 target, brotli)** | `1.0 kB` brotli (target)                                 |
| **Status**                          | `unreleased` (Phase 1.5)                                 |

## Anatomy

```
Alert.Root        (role="status" | role="alert")
  ├── Alert.Title          (visible heading)
  ├── Alert.Description    (body text)
  └── Alert.Close          (optional; only when dismissible)
```

`Alert` is the _static_ equivalent of `Toast` — placed in document
flow, not summoned by an event. Use Toast for ephemeral feedback;
Alert for persistent banners (page-level errors, maintenance notices).

## Severity vs role mapping

| Severity         | Role                                                  | When                                                                       |
| ---------------- | ----------------------------------------------------- | -------------------------------------------------------------------------- |
| `info` (default) | `status`                                              | Informational; do not interrupt assistive-tech focus.                      |
| `success`        | `status`                                              | Confirmation; do not interrupt.                                            |
| `warn`           | `status` or `alert` (consumer choice via `live` prop) | "Pre-emptive" warnings: `status`. Imminent action required: `alert`.       |
| `error`          | `alert`                                               | Default for errors — interrupts assistive-tech for immediate announcement. |

`role="alert"` SHOULD be applied at most once per page at a time;
multiple simultaneous alerts get coalesced by some screen readers.

## ARIA

| Element       | Role                          | aria-\* attributes                             |
| ------------- | ----------------------------- | ---------------------------------------------- |
| `Root`        | per severity (above)          | `aria-live` matches role; `aria-atomic="true"` |
| `Title`       | (none — element is a heading) | `id` referenced by `aria-labelledby` on Root   |
| `Description` | (none)                        | `id` referenced by `aria-describedby` on Root  |
| `Close`       | (Button)                      | `aria-label` (i18n: "Dismiss")                 |

## Keyboard

| Key      | When                             | Effect                            |
| -------- | -------------------------------- | --------------------------------- |
| `Escape` | Alert is dismissible and focused | Close (consumer opts in via prop) |
| `Tab`    | Focus inside dismissible alert   | Cycles to Close button            |

## API

### `Alert.Root`

```ts
type AlertProps =
  | { 'aria-labelledby': string; ... }                  // explicit ref
  | { children: Snippet; ... };                         // Title slot supplies labelledby

type BaseProps = {
  severity?: 'info' | 'success' | 'warn' | 'error';     // default 'info'
  live?: 'polite' | 'assertive';                        // override role/live
  dismissible?: boolean;                                // shows Close, enables Escape
  onDismiss?: () => void;
  icon?: Snippet<[{ severity: Severity }]>;             // per ADR 0014
};
```

## i18n strings

| Key             | en        | ja       |
| --------------- | --------- | -------- |
| `alert.dismiss` | `Dismiss` | `閉じる` |

Lives in `@kumiki/locale/<lang>/alert`.

## Source

- Machine: none.
- Headless: [`packages/headless/src/alert`](../../packages/headless/src/alert)
- Component: [`packages/components/src/alert`](../../packages/components/src/alert)

## Anti-patterns

- Don't render `role="alert"` for non-urgent info — overrides VoiceOver focus and is hostile.
- Don't put interactive controls beyond a single Close inside; alerts are read in one announcement.
- Don't toggle `role` based on state changes — re-mount the alert if severity changes meaningfully.

## Related

- [Toast](toast.md) — for ephemeral feedback in a region.
- ADR 0014 — severity icon snippet shape.
