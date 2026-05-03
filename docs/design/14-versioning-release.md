# 14 — Versioning & Release

## 14.1 SemVer policy

Kumiki uses **independent SemVer per package** ([16-decisions/0010-independent-versioning.md](16-decisions/0010-independent-versioning.md)). Each package can move at its own pace.

A **major** bump is required for:

- Removing a public export.
- Changing a public type (return types, required props, exported interfaces) in a way that breaks compilation for compliant consumers.
- Changing a default behavior such that the visible UX or the announced ARIA changes.
- Renaming a CSS data-attribute (`data-state`, `data-orientation`, …).
- Increasing the published `peerDependencies` floor (e.g., requiring a higher Svelte minor) — this can break consumers' lockfiles.

A **minor** bump is required for:

- Adding a new public export.
- Adding a new optional prop / optional snippet.
- Adding a new event in a machine.
- Adding a new ARIA attribute that is conditional on a new prop.

A **patch** bump is required for:

- Bug fixes that don't change a public type or default behavior.
- Performance improvements with no visible change.
- Documentation-only edits.
- Internal refactors with no public-API change (verified by api-extractor).

When in doubt, **err on the side of a higher bump**. Users prefer a needless minor over a surprise breaking change.

## 14.2 Tooling

### changesets

Every PR that affects a `packages/*` package must include a `.changeset/*.md` file:

```bash
pnpm changeset
```

The wizard prompts for affected packages and bump types. The file is committed alongside the code.

### What a changeset looks like

```md
---
'@kumiki/component-combobox': minor
'@kumiki/attachment-combobox': minor
---

Add `withMultiSelect` composition. Combobox now supports an array `value`
when composed with `withMultiSelect`. See docs/components/combobox.md.
```

### Release flow

1. PRs land on `main` with their changesets.
2. The **Release** workflow opens (or updates) a "Version Packages" PR that:
   - Runs `pnpm changeset version`.
   - Updates `package.json#version`s and consumes changesets.
   - Updates each affected `CHANGELOG.md`.
3. Maintainers review the version PR. Merging triggers `pnpm release`:
   - `pnpm build` (all packages).
   - `pnpm changeset publish` (publishes to npm with `provenance: true`).
4. npm receives the published versions. Tags are pushed as part of `changeset publish`.

The CI workflows are at [`.github/workflows/release.yml`](../../.github/workflows/release.yml) and `preview.yml`.

## 14.3 npm publish settings

```json
"publishConfig": {
  "access": "public",
  "provenance": true
}
```

- **`access: public`** — `@kumiki/*` is a scoped name; explicit access is required for unauthenticated install.
- **`provenance: true`** — npm sigstore-based provenance attestations on every publish. Supported by GitHub Actions when `id-token: write` is granted; configured in `release.yml`.

## 14.4 Pre-1.0 versions

While Kumiki is pre-1.0, packages are at `0.y.z`:

- `0.y.0` is the floor. Any breaking change bumps `y`.
- `0.y.z` for non-breaking changes.
- We do **not** use SemVer in the strict sense pre-1.0; the working convention is "treat `y` as major".

Consumers who can't live with weekly breaking changes should pin tightly:

```json
"@kumiki/component-combobox": "0.3.x"
```

This is communicated in the README and in the docs install instructions.

## 14.5 Layer 5 preview policy

`@kumiki/recipes-*` is published as a **preview** during the v1.0 series, per [16-decisions/0010-layer5-preview-in-v1.md](16-decisions/0010-layer5-preview-in-v1.md).

### Preview snapshot publishes

The `preview.yml` workflow publishes per-PR snapshots tagged `preview`:

```bash
pnpm changeset version --snapshot preview
pnpm changeset publish --tag preview --no-git-tag
```

Versions like `0.0.0-preview-20260601-abcdef0` appear under the `preview` dist-tag. Users who want preview recipes:

```bash
pnpm add @kumiki/recipes-dialog@preview
```

### Stable Layer 5

Once Layer 4 hits 1.0, recipes are re-cut as stable `1.x.x` versions in a coordinated release.

## 14.6 Release cadence

| Cadence                | Trigger                                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| **As-needed**          | PR + changeset → version PR → merge → publish. No fixed schedule.                                     |
| **Coordinated (rare)** | Major bumps across multiple packages may be batched into a single version PR for clean release notes. |

## 14.7 Deprecation policy

Public API marked `@deprecated` in JSDoc remains for **two minor versions** before removal in a major. Removal is announced in the changelog and in the migration notes published at `docs/migrations/`.

For Phase 0/1 (pre-1.0), deprecations may be removed in the next breaking release without the two-minor cushion. The README states this expectation.

## 14.8 Migration tooling (codemods)

For breaking changes that have a mechanical fix, we ship a codemod:

```bash
pnpm dlx @kumiki/codemods <name>
```

Phase 1 doesn't ship codemods (no breaking transitions yet). Phase 2+ — when Layer 5 graduates and component APIs change — codemods become required for our `major` releases.

The user's market research flagged "Bits UI v0 → v1 was painful without codemods." We don't repeat that failure.

## 14.9 Contributor flow

```bash
git checkout -b feat/combobox-async
# ... make changes ...
pnpm test && pnpm typecheck
pnpm changeset                 # creates .changeset/<random>.md
git add . && git commit -m 'feat(machine-combobox): async fetcher'
git push --set-upstream origin feat/combobox-async
gh pr create
```

CI gates:

- format / lint / typecheck / unit tests
- publish health (publint, attw, agadoo, size-limit)
- browser e2e + axe
- (scheduled / on-demand) screen-reader

## 14.10 Open questions

- **TBD:** When v1.0 ships, do we cut a `kumiki@1.0.0` meta-package that re-exports Layer 4? Pro: easier "just install Kumiki". Con: defeats subpath-export tree-shaking. Lean: no, but track demand.
- **TBD:** Whether to lockstep major bumps across all `@kumiki/*` at v1.0, then return to independent post-1.0. Coordination overhead vs simplicity. Lean: yes for the v1.0 cut, then independent.
- **TBD:** Maintenance LTS (long-term support) for older majors. Probably v1.1 conversation.
