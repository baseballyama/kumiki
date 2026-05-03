# 09 — Bundle Budget

## 9.1 Why the budget is a hard CI gate

Bundle size is the single number a user feels every time they ship. It is the most-cited reason teams pick Bits UI over `react-spectrum/react-aria-components` (at 5.6 MB unpacked, RAC alarms many) and the most-cited reason Headless UI loses to Radix on richness. Kumiki's competitive position on bundle size **is the design**, not a refinement.

The competitor numbers we benchmark against, taken from the user's market research and our research agent's findings:

| Library           | Dialog (gzip, est.) | Source                  |
| ----------------- | ------------------- | ----------------------- |
| Bits UI           | ~1.5 KB             | user market research §7 |
| Melt UI           | ~2.5 KB             | user market research §7 |
| React Aria        | ~2.5 KB             | user market research §7 |
| Radix UI          | ~3.2 KB             | user market research §7 |
| Zag.js            | ~3.8 KB             | user market research §7 |
| **Kumiki target** | **≤ 3.5 KB**        | this doc                |

Notes on the table:

- These are _gzipped, post-tree-shake_ numbers from a Vite library build importing the named subpath. Methodology is described in §9.6.
- Kumiki targets a budget tighter than Radix and Zag. We do not promise to beat Bits UI, which has chosen to ship monolithic and so technically benefits from intra-component dedupe; what we promise is that the _user's_ gzipped chunk for a given component is ≤ the budget.

## 9.2 Component-level budgets (Phase 1)

Per package, gzipped, measured by `size-limit` with `@size-limit/preset-small-lib`:

### Layer 2 — `@kumiki/machine-*`

| Machine               | Budget | Notes                                                |
| --------------------- | ------ | ---------------------------------------------------- |
| `machine-toggle`      | 800 B  | Two states; small.                                   |
| `machine-switch`      | 800 B  | Same shape as toggle.                                |
| `machine-checkbox`    | 900 B  | + `mixed` state.                                     |
| `machine-radio-group` | 1200 B | Roving tabindex via `@kumiki/primitives/collection`. |
| `machine-tabs`        | 1500 B | Manual + automatic activation modes.                 |
| `machine-tooltip`     | 1500 B | Open/close delays; `prefers-reduced-motion`.         |
| `machine-dialog`      | 1800 B | Focus management, dismissable, scroll-lock signals.  |
| `machine-form-field`  | 2000 B | Validation race tokens, errors lifecycle.            |
| `machine-select`      | 2500 B | Listbox + popover combination.                       |
| `machine-combobox`    | 3000 B | Filtering + async + listbox + popover.               |

### Layer 3 — `@kumiki/attachment-*`

Each attachment package's budget = the matching machine budget + ~500–1500 B for Svelte controller and attachment factories. The Layer 4 budget below absorbs Layer 3 entirely; Layer 3 numbers apply only to users importing Layer 3 directly.

### Layer 4 — `@kumiki/component-*` (composite — what end-users see)

The Layer 4 budget is what a typical SvelteKit consumer's gzipped chunk grows by when they `import * as Combobox from '@kumiki/component-combobox'` and use the entire compound API.

| Component               | Budget | Status                           |
| ----------------------- | ------ | -------------------------------- |
| `component-toggle`      | 1500 B |                                  |
| `component-switch`      | 1500 B |                                  |
| `component-checkbox`    | 1500 B |                                  |
| `component-radio-group` | 2000 B |                                  |
| `component-tabs`        | 2500 B |                                  |
| `component-tooltip`     | 3500 B | + Floating UI peer dep amortized |
| `component-dialog`      | 3500 B |                                  |
| `component-form-field`  | 3000 B |                                  |
| `component-select`      | 4500 B | + Floating UI peer dep amortized |
| `component-combobox`    | 4500 B | + Floating UI peer dep amortized |

### Layer 5 — `@kumiki/recipes-*` (preview)

| Recipe           | Budget | Notes                                                           |
| ---------------- | ------ | --------------------------------------------------------------- |
| `recipes-toggle` | 6 KB   | Includes Tailwind v4 utility-class strings + scoped CSS variant |
| `recipes-dialog` | 6 KB   | Same shape                                                      |

These are larger because they include styles. We don't apologize: that's the value proposition of recipes.

### Layer 1 — `@kumiki/primitives` (per subpath)

| Subpath        | Budget | Notes                                                        |
| -------------- | ------ | ------------------------------------------------------------ |
| `focus-trap`   | 500 B  | Includes Tab cycle, return-focus, configurable initial focus |
| `dismissable`  | 500 B  | Outside click + Escape                                       |
| `id`           | 500 B  | UUID + SSR fallback                                          |
| `locale`       | 500 B  | direction, formatter, numberSystem                           |
| `live-region`  | 500 B  | announce(politeness)                                         |
| `collection`   | 500 B  | roving tabindex, type-ahead                                  |
| `interactions` | 500 B  | press/hover/focus normalization                              |
| `motion`       | 500 B  | prefers-reduced-motion / contrast                            |
| `portal`       | 500 B  | render in target node                                        |

Full barrel `@kumiki/primitives` (everything) ≤ 3 KB.

### `@kumiki/locale/*`

| Per language                                                         | Budget    | Notes                           |
| -------------------------------------------------------------------- | --------- | ------------------------------- |
| `en`, `ja`, `zh-Hans`, `zh-Hant`, `ko`, `es`, `fr`, `de`, `ar`, `he` | 1 KB each | Strings + plural-rule callbacks |

### `@kumiki/runtime`

|             | Budget       |
| ----------- | ------------ |
| FSM runtime | 1 KB gzipped |

### `@kumiki/types`

|                             | Budget                       |
| --------------------------- | ---------------------------- |
| Shared types (zero runtime) | 300 B (only ambient/`.d.ts`) |

## 9.3 How budgets are enforced

`size-limit` runs in CI on every PR. The configuration lives in each package's `package.json`:

```json
"size-limit": [
  { "name": "default", "path": "dist/index.js", "limit": "3500 B" }
]
```

Multi-entry packages (e.g., `@kumiki/primitives`) configure one entry per subpath:

```json
"size-limit": [
  { "name": "focus-trap", "path": "dist/focus-trap/index.js", "limit": "500 B" },
  { "name": "dismissable", "path": "dist/dismissable/index.js", "limit": "500 B" },
  // …
  { "name": "full", "path": "dist/index.js", "limit": "3 KB" }
]
```

`size-limit` runs once per package; the GitHub Action `andresz1/size-limit-action` posts a comment summarizing changes per PR.

**Going over budget = CI failure, no merge.** No `--ignore` allowed.

## 9.4 Scaling pressure: what we do when a component starts to overflow

When a component's measurement creeps within 10% of its budget, the response is, in priority order:

1. **Find dead code.** Recheck `agadoo`. Often a polyfill or a debug helper has snuck in.
2. **Inline a primitive vs depending on it.** If a 50-byte usage of `@kumiki/primitives/dismissable` brings 150 bytes of import overhead, inline.
3. **Extract a `with*`** for the bloating feature. If async support inside Combobox costs 1 KB and 60% of users don't want it, ship it as `withAsyncSearch` ([11-composition.md](11-composition.md)) and lower the base.
4. **Adjust the budget**, only after (1)–(3) have been exhausted, and only with an ADR documenting the new number and why.

## 9.5 Pre-1.0 expectation

Pre-1.0, budgets are **aspirational**. We expect to be at or below the published budget on the day of release. The CI gate is set at the budget number from day 1, so growth is visible early.

## 9.6 Measurement methodology

The budget number is "what the user sees" — i.e. what gets included in their bundle when they import only the public API.

### How `size-limit` measures

`size-limit` with `@size-limit/preset-small-lib`:

- Bundles the entry with esbuild in production mode.
- Marks `peerDependencies` external (so `svelte` is not included in the measurement).
- Gzips the result and reports the number.

### Tree-shake check

In addition to `size-limit`, we run a **tree-shake regression test** in `apps/docs/sizes/` (Phase 0c):

```ts
// apps/docs/sizes/combobox.size.test.ts
import { test, expect } from 'vitest';
import { build } from 'vite';

test('Combobox.Root only pulls Layer 4 + machines for combobox', async () => {
  const result = await build({
    build: {
      lib: { entry: './fixture-combobox.svelte', formats: ['es'] },
      // ...
    },
  });
  // assert no 'machine-dialog' or 'machine-tabs' content in the output bundle
});
```

This catches accidental cross-component imports (e.g., `import { focusTrap } from '@kumiki/component-dialog/internals'`).

### `agadoo` for `sideEffects: false` honesty

`agadoo` rolls up `pkg.module` and reports any side-effects the bundler can detect. CI rejects.

## 9.7 What the budget does not include

- The Svelte runtime (assumed present; it's a peer dep).
- `@floating-ui/dom` for components that need floating positioning (assumed present; peer dep).
- `@internationalized/date` for Phase 2 Calendar (peer dep).
- User application styles.
- Layer 5 recipe CSS for users that copy-paste recipes.

This means: a real-world page using `@kumiki/component-combobox` adds _only_ the budget number above to its JS chunk, _plus_ whatever Floating UI was already included.

## 9.8 Why these budgets, not stricter

We could promise smaller numbers. We don't, for two reasons:

1. **Honesty over marketing.** Bundle size lies are the most-cited reason developers distrust libraries. We pick numbers we can hit and document them.
2. **Headroom for a11y.** A Combobox with full ARIA attributes, RTL keyboard logic, focus management, and Standard Schema validation hooks has a floor cost. Quoting 2.5 KB and shipping a worse Combobox is a bad trade.

When a component lands measurably below budget, we lower the budget in a versioned ADR.

## 9.9 Comparison to competitors at v1.0

Filling this in becomes a Phase 0c deliverable. At v1.0 we publish a `apps/docs/sizes/comparison/` page that embeds:

- Bundle size badges from `bundlejs.com` for each Kumiki Layer 4 component.
- Same-component numbers from Bits UI, Radix, React Aria where comparable.
- Reproducible scripts that anyone can run locally.

## 9.10 Open questions

- **TBD:** Should `size-limit` also check per-entry **brotli** sizes? Brotli is what edges actually serve. Adds complexity. Lean: yes, in Phase 0c, alongside gzip.
- **TBD:** Are the `1 KB / locale` budgets achievable for languages with longer messages (e.g., German, French)? May need to revisit. Likely OK because the message set is tiny (~10 strings).
- **TBD:** Whether to publish a `kumiki-bundle-report.json` per release for downstream tooling (e.g., bundlephobia ingestion).
