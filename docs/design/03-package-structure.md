# 03 — Package Structure & Sub-path Exports

> **Updated for [ADR 0012](16-decisions/0012-package-consolidation.md).** The 37-package per-Layer×component shape from ADR 0002 has been collapsed to 9 layer-level packages with subpaths per component.

## 3.1 Repository shape

Packages are **layer-level**, with one folder per published package. A
component is implemented as a folder under each layer's `src/`, not as
its own package; cross-component navigation is one filesystem level
instead of three.

```
/
├── packages/
│   ├── core/                            # Layer 0–1 shared
│   │   ├── primitives/                  @kumiki/primitives — subpath per primitive
│   │   ├── locale/                      @kumiki/locale     — subpath per language
│   │   ├── runtime/                     @kumiki/runtime    — minimal FSM runtime
│   │   └── types/                       @kumiki/types      — shared TS types (Layer 0)
│   ├── machines/                        @kumiki/machines   — Layer 2, subpath per component
│   │   └── src/
│   │       ├── toggle/index.ts          @kumiki/machines/toggle
│   │       ├── combobox/index.ts        @kumiki/machines/combobox
│   │       └── … (16 components)
│   ├── headless/                        @kumiki/headless   — Layer 3, subpath per component
│   │   └── src/
│   │       ├── toggle/index.ts          @kumiki/headless/toggle
│   │       ├── combobox/
│   │       │   ├── index.ts             @kumiki/headless/combobox
│   │       │   └── with-validation/index.ts  @kumiki/headless/combobox/with-validation
│   │       └── … (16 components + 4 combobox compositions)
│   ├── components/                      @kumiki/components — Layer 4, subpath per component + dot-namespace barrel
│   │   └── src/
│   │       ├── index.ts                 dot-namespace barrel (`{ Toggle, Dialog, … }`)
│   │       ├── toggle/                  Root.svelte + index.ts → @kumiki/components/toggle
│   │       └── … (16 components)
│   ├── recipes/                         @kumiki/recipes    — Layer 5 preview, subpath per recipe
│   │   └── src/
│   │       ├── toggle/index.ts          @kumiki/recipes/toggle
│   │       └── dialog/index.ts          @kumiki/recipes/dialog
│   └── tooling/
│       └── cli/                         @kumiki/cli        — `kumiki` binary
├── apps/
│   └── docs/                            SvelteKit documentation site
├── docs/                                This design folder
├── .changeset/                          Independent versioning state
├── .github/workflows/                   CI / release / docs deploy
├── pnpm-workspace.yaml                  Workspace + catalog
├── package.json                         Root scripts
└── tsconfig.json                        Base TS config
```

**npm names match the directory.** `@kumiki/components` lives at
`packages/components/`. The `Layer × component` directory hierarchy from
the old shape is gone; each component is a folder under one layer
package's `src/`.

The `pnpm-workspace.yaml` is short:

```yaml
packages:
  - 'packages/core/*'
  - 'packages/machines'
  - 'packages/headless'
  - 'packages/components'
  - 'packages/recipes'
  - 'packages/tooling/*'
  - 'apps/*'
```

**9 packages** in total at v1.0:

- 4 shared (primitives, locale, runtime, types)
- 4 layer packages (machines, headless, components, recipes)
- 1 CLI

## 3.2 Naming conventions

| Pattern              | Use                                                                      |
| -------------------- | ------------------------------------------------------------------------ |
| `@kumiki/primitives` | Layer 1, single shared package, subpath exports per primitive            |
| `@kumiki/locale`     | Layer 1 (data), single shared package, subpath exports per language      |
| `@kumiki/runtime`    | Layer 2 shared FSM runtime                                               |
| `@kumiki/types`      | Layer 0 — shared types only, no runtime                                  |
| `@kumiki/machines`   | Layer 2, all FSMs as subpaths (`./toggle`, `./combobox`, …); pure-TS     |
| `@kumiki/headless`   | Layer 3, all attachments as subpaths (depends on `@kumiki/machines`)     |
| `@kumiki/components` | Layer 4, all Svelte components as subpaths + dot-namespace barrel at `.` |
| `@kumiki/recipes`    | Layer 5, opinionated styled recipes (preview dist-tag)                   |
| `@kumiki/cli`        | The `kumiki` binary                                                      |

Component slugs inside subpaths are kebab-case: `@kumiki/machines/form-field`,
`@kumiki/components/number-field`. **`form-field`** is one slug covering
Field, FieldGroup, Form, and FormItem.

## 3.3 Import shapes

```ts
// Common case — full Svelte UI, dot-namespace barrel for ergonomics.
import { Toggle, Dialog, Combobox } from '@kumiki/components';

// Same components via subpath import (best tree-shake on older bundlers).
import { Root, Trigger } from '@kumiki/components/toggle';

// Headless: bring your own DOM markup, just take the behavior.
import { toggle } from '@kumiki/headless/toggle';
import { combobox, withValidation } from '@kumiki/headless/combobox/with-validation';

// Pure FSM, no DOM (server validation, framework ports).
import { createToggleMachine } from '@kumiki/machines/toggle';
```

Both forms tree-shake correctly with esbuild / rolldown / Vite. The
subpath form is preferred for older bundlers and for IDE auto-import
precision.

## 3.4 The `package.json` template

### TS-only layer package (`@kumiki/machines`, `@kumiki/headless`)

```json
{
  "name": "@kumiki/machines",
  "version": "0.0.0",
  "type": "module",
  "sideEffects": false,
  "files": ["dist", "!dist/**/*.test.*", "README.md"],
  "exports": {
    ".": { "types": "./dist/index.d.mts", "import": "./dist/index.mjs" },
    "./toggle": { "types": "./dist/toggle/index.d.mts", "import": "./dist/toggle/index.mjs" },
    "./combobox": { "types": "./dist/combobox/index.d.mts", "import": "./dist/combobox/index.mjs" },
    "./package.json": "./package.json"
  },
  "main": "./dist/index.mjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.mts",
  "size-limit": [
    {
      "name": "machines/toggle (incremental)",
      "path": "dist/toggle/index.mjs",
      "limit": "500 B",
      "ignore": ["@kumiki/runtime", "@kumiki/primitives"]
    }
  ],
  "publishConfig": { "access": "public", "provenance": true }
}
```

Key points:

- **`type: "module"`** — Kumiki is ESM-only.
- **`sideEffects: false`** — required for tree-shaking. Verified by `agadoo` in CI.
- **`exports` is the only entry resolution path.** `main` / `module` / `types` are kept for legacy bundlers but the conditional `exports` is authoritative.
- **One `size-limit` entry per subpath** — the layer-level package replaces ~16 per-component packages, but the budget table is unchanged in spirit: every subpath has its own line.
- **`./package.json` is exposed** — required by `publint`.
- **`provenance: true`** — npm provenance attestations on every publish.

### Svelte component package (`@kumiki/components`, `@kumiki/recipes`)

```json
{
  "exports": {
    ".": { "types": "./dist/index.d.ts", "svelte": "./dist/index.js", "import": "./dist/index.js" },
    "./toggle": {
      "types": "./dist/toggle/index.d.ts",
      "svelte": "./dist/toggle/index.js",
      "import": "./dist/toggle/index.js"
    },
    "./dialog": {
      "types": "./dist/dialog/index.d.ts",
      "svelte": "./dist/dialog/index.js",
      "import": "./dist/dialog/index.js"
    },
    "./package.json": "./package.json"
  },
  "svelte": "./dist/index.js",
  "peerDependencies": { "svelte": "catalog:" },
  "scripts": {
    "build": "svelte-package -i src -o dist && publint"
  }
}
```

The **`svelte`** export condition is required so that consumers
(SvelteKit, Vite + svelte plugin) resolve `.svelte` source files rather
than precompiled JS. `svelte-package` outputs `.svelte` (preprocessed
but uncompiled) plus `.svelte.d.ts`.

The dot-namespace barrel at `.` uses `export * as Toggle from
'./toggle/index.js'` rather than `export const Toggle = { Root, … }`
because generic Svelte components emit `$$IsomorphicComponent` in their
`.d.ts` which can't cross module boundaries through a const-bound object
(sveltejs/svelte#12785).

## 3.5 Sub-path exports — examples

### `@kumiki/primitives` (one package, many subpaths)

```json
"exports": {
  ".":              { "types": "./dist/index.d.mts",             "import": "./dist/index.mjs" },
  "./focus-trap":   { "types": "./dist/focus-trap/index.d.mts",  "import": "./dist/focus-trap/index.mjs" },
  "./dismissable":  { "types": "./dist/dismissable/index.d.mts", "import": "./dist/dismissable/index.mjs" },
  "./id":           { "types": "./dist/id/index.d.mts",          "import": "./dist/id/index.mjs" },
  "./locale":       { "types": "./dist/locale/index.d.mts",      "import": "./dist/locale/index.mjs" },
  "./live-region":  { "types": "./dist/live-region/index.d.mts", "import": "./dist/live-region/index.mjs" },
  "./collection":   { "types": "./dist/collection/index.d.mts",  "import": "./dist/collection/index.mjs" },
  "./interactions": { "types": "./dist/interactions/index.d.mts","import": "./dist/interactions/index.mjs" },
  "./motion":       { "types": "./dist/motion/index.d.mts",      "import": "./dist/motion/index.mjs" },
  "./portal":       { "types": "./dist/portal/index.d.mts",      "import": "./dist/portal/index.mjs" },
  "./package.json": "./package.json"
}
```

### `@kumiki/locale` (one package, many subpaths, dynamic-import safe)

```json
"exports": {
  ".":         { "types": "./dist/index.d.mts",         "import": "./dist/index.mjs" },
  "./en":      { "types": "./dist/en/index.d.mts",      "import": "./dist/en/index.mjs" },
  "./ja":      { "types": "./dist/ja/index.d.mts",      "import": "./dist/ja/index.mjs" },
  "./zh-Hans": { "types": "./dist/zh-Hans/index.d.mts", "import": "./dist/zh-Hans/index.mjs" },
  "./zh-Hant": { "types": "./dist/zh-Hant/index.d.mts", "import": "./dist/zh-Hant/index.mjs" },
  "./ko":      { "types": "./dist/ko/index.d.mts",      "import": "./dist/ko/index.mjs" },
  "./es":      { "types": "./dist/es/index.d.mts",      "import": "./dist/es/index.mjs" },
  "./fr":      { "types": "./dist/fr/index.d.mts",      "import": "./dist/fr/index.mjs" },
  "./de":      { "types": "./dist/de/index.d.mts",      "import": "./dist/de/index.mjs" },
  "./ar":      { "types": "./dist/ar/index.d.mts",      "import": "./dist/ar/index.mjs" },
  "./he":      { "types": "./dist/he/index.d.mts",      "import": "./dist/he/index.mjs" },
  "./package.json": "./package.json"
}
```

Users either statically import a single locale:

```ts
import { messages } from '@kumiki/locale/ja';
```

…or dynamically import based on runtime:

```ts
const lang = await detectLocale(); // 'ja'
const { messages } = await import(`@kumiki/locale/${lang}`);
```

The latter form depends on Vite's static analysis of the template
literal. We test this in `apps/docs/sizes/locale-tree-shake.test.ts`
(Phase 0c).

## 3.6 Dependency policy

### Internal dependencies (workspace)

Cross-package edges (ADR 0012):

```
@kumiki/recipes     →  @kumiki/components
@kumiki/components  →  @kumiki/headless
@kumiki/headless    →  @kumiki/machines, @kumiki/primitives, @kumiki/runtime
@kumiki/machines    →  @kumiki/runtime, @kumiki/primitives
```

Each cross-package edge is a `dependencies` (not `peerDependencies`)
entry using `workspace:*`:

```json
{
  "dependencies": {
    "@kumiki/headless": "workspace:*"
  }
}
```

`changesets` rewrites `workspace:*` to the current published version on
`pnpm changeset publish`.

### External dependencies

| Class                                 | Policy                                                                                                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `svelte`                              | `peerDependencies` with catalog version (currently `^5.55.0`). Never a direct `dependencies` entry. Required by `@kumiki/headless`, `components`, `recipes`. |
| `@floating-ui/dom`                    | Lazy loaded by `@kumiki/headless` for `Tooltip`, `Popover`, `Combobox`, `Select`. Listed in `peerDependencies` so the user can pick a version.               |
| Validation libs (`zod`, `valibot`, …) | **Never** a dependency. Consumed only via Standard Schema. See [07-form-validation.md](07-form-validation.md).                                               |
| `@internationalized/date`             | Used by `Calendar` / `DatePicker` (Phase 2). Listed in `peerDependencies`.                                                                                   |
| Runtime polyfills                     | None. Modern browsers + Node 22 + edge runtimes only.                                                                                                        |

### What we will _not_ depend on

- `tabbable` (Bits UI uses it). Replaced by our own `focus-trap`
  primitive — measured in [09-bundle-budget.md](09-bundle-budget.md) at
  < 500 B.
- `nanoid` (Melt UI uses it). `@kumiki/primitives/id` uses
  `crypto.randomUUID` with a small fallback.
- `dequal` (Melt UI uses it). Equality checks at this scale are cheap
  inline.

This is not anti-dependency-purism; it is bundle-budget arithmetic.
Adding a 1 KB external for a 50-byte-of-internal-work problem makes the
budget impossible.

## 3.7 The `pnpm-workspace.yaml` catalog

Versions of every shared dev/peer dep are pinned in the workspace
catalog:

```yaml
catalog:
  svelte: ^5.55.0
  typescript: ^5.7.0
  tsdown: ^0.21.10
  vitest: ^4.1.5
  # ... see pnpm-workspace.yaml for the full list
```

Every package references `"svelte": "catalog:"`. This guarantees a
single Svelte version across the monorepo and a single source of truth
for upgrades.

## 3.8 Build pipeline per package

| Package class                                                                | Build tool                               | Notes                                                                                |
| ---------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------ |
| TS-only (`runtime`, `primitives`, `locale`, `types`, `machines`, `headless`) | **tsdown**                               | Rolldown-powered, fast, DTS bundling, multiple entry points → per-subpath dist files |
| Svelte (`components`, `recipes`)                                             | **`@sveltejs/package`** (svelte-package) | Preprocesses `.svelte`, emits `.svelte.d.ts`, copies `.svelte` files as-is           |

Each package's `pnpm build` is independent. The root `pnpm build` runs
`pnpm -r build` (recursive), respecting `dependencies` order.

`tsdown` for layer packages takes a list of entry points (one per
subpath); the output preserves the relative `src/<component>/index.ts` →
`dist/<component>/index.mjs` shape.

## 3.9 Why we picked layer-level packages — alternatives

See [ADR 0012 §Alternatives reconsidered](16-decisions/0012-package-consolidation.md#alternatives-reconsidered).
Summary:

| Alternative                                                  | Verdict       |
| ------------------------------------------------------------ | ------------- |
| **Per-layer with subpath per component** (chosen — ADR 0012) | ✅            |
| **Per-Layer × component, ~37 packages** (ADR 0002)           | ❌ superseded |
| **Single mega-package** (Bits UI shape)                      | ❌            |
| **Two-package: headless + components only**                  | ❌            |

## 3.10 What `publint`, `arethetypeswrong`, and `agadoo` enforce

Each package is gated by all three on every PR
([12-testing.md](12-testing.md)):

- **publint**: `package.json` is internally consistent (exports paths
  exist, types resolve, no missing fields).
- **arethetypeswrong** (`attw`): types resolve correctly under node10 /
  node16 / bundler resolutions. ESM-only is OK; we deliberately don't
  ship CJS. Skipped for `@kumiki/components` and `@kumiki/recipes`
  because svelte-package's `.svelte` output isn't `attw`-friendly;
  their type surface is verified via `pnpm typecheck` and `publint`.
- **agadoo**: rolling up `pkg.module` produces no side effects — i.e.,
  `sideEffects: false` is honest. Same exclusion for
  `@kumiki/components` and `@kumiki/recipes`.

A package failing any of these blocks the PR. We add no `--ignore`
flags.

## 3.11 Risks and open questions

- **Risk:** sub-path proliferation in `@kumiki/headless` (16 base + 4
  combobox compositions = 20 entries) is fine but may grow further as
  Phase 2 adds composition wrappers. **Mitigation:** if the entry
  count crosses ~30, consider a `with-*` second-level subpath
  convention per component.
- **Risk:** `svelte-package` emits `.svelte.d.ts` files that
  `arethetypeswrong` may have edge cases with. **Mitigation:** we run
  `pnpm typecheck` (svelte-check) over the whole workspace; the docs
  site consumes the package as a real workspace dependency, exercising
  the `.svelte` types end-to-end.
- **Open question:** Layer 4 bundle budget enforcement is currently
  indirect (Layer 3 budgets + docs-site Lighthouse run) because
  size-limit's esbuild loader doesn't read `.svelte`. Consider a custom
  size-limit plugin that compiles `.svelte` first; tracked as a Phase
  0c stretch goal.
