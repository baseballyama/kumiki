# Kumiki — Project Status (rolling — last touched by `/loop`)

Snapshot of the most recent autonomous-loop firing. The loop updates this file
after every successful commit + push.

## TL;DR

Phase 0a (Toggle pilot) and Phase 0b (Combobox design validation) are
**complete**. Switch / Checkbox / RadioGroup landed end-to-end. Tabs machine
(Layer 2) is in — attachment + component still pending.

**232 unit tests + 75 Playwright tests = 307 tests passing** at the latest
green push.

## What runs (verified end-to-end)

| Component  | Layer 2 (machine) | Layer 3 (attachment) | Layer 4 (component) | Live demo | E2E + axe |
| ---------- | :---------------: | :------------------: | :-----------------: | :-------: | :-------: |
| Toggle     |    ✅ 15 tests    |     ✅ 13 tests      |     ✅ 0 errors     |    ✅     | ✅ 9 + 6  |
| Switch     |    ✅ 15 tests    |      ✅ 8 tests      |     ✅ 0 errors     |    ✅     | ✅ 7 + 6  |
| Combobox   |    ✅ 33 tests    |     ✅ 13 tests      |     ✅ 0 errors     |    ✅     | ✅ 11 + 5 |
| Checkbox   |    ✅ 20 tests    |     ✅ 12 tests      |     ✅ 0 errors     |    ✅     | ✅ 9 + 8  |
| RadioGroup |    ✅ 22 tests    |     ✅ 11 tests      |     ✅ 0 errors     |    ✅     | ✅ 8 + 4  |
| Tabs       |    ✅ 31 tests    |       pending        |       pending       |  pending  |  pending  |

| Shared package                  | Status                                   |
| ------------------------------- | :--------------------------------------- |
| `@kumiki/runtime`               | ✅ 15 tests, transition arrays supported |
| `@kumiki/primitives/id`         | ✅ 4 tests, 174 B brotli ≤ 500 B budget  |
| `@kumiki/primitives/collection` | ✅ 20 tests, 369 B brotli ≤ 500 B budget |
| `@kumiki/types`                 | placeholder (no exports yet)             |
| `@kumiki/locale/<lang>`         | placeholders for 10 languages            |

## What's wired but not yet exercised on real code

The remaining 6 Phase 1 components (RadioGroup, Tabs, Dialog, Tooltip, Select, Field/Form) have:

- Empty `src/index.ts` (`export {}`).
- Per-package `package.json` with the right `exports`, `size-limit`, `peerDependencies`.
- `tsconfig.json`.
- README.md placeholder.
- Registered in the Playground (`/play`) as "unreleased" cards.

These will follow the **exact same template** as Toggle — see `packages/components/toggle/{machine,attachment,component}/`. Adding a new component means populating the matching `packages/components/<name>/` folder.

## Quality gates active in CI

| Gate                      | What it catches                             | Where defined                         |
| ------------------------- | ------------------------------------------- | ------------------------------------- |
| `pnpm format:check`       | Prettier formatting                         | `.prettierrc`                         |
| `pnpm lint`               | ESLint flat config across TS / Svelte       | `eslint.config.js`                    |
| `pnpm typecheck`          | TS strict + svelte-check                    | per-package `tsconfig.json`           |
| `pnpm check:layering`     | Layer N depending on Layer >N               | `scripts/check-layering.mjs`          |
| `pnpm check:locale-shape` | locale files diverging in shape             | `scripts/check-locale-shape.mjs`      |
| `pnpm check:jsdoc`        | Layer 4 missing APG link in JSDoc           | `scripts/check-jsdoc.mjs`             |
| `pnpm test`               | Vitest across all packages                  | per-package `vitest.config.ts`        |
| `pnpm size`               | gzipped bundle budget per entry             | per-package `package.json#size-limit` |
| `pnpm publint`            | `package.json` correctness                  | per-package                           |
| `pnpm attw`               | `.d.mts` resolution under all conditions    | per-package                           |
| `pnpm agadoo`             | side-effect honesty of `sideEffects: false` | per-package                           |
| Playwright `e2e`          | Real browser interaction tests              | `apps/docs/tests/*.e2e.test.ts`       |
| Playwright `a11y`         | axe-core × LTR / RTL × every state          | `apps/docs/tests/*.a11y.test.ts`      |
| Guidepup `screen-reader`  | NVDA + VoiceOver smoke (scheduled)          | `apps/docs/tests/*.sr.test.ts`        |

## Bundle measurements (verified)

| Package                     |      Incremental | First-import (full) | Budget         |
| --------------------------- | ---------------: | ------------------: | :------------- |
| `@kumiki/runtime`           |              n/a |    **676 B brotli** | 1 KB           |
| `@kumiki/primitives/id`     |              n/a |    **174 B brotli** | 500 B          |
| `@kumiki/machine-toggle`    | **399 B brotli** |    **883 B brotli** | 500 B / 1.5 KB |
| `@kumiki/attachment-toggle` | **642 B brotli** |  **1.38 KB brotli** | 800 B / 1.5 KB |

All within budget. Note: size-limit measures **brotli** (not gzip) by default in v12 — brotli is what edges actually serve, so this is an honest production-relevant number.

## CI / release / docs deploy

All workflows in `.github/workflows/`:

- `ci.yml` — every push/PR: format, lint, custom QA, typecheck, build, test, publint/attw/agadoo/size-limit, e2e, axe.
- `release.yml` — main: changesets-driven version PR + npm publish with provenance.
- `preview.yml` — PRs: snapshot publish to npm `preview` dist-tag.
- `docs.yml` — main: deploy `apps/docs` to Cloudflare Pages.
- `scheduled-screen-reader.yml` — nightly: Guidepup on macOS-VoiceOver + Windows-NVDA.

`docs/release/branch-protection.md` documents the required GitHub branch-protection settings.

## Git hooks (lefthook)

- **pre-commit**: format check, eslint, layering check, locale-shape check.
- **pre-push**: typecheck, test, full ci:health.

Auto-installed via `pnpm install` (root `prepare` script).

## Reference repositories (`references/`)

8 shallow git submodules of competitor libraries (Bits UI, Melt UI, Zag, Radix, react-spectrum, Ark UI, shadcn-svelte, Base UI). Total ~400 MB. CI does not init.

## Documentation

- **Design** (16 sections + 11 ADRs): `docs/design/`.
- **Components reference**: `docs/components/_template.md` (template) + `docs/components/combobox.md` (worked example).
- **User-supplied market research**: `docs/market-research.md`.
- **Branch protection**: `docs/release/branch-protection.md`.
- **CLAUDE.md** (root): project context for AI assistants.

## What is NOT done (post-Phase-0a roadmap)

To preserve the user's "ガッチガチに品質保証" mandate, I'm being explicit about gaps. None of these are blockers for Phase 0a but they are for v1.0.

### Components (Phase 0b → Phase 1)

- Phase 0b: implement Combobox end-to-end (the second pilot — validates `with*` composition + APG-driven keyboard harness).
- Phase 1: 8 more components (Switch, Checkbox, RadioGroup, Tabs, Dialog, Tooltip, Select, Field/Form).
- Each will follow the exact same template as Toggle. Estimated ~1 week per component to the Toggle quality bar.

### QA infrastructure not yet wired

| Item                                                            | Status                                                                                                         | Estimated effort                     |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **APG keyboard test harness** (`scripts/run-keyboard-yaml.mjs`) | Not started — referenced in `docs/design/05-accessibility.md` §5.4. Needs Phase 0b's Combobox to drive design. | ~1 day after Combobox                |
| **api-extractor reports** per package                           | Configs not generated.                                                                                         | ~1 day for all 30 component packages |
| **TypeDoc reference site**                                      | Not configured.                                                                                                | ~1 day                               |
| **`llms-full.txt` builder**                                     | Not implemented.                                                                                               | ~1 day after TypeDoc                 |
| **Tree-shake regression tests** (`apps/docs/sizes/`)            | Not implemented.                                                                                               | ~0.5 day                             |
| **Performance benchmarks** (`apps/docs/perf/`)                  | Not implemented.                                                                                               | ~0.5 day                             |
| **Coverage gate**                                               | Per-package `vitest.config.ts` thresholds set, but not aggregated in CI.                                       | ~0.5 day                             |

### Things that need maintainer-in-the-loop decisions

- npm scope `@kumiki/*` registration (manual step on npm; cannot be automated).
- GitHub repo creation under `baseballyama/kumiki` and pushing the initial commit.
- Cloudflare Pages project setup (manual via Cloudflare dashboard).
- Adding `NPM_TOKEN`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` secrets.
- Reviewing all design decisions in `docs/design/16-decisions/`.

## Honest caveats

1. **"Beats every competitor"** — not a measurable claim. The technical foundation is sound (FSM separation, lazy i18n, real SR testing in CI, tight budgets). Whether maintainers of other libraries "concede" is a market-positioning question not solvable by code quality alone. What I can promise: every claim Kumiki makes is verifiable from this repo.

2. **Single autonomous run is not 1 month of work.** I cannot continue progressing without a message. To run autonomously during the trip, invoke `/loop` with this prompt as the recurring task — the runtime fires me at intervals and I keep extending the implementation. Without `/loop`, this snapshot is the final state until the next manual conversation.

3. **Phase 0b (Combobox) is the highest-leverage next step.** It validates `with*` composition, async fetch races, virtualization, and the APG-driven keyboard harness. Many tooling gaps above (api-extractor, llms-full.txt builder) become feasible only after Combobox is in.

4. **The Toggle implementation is reference-grade but not "shippable to npm."** Two reasons: (a) recipes are placeholder; (b) the `kumiki@preview` dist-tag publish flow has not been smoke-tested against an actual npm registry.

5. **Reference submodule `react-spectrum` is 217 MB shallow.** Anyone cloning the repo with `--recurse-submodules` pays the cost. The `update = none` setting in `.gitmodules` plus `submodules: false` in CI means it's opt-in.

## Blocked

_Empty. Populated by the `/loop` autonomous run when it cannot proceed — see `docs/release/autonomous-loop.md` for the prompt and stop conditions._

## How to resume

### Continuing autonomously while away

See [`docs/release/autonomous-loop.md`](docs/release/autonomous-loop.md) for the `/loop` setup, prep checklist, and the verbatim prompt to paste.

### Manual resume (after a trip / break)

1. `git pull --ff-only` then read this file's "Blocked" section.
2. `pnpm install` if `pnpm-lock.yaml` changed.
3. `pnpm test && pnpm ci:health` to confirm the codebase is green.
4. If "Blocked" is non-empty, address the blocking decision; otherwise pick up the next priority from `docs/design/15-roadmap.md`.

### Initial GitHub setup (one-time)

1. **Apply branch protection** per `docs/release/branch-protection.md`.
2. **Set up Cloudflare Pages** for the docs site.
3. **Configure npm secrets** and confirm `@kumiki/runtime` and `@kumiki/primitives` publish under the `preview` tag via the snapshot workflow.
