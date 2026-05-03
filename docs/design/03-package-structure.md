# 03 — Package Structure & Sub-path Exports

## 3.1 Repository shape

```
/
├── packages/
│   ├── primitives/                  Layer 1 — subpath exports per primitive
│   ├── locale/                      Layer 1 — subpath exports per language
│   ├── runtime/                     Layer 2 — minimal FSM runtime
│   ├── types/                       Layer 0 — shared TS types
│   ├── machine-{toggle, …}/         Layer 2 — 10 packages
│   ├── attachment-{toggle, …}/      Layer 3 — 10 packages
│   ├── component-{toggle, …}/       Layer 4 — 10 packages
│   ├── recipes-{toggle, dialog}/    Layer 5 (preview) — 2 packages at v1.0
│   └── cli/                         `kumiki` binary for `npx kumiki add`
├── apps/
│   └── docs/                        SvelteKit documentation site
├── docs/                            This design folder
├── .changeset/                      Independent versioning state
├── .github/workflows/               CI / release / docs deploy
├── .config/                         Shared tool configs (size-limit aggregator)
├── pnpm-workspace.yaml              Workspace + catalog
├── package.json                     Root scripts
└── tsconfig.json                    Base TS config
```

**37 packages** in total at v1.0:

- 4 shared (primitives, locale, runtime, types)
- 10 × 3 = 30 component packages (machine + attachment + component)
- 2 recipe packages (Layer 5 preview)
- 1 CLI

## 3.2 Naming conventions

| Pattern                           | Use                                                                 |
| --------------------------------- | ------------------------------------------------------------------- |
| `@kumiki/primitives`              | Layer 1, single shared package, subpath exports per primitive       |
| `@kumiki/locale`                  | Layer 1 (data), single shared package, subpath exports per language |
| `@kumiki/runtime`                 | Layer 2 shared FSM runtime                                          |
| `@kumiki/types`                   | Layer 0 — shared types only, no runtime                             |
| `@kumiki/machine-{kebab-case}`    | Layer 2 per-component machine (TS only)                             |
| `@kumiki/attachment-{kebab-case}` | Layer 3 per-component attachment (TS only, peer-dep on `svelte`)    |
| `@kumiki/component-{kebab-case}`  | Layer 4 per-component compound component (`.svelte` files)          |
| `@kumiki/recipes-{kebab-case}`    | Layer 5 styled recipe (preview, copy-paste source)                  |
| `@kumiki/cli`                     | The `kumiki` binary                                                 |

Kebab-case is mandatory for component slugs. **`form-field`** is a single package covering Field, FieldGroup, Form, and FormItem.

## 3.3 The `package.json` template

Every Kumiki package follows the same structure. Deviations are explicit and documented.

### TS-only package (machine-_, attachment-_, primitives, runtime, locale, types)

```json
{
  "name": "@kumiki/machine-toggle",
  "version": "0.0.0",
  "type": "module",
  "sideEffects": false,
  "files": ["dist", "!dist/**/*.test.*", "README.md"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./package.json": "./package.json"
  },
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "size-limit": [{ "name": "default", "path": "dist/index.js", "limit": "800 B" }],
  "publishConfig": {
    "access": "public",
    "provenance": true
  }
}
```

Key points:

- **`type: "module"`** — Kumiki is ESM-only.
- **`sideEffects: false`** — required for tree-shaking. Verified by `agadoo` in CI.
- **`exports` is the only entry resolution path.** `main` / `module` / `types` are kept for legacy bundlers but the conditional `exports` is authoritative.
- **`./package.json` is exposed** — required by `publint` and consumed by tools like `arethetypeswrong`.
- **`provenance: true`** — npm provenance attestations on every publish.

### Svelte component package (component-_, recipes-_)

Adds:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js",
      "import": "./dist/index.js"
    },
    "./package.json": "./package.json"
  },
  "svelte": "./dist/index.js",
  "peerDependencies": {
    "svelte": "catalog:"
  },
  "scripts": {
    "build": "svelte-package -i src -o dist && publint"
  }
}
```

The **`svelte`** export condition is required so that consumers (SvelteKit, Vite + svelte plugin) resolve `.svelte` source files rather than precompiled JS. `svelte-package` outputs `.svelte` (preprocessed but uncompiled) plus `.svelte.d.ts`.

## 3.4 Sub-path exports — examples

### `@kumiki/primitives` (one package, many subpaths)

```json
"exports": {
  ".":              { "types": "./dist/index.d.ts",            "import": "./dist/index.js" },
  "./focus-trap":   { "types": "./dist/focus-trap/index.d.ts", "import": "./dist/focus-trap/index.js" },
  "./dismissable":  { "types": "./dist/dismissable/index.d.ts","import": "./dist/dismissable/index.js" },
  "./id":           { "types": "./dist/id/index.d.ts",         "import": "./dist/id/index.js" },
  "./locale":       { "types": "./dist/locale/index.d.ts",     "import": "./dist/locale/index.js" },
  "./live-region":  { "types": "./dist/live-region/index.d.ts","import": "./dist/live-region/index.js" },
  "./collection":   { "types": "./dist/collection/index.d.ts", "import": "./dist/collection/index.js" },
  "./interactions": { "types": "./dist/interactions/index.d.ts","import":"./dist/interactions/index.js" },
  "./motion":       { "types": "./dist/motion/index.d.ts",     "import": "./dist/motion/index.js" },
  "./portal":       { "types": "./dist/portal/index.d.ts",     "import": "./dist/portal/index.js" },
  "./package.json": "./package.json"
}
```

### `@kumiki/locale` (one package, many subpaths, dynamic)

```json
"exports": {
  ".":         { "types": "./dist/index.d.ts",        "import": "./dist/index.js" },
  "./en":      { "types": "./dist/en/index.d.ts",     "import": "./dist/en/index.js" },
  "./ja":      { "types": "./dist/ja/index.d.ts",     "import": "./dist/ja/index.js" },
  "./zh-Hans": { "types": "./dist/zh-Hans/index.d.ts","import": "./dist/zh-Hans/index.js" },
  "./zh-Hant": { "types": "./dist/zh-Hant/index.d.ts","import": "./dist/zh-Hant/index.js" },
  "./ko":      { "types": "./dist/ko/index.d.ts",     "import": "./dist/ko/index.js" },
  "./es":      { "types": "./dist/es/index.d.ts",     "import": "./dist/es/index.js" },
  "./fr":      { "types": "./dist/fr/index.d.ts",     "import": "./dist/fr/index.js" },
  "./de":      { "types": "./dist/de/index.d.ts",     "import": "./dist/de/index.js" },
  "./ar":      { "types": "./dist/ar/index.d.ts",     "import": "./dist/ar/index.js" },
  "./he":      { "types": "./dist/he/index.d.ts",     "import": "./dist/he/index.js" },
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

The latter form depends on Vite's static analysis of the template literal. We test this in `apps/docs/sizes/locale-tree-shake.test.ts` (Phase 0c).

## 3.5 Dependency policy

### Internal dependencies (workspace)

All cross-package dependencies use the `workspace:*` protocol:

```json
{
  "dependencies": {
    "@kumiki/runtime": "workspace:*",
    "@kumiki/primitives": "workspace:*"
  }
}
```

`changesets` rewrites `workspace:*` to the current published version on `pnpm changeset publish`.

### External dependencies

| Class                                 | Policy                                                                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `svelte`                              | `peerDependencies` with catalog version (currently `^5.29.0`). Never a direct `dependencies` entry.                                  |
| `@floating-ui/dom`                    | Lazy loaded by Layer 3 attachment for `Tooltip`, `Popover`, `Combobox`. Listed in `peerDependencies` so the user can pick a version. |
| Validation libs (`zod`, `valibot`, …) | **Never** a dependency. Consumed only via Standard Schema. See [07-form-validation.md](07-form-validation.md).                       |
| `@internationalized/date`             | Used by `Calendar` / `DatePicker` (Phase 2). Listed in `peerDependencies`.                                                           |
| Runtime polyfills                     | None. Modern browsers + Node 22 + edge runtimes only.                                                                                |

### What we will _not_ depend on

- `tabbable` (Bits UI uses it). Replaced by our own `focus-trap` primitive — measured in [09-bundle-budget.md](09-bundle-budget.md) at < 500 B.
- `nanoid` (Melt UI uses it). `@kumiki/primitives/id` uses `crypto.randomUUID` with a small fallback.
- `dequal` (Melt UI uses it). Equality checks at this scale are cheap inline.

This is not anti-dependency-purism; it is bundle-budget arithmetic. Adding a 1 KB external for a 50-byte-of-internal-work problem makes the budget impossible.

## 3.6 The `pnpm-workspace.yaml` catalog

Versions of every shared dev/peer dep are pinned in the workspace catalog:

```yaml
catalog:
  svelte: ^5.29.0
  typescript: ^5.7.0
  tsdown: ^0.21.0
  vitest: ^2.1.0
  # ... see pnpm-workspace.yaml for the full list
```

Every package references `"svelte": "catalog:"`. This guarantees a single Svelte version across the monorepo and a single source of truth for upgrades.

## 3.7 Build pipeline per package

| Package class | Build tool                               | Notes                                                                            |
| ------------- | ---------------------------------------- | -------------------------------------------------------------------------------- |
| TS-only       | **tsdown**                               | Rolldown-powered, fast, DTS bundling, generates `package.json#exports` as needed |
| Svelte        | **`@sveltejs/package`** (svelte-package) | Preprocesses `.svelte`, emits `.svelte.d.ts`, copies as-is                       |

Each package's `pnpm build` is independent. The root `pnpm build` runs `pnpm -r build` (recursive), respecting `dependencies` order.

## 3.8 Why we picked sub-path exports — alternatives

| Alternative                                                                  | Verdict             | Why                                                                                                                                |
| ---------------------------------------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Sub-path exports per Layer × component** (chosen)                          | ✅                  | Best tree-shake, clearest mental model, smallest accidental-import surface                                                         |
| **One mega-package with `kumiki/dialog`, `kumiki/combobox`**                 | ❌                  | Versioning conflict — a Layer 1 patch forces every consumer to upgrade                                                             |
| **One package per component but layers as named exports** (Bits UI v2 shape) | ❌                  | Forces the FSM to ship to every consumer, even when they only want the machine                                                     |
| **Sub-paths _and_ a `kumiki` meta-barrel**                                   | ⏳ deferred to v1.1 | The barrel is a v1.1 thing once Layer 4 is stable. Discussed in [02-architecture.md §2.11](02-architecture.md#211-open-questions). |

## 3.9 What `publint`, `arethetypeswrong`, and `agadoo` enforce

Each package is gated by all three on every PR ([12-testing.md](12-testing.md)):

- **publint**: `package.json` is internally consistent (exports paths exist, types resolve, no missing fields).
- **arethetypeswrong** (`attw`): types resolve correctly under node10 / node16 / bundler resolutions. ESM-only is OK; we deliberately don't ship CJS, and `attw` is configured accordingly.
- **agadoo**: rolling up `pkg.module` produces no side effects — i.e., `sideEffects: false` is honest.

A package failing any of these blocks the PR. We add no `--ignore` flags.

## 3.10 Risks and open questions

- **Risk:** sub-path proliferation in `@kumiki/primitives` is fine at 9 entries but won't scale to 50. **Mitigation:** if Phase 2 adds primitives, we may split into `@kumiki/primitives-core` and `@kumiki/primitives-x`. Tracked.
- **Risk:** `svelte-package` emits `.svelte.d.ts` files that `arethetypeswrong` may have edge cases with. **Mitigation:** Phase 0a Combobox spike runs the full pipeline end-to-end to catch this. Reference: [Svelte issue #12785](https://github.com/sveltejs/svelte/issues/12785).
- **Open question:** does `tsdown`'s autogenerated `exports` field play nicely with our manually-curated subpath exports? **Investigate in Phase 0a.**
