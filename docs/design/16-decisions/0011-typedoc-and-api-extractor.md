# ADR 0011 — TypeDoc + api-extractor (both, different roles)

**Status:** Accepted
**Date:** 2026-05

## Context

Two TS-aware documentation tools dominate the ecosystem:

- **TypeDoc** — generates human-readable Markdown / HTML reference from TS source + JSDoc.
- **`@microsoft/api-extractor`** — produces an API report (`<pkg>.api.md`) listing every public TS symbol; intended as a SemVer compatibility gate.

They overlap in inputs (TS + JSDoc) but have different outputs and audiences.

## Decision

Use **both**, in different roles:

- **TypeDoc + `typedoc-plugin-markdown`**: generates the per-component reference rendered by the SvelteKit docs site. Audience: humans browsing `kumiki.dev/components/<name>`.
- **api-extractor**: generates `<pkg>/etc/<unscoped>.api.md` per Layer 1/2/3 package, committed to the repo. Diff is reviewed in PRs as part of the SemVer contract. Audience: maintainers, reviewers. Layer 4/5 (Svelte source) are skipped — `attw` covers them via `pnpm ci:health`.

Both run in CI on every PR. TypeDoc output drives the docs site; api-extractor output is a tracked file under each package.

## Alternatives considered

| Option                             | Verdict                                                                           |
| ---------------------------------- | --------------------------------------------------------------------------------- |
| **Both, different roles** (chosen) | ✅ Each tool plays to its strength; no overlap                                    |
| TypeDoc only                       | ⚠️ Loses the SemVer-gate function; relies on humans to spot type changes in PRs   |
| api-extractor only                 | ⚠️ Its docs output is not great for end users; we'd need a separate site renderer |
| Neither (manual docs)              | ❌ Doesn't scale to 30+ packages                                                  |

## How they cooperate

TypeDoc consumes JSDoc tags (`@when-to-use`, `@anti-pattern`, `@see`) directly. The same JSDoc lives in source.

api-extractor produces a file like:

```ts
// packages/machines/etc/machines.api.md
// @public
export interface ComboboxOption {
  id: string;
  label: string;
  disabled?: boolean;
}
// @public
export function createComboboxMachine<T extends ComboboxOption>(
  input: CreateComboboxInput<T>,
): ComboboxMachine<T>;
// …
```

A change to `Combobox.Root`'s public type produces a diff in this file; the PR reviewer sees the surface change at a glance.

## Known limitations on Svelte 5 components

api-extractor does not parse `.svelte` files; it operates on the `.svelte.d.ts` produced by `svelte-package`. There are edge cases with namespace re-exports ([sveltejs/svelte#12785](https://github.com/sveltejs/svelte/issues/12785)). Workaround: also export each subcomponent as a named export, so api-extractor can trace the type graph.

## Consequences

**Easier:**

- Public API changes are visible at PR time.
- The docs site's component reference is auto-generated from JSDoc.

**Harder:**

- Two tools to keep configured. Mitigation: minimal config files per package; uniform across the workspace.
- api-extractor reports add ~100 lines per package to git history. Acceptable cost.

## Phase plan

- **Phase 0a**: TypeDoc working for `@kumiki/primitives` and `@kumiki/components/toggle`. api-extractor wired but not enforcing. ✅
- **Phase 0b**: api-extractor enforces — PRs that change reports without updating them are rejected (`pnpm check:api-report`). ✅
- **Phase 0c**: TypeDoc output (`pnpm typedoc`) generates per-package markdown under `docs/api/` (gitignored, built on demand). ✅
- **Phase 1**: Both tools running over all Layer 1/2/3 packages (post-ADR-0012). ✅

## References

- TypeDoc: https://typedoc.org/
- api-extractor: https://api-extractor.com/
- typedoc-plugin-markdown: https://typedoc-plugin-markdown.org/
