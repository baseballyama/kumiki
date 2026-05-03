# ADR 0002 — Subpackage split per Layer × component

**Status:** Accepted
**Date:** 2026-05

## Context

Headless UI libraries take very different approaches to packaging:

- **Radix UI**: 59 separate `@radix-ui/react-*` packages, plus an umbrella `radix-ui`.
- **Bits UI**: one package (`bits-ui`) with `~1.9 MB` unpacked, relying on tree-shaking.
- **Zag.js**: 51 machine packages + 4 framework adapters.
- **React Aria**: three-tier split (`react-stately`, `react-aria`, `react-aria-components`) with sub-path exports per component and per-locale `./i18n/<lang>` paths.
- **Melt UI**: one package + `internal/*` subpath exports.

Each model has trade-offs in install ceremony, version management, and tree-shake reliability.

## Decision

**One package per Layer × component**, plus a small set of shared packages:

- 4 shared (`@kumiki/primitives`, `@kumiki/locale`, `@kumiki/runtime`, `@kumiki/types`).
- 10 components × 3 layers (machine, attachment, component) = 30 component packages.
- 2 Layer-5 recipes (Toggle, Dialog) at v1.0 preview.
- 1 CLI (`@kumiki/cli`).

= 37 packages at v1.0.

## Alternatives considered

| Option                                                                   | Verdict                                                                                                                                      |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **30+ small packages, one per Layer × component** (chosen — Radix model) | ✅ Independent versioning, surgical bundle, clearest layer boundary                                                                          |
| **One mega-package** (Bits UI / Melt UI model)                           | ❌ Tree-shake is an unverifiable promise; users frequently report unexpected size growth; one Layer 1 patch forces every consumer to upgrade |
| **Three-tier split** (state / behavior / components — React Aria model)  | ⚠️ Considered. Rejected because it mixes "Layer abstraction" with "feature category"; we want sharper boundaries than that                   |
| **Two-tier split** (machines + components, no separate attachments)      | ❌ Loses the "want maximum DOM control" surface; Phase 0b validation requires it                                                             |

## Consequences

**Easier:**

- A user that wants only the Combobox machine for non-UI logic imports `@kumiki/machine-combobox` — gets a 3 KB pure-TS package, no Svelte runtime dependency.
- Layer 1 patches don't force Layer 4 consumers to bump.
- Layer 5 preview can carry a `0.x.x-preview` dist-tag without contaminating Layer 4 stability.

**Harder:**

- 37 `package.json` files to keep consistent. Mitigated by the script `scripts/gen_pkg.sh` (used during Phase 0a scaffolding) and per-package templates.
- Cross-package version drift if not careful. Mitigated by changesets + `workspace:*` protocol + monorepo CI gating publish health checks across the workspace.
- Install ceremony for users — they may need 5-10 packages for a typical app. Mitigated by a docs-site "starter snippet" generator and (deferred to v1.1) a possible meta-package.

## Why we don't ship an umbrella package at v1.0

Radix has `radix-ui` as an umbrella; we considered the same. We're holding off because:

1. The umbrella package adds zero functional value if subpath imports work (which they do).
2. Tooling like `pnpm dlx kumiki add <component>` is the better install ergonomics; meta-package is just a worse version of that.
3. We can add it in v1.1 if user demand materializes — backwards-compatible.

## References

- Competitor research report from research agent (May 2026).
- User market research §4.4 (bundle size discipline).
