# ADR 0017 — Atelier GA at v1.0 (supersedes ADR 0010)

**Status:** Accepted
**Date:** 2026-05-10
**Supersedes:** [ADR 0010 — Layer 5 preview during the v1.0 series](0010-layer5-preview-in-v1.md)

## Context

[ADR 0010](0010-layer5-preview-in-v1.md) (May 2026) decided to ship
`@kumiki/atelier` (Layer 5) as a **preview during the v1.0 series** —
versioned `0.x.x-preview-<datetime>-<sha>` on the npm `preview` dist-tag,
initial scope of two components (`toggle` + `dialog`), and a coordinated
re-cut to stable `1.x.x` once the rest of the stack matured.

Two facts have changed since:

1. **flyle-nexus adopted Atelier in production** under the bridge layer
   defined in [`docs/migrations/flyle-nexus.md`](../../migrations/flyle-nexus.md).
   The migration's bundle math, CSS-variable contract, and copy-paste
   ergonomics are being validated against a real product — not a preview
   audience. Telling flyle "your system depends on a preview package
   whose API may break" is the wrong message for code that already
   ships to users.

2. **Layer 4's contract just stabilized.** As of
   [the L4 headless contract clarification](../18-css-variable-contract.md#layer-4-data--contract-vs-layer-5-styling-vocabulary),
   Layer 4 emits only behavioral / ARIA `data-*` and Atelier owns the
   visual vocabulary (`data-variant`, `data-size`, …) via the rest-spread.
   The category of churn ADR 0010 was protecting against — Atelier
   needing re-paste because Layer 4 changed shape — is now bounded:
   the L4 surface no longer encodes any opinion that Atelier has to
   chase.

The competitive picture also reinforces the move. shadcn-svelte —
Atelier's nearest competitor on the copy-paste axis — ships its presets
as the canonical surface, not as preview. Telling evaluators "the
import-only mode is stable, but the copy-paste mode is preview" splits
the value proposition and undermines the path most prospects pick first.

## Decision

Ship `@kumiki/atelier` as a **GA package at v1.0** alongside the rest
of the `@kumiki/*` stack.

Concretely:

- **Versioning.** `@kumiki/atelier` ships as `1.0.0` in the same release
  as `@kumiki/{components,headless,machines,runtime,primitives,locale,types,cli}`.
  No more `0.x.x-preview-<datetime>-<sha>` versions; the npm `preview`
  dist-tag for Atelier is retired (preview tags for other unreleased
  experiments are unaffected).
- **Scope at GA.** All 32 Phase 1.5 atelier surfaces × 2 variants
  (Tailwind + vanilla) are GA, not just Toggle and Dialog. Shape and
  variant-naming are frozen behind the quality contract below.
- **Backwards-compatibility surface.** Three things are now semver-load-bearing
  for Atelier:
  - The `class`/`data-*` vocabulary Atelier emits on the inner Layer 4
    root (e.g. `data-variant="primary"` on Button).
  - The CSS custom properties Atelier reads from
    ([`docs/design/18-css-variable-contract.md`](../18-css-variable-contract.md)).
    Renaming or removing a documented "stable" leaf var is a major bump.
  - The component / part anatomy that `kumiki add` emits as source files.
    A consumer who ran `kumiki add button` two minor versions ago must
    still be able to upgrade `@kumiki/components/button` (the import-only
    mode dependency) without rewriting the painted file.

## Quality contract (the GA gate)

GA cannot be cut until every item below is true. These items are tracked
as track C of [`docs/release/v1-execution-plan.md`](../../release/v1-execution-plan.md);
this ADR is their charter.

1. **Variant shape uniformity (C-2).** Every atelier component exposes
   both Tailwind and vanilla variants under one regnant convention
   (folder-per-variant or `Name.tailwind.svelte` + `Name.vanilla.svelte`,
   not both). A `scripts/check-atelier-shape.mjs` CI gate enforces it.
2. **CSS-variable contract semver (C-3).** Every "stable" leaf var in
   [`docs/design/18-css-variable-contract.md`](../18-css-variable-contract.md)
   §18.3 is marked `stable`; experimental ones are explicitly opted in.
   `scripts/check-css-vars.mjs` verifies that atelier `:where(...)`
   rules reference only documented leaf vars.
3. **Bundle budgets (C-4).** Each atelier subpath × variant has a
   brotli budget enforced in CI (shared infra with the L4 budget gate
   in track A-2).
4. **Visual regression (C-5).** Each atelier component's representative
   states (incl. RTL) have a Playwright snapshot in
   `pnpm --filter @kumiki/docs test:visual`.
5. **`kumiki add` end-to-end (C-6).** `kumiki add <comp> --variant=tailwind`
   and `--variant=vanilla` succeed for every atelier surface; CLI ↔
   atelier version mismatch is detected and warned.
6. **Atelier docs (C-7).** `apps/docs/src/routes/atelier/` page positions
   Atelier as a first-class product (import-only / atelier-fork /
   headless-only modes) with a CSS-variable token visualizer.

## Alternatives considered

| Option                                                | Verdict                                                                                                                                                                                                                                   |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Atelier GA at v1.0** (chosen)                       | ✅ Matches actual production usage (flyle-nexus). Aligns with shadcn-svelte's copy-paste positioning. The L4 contract change bounded the churn risk that motivated the 0010 preview window.                                               |
| Keep ADR 0010 — preview during v1.0                   | ❌ Real production users already depend on Atelier; "preview" is now factually wrong. Stale.                                                                                                                                              |
| Tag Atelier `1.0.0-rc` instead of `1.0.0`             | ❌ `-rc` reads as "still feature-incomplete." With the quality contract above as the GA gate, the answer is binary: meet it or don't ship.                                                                                                |
| Promote only Toggle + Dialog to GA, rest stay preview | ❌ Forces flyle-nexus and any other consumer to consume two release tracks for one styling layer. The whole point of Atelier is that it covers the visual surface; partial GA defeats it.                                                 |
| Defer Atelier to v1.1                                 | ❌ Loses the "kumiki ships everything you need" coverage at launch. shadcn-svelte's positioning would dominate the v1.0 evaluation window. Also impossible without a hard fork given existing flyle-nexus dependency on stable contracts. |

## Consequences

**Easier:**

- One npm dist-tag (`latest`), one release workflow (`release.yml`) for
  Atelier — `preview.yml`'s Atelier-specific cuts go away.
- Marketing / SEO is straightforward — Atelier is a feature, not an
  asterisk on the landing page.
- flyle-nexus and any future external consumer get a stable contract
  from day one. No "we'll cut a stable version when …" caveats.
- Atelier becomes a first-class testbed for the CSS-variable contract,
  visual regression budget, and `kumiki add` CLI — quality these would
  not otherwise have funded.

**Harder:**

- The quality contract above is now load-bearing on the v1.0 ship date.
  None of those gates exist as code today; track C of the execution
  plan owns the build-out, and the path is on the launch critical path
  via M3 (2026-09 target).
- The CSS-variable contract has to be frozen before v1.0. Renames after
  GA become semver majors with codemods. The pre-GA window is the only
  cheap moment to rename or restructure leaf vars.
- Two-axis maintenance — Tailwind variant + vanilla variant — applies
  to every atelier component on every release. Drift between variants
  becomes a recurring CI concern.
- The variant naming we ship at GA (e.g. Button's `primary | secondary
| ghost | danger`) is contractual. Adding a variant later is a minor;
  removing or renaming one is a major.

## Migration from ADR 0010

For consumers tracking the `preview` dist-tag (`pnpm add @kumiki/atelier@preview`):

```bash
pnpm remove @kumiki/atelier
pnpm add @kumiki/atelier@^1.0.0
```

No source-level changes are expected for Toggle / Dialog (the two
components in 0010's launch scope) — the public API at preview-final is
the same as 1.0.0. Other components were not in the preview, so consumers
were not depending on them yet.

For consumers running `kumiki add <comp>` against a preview CLI, re-running
against the GA CLI emits the same source. The CLI gains a mismatch warning
(track C-6) so a CLI from before GA used against a GA `@kumiki/atelier`
package nudges users to upgrade.

## References

- [ADR 0010 — Layer 5 preview during the v1.0 series](0010-layer5-preview-in-v1.md) (superseded by this ADR).
- [`docs/release/v1-execution-plan.md`](../../release/v1-execution-plan.md), track C — the GA gate work.
- [`docs/design/18-css-variable-contract.md`](../18-css-variable-contract.md) — the CSS-variable contract this ADR makes semver-load-bearing.
- [`docs/design/14-versioning-release.md`](../14-versioning-release.md) — the release process; will be amended to drop the Atelier preview track in a follow-up.
- [`docs/design/15-roadmap.md`](../15-roadmap.md) §Phase 2 — "Layer 5 stable" line item is now obsolete; will be amended in a follow-up.
- [`docs/migrations/flyle-nexus.md`](../../migrations/flyle-nexus.md) — the production user whose adoption motivates GA.
- shadcn-svelte's copy-paste model — the spiritual reference for Atelier's distribution form.
