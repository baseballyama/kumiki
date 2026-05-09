# Changesets

This directory holds [changesets](https://github.com/changesets/changesets) — small markdown files that describe what changed in a PR and which packages are affected. Changesets are consumed at release time to compute version bumps and generate the changelog.

## Workflow

1. Make your changes in a branch.
2. Run `pnpm changeset` and follow the prompts. Pick the affected packages and the bump type (`patch` / `minor` / `major`).
3. Commit the generated `.changeset/*.md` file alongside your code.
4. When the PR merges, the **Release** workflow opens (or updates) a "Version Packages" PR. Merging that PR publishes to npm.

## Bump policy

Kumiki uses **independent versioning**. Each package can move at its own SemVer pace. See `docs/design/14-versioning-release.md` for the full policy and what counts as a breaking change.

## Layer 5 preview

`@kumiki/atelier` is published with the `preview` npm dist-tag during the v1.0 series (per ADR 0010). Use the `--snapshot preview` workflow described in `docs/design/14-versioning-release.md` to publish.
