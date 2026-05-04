# CLAUDE.md

Instructions for Claude Code when working in this repo. Read this fully before any non-trivial action.

## What is this project

**Kumiki** — a headless, composable, deeply accessible UI primitive library for **Svelte 5 only**. ~30 packages under `@kumiki/*`. Architectural goals: per-component bundle budgets enforced in CI, framework-agnostic state machines, lazy-loaded i18n with non-Gregorian calendars, real screen-reader testing in CI.

**Status: pre-alpha.** Only design docs + package scaffolding exist. **No runtime implementation yet.** Phase 0a is the first implementation phase; see `docs/design/15-roadmap.md`.

## Authoritative documents (read these before designing)

The design is authoritative. Do not re-litigate decisions that already have an ADR.

| If you need…                                                 | Read                                          |
| ------------------------------------------------------------ | --------------------------------------------- |
| The 5-layer architecture                                     | `docs/design/02-architecture.md`              |
| Package layout / subpath exports / naming                    | `docs/design/03-package-structure.md`         |
| Custom FSM runtime spec                                      | `docs/design/04-state-machines.md`            |
| a11y testing strategy (axe + Guidepup + APG-driven keyboard) | `docs/design/05-accessibility.md`             |
| i18n / RTL / locale subpath exports                          | `docs/design/06-i18n.md`                      |
| Form / Standard Schema integration                           | `docs/design/07-form-validation.md`           |
| Generic propagation, `child` snippet, type design            | `docs/design/08-typescript.md`                |
| **Bundle budgets** (CI gate)                                 | `docs/design/09-bundle-budget.md`             |
| `with*` composition pattern                                  | `docs/design/11-composition.md`               |
| Versioning + changesets + Layer 5 preview                    | `docs/design/14-versioning-release.md`        |
| Roadmap (Phase 0a/0b/0c/1/2/3)                               | `docs/design/15-roadmap.md`                   |
| Architecture decisions (numbered ADRs)                       | `docs/design/16-decisions/`                   |
| Per-component spec template + Combobox example               | `docs/components/_template.md`, `combobox.md` |
| User-supplied competitor research                            | `docs/market-research.md`                     |

## Locked-in decisions (do not re-debate)

These have been decided. If a future change requires rethinking one, write a new ADR that supersedes the old.

| Decision                                                                        | Authority |
| ------------------------------------------------------------------------------- | --------- |
| Svelte 5 **only** (≥ 5.29 for `{@attach}`); no Svelte 4                         | ADR 0001  |
| 37 packages: shared (4) + machine/attachment/component × 10 + recipes × 2 + cli | ADR 0002  |
| Custom minimal FSM at `@kumiki/runtime` (~1 KB), **not XState v5**              | ADR 0003  |
| Standard Schema only — no per-validator adapters                                | ADR 0004  |
| Guidepup nightly (macOS-VoiceOver + Windows-NVDA), not per-PR                   | ADR 0005  |
| Locale subpath exports `@kumiki/locale/<lang>`, lazy                            | ADR 0006  |
| **`child` snippet replaces `asChild`** (Bits UI v2 pattern)                     | ADR 0007  |
| **pnpm workspace only** — no Turborepo / Nx                                     | ADR 0008  |
| **tsdown** for TS-only packages, **svelte-package** for `.svelte`               | ADR 0009  |
| Layer 5 ships as **`0.x.x-preview`** during v1.0 series                         | ADR 0010  |
| TypeDoc + api-extractor (both, different roles)                                 | ADR 0011  |

## Repository layout

```
docs/                       Design docs (authoritative)
docs/design/                01-vision … 15-roadmap, 16-decisions/
docs/components/            Per-component specs (_template.md, combobox.md)
docs/market-research.md     User-supplied competitor research

packages/                       37 packages, vertically sliced
  core/
    primitives/                 @kumiki/primitives — Layer 1 (subpath exports)
    locale/                     @kumiki/locale — subpath per language
    runtime/                    @kumiki/runtime — minimal FSM
    types/                      @kumiki/types — shared TS types
  components/                   one folder per component, all 3 layers co-located
    {toggle,switch,checkbox,radio-group,tabs,dialog,tooltip,combobox,select,form-field}/
      machine/                  @kumiki/machine-{X}     (Layer 2)
      attachment/               @kumiki/attachment-{X}  (Layer 3)
      component/                @kumiki/component-{X}   (Layer 4)
  recipes/
    toggle/                     @kumiki/recipes-toggle  (Layer 5 preview)
    dialog/                     @kumiki/recipes-dialog  (Layer 5 preview)
  tooling/
    cli/                        @kumiki/cli — `kumiki add` binary

# npm package names are flat (`@kumiki/machine-toggle`, not `@kumiki/components/toggle/machine`).
# The vertical directory structure is for developer ergonomics, not the published surface.

apps/docs/                  SvelteKit docs site → Cloudflare Pages

references/                 Shallow submodules of competitor libs (opt-in, ~400 MB)
.github/workflows/          ci, release, preview, docs, scheduled-screen-reader
.changeset/                 Independent versioning
pnpm-workspace.yaml         Catalog (Svelte 5.29, tsdown 0.21, etc.)
```

## Runtime targets — Node + browser

Kumiki must run in **both Node 22+ and modern browsers**. The dual-environment
contract is:

| Layer                  | Node import                                         | Node execute                                                            | Browser execute                 |
| ---------------------- | --------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------- |
| 1 — primitives, locale | ✅ no DOM                                           | ✅ pure logic / data                                                    | ✅                              |
| 2 — runtime, machines  | ✅ no DOM                                           | ✅ FSM in Vitest, scripts, server validation                            | ✅                              |
| 3 — attachments        | ✅ import OK (DOM types only inside factory bodies) | ⚠️ controller construction OK; calling `t.root(node)` requires real DOM | ✅                              |
| 4 — components         | ✅ via SvelteKit SSR                                | ✅ SSR rendering                                                        | ✅ post-hydration interactivity |

**Hard rules to preserve this:**

- No top-level `document.` / `window.` / `HTMLElement` / `MouseEvent` access
  in any source file. DOM globals only inside attachment-factory bodies that
  the consumer calls when a real node exists.
- `typeof X === 'undefined'` guards for `crypto`, `process`, `globalThis`
  before reading them at module scope.
- Vitest tests for Layer 1 / 2 must use `environment: 'node'`. Layer 3
  controller tests use `environment: 'jsdom'`.
- Use only modern globals available in Node 22 (`crypto.randomUUID`,
  `AbortSignal`, `Intl.*`, `URL`). Don't reach for Node-specific built-ins
  like `node:fs`, `node:path`, `node:process` in library packages.

The smoke test for this is `node -e "import('./dist/index.mjs')"` from any
package's directory — it must succeed without DOM globals.

## Phase 1 components (10) and the order they ship

Ship order from `15-roadmap.md`: **Toggle (Phase 0a) → Combobox (Phase 0b) → Switch → Checkbox → RadioGroup → Tabs → Dialog → Tooltip → Select → Field/Form**.

## Phase 1 locales (10)

`en`, `ja`, `zh-Hans`, `zh-Hant`, `ko`, `es`, `fr`, `de`, `ar`, `he`. Each ≤ 1 KB gzip.

## Bundle budgets (CI gate — never silently raise)

| Package                      | gzip target |
| ---------------------------- | ----------- |
| `@kumiki/primitives/<each>`  | 500 B       |
| `@kumiki/runtime`            | 1 KB        |
| `@kumiki/machine-toggle`     | 800 B       |
| `@kumiki/machine-combobox`   | 3 KB        |
| `@kumiki/component-toggle`   | 1.5 KB      |
| `@kumiki/component-dialog`   | 3.5 KB      |
| `@kumiki/component-combobox` | 4.5 KB      |
| `@kumiki/locale/<lang>`      | 1 KB        |

Full table: `docs/design/09-bundle-budget.md`. Adjusting a budget requires a new ADR with measurement evidence.

## Svelte 5 idioms we rely on

- **`{@attach}`** (≥ 5.29). Multiple per element, returns optional teardown, fully reactive. Layer 3 entry point.
- **`<script lang="ts" generics="T">`**. Use generics only on the **outermost** user-facing component. Inner components consume via `getContext`. Generic+`bind:` deeply nested is fragile (sveltejs/svelte#11356).
- **Snippets** (`Snippet<[ArgTypes]>`). Replace v4 slots. Type each one.
- **`child` snippet** for render delegation. **Never** introduce `asChild`. Pattern: snippet receives `{ props, wrapperProps?, state? }`, user spreads on their element.
- **Dot-namespace components** (`<Combobox.Root>`). Also export each subcomponent as a named export to work around d.ts edge cases (sveltejs/svelte#12785).
- **`*.svelte.ts` files** for runes-using controllers. Export classes/functions, not bare `$state` (cross-module reactivity does not transparently transfer).

## State machine convention

Each `@kumiki/machine-*`:

- Pure TypeScript, **no `svelte` import**.
- Uses `defineMachine` from `@kumiki/runtime`.
- Exports `createXMachine(input)` returning `{ state, context, send, subscribe, toJSON }`.
- Actions are **described as data** (`{ type: 'name', exec: fn }`) so `toJSON()` produces an XState-compatible config for [stately.ai/viz](https://stately.ai/viz).
- Tests live next to source as `*.test.ts`, run in pure Vitest (no jsdom).

## Code conventions

- **TypeScript strict**, plus `noUncheckedIndexedAccess`, `verbatimModuleSyntax`.
- **ESM only.** Never ship CJS.
- **`sideEffects: false`** in every package. Verified by `agadoo` in CI.
- **Subpath exports authoritative.** `main`/`module`/`types` for legacy fallback only.
- **No mocks of code under test.** Stub user-supplied callbacks (e.g., async fetchers) only.
- **JSDoc** on every public type with `@when-to-use`, `@anti-pattern`, `@see <APG link>` where relevant. Used by TypeDoc and `llms-full.txt`.
- **Comments**: only when _why_ is non-obvious. No "what" comments.

## Files to NOT depend on

- `tabbable`, `nanoid`, `dequal` — replace with our own primitives. Bundle math doesn't allow them.
- `xstate` — use `@kumiki/runtime` instead.
- Validation libraries (`zod`, `valibot`, …) — accept Standard Schema only.

## Commands

| Task                                                 | Command                                   |
| ---------------------------------------------------- | ----------------------------------------- |
| Install                                              | `pnpm install`                            |
| Build all packages                                   | `pnpm build`                              |
| Run a single package's tests                         | `pnpm --filter @kumiki/<name> test`       |
| Type-check workspace                                 | `pnpm typecheck`                          |
| Lint                                                 | `pnpm lint`                               |
| Format check                                         | `pnpm format:check`                       |
| Bundle size check                                    | `pnpm size`                               |
| Distribution health (publint + attw + agadoo + size) | `pnpm ci:health`                          |
| Generate a changeset                                 | `pnpm changeset`                          |
| Run docs site locally                                | `pnpm --filter @kumiki/docs dev`          |
| Update reference submodules                          | `git submodule update --remote --depth=1` |

## CI gates (all must pass)

1. format / lint / typecheck / unit tests
2. publish health: `publint`, `arethetypeswrong`, `agadoo`, `size-limit`
3. browser e2e + axe (LTR + RTL × every documented state)
4. (scheduled / on-demand) screen-reader on macOS + Windows

Going over a bundle budget is a CI failure, no merge. **Never** add `--ignore` flags to `publint`, `attw`, `agadoo`, or `size-limit`.

## a11y bar

Every component must satisfy the [Kumiki-ready checklist](docs/design/05-accessibility.md#56-what-every-component-must-satisfy-at-v10) before merge. Required accessible names are enforced at the **type level** wherever possible (e.g. `Dialog.Root` requires `title | aria-label | aria-labelledby`).

axe-core catches 30–40% of WCAG violations. The other 60% comes from APG keyboard tests + Guidepup. Treat axe as necessary, not sufficient.

## i18n bar

- Library code reads `direction` and `messages` from `LocaleProvider` context, never from globals.
- Keyboard logic that depends on physical direction (Tabs `ArrowRight`, Slider) reads `direction` from machine context — RTL inversion lives in the machine, not the controller.
- New strings touch all 10 locale files (`packages/locale/src/<lang>/index.ts`). CI verifies shape consistency.

## `references/` (competitor source as submodules)

`references/` holds shallow git submodules of Bits UI, Melt UI, Zag, Radix, react-spectrum, Ark, shadcn-svelte, Base UI. **Read only.** Do not copy code without explicit attribution and license review.

```bash
git submodule update --init --depth=1   # opt-in, ~400 MB
```

When designing a new piece, **grep references/ first** before web-searching:

```bash
grep -r 'createCombobox' references/zag/packages/machines/combobox/
grep -r '~standard' references/bits-ui/
```

CI does not init submodules.

## Working style preferences

- The maintainer is a Svelte maintainer himself; he prefers terse, decision-grade communication. Do not pad explanations.
- **Conversation in Japanese**, **code/comments/docs in English**.
- For UI changes, run the dev server and verify in a browser before claiming done.
- For design questions, prefer asking before assuming when the choice is load-bearing.
- Confirmed answers from the design Q&A (May 2026): pnpm-only, tsdown, Layer 5 preview at v1.0, GitHub `baseballyama/kumiki`, Cloudflare Pages, independent versioning, dot-namespace components.

## Things to NOT do without confirmation

- Modify `package.json` `exports` shape (it's a versioned contract).
- Adjust a bundle budget upward.
- Add a new dependency to a package.
- Add a new submodule to `references/`.
- Touch `.changeset/config.json` or release workflows.
- Push to remote, open PRs, or write to npm. Local commits only when asked.
- Skip git hooks (`--no-verify`).

## Things you can freely do

- Read any file.
- Edit `docs/`, `apps/docs/`, source files, tests.
- Run `pnpm` scripts.
- Run `vitest`, `playwright`, `tsc`, `eslint`, `prettier`.
- Generate changesets via `pnpm changeset` (do not commit yet).
- Search `references/` for prior art.
