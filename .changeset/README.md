# Changesets

This directory holds [changesets](https://github.com/changesets/changesets) — small markdown files that describe what changed in a PR and which packages are affected. Changesets are consumed at release time to compute version bumps and generate the changelog.

## Workflow

1. Make your changes in a branch.
2. Run `pnpm changeset` and follow the prompts. Pick the affected packages and the bump type (`patch` / `minor` / `major`).
3. Commit the generated `.changeset/*.md` file alongside your code.
4. When the PR merges, the **Release** workflow opens (or updates) a "Version Packages" PR. Merging that PR publishes to npm.

## Bump policy

Kumiki uses **independent versioning**. Each package can move at its own SemVer pace. See `docs/design/14-versioning-release.md` for the full policy and what counts as a breaking change.

## PR packages

PRs are not published to npm. CI's **Package smoke** job packs every publishable package, installs the tarballs into a clean consumer, and uploads them as the `kumiki-packages-<head sha>` artifact. To try them, install every tarball together, listing each one as `file:<path>` in both `dependencies` and `pnpm.overrides` (the cross-package `0.0.0` dependencies must resolve to the tarballs, not the registry; `scripts/check-pack-smoke.mjs` builds exactly this consumer). The `preview` dist-tag for Atelier is retired (ADR 0017, superseding ADR 0010); drop `publishConfig.tag: "preview"` from `packages/atelier/package.json` with the first GA release.
