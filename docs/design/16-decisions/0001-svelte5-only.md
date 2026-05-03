# ADR 0001 — Svelte 5 only, no Svelte 4 compatibility

**Status:** Accepted
**Date:** 2026-05

## Context

Svelte 5 introduced runes (`$state`, `$derived`, `$effect`), attachments (`{@attach}`, added in 5.29), snippets (replacing slots), and an attribute-based reactivity model. These are not opt-in features layered on top of Svelte 4 — they are the new compilation target. Code that uses runes cannot run under Svelte 4, and the inverse (slot-based code) is officially supported in Svelte 5 but constrains design.

Kumiki is being designed in 2026, two years after Svelte 5's GA. Adopting Svelte 5 idioms is a foundational decision with bundle, DX, and ergonomic implications.

## Decision

Kumiki targets **Svelte 5.29+ only**. We do not provide a Svelte 4 build, a backport, or a feature subset that runs under Svelte 4.

Svelte 5.29 is the floor because `{@attach}` was added in that version and is central to Layer 3.

## Alternatives considered

| Option                                     | Verdict                                                                                                                                               |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Svelte 5 only** (chosen)                 | ✅                                                                                                                                                    |
| Dual targets (Svelte 4 + 5) via build flag | ❌ Doubles maintenance; each test becomes two; runes can't be compiled to Svelte 4 stores reliably; the Layer 3 attachment API has no Svelte 4 analog |
| Svelte 4 only, plan to migrate later       | ❌ Adopters in 2026 expect Svelte 5; Bits UI v2 is Svelte 5; Melt UI is migrating; Svelte 4-only is a dead-on-arrival positioning                     |

## Consequences

**Easier:**

- Layer 3 uses `{@attach}` directly. Multiple attachments per element, fully reactive, optional teardown — exactly the right primitive.
- Compound component generics work via `<script lang="ts" generics="T">`; no manual instance-type plumbing.
- The `child` snippet pattern (ADR 0007) replaces `asChild` cleanly.
- `$state` / `$derived` cross-file via `*.svelte.ts` files for controllers.

**Harder:**

- Users on Svelte 4 cannot adopt Kumiki without upgrading. We expect this to be uncommon by mid-2026.
- The catalog version `^5.29.0` is a bumpable floor; minor Svelte updates may break us.

## Mitigation for Svelte 4 users

We explicitly list the **migration path**: upgrade to Svelte 5, then adopt Kumiki. We will not maintain a Svelte 4 fork.

## References

- Svelte 5 attachments docs: https://svelte.dev/docs/svelte/@attach
- Svelte 5 migration guide: https://svelte.dev/docs/svelte/v5-migration-guide
- The user's market research §2.1 (Bits UI v1 migration) confirms the ecosystem direction.
