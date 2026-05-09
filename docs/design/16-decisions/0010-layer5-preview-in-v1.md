# ADR 0010 — Layer 5 (the Atelier) preview during the v1.0 series

**Status:** Accepted
**Date:** 2026-05 (revised 2026-05-09 — package renamed `@kumiki/recipes` → `@kumiki/atelier`)

## Context

Layer 5 is styled, copy-paste-friendly component variants (`@kumiki/atelier`) — Tailwind v4 + vanilla CSS variants — distributed via `@kumiki/cli` (`npx kumiki add dialog`).

The brief's Section 4 deferred Layer 5 to v1.1: "v1.0 では Layer 1〜4 を優先し、Layer 5 は v1.1 以降でも可". The user's later answer (Q14, May 2026) was **C: ship Layer 5 alongside v1.0 as a preview** — recognizing that "design-validation needs ready-to-paste assets to evaluate."

The trade-off:

- **Pro of preview:** users can immediately copy a working dialog into their app — accelerates evaluation and uncovers Layer 4 ergonomics issues earlier.
- **Con of preview:** if Layer 4 changes between v1.0 and v1.1, the preview Atelier sources need re-pasting in user codebases. Communicating "this is preview" is essential.

## Decision

Ship `@kumiki/atelier` as a **preview during the v1.0 series**, published with the npm dist-tag `preview` and version pattern `0.x.x-preview-<datetime>-<sha>`.

Initial preview scope at v1.0 launch: **two Atelier components** — `@kumiki/atelier/toggle` and `@kumiki/atelier/dialog`. These are the lowest-API-risk components.

When Layer 4 hits 1.0 (which it does at v1.0 of `@kumiki/components`), the Atelier is re-cut as stable `1.x.x` versions in a coordinated release.

### Why "Atelier" (and not "Recipes")

The original package name was `@kumiki/recipes`. It was renamed in 2026-05-09 to `@kumiki/atelier` because:

- "Recipe" reads as casual / DIY and undersells the polish that Layer 5 needs to carry as the user-facing styled surface.
- The Atelier metaphor matches the project's woodworking name: Kumiki (組木) is the joinery, the Atelier is the workshop where surface treatment happens.
- The CLI command (`kumiki add toggle`) reads cleanly without referencing the package name; nothing user-facing depends on the old word.

Search for any lingering `@kumiki/recipes` references is part of CI cleanup; the legacy name is only retained as a redirect in this ADR for archeology.

## Preview tag mechanics

`changesets` snapshot publishes via the `preview.yml` workflow:

```bash
pnpm changeset version --snapshot preview
pnpm changeset publish --tag preview --no-git-tag
```

Versions look like `0.0.0-preview-20260601-abcdef0`. Users opt in:

```bash
pnpm add @kumiki/atelier@preview
```

Stable installs (`pnpm add @kumiki/atelier`) get nothing until v1.0 stable.

## What "preview" means

- **API contract**: not stable. Atelier source can change between previews.
- **Bug fixes**: best-effort. We ship preview snapshots when convenient.
- **Documentation**: marked `Status: preview` on each Atelier page.
- **Migration**: no codemods for preview-to-preview changes. From preview-final to v1.0 stable, we ship a codemod.

## Alternatives considered

| Option                                            | Verdict                                                                                           |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Preview during v1.0** (chosen)                  | ✅ Users get assets to try immediately; preview tag prevents accidental adoption of unstable code |
| Defer all Layer 5 to v1.1 (brief's original)      | ⚠️ Loses early validation feedback; user's Q14 answer indicated this risk                         |
| Ship Layer 5 stable alongside v1.0                | ❌ Locks in copy-paste sources that may break with Layer 4 evolution                              |
| Ship Layer 5 only to public docs (no npm publish) | ❌ Defeats the `kumiki add` install ergonomics                                                    |

## Consequences

**Easier:**

- Users have ready-to-paste components from day one.
- Feedback on the Atelier's CSS architecture (CSS vars, Tailwind v4 variants) starts during the v1.0 series.
- The CLI (`@kumiki/cli`) is exercised in production from launch.

**Harder:**

- Communicating "preview" clearly. Mitigation: dist-tag + Atelier page banner + npm `description` includes "(preview)".
- Two release tracks for the Atelier (preview vs stable). Mitigation: `preview.yml` workflow handles preview cuts; `release.yml` handles stable.
- Atelier maintenance during preview is best-effort, which can frustrate users. Mitigation: docs and README make the contract explicit.

## References

- changesets snapshot release: https://github.com/changesets/changesets/blob/main/docs/snapshot-releases.md
- User's Q14 answer (May 2026): preferred C — "v1.0 と同時に preview 版で公開".
- shadcn-svelte's copy-paste model is the spiritual reference for distribution form.
