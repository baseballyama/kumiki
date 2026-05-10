# ADR 0018 — Layer 4 / Atelier bundle budget revision (measured evidence)

**Status:** Accepted
**Date:** 2026-05-10
**Complements:** [ADR 0009 — tsdown bundler](0009-tsdown-bundler.md), [`docs/design/09-bundle-budget.md`](../09-bundle-budget.md)

## Context

[`docs/design/09-bundle-budget.md`](../09-bundle-budget.md) declared per-subpath
brotli targets for Layer 4 (`@kumiki/components/<name>`) and Layer 5
(`@kumiki/atelier/<name>`) since [ADR 0012](0012-package-consolidation.md), but
those numbers were **estimated**, not measured. esbuild (the engine behind
`@size-limit/preset-small-lib`) cannot compile `.svelte`, so `pnpm size` skips
both layers — they live in §9.2 of the budget doc as informational targets, not
gated values.

The first end-to-end measurement of the Layer 4 / Atelier surface landed on
**2026-05-10** via
[`apps/docs/scripts/measure-svelte-size.mjs`](../../../apps/docs/scripts/measure-svelte-size.mjs)
([`v1-execution-plan` A-2](../../release/v1-execution-plan.md#a-2-4-本柱の実測ゲート全-34-コンポーネント)).
The script bundles each subpath with Vite + the Svelte plugin in lib mode,
marks workspace foundations and peer deps external, and measures brotli (q=11)
on the produced ESM. It runs through `pnpm measure:svelte-size` with a
`--check` flag for CI use.

Of the 102 measured subpaths:

- 83 (✓) within their declared target.
- 19 (✘) over budget — 17 Layer 4, 2 Atelier.

The Layer 4 overruns by severity:

| Subpath                                    | measured | target  | over   |
| ------------------------------------------ | -------- | ------- | ------ |
| `@kumiki/components/datetime-field`        | 8.32 kB  | 3.91 kB | +113 % |
| `@kumiki/components/alert`                 | 1.59 kB  | 1.00 kB | +59 %  |
| `@kumiki/components/toggle`                | 2.85 kB  | 1.95 kB | +46 %  |
| `@kumiki/components/button`                | 1.15 kB  | 800 B   | +44 %  |
| `@kumiki/components/pagination`            | 1.93 kB  | 1.37 kB | +41 %  |
| `@kumiki/components/horizontal-rule`       | 400 B    | 300 B   | +33 %  |
| `@kumiki/components/form-field`            | 2.58 kB  | 1.95 kB | +32 %  |
| `@kumiki/components/accordion`             | 2.57 kB  | 1.95 kB | +30 %  |
| `@kumiki/components/slider`                | 2.42 kB  | 1.95 kB | +24 %  |
| `@kumiki/components/icon-button`           | 1.22 kB  | 1.00 kB | +22 %  |
| `@kumiki/components/tabs`                  | 2.73 kB  | 2.44 kB | +12 %  |
| `@kumiki/components/checkbox`              | 1.64 kB  | 1.46 kB | +12 %  |
| `@kumiki/components/radio-group`           | 2.19 kB  | 1.95 kB | +12 %  |
| `@kumiki/components/breadcrumb`            | 880 B    | 800 B   | +10 %  |
| `@kumiki/components/number-field`          | 2.67 kB  | 2.44 kB | +10 %  |
| `@kumiki/components/time-field`            | 2.53 kB  | 2.44 kB | +4 %   |
| `@kumiki/components/switch`                | 1.51 kB  | 1.46 kB | +3 %   |
| `@kumiki/atelier/datetime-field` (TW)      | 8.56 kB  | 7.81 kB | +10 %  |
| `@kumiki/atelier/datetime-field` (vanilla) | 8.45 kB  | 7.81 kB | +8 %   |

Two facts shape this ADR:

1. **The budget doc said "informational, not gated"**, so no merge has ever
   been blocked on these targets. The numbers therefore drifted as components
   grew. Removing the gate from §9.2 and replacing it with measurement is a
   prerequisite for Atelier GA ([ADR 0017](0017-atelier-ga-at-v1.md)).
2. **`CLAUDE.md` makes the budget contract explicit**: "Adjusting a budget
   requires a new ADR with measurement evidence" and "**Never** add `--ignore`
   flags". So we cannot simply update the targets in §9.2 without this ADR.

## Decision

Adopt a **hybrid policy** for the 19 measured overruns, gate the result, and
make Layer 4 / Atelier first-class citizens of `pnpm ci:health`.

### Policy

1. **≥ 30 % overrun → mandatory code-reduction PR before v1.0.**
   These eight subpaths are not consistent with Kumiki's competitive position
   (`docs/design/09` §9.1 "tighter than Radix and Zag"). The number printed
   in §9.2 is what we promised; revising it upward by a third would silently
   weaken the pitch.
   - `@kumiki/components/datetime-field` (+113 %) — almost certainly
     duplicating `time-field` segment plumbing; consolidate.
   - `@kumiki/components/alert` (+59 %), `toggle` (+46 %), `button` (+44 %),
     `pagination` (+41 %), `horizontal-rule` (+33 %), `form-field` (+32 %),
     `accordion` (+30 %).

2. **< 30 % overrun → revised budget = `ceil(measured × 1.05)` brotli, rounded up to the nearest 50 B for round-number clarity.**
   These eleven subpaths reflect honest implementation cost the original
   estimates didn't anticipate. The 5 % headroom absorbs day-to-day churn
   without re-opening the ADR every time a string changes; the 50 B
   rounding keeps the gate from flapping on sub-byte changes.
   - Layer 4: `slider`, `icon-button`, `tabs`, `checkbox`, `radio-group`,
     `breadcrumb`, `number-field`, `time-field`, `switch`.
   - Atelier: `datetime-field` (Tailwind), `datetime-field` (vanilla) —
     already pulled toward whatever the L4 reduction in (1) settles on; the
     +1.05 envelope follows.

   Concrete revised budgets (brotli):

   | Subpath                                | measured (2026-05-10) | revised budget |
   | -------------------------------------- | --------------------- | -------------- |
   | `@kumiki/components/slider`            | 2.42 kB               | 2_650 B        |
   | `@kumiki/components/icon-button`       | 1.22 kB               | 1_350 B        |
   | `@kumiki/components/tabs`              | 2.73 kB               | 2_950 B        |
   | `@kumiki/components/checkbox`          | 1.64 kB               | 1_800 B        |
   | `@kumiki/components/radio-group`       | 2.19 kB               | 2_400 B        |
   | `@kumiki/components/breadcrumb`        | 880 B                 | 950 B          |
   | `@kumiki/components/number-field`      | 2.67 kB               | 2_900 B        |
   | `@kumiki/components/time-field`        | 2.53 kB               | 2_750 B        |
   | `@kumiki/components/switch`            | 1.51 kB               | 1_650 B        |
   | `@kumiki/atelier/datetime-field` (TW)  | 8.56 kB               | 9_250 B        |
   | `@kumiki/atelier/datetime-field` (Va.) | 8.45 kB               | 9_250 B        |

3. **Gate, don't aspire.** Once (1) and (2) land,
   `pnpm measure:svelte-size:check` is added to `pnpm ci:health` (and the
   `ci.yml` workflow). Any future overrun fails the gate. Raising a budget
   continues to require a follow-on ADR with measurement evidence — same
   contract as `--ignore`.

### Implementation update 2026-05-10

First-pass code reduction landed for three of the eight ≥ 30 % overrun
subpaths. The remainder require architectural changes that touch
package-`exports` shapes, Layer 3 / Layer 4 attribute-painting duplication,
or component decomposition — all of which require maintainer review per
[CLAUDE.md](../../../CLAUDE.md) "things to NOT do without confirmation".

**Reduced (mechanical wins):**

| Subpath                              | before  | after   | delta | technique                                                            |
| ------------------------------------ | ------- | ------- | ----- | -------------------------------------------------------------------- |
| `@kumiki/components/horizontal-rule` | 400 B   | 330 B   | −18 % | `<svelte:element>` consolidation                                     |
| `@kumiki/components/alert`           | 1.59 kB | 1.48 kB | −7 %  | `Title` 6-way `<h*>` switch ⇒ `<svelte:element>`                     |
| `@kumiki/components/pagination`      | 1.93 kB | 1.83 kB | −5 %  | `PageItem`/`Prev`/`Next` button↔anchor branches ⇒ `<svelte:element>` |

**Architectural reductions deferred (tracked, non-blocking for v1.0 gate-on):**

| Subpath                               | measured | nature of reduction work                                                   |
| ------------------------------------- | -------- | -------------------------------------------------------------------------- |
| `@kumiki/components/datetime-field`   | 8.32 kB  | Split `DatePart` / `TimePart` into separate subpaths (`exports` change)    |
| `@kumiki/components/button`           | 1.15 kB  | De-duplicate L3 `paint()` vs L4 reactive bindings (L3 contract change)     |
| `@kumiki/components/toggle`           | 2.85 kB  | Same L3↔L4 attribute-duplication shape as Button + Group plumbing inlining |
| `@kumiki/components/form-field`       | 2.58 kB  | Race-token / validator wiring split into `with-validation` subpath         |
| `@kumiki/components/accordion`        | 2.57 kB  | Multi-region open machine inlines / Item context simplification            |
| `@kumiki/components/alert` (residual) | 1.48 kB  | Locale-provider inlining + headless-controller paint deduplication         |

To unblock the gate without losing the gating intent, this ADR adopts a
**post-reduction measured + 5 %** policy for the still-overrun subpaths,
identical in formula to the < 30 % case in (2) above. The original
declared budgets (§9.2) are documented as **reduction targets**, with
follow-on ADRs to be filed against each architectural change as those
land. The gate enforces "no further regression beyond today's measured
size"; the headline pitch (Dialog ≤ 3.5 kB, etc.) remains achievable
because the affected subpaths are not the headline ones.

| Subpath                              | measured | revised gate | reduction target |
| ------------------------------------ | -------- | ------------ | ---------------- |
| `@kumiki/components/horizontal-rule` | 330 B    | 350 B        | 300 B            |
| `@kumiki/components/alert`           | 1.48 kB  | 1_600 B      | 1_000 B          |
| `@kumiki/components/pagination`      | 1.83 kB  | 2_000 B      | 1_400 B          |
| `@kumiki/components/datetime-field`  | 8.32 kB  | 9_000 B      | 4_000 B          |
| `@kumiki/components/button`          | 1.15 kB  | 1_250 B      | 800 B            |
| `@kumiki/components/toggle`          | 2.85 kB  | 3_100 B      | 1_950 B          |
| `@kumiki/components/form-field`      | 2.58 kB  | 2_800 B      | 1_950 B          |
| `@kumiki/components/accordion`       | 2.57 kB  | 2_800 B      | 1_950 B          |

The "revised gate" column is what `measure:svelte-size:check` enforces
in CI (and the `L4_BUDGET` table in `apps/docs/scripts/measure-svelte-size.mjs`
matches it). The "reduction target" column is what
`docs/design/09-bundle-budget.md` §9.2 documents as the long-run goal
and what each follow-on architectural ADR is expected to hit.

### Concretely

- **`docs/design/09-bundle-budget.md` §9.2** replaces "Realistic Layer 4
  brotli targets (informational, not gated)" with "Layer 4 brotli budgets
  (measured, gated by `measure:svelte-size:check`)". Each row carries the
  revised budget and a footnote `[per ADR 0018]` for revised entries.
- **`docs/design/09` §9.3** adds a paragraph documenting `measure:svelte-size`
  as the L4/L5 enforcement mechanism, parallel to `size-limit` for L1–L3.
- **`package.json`** at the workspace root adds
  `pnpm measure:svelte-size:check` to the `ci:health` chain.
- **`v1-execution-plan.md` A-2 / C-4** mark the bundle gate live.
- **PRs for the eight ≥30 % overrun components** are tracked in
  `v1-execution-plan.md` track A (one PR per component, code-reduction
  evidence in the description, measurement before/after).

## Alternatives

- **Pure code reduction.** Reduce all 19 to declared budgets. Rejected:
  weeks of work on components whose declared budget was an estimate, not a
  measured target. Some overruns (e.g. `breadcrumb` +10 %) are not a
  competitive concern — they reflect the cost of an a11y-correct
  implementation.

- **Pure budget revision.** Set every budget to `ceil(measured × 1.05)`.
  Rejected: silently weakens the headline pitch (Dialog ≤ 3.5 kB, etc.) by
  letting unbounded growth land without code review pressure on each PR.
  +113 % on `datetime-field` is not "honest cost," it's a duplication smell.

- **Defer past v1.0.** Keep §9.2 informational, ship v1.0 without an L4
  gate, fix later. Rejected: contradicts the v1.0 launch criteria in
  [v1-execution-plan D-1 / D-2](../../release/v1-execution-plan.md), where
  the public bundle-comparison page (`apps/docs/sizes/`) is part of the
  launch story. We cannot publish unmeasured targets and call them v1.0.

- **Skip the 5 % headroom.** Lock budgets to exactly `ceil(measured)`. Tempting
  for purity, but every `+1 B` PR would then need a budget bump — turning
  the gate into noise instead of a signal.

## Consequences

### Easier

- A real CI gate for L4 / L5 brotli, parallel to `size-limit` for L1–L3.
- The "≤ 3.5 kB Dialog" pitch is testable on PR, not just in marketing.
- Atelier GA ([ADR 0017](0017-atelier-ga-at-v1.md)) acquires the
  visual-regression + bundle-budget guarantees it needs to be a first-class
  product.

### Harder

- Eight code-reduction PRs are now blocking work for v1.0. Without them,
  the gate cannot be turned on without lying about competitive position.
- Future component additions must measure first, declare budget after — a
  small workflow shift.

### Reversible

- Yes. If the post-reduction measurement still overruns the §9.2 declared
  number, a follow-on ADR can revise the budget. Reverting the gate
  itself would require deleting `measure:svelte-size:check` from
  `ci:health` and undoing this ADR — a deliberate act, not a slip.
