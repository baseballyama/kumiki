# Branch Protection — required GitHub configuration

This file documents the GitHub branch-protection settings that `main` must have for Kumiki releases to remain safe. Apply these manually in **Settings → Branches → Add rule** for `main` after the repo is created.

## Required status checks

Every PR must pass the following checks before merging:

- `Build & test (Linux)` — from `.github/workflows/ci.yml`
- `Publish health` — publint + attw + agadoo + size-limit + custom QA scripts
- `Browser tests (e2e + axe)` — Playwright e2e + axe in LTR / RTL across documented states

## Required PR settings

- **Require a pull request before merging**: ON
- **Require approvals**: 1 (only relevant when more than one maintainer; until then, the rule is informational)
- **Dismiss stale pull request approvals when new commits are pushed**: ON
- **Require review from Code Owners**: ON (uses `.github/CODEOWNERS`)
- **Require status checks to pass before merging**: ON
- **Require branches to be up to date before merging**: ON
- **Require conversation resolution before merging**: ON
- **Require linear history**: ON (squash-merge only — no merge commits)
- **Require signed commits**: OFF for v0/v1 (revisit when adding more maintainers)
- **Do not allow bypassing the above settings**: ON

## Squash merge configuration

- **Allow squash merging**: ON
- **Allow merge commits**: OFF
- **Allow rebase merging**: OFF
- **Default to PR title as the squash commit message** (Conventional Commits style)
- **Automatically delete head branches**: ON

## Force push policy

- **Restrict force pushes**: ON for `main`
- **Restrict deletions**: ON for `main`

## Tags

- **Protect tags matching `v*`**: ON. Tag pushes come only from the Release workflow.

## Secrets required (Settings → Secrets and variables → Actions)

| Secret                  | Used by                      | Purpose                |
| ----------------------- | ---------------------------- | ---------------------- |
| `NPM_TOKEN`             | `release.yml`, `preview.yml` | Publishing to npm      |
| `CLOUDFLARE_API_TOKEN`  | `docs.yml`                   | Deploying docs site    |
| `CLOUDFLARE_ACCOUNT_ID` | `docs.yml`                   | Cloudflare account ref |
| `GITHUB_TOKEN`          | all workflows                | provided automatically |

## Manual verification checklist

After applying:

- [ ] Push a no-op commit to a feature branch; PR cannot merge until checks finish.
- [ ] Verify CODEOWNERS triggers a review request.
- [ ] Verify the changeset workflow opens a "Version Packages" PR after the next merge.
- [ ] Verify `main` cannot be force-pushed.
- [ ] Verify a deletion of `main` is rejected.
