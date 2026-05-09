# ADR 0012 — Consolidate per-component packages into per-layer packages

**Status:** Accepted (supersedes [ADR 0002](0002-subpackage-split.md))
**Date:** 2026-05

## Context

ADR 0002 fixed the package shape at **one package per Layer × component**:
~37 published packages at v1.0. The reasoning at the time was Radix-style
surgical layering and independent versioning per component.

Six months in, with all of Phase 1 + Phase 2 (16 components × 3 layers
= 48 component packages) implemented behind the auto-generated
`@kumiki/components` umbrella, two failure modes are unmistakable:

1. **Install ceremony is hostile.** A working "Toggle + Dialog + Combobox"
   app needs `@kumiki/component-toggle`, `@kumiki/component-dialog`,
   `@kumiki/component-combobox`, plus their transitive `attachment-*`
   and `machine-*` peers. The `@kumiki/components` umbrella partly
   solves this for end users but doesn't help anyone who wants headless.
2. **Scaffolding tax is enormous.** Every new component costs 3 fresh
   packages with `package.json`, `tsconfig.json`, `tsdown.config`,
   `vitest.config`, `etc/<pkg>.api.md`, `size-limit` configs, and an
   addition to `pnpm-workspace.yaml`. We've spent more time on package
   plumbing than on FSM logic.

Independent versioning per component — the strongest argument for the
old shape — has not paid off in practice. With changesets we already
emit one synchronized release per logical change; the cost of bumping
unaffected components is a no-op patch line in the changelog.

The library is **pre-publication** (no npm registrations, no consumers).
This is the right moment to fix the shape.

## Decision

**One package per layer**, with subpath exports per component:

| Package              | Role                                              | Subpaths                                                              |
| -------------------- | ------------------------------------------------- | --------------------------------------------------------------------- |
| `@kumiki/runtime`    | FSM core (`defineMachine`, transition primitive)  | (single entry)                                                        |
| `@kumiki/primitives` | DOM primitives                                    | `/id`, `/collection`, `/focus-trap`, `/dismissable`                   |
| `@kumiki/locale`     | i18n message data                                 | `/en`, `/ja`, `/zh-Hans`, ... (10 languages)                          |
| `@kumiki/types`      | Shared TS types                                   | (single entry)                                                        |
| `@kumiki/machines`   | All Layer 2 FSMs                                  | `/toggle`, `/combobox`, `/dialog`, ... (one per component)            |
| `@kumiki/headless`   | All Layer 3 attachments — depends on `machines`   | `/toggle`, `/combobox`, ... + composition `/combobox/with-validation` |
| `@kumiki/components` | All Layer 4 Svelte components                     | `/toggle`, `/dialog`, ... + dot-namespace barrel at root              |
| `@kumiki/atelier`    | All Layer 5 opinionated styled component variants | `/toggle`, `/dialog`                                                  |
| `@kumiki/cli`        | `kumiki add` binary                               | (single entry)                                                        |

**9 packages**, down from 37. Subpath exports remain authoritative for
tree-shake guarantees and IDE auto-import precision.

### Import shapes

```ts
// Common case — full Svelte components, dot-namespace barrel
import { Toggle, Dialog } from '@kumiki/components';

// Same components via subpath import (better tree-shake guarantee
// for older bundlers; identical for esbuild / rolldown)
import { Root, Trigger } from '@kumiki/components/toggle';

// Headless: own UI, just behavior
import { toggle } from '@kumiki/headless/toggle';
import { combobox, withValidation } from '@kumiki/headless/combobox';

// Pure FSM, no DOM (server-side validation, framework ports)
import { createToggleMachine } from '@kumiki/machines/toggle';
```

### Cross-package edges

- `@kumiki/headless` declares `@kumiki/machines` as a `dependencies`
  entry (not `peerDependencies`). Installing headless brings machines.
- `@kumiki/components` declares `@kumiki/headless` as a dependency.
  Installing components brings the whole stack.
- `@kumiki/atelier` depends on `@kumiki/components`.
- `@kumiki/runtime`, `@kumiki/primitives`, `@kumiki/locale`, `@kumiki/types`
  remain leaf foundations consumed throughout.

## Alternatives reconsidered

| Option                                                      | Verdict                                                                                                                                                                                                |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Per-layer packages with subpath per component** (chosen)  | ✅ One install for the common case; tree-shake intact via subpath; scaffolding cost is one folder per component, not three packages.                                                                   |
| **Status quo — 37 packages** (ADR 0002)                     | ❌ Validated as costly above. Independent versioning per component never used in anger.                                                                                                                |
| **Single mega-package** (Bits UI model)                     | ❌ A user who wants pure FSM (no DOM) gets the whole DOM-touching surface in their dep tree, even if tree-shaken from the bundle. Hard to enforce the layering constraint that DOM-free Layer 2 needs. |
| **Two packages: `@kumiki/headless` + `@kumiki/components`** | ⚠️ Tempting. Folds Layer 2 into headless. Rejected because pure FSM consumers (e.g. server validation, future React port) deserve a DOM-typeless install path.                                         |

## Consequences

**Easier:**

- New component cost: one `packages/machines/src/<name>/`,
  `packages/headless/src/<name>/`, `packages/components/src/<name>/`
  set of folders. No package.json files. No tsdown configs. No
  size-limit per-package wiring.
- Install for the common case drops from "three or more packages" to
  one (`@kumiki/components`) — or to two (`@kumiki/headless` + a UI of
  your own).
- Layering check stays mechanical: it now checks subpath imports
  within each layer package rather than inter-package imports.
- Removes the auto-generated `@kumiki/components` / `@kumiki/atelier`
  umbrella scripts — those packages are now first-class.

**Harder:**

- One regression in any component's machine forces a single layer
  package to bump. Acceptable because changesets already gates a
  release on a green workspace.
- size-limit must measure per-subpath, not per-package. Already the
  case for `@kumiki/primitives` (4 subpaths in one package); the
  pattern just expands. Per-subpath budgets stay in
  `docs/design/09-bundle-budget.md`.
- api-extractor's `<pkg>.api.md` becomes one report per layer package
  (a single large surface file) rather than 30+ tiny ones. We accept
  this — the diff still surfaces breaking changes.

## Migration

Migration runs in the same `/loop` cycle that introduces this ADR.

1. ADR + CLAUDE.md + STATUS.md updated to declare the new shape.
2. Per-layer migration in dependency order:
   - `@kumiki/machines` ← `@kumiki/machine-*` (16)
   - `@kumiki/headless` ← `@kumiki/attachment-*` (16) + composition subpaths
   - `@kumiki/components` ← `@kumiki/component-*` (16)
   - `@kumiki/atelier` ← `@kumiki/atelier-*` (2)
3. Tooling cleanup: drop `scripts/build-meta-packages.mjs`,
   `scripts/check-meta-drift.mjs`, the `packages/meta/` umbrella, the
   per-component `package.json` files, and entries in
   `pnpm-workspace.yaml`.
4. Tests, docs, sandboxes, and import statements move alongside.

Each layer's migration ships as one commit; gates green per commit.

## References

- ADR 0002 — superseded by this ADR.
- Per-package size table in `docs/design/09-bundle-budget.md` (rewritten
  alongside the migration).
- User direction (2026-05): "1コンポーネントずつパッケージが切られていても、
  使う側は沢山 npm インストールしないといけなくて大変。理想系で
  リファクタリングしてOK。"
