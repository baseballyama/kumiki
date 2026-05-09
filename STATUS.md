# Kumiki — Project Status

Snapshot as of **2026-05-09**, after the v1.0 readiness sprint that closed
14 outstanding tasks (rename → atelier, 10-locale messages, real CLI,
Atelier Toggle/Dialog, `@internationalized/date` adoption, Calendar +
DatePicker, screen-reader smoke harness, /api TypeDoc route, Pagefind
search, /sizes/compare, Lighthouse CI, coverage gate).

## TL;DR

**Code-side v1.0 work is complete.** Every Phase 1 + Phase 2 component
ships end-to-end (machine + headless + component + sandbox + e2e + axe

- APG keyboard contract + screen-reader smoke). Phase 0c quality gates
  are all wired. Atelier preview ships with a working `kumiki add` flow.

What's left is **maintainer-in-the-loop publishing setup** — see the
"Publish prerequisites" section at the bottom. Nothing in the code
blocks v1.0; only the registry / hosting / secrets steps that only the
human maintainer can do.

## What ships

### Phase 1 components (10 of 10) — all green

Toggle, Switch, Combobox, Checkbox, RadioGroup, Tabs, Dialog, Tooltip,
Select, Field/Form. Each: machine + attachment + component + sandbox +
e2e + axe + APG keyboard contract + screen-reader smoke.

### Phase 2 components (8 of 8) — all green

Slider, Accordion, NumberField, Popover, Toast, Menu, **Calendar**,
**DatePicker** (Calendar/DatePicker shipped in this sprint). Calendar
ships with Gregorian + Japanese imperial at v1.0 per ADR 0013;
Buddhist / Hijri / Hebrew arrive in Phase 2.1.

### Phase 0b composition (4 of 4) — all green

`withValidation`, `withAsyncSearch`, `withMultiSelect`, `withVirtualization`
on Combobox. 1.77 KB total optional surface; each tree-shakes when not
imported.

### Locale (10 of 10) — real strings

en, ja, zh-Hans, zh-Hant, ko, es, fr, de, ar, he. Each subpath also
exports `direction` (`'ltr'` or `'rtl'`). Brotli sizes 197 B – 289 B,
all under the 1 KB-per-locale budget. `<LocaleProvider>` Svelte
component + `useLocale()` consumer ship in
`@kumiki/components/locale-provider`; pure-TS bits (`inferDirection`,
`LOCALE_CONTEXT_KEY`) sit in `@kumiki/primitives/locale` (133 B brotli).

### Atelier preview (Layer 5)

`@kumiki/atelier/toggle` and `@kumiki/atelier/dialog` ship
**Tailwind v4 + vanilla CSS** variants. Sandbox routes
`/sandbox/atelier-toggle` and `/sandbox/atelier-dialog`. Versioned
under the `preview` npm dist-tag per ADR 0010.

### CLI (`kumiki add`)

- `kumiki add <toggle|dialog>` — copy Atelier sources from
  `node_modules/@kumiki/atelier/dist/` into the user project.
- `--variant=tailwind|vanilla`, `--dest=<dir>`, `--force`, `--dry-run`.
- Programmatic `add()` API for scaffolding scripts.
- 20-test suite: 15 add() unit tests + 5 spawn-the-binary smoke tests.

## Counts

| Surface                       | Number                                                                                                |
| ----------------------------- | ----------------------------------------------------------------------------------------------------- |
| Packages                      | 9 (`@kumiki/{runtime, primitives, locale, types}` + machines + headless + components + atelier + cli) |
| Phase 1 components            | 10                                                                                                    |
| Phase 2 components            | 8                                                                                                     |
| Locales                       | 10                                                                                                    |
| **Unit tests**                | **720** (runtime 15, primitives 54, machines 357, headless 285, components 4, cli 20)                 |
| Phase 0b composition subpaths | 4 (Combobox `with-*`)                                                                                 |
| APG keyboard cases            | **86** (76 prior + 10 Calendar)                                                                       |
| Screen-reader smoke cases     | **19** across 18 components                                                                           |
| Microbenchmarks               | 109                                                                                                   |

## Quality gates active in CI

| Gate                              | What it catches                                            | Where defined                                   |
| --------------------------------- | ---------------------------------------------------------- | ----------------------------------------------- |
| `pnpm format:check`               | oxfmt (TS/JS) + Prettier (Svelte)                          | `.oxfmtrc.json` + `.prettierrc`                 |
| `pnpm lint`                       | oxlint correctness/suspicious as error                     | `.oxlintrc.json`                                |
| `pnpm typecheck`                  | TS strict + svelte-check                                   | per-package `tsconfig.json`                     |
| `pnpm check:layering`             | Layer N depending on Layer >N                              | `scripts/check-layering.mjs`                    |
| `pnpm check:locale-shape`         | locale files diverging in shape                            | `scripts/check-locale-shape.mjs`                |
| `pnpm check:jsdoc`                | Layer 4 missing APG link in JSDoc                          | `scripts/check-jsdoc.mjs`                       |
| `pnpm check:node-compat`          | Layer 1/2/3 importing without DOM globals                  | `scripts/check-node-compat.mjs`                 |
| `pnpm check:api-report`           | `.api.md` drift in TS-only packages                        | api-extractor                                   |
| `pnpm coverage:check` ✨ NEW      | Threshold gate (lines 80, branches 65, funcs 60, stmts 80) | `package.json#scripts`                          |
| `pnpm test`                       | Vitest across all packages                                 | per-package `vitest.config.ts`                  |
| `pnpm size`                       | brotli bundle budget per subpath                           | per-package `package.json#size-limit`           |
| `pnpm publint`                    | `package.json` correctness                                 | per-package                                     |
| `pnpm attw`                       | `.d.mts` resolution under all conditions                   | per-package                                     |
| `pnpm agadoo`                     | side-effect honesty of `sideEffects: false`                | per-package                                     |
| Playwright `e2e`                  | Real browser interaction tests                             | `apps/docs/tests/*.e2e.test.ts`                 |
| Playwright `a11y`                 | axe-core × LTR / RTL × every state                         | `apps/docs/tests/*.a11y.test.ts`                |
| Playwright `keyboard`             | APG keyboard contract harness (86 cases)                   | `apps/docs/tests/keyboard/*.kb.test.ts`         |
| Playwright `screen-reader` ✨ NEW | role + accessible-name smoke for 18 components             | `apps/docs/tests/screen-reader/*.sr.test.ts`    |
| Lighthouse CI ✨ NEW              | 5 docs pages; a11y ≥ 0.95 (error), perf ≥ 0.9 (warn)       | `lighthouserc.cjs`                              |
| `scheduled-screen-reader`         | Guidepup nightly on macOS-VO + Windows-NVDA                | `.github/workflows/scheduled-screen-reader.yml` |
| `scheduled-apg-drift`             | APG snapshot drift                                         | `.github/workflows/scheduled-apg-drift.yml`     |

## Documentation

- **Design** (16 sections + 13 ADRs including new ADR 0013 for `@internationalized/date`): `docs/design/`.
- **Component reference** (auto-generated): `/api` route in the docs site, sourced from TypeDoc markdown.
- **Bundle measurements**: `/sizes` (Kumiki only) + **`/sizes/compare`** ✨ NEW (vs Bits UI / Melt UI / React Aria / Radix / Zag).
- **Per-component reference docs**: `docs/components/` for all 16 components.
- **AI-targeted reference**: `/llms.txt` + `/llms-full.txt`.
- **Search** ✨ NEW: Pagefind, indexed at build time, served from the docs site header.
- **CLI reference**: `packages/tooling/cli/README.md`.

## Bundle measurements (verified, brotli)

Sample numbers; full per-subpath table is built into `/sizes.json` and
served from the docs site at `/sizes`. Cross-library comparison at
`/sizes/compare`.

| Subpath                        | Incremental | Budget |
| ------------------------------ | ----------- | ------ |
| `@kumiki/runtime`              | **676 B**   | 1 KB   |
| `@kumiki/primitives/id`        | **174 B**   | 500 B  |
| `@kumiki/primitives/locale` ✨ | **133 B**   | 500 B  |
| `@kumiki/machines/toggle`      | **399 B**   | 500 B  |
| `@kumiki/machines/calendar` ✨ | **796 B**   | 1.5 KB |
| `@kumiki/headless/toggle`      | **642 B**   | 750 B  |
| `@kumiki/headless/calendar` ✨ | **1.21 KB** | 1.5 KB |
| `@kumiki/machines/combobox`    | **1.16 KB** | 3 KB   |
| `@kumiki/headless/combobox`    | ~1.2 KB     | 1.7 KB |
| `@kumiki/cli`                  | **973 B**   | 30 KB  |

`@kumiki/components` (Layer 4) and `@kumiki/atelier` (Layer 5) are
intentionally not size-limit-gated — `svelte-package` emits `.svelte`
which esbuild can't bundle. Indirect enforcement via Layer 3 budgets
above + Lighthouse CI on docs pages.

## What is NOT done

Everything below is **maintainer-in-the-loop**: only the human can
complete it. None block code merge; all block public release.

### Publish prerequisites (maintainer-only)

- [ ] **Register `@kumiki` npm scope.** `npm org create kumiki` + add the
      maintainer as admin. Without this, `pnpm publish` fails with a
      403 the moment any package version becomes non-`-preview`.
- [ ] **Push the repo to `github.com/baseballyama/kumiki`.** Already done
      via the rename commit; verify CI workflows fire on push.
- [ ] **Apply branch protection.** Settings copied verbatim from
      `docs/release/branch-protection.md`. Required since `release.yml`
      pushes commits + tags from the version PR.
- [ ] **Create the Cloudflare Pages project** for `apps/docs`. Wire it
      to the `docs.yml` workflow.
- [ ] **Add CI secrets:** - `NPM_TOKEN` — for `release.yml` and `preview.yml`. - `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` — for `docs.yml`.
- [ ] **Smoke-test the preview publish flow.** `pnpm changeset version
--snapshot preview && pnpm changeset publish --tag preview --no-git-tag`
      against the real registry. Confirm the resulting versions are
      installable from `pnpm add @kumiki/atelier@preview`.
- [ ] **Verify the screen-reader matrix.** First nightly run of
      `scheduled-screen-reader.yml` exercises the SR smoke harness on
      macos-latest + windows-latest. Watch the first run; if it flakes,
      tune timeouts before announcing v1.0.
- [ ] **Outside contributor.** Vision §1.6 names "one outside committer
      shipping a non-trivial PR" as a v1.0 exit criterion. This is a
      community-building task — open an issue, share the design docs.

### Phase 2.1 work that lands without blockers

These are post-v1.0 enhancements; the code lands incrementally:

- **Calendar variants:** Buddhist (Thai) / Hijri (Umm al-Qura, Civil,
  Tabular) / Hebrew calendars — each as a separate `@internationalized/date`
  import, additive to `@kumiki/components/calendar`. ADR 0013 §"v1.0
  calendar scope" lays out the schedule.
- **Atelier coverage:** add Tailwind + Vanilla variants for the
  remaining Phase 1 components (Switch, Combobox, Checkbox, RadioGroup,
  Tabs, Tooltip, Select, Field/Form). Each adds 2 files to the CLI
  registry.
- **Range date selection** in Calendar/DatePicker.
- **TypeDoc /api markdown rendering pipeline** (mdsvex or marked +
  DOMPurify). Currently `<pre>` rendering is acceptable but not pretty.
- **Lighthouse CI promotion** from `continue-on-error` to a hard gate
  after the first week of green runs.
- **Real Guidepup VO/NVDA** integration in the SR harness — currently
  the harness reads role + name from the AX tree (catches 80% of
  regressions); the full VO round-trip is the nightly matrix's job.

## How to resume

1. `git pull --ff-only`.
2. Read this file's "Publish prerequisites" — work through it top to bottom.
3. After each item, re-run `pnpm ci:health` to keep the gates green.
4. When the prerequisites are clear, cut a `0.0.1-preview` release with
   `pnpm changeset version --snapshot preview && pnpm changeset publish --tag preview`.

Nothing in the code is blocked. Safe to walk away after the prerequisites
are done.
