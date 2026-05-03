# ADR 0008 — pnpm workspace only — no Turborepo / Nx

**Status:** Accepted
**Date:** 2026-05

## Context

Multi-package monorepos commonly add a task orchestrator: Turborepo (Vercel), Nx (Nrwl), Wireit (Google), or pnpm scripts directly. Each adds:

- A configuration file (`turbo.json`, `nx.json`).
- A dependency graph cache.
- Optional remote-cache (Turborepo's selling point at scale).

The user's preference (Q3 in the design brief) was explicit: **pnpm only**.

## Decision

Kumiki uses **pnpm workspace + pnpm scripts directly**. No Turborepo. No Nx. No Wireit.

Build orchestration:

- `pnpm -r build` runs every package's `build` script in topological order.
- `pnpm --filter <pkg> build` builds a single package and its workspace dependencies.
- CI uses these directly (`.github/workflows/ci.yml`).

## Alternatives considered

| Option                 | Verdict                                                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **pnpm only** (chosen) | ✅ Zero extra config; least lock-in; sufficient for our task graph                                                            |
| Turborepo              | ❌ Useful at scale (remote cache shared across dev / CI); overkill for a 37-package design library; user explicitly opted out |
| Nx                     | ❌ Heavier; plugin ecosystem; overkill                                                                                        |
| Wireit                 | ❌ Better than nothing for fine-grained `package.json` script dependencies, but pnpm covers our needs                         |

## Consequences

**Easier:**

- One less tool. New contributors don't need to learn Turborepo's task graph.
- `pnpm install && pnpm build` works from a clean clone with no extra setup.
- No `turbo.json` to keep in sync with package boundaries.

**Harder:**

- No remote-cache benefit. CI rebuilds from scratch unless GitHub Actions cache is wired (it is, via `actions/setup-node@v4` + `cache: pnpm`).
- Affected-only computation (build/test only what changed since `main`) requires bespoke scripting if we add it later. We don't currently need it; the build is fast.

## When to revisit

We add a task orchestrator if any of these become true:

- Cold CI build exceeds **10 minutes** consistently.
- Local dev `pnpm test` exceeds **30 seconds** consistently.
- Team size grows to 5+ active maintainers and remote-cache value materializes.

Until then, pnpm carries us.

## References

- pnpm workspace docs: https://pnpm.io/workspaces
- User's brief §6 listed Turborepo / Nx as choices; user picked neither in Q3 answer (May 2026).
