# ADR 0019 — Split datetime-field into DatePart / TimePart subpaths

**Status:** Proposed (post-v1.0; supersedes the architectural-reduction
row for `@kumiki/components/datetime-field` in
[ADR 0018](0018-l4-bundle-budget-revision.md))
**Date:** 2026-05-10
**Implementation target:** v1.x (post-v1.0)
**Touches versioned contracts:** Yes — `@kumiki/components` `package.json`
`exports` map. **Requires maintainer review before merge** per
[CLAUDE.md](../../../CLAUDE.md) "Things to NOT do without confirmation".

## Context

[ADR 0018](0018-l4-bundle-budget-revision.md) measured
`@kumiki/components/datetime-field` at **8.32 kB brotli**, +113 % over
the originally-declared **3.91 kB** target — by far the worst overrun in
the repo. The same ADR set the v1.0 gate at `9_000 B` (post-`+5 %`
envelope) and recorded **4_000 B** as the long-run reduction target,
contingent on this follow-on ADR.

Reading `packages/components/src/datetime-field/Root.svelte` confirms the
duplication: `datetime-field` re-implements segment plumbing already
present in `time-field`, and additionally inlines the calendar wiring
already present in `date-picker`. A consumer who only needs the date
portion (or only the time portion) pays for both regardless.

The component spec is
[`docs/components/time-and-datetime-field.md`](../../components/time-and-datetime-field.md);
`docs/components/datetime-field.md` was intentionally folded into that
spec by [F-1](../../release/v1-execution-plan.md#f-1-コンポーネント仕様-docscomponentsnamemd)
because the two components share segment internals.

## Decision

Split the surface into two **co-equal subpaths** under
`@kumiki/components/datetime-field`, plus an optional convenience
re-export, while keeping the user-visible component anatomy unchanged:

```
@kumiki/components/datetime-field          (default — Root + both parts)
@kumiki/components/datetime-field/date     (DatePart only — calendar wiring)
@kumiki/components/datetime-field/time     (TimePart only — segment wiring)
```

Internally, `DatePart` and `TimePart` move into co-located `*.svelte.ts`
controllers that compose `time-field`'s segment coordinator and
`date-picker`'s open/selection state, instead of re-implementing them.
The default subpath continues to render a unified field — consumers who
import it pay the full size; consumers who only need one portion can
import the corresponding sub-subpath and shed roughly half the bundle.

### `package.json` `exports` change

```jsonc
"./datetime-field": {
  "types": "./dist/datetime-field/index.d.ts",
  "svelte": "./dist/datetime-field/index.js",
  "import": "./dist/datetime-field/index.js"
},
"./datetime-field/date": {
  "types": "./dist/datetime-field/date/index.d.ts",
  "svelte": "./dist/datetime-field/date/index.js",
  "import": "./dist/datetime-field/date/index.js"
},
"./datetime-field/time": {
  "types": "./dist/datetime-field/time/index.d.ts",
  "svelte": "./dist/datetime-field/time/index.js",
  "import": "./dist/datetime-field/time/index.js"
}
```

This is an **additive** change to the published exports surface — the
current `./datetime-field` import keeps working unchanged. Marked
`Compatible (additive)` per
[`docs/design/14-versioning-release.md`](../14-versioning-release.md).

### Bundle target

Per ADR 0018: the default subpath drops to ≤ **4_000 B** brotli (the
recorded reduction target). The two sub-subpaths gain their own budgets
(estimated ≤ 2_500 B each, to be measured at first build). All three
gate via `measure:svelte-size:check`.

## Alternatives

| Option                                                                                          | Verdict                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Keep one mega-subpath, shrink in place**                                                      | ❌ The 8.32 kB number is duplication, not feature surface. Inlining alone won't hit 4 kB.                                                                                                                            |
| **Split into co-equal subpaths (this ADR)**                                                     | ✅ Matches the underlying component anatomy. Consumers who only need one half don't pay for both. Additive exports. Default subpath remains fully backward-compatible.                                               |
| **Replace `datetime-field` with two separate top-level components (`DateField` + `TimeField`)** | ❌ Already partially exists (`time-field`); but the _combined_ `DateTimeField` consumer story is real (single value, single accessible name, single "submit"). Forcing every consumer to re-implement this is wrong. |
| **Defer to v2.0**                                                                               | ❌ Would lock the 8.32 kB measurement into the v1.0 gate forever, weakening the "tighter than Radix" pitch in §9.1.                                                                                                  |

## Consequences

### Easier

- DateTime-only consumers shed ~50 % of the cost.
- The shared segment/calendar plumbing has one home (existing
  `time-field` and `date-picker`), removing a class of bug.
- ADR 0018's "deferred" row closes.

### Harder

- One-time migration of `Root.svelte` internals to delegate into the
  shared controllers.
- Three subpaths to gate / document instead of one.
- `exports` map changes require coordinated maintainer review and a
  changeset.

### Reversible

- Yes, but expensive. Once consumers start importing
  `@kumiki/components/datetime-field/date`, removing those entries
  becomes a major version bump.

## References

- [ADR 0018](0018-l4-bundle-budget-revision.md) §"Architectural reductions deferred"
- [`docs/design/09-bundle-budget.md`](../09-bundle-budget.md) §9.2
- [`docs/components/time-and-datetime-field.md`](../../components/time-and-datetime-field.md)
- [`docs/release/v1-execution-plan.md`](../../release/v1-execution-plan.md) A-2 完了ログ
