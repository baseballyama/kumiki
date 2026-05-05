# @kumiki/primitives

> Layer 1 framework-agnostic primitives — focus-trap, dismissable, id, locale, live-region, collection, interactions, motion, portal. Each subpath ≤ 500 B brotli.

**Layer:** Layer 1.

## Install

```bash
pnpm add @kumiki/primitives
```

## Use

Import only what you need — every primitive is a separate subpath:

```ts
import { createFocusTrap } from '@kumiki/primitives/focus-trap';
import { createDismissable } from '@kumiki/primitives/dismissable';
import { uid, createIdScope } from '@kumiki/primitives/id';
import { getNextEnabledId, findByTypeAhead } from '@kumiki/primitives/collection';
```

## Available subpaths

| Subpath                           | What                                                              | Budget |
| --------------------------------- | ----------------------------------------------------------------- | -----: |
| `@kumiki/primitives/focus-trap`   | Trap Tab cycle, configurable initial focus, return-focus on close |  500 B |
| `@kumiki/primitives/dismissable`  | Outside click + Escape detection                                  |  500 B |
| `@kumiki/primitives/id`           | SSR-safe id generator with `crypto.randomUUID` fallback           |  500 B |
| `@kumiki/primitives/locale`       | `direction()`, `formatter()`, `numberSystem()` helpers            |  500 B |
| `@kumiki/primitives/live-region`  | `announce(message, { politeness })`                               |  500 B |
| `@kumiki/primitives/collection`   | Roving tabindex, type-ahead, `getNextEnabledId`, `tabindexFor`    |  500 B |
| `@kumiki/primitives/interactions` | `press`, `hover`, `focus` — React-Aria-style normalizations       |  500 B |
| `@kumiki/primitives/motion`       | `prefersReducedMotion()`, `prefersContrast()`                     |  500 B |
| `@kumiki/primitives/portal`       | Render in target node                                             |  500 B |

Per-subpath budgets enforced in CI (`pnpm size`); current measurements
on the docs site at `/sizes`.

## See also

- [`docs/design/02-architecture.md`](../../../docs/design/02-architecture.md) — how Layer 1 fits.
- [`docs/design/09-bundle-budget.md`](../../../docs/design/09-bundle-budget.md) — per-subpath budget table.
