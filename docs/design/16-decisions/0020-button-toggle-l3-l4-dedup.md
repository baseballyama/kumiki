# ADR 0020 — Deduplicate Button / Toggle attribute painting between L3 and L4

**Status:** Proposed (post-v1.0; supersedes the architectural-reduction
rows for `@kumiki/components/{button,toggle}` in
[ADR 0018](0018-l4-bundle-budget-revision.md))
**Date:** 2026-05-10
**Implementation target:** v1.x (post-v1.0)
**Touches versioned contracts:** Yes — Layer 3 attachment contract (the
`paint()` function exposed by `@kumiki/headless/{button,toggle}`).
**Requires maintainer review before merge** per
[CLAUDE.md](../../../CLAUDE.md) "Things to NOT do without confirmation".

## Context

[ADR 0018](0018-l4-bundle-budget-revision.md) measured:

| Subpath                     | measured | reduction target |
| --------------------------- | -------- | ---------------- |
| `@kumiki/components/button` | 1.15 kB  | 800 B            |
| `@kumiki/components/toggle` | 2.85 kB  | 1_950 B          |

Both Button and Toggle (and `Toggle.Group` plumbing inside the latter)
suffer from the **same duplication smell**:

1. **Layer 3** (`@kumiki/headless/button`, `@kumiki/headless/toggle`)
   ships an attachment factory whose `paint(node)` writes
   `aria-pressed` / `aria-disabled` / `data-state` / `data-disabled`
   onto the node imperatively.
2. **Layer 4** (`Root.svelte`) re-derives the _same_ attribute set as
   reactive bindings (`aria-pressed={pressed}`, `data-state={…}`) so SSR
   produces the right HTML before the attachment runs.

The result: every L4 paint call site is shadowed by an equivalent L3
paint, and every reactive expression in L4 has a near-duplicate in the
L3 controller. This is what is making `toggle` measure 2.85 kB despite
the relative simplicity of an aria-pressed button.

Note: this is **not** an argument that L3 paint should disappear — it
remains the right tool for client-only consumers who attach kumiki to
non-Svelte hosts. The point is that the **L4 component shouldn't be
paying for both**.

## Decision

Refactor the L3 attachment contract so that L4 components can suppress
the paint pass without re-introducing it manually. Two coordinated
changes:

1. **Introduce a `mode` option on the L3 controller factory.**

   ```ts
   createButton({ mode: 'paint' }); // current default — L3 owns the DOM
   createButton({ mode: 'declarative' }); // L4 mode — L3 returns state, no paint
   ```

   In `'declarative'` mode the controller returns `state`, `props`, and
   `events` only; `paint()` is a no-op or absent. The L4 `Root.svelte`
   spreads `controller.props` onto its element and renders state-driven
   bindings as today, but no longer pays for the paint code path.

2. **Inline `Toggle.Group` roving-tabindex coordinator into Group root.**

   `@kumiki/components/toggle/Group.svelte` currently registers an
   item-list context and a roving-tabindex coordinator that mirrors what
   Toolbar does. Toolbar's design intentionally inlined this (see
   [`docs/components/toolbar.md`](../../components/toolbar.md) §"Why no
   machine, no Layer 3"); Toggle.Group should follow the same pattern,
   shedding the secondary controller entirely.

The combination is expected to bring Button to ≤ 800 B and Toggle to ≤
1_950 B (the reduction targets in ADR 0018).

### Migration story

- L3 consumers calling `createButton(input)` without options keep
  `'paint'` mode and see no change.
- L4 components opt into `'declarative'` mode in their `Root.svelte`
  controller construction.
- A migration note in
  [`docs/design/04-state-machines.md`](../04-state-machines.md) and the
  next major release notes documents the option.

This is **non-breaking** for L3 consumers but is a **contract change** to
the L3 surface (a new option, new public-API symbol). Marked
`Compatible (additive)` per
[`docs/design/14-versioning-release.md`](../14-versioning-release.md).

## Alternatives

| Option                                                                               | Verdict                                                                                                                                                             |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mode-flag the L3 controller (this ADR)**                                           | ✅ Lets L4 stop paying for paint without breaking standalone L3 consumers. Same idea as RAC's "render prop vs DOM ref" split.                                       |
| **Drop L3 paint entirely; require consumers to render attributes themselves**        | ❌ Cuts off the documented L3 use case (attach kumiki state to a non-Svelte node). Violates ADR 0012's per-layer separation.                                        |
| **Move all L4 attribute reactivity into the controller, treat L4 as a thin wrapper** | ❌ Forces the controller to emit Svelte snippets / runes, which couples Layer 3 to Svelte specifically. Layer 3 must remain framework-agnostic per ADR 0012 §3.     |
| **Accept the duplication, raise the budget**                                         | ❌ ADR 0018 already declined this for the headline components. 2.85 kB Toggle hands the "tighter than Radix" pitch to Bits UI on Toggle specifically (Bits ~800 B). |

## Consequences

### Easier

- Button + Toggle hit their declared budgets, closing two of the eight
  reduction rows in ADR 0018 §"deferred".
- The mental model "L4 = SSR-friendly reactive bindings; L3 = imperative
  attach-to-DOM" sharpens.
- Toggle.Group follows the same "no-machine" rationale as Toolbar — one
  documented pattern, two components.

### Harder

- Every existing L4 component that uses an L3 controller needs auditing
  for whether it should adopt `'declarative'` mode (we expect Button,
  Toggle, Switch, Checkbox, Tabs, RadioGroup, Slider — basically every
  controlled-state component). One PR per family.
- L3 attachment tests need to cover both modes.

### Reversible

- Yes. Removing the `mode` option later requires a major bump but the
  internal change is mechanical — flip every L4 caller back to the
  paint-mode default.

## References

- [ADR 0012](0012-package-consolidation.md) — per-layer package shape.
- [ADR 0018](0018-l4-bundle-budget-revision.md) §"Architectural reductions deferred"
- [`docs/components/toggle.md`](../../components/toggle.md) — Toggle + Toggle.Group spec
- [`docs/components/toolbar.md`](../../components/toolbar.md) — pattern reference
  ("Why no machine, no Layer 3")
- [`docs/design/04-state-machines.md`](../04-state-machines.md)
- [`docs/release/v1-execution-plan.md`](../../release/v1-execution-plan.md) A-2 完了ログ
