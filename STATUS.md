# Kumiki — Project Status (rolling — last touched by `/loop`)

Snapshot of the most recent autonomous-loop firing. The loop updates this file
after every successful commit + push.

## TL;DR

**Phase 1 is complete.** All 10 components — Toggle, Switch, Combobox,
Checkbox, RadioGroup, Tabs, Dialog, Tooltip, Select, Field/Form — landed
end-to-end (machine + attachment + component + sandbox + e2e + axe +
Playground + APG keyboard contract). focus-trap + dismissable Layer 1
primitives shipped.

**Package consolidation complete (ADR 0012).** 37 packages collapsed to
9 layer-level packages with subpaths per component:
`@kumiki/{runtime,primitives,locale,types}` (4 foundations) +
`@kumiki/machines` + `@kumiki/headless` + `@kumiki/components` +
`@kumiki/recipes` + `@kumiki/cli`. Auto-generated meta umbrellas + their
build-meta scripts removed.

**Phase 2 components shipped:** Slider, Accordion, NumberField, Popover,
Toast, Menu — all six landed end-to-end. Menu ships single-level only
(submenus deferred). Remaining Phase 2 work: Calendar / DatePicker —
blocked on `@internationalized/date` dep approval.

**Phase 0c QA gates in flight:** APG keyboard harness ✅, llms-full.txt
builder ✅, sizes.json + /sizes route ✅, per-component reference docs ✅
(Phase 1 + Phase 2), api-extractor surface reports ✅, tree-shake check ✅,
coverage aggregation ✅, TypeDoc markdown reference ✅, APG drift
snapshots ✅, performance benchmarks ✅. Bundle budgets enforced **per
subpath** (one entry per component) with brotli measurement.

**Tooling migration (2026-05):** ESLint → oxlint, Prettier → oxfmt for
non-Svelte files (Svelte stays on prettier-plugin-svelte until oxfmt's
bundled support stabilizes). ~30–100× faster local + CI.

**Reproducible dev shell:** `flake.nix` pins Node 22 + corepack-managed
pnpm; `direnv` auto-loads.

**Phase 0b composition complete:** `withValidation` / `withAsyncSearch` /
`withMultiSelect` / `withVirtualization` shipped on Combobox as four
tree-shakable subpaths (1.77 KB total optional surface).

## What runs (verified end-to-end)

| Component   | Layer 2 (machine) |   Layer 3 (headless)   | Layer 4 (component) | Live demo | E2E + axe |
| ----------- | :---------------: | :--------------------: | :-----------------: | :-------: | :-------: |
| Toggle      |    ✅ 15 tests    |      ✅ 13 tests       |     ✅ 0 errors     |    ✅     | ✅ 9 + 6  |
| Switch      |    ✅ 15 tests    |       ✅ 8 tests       |     ✅ 0 errors     |    ✅     | ✅ 7 + 6  |
| Combobox    |    ✅ 33 tests    | ✅ 63 tests (+with-\*) |     ✅ 0 errors     |    ✅     | ✅ 11 + 5 |
| Checkbox    |    ✅ 20 tests    |      ✅ 12 tests       |     ✅ 0 errors     |    ✅     | ✅ 9 + 8  |
| RadioGroup  |    ✅ 22 tests    |      ✅ 11 tests       |     ✅ 0 errors     |    ✅     | ✅ 8 + 4  |
| Tabs        |    ✅ 31 tests    |      ✅ 14 tests       |     ✅ 0 errors     |    ✅     | ✅ 9 + 8  |
| Dialog      |    ✅ 20 tests    |      ✅ 15 tests       |     ✅ 0 errors     |    ✅     | ✅ 8 + 4  |
| Tooltip     |    ✅ 16 tests    |      ✅ 12 tests       |     ✅ 0 errors     |    ✅     | ✅ 7 + 4  |
| Select      |    ✅ 26 tests    |      ✅ 14 tests       |     ✅ 0 errors     |    ✅     | ✅ 9 + 4  |
| Field/Form  |    ✅ 17 tests    |      ✅ 14 tests       |     ✅ 0 errors     |    ✅     | ✅ 9 + 4  |
| Slider      |    ✅ 20 tests    |      ✅ 12 tests       |     ✅ 0 errors     |    ✅     | ✅ 8 + 6  |
| Accordion   |    ✅ 21 tests    |      ✅ 10 tests       |     ✅ 0 errors     |    ✅     |    ✅     |
| NumberField |    ✅ 25 tests    |      ✅ 21 tests       |     ✅ 0 errors     |    ✅     | ✅ 12 + 6 |
| Popover     |    ✅ 18 tests    |      ✅ 16 tests       |     ✅ 0 errors     |    ✅     | ✅ 11 + 4 |
| Toast       |    ✅ 19 tests    |      ✅ 16 tests       |     ✅ 0 errors     |    ✅     | ✅ 10 + 4 |
| Menu        |    ✅ 22 tests    |      ✅ 20 tests       |     ✅ 0 errors     |    ✅     | ✅ 13 + 4 |

**Totals:** machines 340, headless 271, runtime 15, primitives 46 — **672 unit tests across 9 packages** (plus 73 APG keyboard cases in Playwright). **109 microbenchmarks** at `/bench`.

| Shared package                   | Status                                   |
| -------------------------------- | :--------------------------------------- |
| `@kumiki/runtime`                | ✅ 15 tests, transition arrays supported |
| `@kumiki/primitives/id`          | ✅ 4 tests, 174 B brotli ≤ 500 B budget  |
| `@kumiki/primitives/collection`  | ✅ 20 tests, 369 B brotli ≤ 500 B budget |
| `@kumiki/primitives/focus-trap`  | ✅ 12 tests, 434 B brotli ≤ 500 B budget |
| `@kumiki/primitives/dismissable` | ✅ 10 tests, 295 B brotli ≤ 500 B budget |
| `@kumiki/types`                  | placeholder (no exports yet)             |
| `@kumiki/locale/<lang>`          | placeholders for 10 languages            |

## APG keyboard harness coverage

`apps/docs/keyboard/<name>.kb.ts` declares each component's keyboard
contract per the APG spec; `apps/docs/tests/keyboard/_harness.ts` runs
each contract under Playwright with a hydration sentinel.

| Component   | Cases | Notes                                                            |
| ----------- | ----: | ---------------------------------------------------------------- |
| Tabs        |    11 | LTR/RTL/vertical arrows, Home/End, manual activation             |
| RadioGroup  |     8 | Axis-agnostic arrows, Space, Home/End, skip-disabled             |
| Select      |    10 | Open/close, navigate, type-ahead, Enter/Escape/Tab               |
| Combobox    |     6 | Open/close, active-descendant via `data-highlighted`             |
| Toggle      |     3 | Space/Enter activation cycle                                     |
| Switch      |     2 | Space/Enter activation                                           |
| Checkbox    |     2 | Space toggles checked ↔ unchecked                                |
| Dialog      |     4 | Open via Enter/Space, Escape close (policy-gated)                |
| Tooltip     |     1 | Escape closes focused tooltip                                    |
| Field/Form  |     2 | Tab-after-typing → blur-validation surface                       |
| Slider      |     8 | LTR/RTL/vertical arrows, Page\*, Home/End                        |
| NumberField |     6 | Arrow up/down, Page\*, Home/End                                  |
| Popover     |     4 | Enter/Space open, Escape close (policy-gated)                    |
| Menu        |     6 | Enter/Space/ArrowDown open, ArrowUp opens last, Escape/Tab close |
| Toast       |     3 | Enter/Space on Add creates a toast, Enter on Close dismisses it  |

Total: **76 keyboard cases** all green.

## Phase 0c QA artifacts

- **`/llms-full.txt`** — apps/docs/scripts/build-llms-full.mjs walks every package, inlines first-JSDoc + exports → AI reference, regenerated against the post-ADR-0012 9-package shape.
- **`/sizes.json`** — apps/docs/scripts/build-sizes.mjs runs `size-limit --json` per layer package, aggregates verified per-subpath brotli measurements.
- **`/sizes`** — SvelteKit route that renders `/sizes.json` as a per-subpath table with safe / tight / fail color bars.
- **`/benches.json`** — `pnpm -w run bench:json` (scripts/aggregate-bench.mjs) runs `vitest bench --outputJson` across runtime + primitives + machines and aggregates ops/sec / mean / p99 per benchmark.
- **`/bench`** — SvelteKit route that renders `/benches.json` as per-package, per-describe-block tables.
- **`docs/components/<name>.md`** — reference docs for all 10 Phase 1 + 6 Phase 2 components: anatomy, keyboard, ARIA, source links.

## Quality gates active in CI

| Gate                      | What it catches                             | Where defined                         |
| ------------------------- | ------------------------------------------- | ------------------------------------- |
| `pnpm format:check`       | oxfmt (TS/JS) + Prettier (Svelte)           | `.oxfmtrc.json` + `.prettierrc`       |
| `pnpm lint`               | oxlint correctness/suspicious as error      | `.oxlintrc.json`                      |
| `pnpm typecheck`          | TS strict + svelte-check                    | per-package `tsconfig.json`           |
| `pnpm check:layering`     | Layer N depending on Layer >N               | `scripts/check-layering.mjs`          |
| `pnpm check:locale-shape` | locale files diverging in shape             | `scripts/check-locale-shape.mjs`      |
| `pnpm check:jsdoc`        | Layer 4 missing APG link in JSDoc           | `scripts/check-jsdoc.mjs`             |
| `pnpm test`               | Vitest across all packages                  | per-package `vitest.config.ts`        |
| `pnpm size`               | brotli bundle budget per subpath            | per-package `package.json#size-limit` |
| `pnpm publint`            | `package.json` correctness                  | per-package                           |
| `pnpm attw`               | `.d.mts` resolution under all conditions    | per-package                           |
| `pnpm agadoo`             | side-effect honesty of `sideEffects: false` | per-package                           |
| Playwright `e2e`          | Real browser interaction tests              | `apps/docs/tests/*.e2e.test.ts`       |
| Playwright `a11y`         | axe-core × LTR / RTL × every state          | `apps/docs/tests/*.a11y.test.ts`      |
| Guidepup `screen-reader`  | NVDA + VoiceOver smoke (scheduled)          | `apps/docs/tests/*.sr.test.ts`        |

## Bundle measurements (verified, brotli)

Sample numbers; full per-subpath table is built into `/sizes.json` and
served from the docs site at `/sizes`. All measurements use size-limit
v12 (brotli — what edges actually serve).

| Subpath                     | Incremental | Budget |
| --------------------------- | ----------: | -----: |
| `@kumiki/runtime`           |   **676 B** |   1 KB |
| `@kumiki/primitives/id`     |   **174 B** |  500 B |
| `@kumiki/machines/toggle`   |   **399 B** |  500 B |
| `@kumiki/headless/toggle`   |   **642 B** |  750 B |
| `@kumiki/machines/combobox` | **1.16 KB** |   3 KB |
| `@kumiki/headless/combobox` |     ~1.2 KB | 1.7 KB |

`@kumiki/components` (Layer 4) is intentionally not gated by size-limit
— svelte-package emits `.svelte` files that esbuild can't load.
Enforcement is indirect via the Layer 3 budgets above plus Lighthouse
on the docs site (Phase 0c).

## CI / release / docs deploy

All workflows in `.github/workflows/`:

- `ci.yml` — every push/PR: format, lint, custom QA, typecheck, build, test, publint/attw/agadoo/size-limit, e2e, axe.
- `release.yml` — main: changesets-driven version PR + npm publish with provenance.
- `preview.yml` — PRs: snapshot publish to npm `preview` dist-tag.
- `docs.yml` — main: deploy `apps/docs` to Cloudflare Pages.
- `scheduled-screen-reader.yml` — nightly: Guidepup on macOS-VoiceOver + Windows-NVDA.

`docs/release/branch-protection.md` documents the required GitHub branch-protection settings.

## Git hooks (lefthook)

- **pre-commit**: oxfmt + Prettier (Svelte), oxlint, layering check, locale-shape check.
- **pre-push**: typecheck, test, full ci:health.

Auto-installed via `pnpm install` (root `prepare` script).

## Reference repositories (`references/`)

8 shallow git submodules of competitor libraries (Bits UI, Melt UI, Zag, Radix, react-spectrum, Ark UI, shadcn-svelte, Base UI). Total ~400 MB. CI does not init.

## Documentation

- **Design** (16 sections + 11 ADRs): `docs/design/`.
- **Components reference**: `docs/components/_template.md` (template) + per-component reference for all 10 Phase 1 components (`combobox.md`, `dialog.md`, `tabs.md`, `select.md`, `tooltip.md`, `radio-group.md`, `checkbox.md`, `toggle.md`, `switch.md`, `form-field.md`).
- **User-supplied market research**: `docs/market-research.md`.
- **Branch protection**: `docs/release/branch-protection.md`.
- **CLAUDE.md** (root): project context for AI assistants.

## What is NOT done (post-Phase-1 roadmap)

To preserve the user's "ガッチガチに品質保証" mandate, gaps are explicit. None block v0.x preview; some block v1.0.

### Phase 0c QA gaps still open

| Item                                  | Status                                                                                                                                                                                                                                                                                                                     | Notes                                                                            |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **api-extractor reports** per package | ✅ shipped (2026-05). `pnpm api:report` generates `<pkg>/etc/<unscoped>.api.md` for every Layer 1/2/3 package. `pnpm check:api-report` is wired into `check:all` and fails CI on drift. Layer 4/5 skipped (Svelte source — `attw` covers them).                                                                            | Locked-in via ADR 0011                                                           |
| **TypeDoc reference site**            | ✅ shipped (2026-05). `pnpm typedoc` generates per-package markdown under `docs/api/` (40 entry points, one file per package). `tsconfig.typedoc.json` excludes tests + tooling. `docs/api/` is gitignored — built on demand for the docs site. Custom `@when-to-use` / `@anti-pattern` block tags render.                 | Locked-in via ADR 0011                                                           |
| **Lighthouse CI**                     | Not configured; needs `@lhci/cli` dep                                                                                                                                                                                                                                                                                      | For docs site perf budget                                                        |
| **APG diff-against-published**        | ✅ shipped (2026-05). `pnpm apg:snapshot` fetches each `kb.ts`'s APG URL, extracts the Keyboard Interaction section, snapshots to `apps/docs/keyboard/.apg-snapshots/`. `pnpm check:apg-snapshots` runs weekly via `.github/workflows/scheduled-apg-drift.yml` and opens a labeled issue on drift.                         |                                                                                  |
| **Tree-shake regression tests**       | ✅ shipped (2026-05). `pnpm check:tree-shake` retired together with the auto-generated `@kumiki/components` umbrella under ADR 0012; cross-component leakage is now prevented by-construction (one subdir per component under each layer's `src/`).                                                                        | ADR 0012 made this script unnecessary; deleted in `4c6552d`.                     |
| **Performance benchmarks**            | ✅ shipped (2026-05). `pnpm bench` runs vitest's `bench` mode against `@kumiki/runtime` (synthetic 3-state machine) and `@kumiki/machines/{toggle,dialog,combobox}` (real machines, including a 100-option Combobox filter). Not wired into ci:health (numbers are machine-dependent); run on demand to track regressions. | Phase 0c stretch goal                                                            |
| **Coverage gate aggregation**         | ✅ shipped (2026-05). `pnpm -w run coverage` runs vitest --coverage workspace-wide; `pnpm coverage:report` rolls per-file counters into one summary table. Not yet a CI gate (some Phase 1 thresholds are aspirational).                                                                                                   | Last aggregate (54 pkgs): 88.2% stmts, 77.6% branches, 86.4% funcs, 88.2% lines. |

### Phase 2 components — remaining

Only **Calendar / DatePicker** — blocked on `@internationalized/date`
dep approval. Slider, Accordion, NumberField, Popover, Toast, Menu
all shipped end-to-end.

### Phase 0b deferred composition — DONE

All four `with*` compositions shipped under `@kumiki/headless/combobox`:

| Subpath                                         | Brotli      | Adds                                                          |
| ----------------------------------------------- | ----------- | ------------------------------------------------------------- |
| `@kumiki/headless/combobox/with-validation`     | 378 B       | Standard Schema validator with race-token guard               |
| `@kumiki/headless/combobox/with-async-search`   | 476 B       | Abort-aware fetcher; reuses machine's FETCH.\* token protocol |
| `@kumiki/headless/combobox/with-multi-select`   | 365 B       | `selected: T[]` + toggle / selectAll / clear                  |
| `@kumiki/headless/combobox/with-virtualization` | 548 B       | Fixed-row windowing; visibleItems + getItemStyle              |
| **Total optional surface**                      | **1.77 KB** | Each subpath tree-shakes when not imported                    |

### Things that need maintainer-in-the-loop decisions

- npm scope `@kumiki/*` registration (manual step on npm; cannot be automated).
- GitHub repo creation under `baseballyama/kumiki` and pushing the initial commit.
- Cloudflare Pages project setup (manual via Cloudflare dashboard).
- Adding `NPM_TOKEN`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` secrets.
- Reviewing all design decisions in `docs/design/16-decisions/`.

## Honest caveats

1. **"Beats every competitor"** — not a measurable claim. Every claim Kumiki makes is verifiable from this repo: bundle measurements at `/sizes`, keyboard contracts at `apps/docs/keyboard/`, axe results in CI, screen-reader tests via Guidepup nightly.

2. **`/loop` keeps the work going while away.** Single conversations end when the user closes Claude Code. The autonomous loop fires me at ~5-min intervals to keep shipping. Without `/loop`, progress pauses until the next manual conversation.

3. **Phase 1 + the harness are the highest-leverage milestones already passed.** All 10 components ship machine + attachment + component + sandbox + e2e + axe + keyboard contract. The shape is proven; Phase 2 components fill out the catalog.

4. **The npm publish flow has not been smoke-tested against an actual registry.** `pnpm ci:health` validates package shape (`publint`, `attw`, `agadoo`, `size-limit`) but the `kumiki@preview` dist-tag publish from `release.yml` needs one round-trip before v0.x.

5. **Reference submodule `react-spectrum` is 217 MB shallow.** Anyone cloning the repo with `--recurse-submodules` pays the cost. The `update = none` setting in `.gitmodules` plus `submodules: false` in CI means it's opt-in.

6. **Phase 0c devDeps.** `@microsoft/api-extractor` ✅ wired. `typedoc` + `typedoc-plugin-markdown` ✅ wired. Only `@lhci/cli` is still awaiting maintainer dep approval.

## Blocked

The autonomous `/loop` run, since revival on 2026-05-05, has shipped:

- 6 Phase 0c QA gates: tree-shake regression (since retired by ADR 0012),
  coverage aggregation, api-extractor reports, TypeDoc markdown
  reference, APG drift snapshots, performance benchmarks.
- ADR 0012 + the 4-phase package consolidation (37 → 9 packages).
- Design doc + README rewrites following ADR 0012.

All commits pushed to `origin/main`. Remaining items need
maintainer-in-the-loop input:

| Item                          | Reason                                                                                                                      | What unblocks it                                                                                           |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Calendar / DatePicker**     | Need `@internationalized/date` runtime dep; CLAUDE.md forbids adding deps without confirmation.                             | Maintainer adds the dep to the catalog and confirms the FSM design (Hijri / Buddhist calendar scope).      |
| **TypeDoc → docs site route** | TypeDoc generation ✅. Not yet wired into a SvelteKit `/api` route — needs maintainer call on URL shape and sidebar layout. | Maintainer confirms whether TypeDoc output should be served at `/api`, `/reference`, or as a sibling site. |
| **Lighthouse CI**             | `@lhci/cli` not in catalog.                                                                                                 | Maintainer adds the dep and confirms perf budgets per page.                                                |

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
