# Badge

> Compact label / count, non-interactive by default.

| Field                               | Value                    |
| ----------------------------------- | ------------------------ |
| **APG pattern**                     | (none — semantic span)   |
| **Bundle (Layer 4 target, brotli)** | `0.5 kB` brotli          |
| **Status**                          | `unreleased` (Phase 1.5) |

## Anatomy

```
Badge.Root        (<span>)
```

Badge is _purely presentational_: a styled `<span>` with status data
hooks. It has no FSM, no Layer 2/3.

## When to use which markup

- Visible text (e.g. "New") — content is the accessible name; no extra ARIA needed.
- Count-only (e.g. "3" on a notification bell) — Root requires `aria-label` (e.g. `"3 unread notifications"`) or the surrounding control supplies the meaning via `aria-describedby`.
- Decorative-only (e.g. dot indicator) — set `decorative={true}` to apply `aria-hidden="true"`.

## ARIA

| Element | Role   | aria-\* attributes                                              |
| ------- | ------ | --------------------------------------------------------------- |
| `Root`  | (none) | `aria-label` (when count-only); `aria-hidden` (when decorative) |

## API

```ts
type BadgeProps =
  | { decorative: true; children?: Snippet }
  | { 'aria-label': string; children: Snippet } // count-only with explicit label
  | { children: Snippet }; // text-content carries semantics

type CommonProps = {
  variant?: 'neutral' | 'info' | 'success' | 'warn' | 'error';
  size?: 'sm' | 'md';
};
```

## Examples

```svelte
<!-- text content -->
<Badge.Root variant="success">New</Badge.Root>

<!-- count-only -->
<Badge.Root aria-label="3 unread notifications">3</Badge.Root>

<!-- decorative dot -->
<Badge.Root decorative variant="error" />
```

## Source

- Component: [`packages/components/src/badge`](../../packages/components/src/badge)

## Related

- [Chips](chips.md) — when the badge becomes interactive (filter, dismissible).
