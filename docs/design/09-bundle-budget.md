# 09 — Bundle Budget

> **Updated for [ADR 0012](16-decisions/0012-package-consolidation.md).** Budgets are enforced **per subpath** of the new layer packages — `@kumiki/machines/<name>`, `@kumiki/headless/<name>`, etc. — rather than per-package. The numbers below are what the user pays when importing a single subpath.
>
> All numbers are **brotli** (not gzip). `size-limit` v12 measures brotli by default; brotli is what edges actually serve.

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

- The Kumiki target is **gzipped, post-tree-shake** for direct comparison; our internal gates measure brotli, which is typically ~10–15% smaller. Methodology in §9.6.
- Kumiki targets a budget tighter than Radix and Zag. We do not promise to beat Bits UI, which has chosen to ship monolithic and so technically benefits from intra-component dedupe; what we promise is that the _user's_ chunk for a given component is ≤ the budget.

## 9.2 Per-subpath budgets (Phase 1)

All numbers brotli, measured by `size-limit` with `@size-limit/preset-small-lib`.

The "incremental" column is the cost of importing **one more component** when the foundations (`@kumiki/runtime`, `@kumiki/primitives/*`) are already in the consumer's bundle from a previous component on the same page. This is the typical case and what the CI gate enforces.

### `@kumiki/machines/<name>` — Layer 2

Pure-TS FSMs. No DOM, no Svelte. Tested with `environment: 'node'`.

| Subpath                         | Incremental | Notes                                                |
| ------------------------------- | ----------- | ---------------------------------------------------- |
| `@kumiki/machines/toggle`       | 500 B       | Two states; small.                                   |
| `@kumiki/machines/switch`       | 500 B       | Same shape as toggle.                                |
| `@kumiki/machines/checkbox`     | 600 B       | + `mixed` state.                                     |
| `@kumiki/machines/dialog`       | 800 B       | Focus-restore + dismissable policy hooks.            |
| `@kumiki/machines/tooltip`      | 800 B       | Open/close delays; `prefers-reduced-motion`.         |
| `@kumiki/machines/accordion`    | 1 kB        | Multi-region open + collection.                      |
| `@kumiki/machines/form-field`   | 1 kB        | Validation race tokens, errors lifecycle.            |
| `@kumiki/machines/radio-group`  | 1 kB        | Roving tabindex via `@kumiki/primitives/collection`. |
| `@kumiki/machines/slider`       | 1.2 kB      | Single-thumb numeric slider.                         |
| `@kumiki/machines/tabs`         | 1.2 kB      | Manual + automatic activation modes.                 |
| `@kumiki/machines/toast`        | 1.2 kB      | Per-toast lifecycle inside the toaster.              |
| `@kumiki/machines/number-field` | 1.2 kB      | Step / page / clamp logic.                           |
| `@kumiki/machines/menu`         | 1.5 kB      | Single-level menu (submenus deferred).               |
| `@kumiki/machines/popover`      | 1.5 kB      | Non-modal disclosure.                                |
| `@kumiki/machines/select`       | 1.5 kB      | Listbox + popover combination.                       |
| `@kumiki/machines/combobox`     | 3 kB        | Filtering + async + listbox + popover.               |

### `@kumiki/headless/<name>` — Layer 3

Svelte 5 attachments wrapping the machines. `peerDependencies: { svelte }`. Tested with `environment: 'jsdom'`.

| Subpath                                         | Incremental | Notes                                               |
| ----------------------------------------------- | ----------- | --------------------------------------------------- |
| `@kumiki/headless/toggle`                       | 750 B       |                                                     |
| `@kumiki/headless/switch`                       | 750 B       |                                                     |
| `@kumiki/headless/checkbox`                     | 850 B       |                                                     |
| `@kumiki/headless/tooltip`                      | 1 kB        |                                                     |
| `@kumiki/headless/radio-group`                  | 1.2 kB      |                                                     |
| `@kumiki/headless/dialog`                       | 1.4 kB      | + focus-trap + dismissable primitives.              |
| `@kumiki/headless/accordion`                    | 1.4 kB      |                                                     |
| `@kumiki/headless/form-field`                   | 1.5 kB      | + race-token guarding for async validators.         |
| `@kumiki/headless/select`                       | 1.5 kB      | + Floating UI peer dep amortized.                   |
| `@kumiki/headless/slider`                       | 1.5 kB      |                                                     |
| `@kumiki/headless/tabs`                         | 1.5 kB      |                                                     |
| `@kumiki/headless/popover`                      | 1.5 kB      | + Floating UI peer dep amortized.                   |
| `@kumiki/headless/number-field`                 | 1.5 kB      |                                                     |
| `@kumiki/headless/toast`                        | 1.5 kB      |                                                     |
| `@kumiki/headless/menu`                         | 1.7 kB      |                                                     |
| `@kumiki/headless/combobox`                     | 1.7 kB      | + Floating UI peer dep amortized.                   |
| `@kumiki/headless/combobox/with-validation`     | 750 B       | Standard Schema validator wrapper.                  |
| `@kumiki/headless/combobox/with-async-search`   | 750 B       | Abort-aware fetcher; reuses FETCH.\* token protocol |
| `@kumiki/headless/combobox/with-multi-select`   | 750 B       | `selected: T[]` + toggle/selectAll/clear.           |
| `@kumiki/headless/combobox/with-virtualization` | 750 B       | Fixed-row windowing.                                |

### `@kumiki/components/<name>` — Layer 4

Compound Svelte components. **Not gated by `size-limit`**: svelte-package emits `.svelte` files for the consumer's bundler to compile, and esbuild (the engine behind `@size-limit/preset-small-lib`) cannot load `.svelte`. Layer 4 size enforcement is therefore indirect:

1. **Layer 3 budgets above** cap the Svelte-runtime-free behavioral surface.
2. **Lighthouse CI on `apps/docs`** (Phase 0c) catches regressions in real per-page bundle size.

Realistic Layer 4 brotli targets (informational, not gated):

| Subpath                           | Target | Status                           |
| --------------------------------- | ------ | -------------------------------- |
| `@kumiki/components/toggle`       | 1.5 kB |                                  |
| `@kumiki/components/switch`       | 1.5 kB |                                  |
| `@kumiki/components/checkbox`     | 1.5 kB |                                  |
| `@kumiki/components/radio-group`  | 2 kB   |                                  |
| `@kumiki/components/tabs`         | 2.5 kB |                                  |
| `@kumiki/components/tooltip`      | 2 kB   | + Floating UI peer dep amortized |
| `@kumiki/components/dialog`       | 3.5 kB |                                  |
| `@kumiki/components/form-field`   | 2 kB   |                                  |
| `@kumiki/components/select`       | 3 kB   | + Floating UI peer dep amortized |
| `@kumiki/components/combobox`     | 4.5 kB | + Floating UI peer dep amortized |
| `@kumiki/components/accordion`    | 2 kB   |                                  |
| `@kumiki/components/slider`       | 2 kB   |                                  |
| `@kumiki/components/number-field` | 2.5 kB |                                  |
| `@kumiki/components/popover`      | 2.5 kB |                                  |
| `@kumiki/components/toast`        | 3 kB   |                                  |
| `@kumiki/components/menu`         | 3 kB   |                                  |

### `@kumiki/recipes/<name>` — Layer 5 preview

| Subpath                  | Target | Notes                                                           |
| ------------------------ | ------ | --------------------------------------------------------------- |
| `@kumiki/recipes/toggle` | 6 KB   | Includes Tailwind v4 utility-class strings + scoped CSS variant |
| `@kumiki/recipes/dialog` | 6 KB   | Same shape                                                      |

These are larger because they include styles. We don't apologize: that's the value proposition of recipes. Same Layer-4 svelte-package caveat: these are targets, not gated.

### `@kumiki/primitives/<each>` — Layer 1

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

Full barrel `@kumiki/primitives` (everything imported) ≤ 3 KB.

### `@kumiki/locale/<lang>`

| Per language                                                         | Budget    | Notes                           |
| -------------------------------------------------------------------- | --------- | ------------------------------- |
| `en`, `ja`, `zh-Hans`, `zh-Hant`, `ko`, `es`, `fr`, `de`, `ar`, `he` | 1 KB each | Strings + plural-rule callbacks |

### `@kumiki/runtime` and `@kumiki/types`

|                              | Budget                       |
| ---------------------------- | ---------------------------- |
| `@kumiki/runtime` (FSM core) | 1 KB                         |
| `@kumiki/types`              | 300 B (only ambient/`.d.ts`) |

## 9.3 How budgets are enforced

`size-limit` runs in CI on every PR. Configuration lives in each layer package's `package.json`, with one entry per subpath:

```json
"size-limit": [
  {
    "name": "machines/toggle (incremental)",
    "path": "dist/toggle/index.mjs",
    "limit": "500 B",
    "ignore": ["@kumiki/runtime", "@kumiki/primitives"]
  },
  {
    "name": "machines/combobox (incremental)",
    "path": "dist/combobox/index.mjs",
    "limit": "3 kB",
    "ignore": ["@kumiki/runtime", "@kumiki/primitives"]
  }
]
```

The `ignore` array marks workspace-internal foundations as already
present, so the number measures only the per-component cost.

`size-limit` runs once per package; the GitHub Action
`andresz1/size-limit-action` posts a comment summarizing changes per PR.

**Going over budget = CI failure, no merge.** No `--ignore` flags
allowed on the `size-limit` invocation itself.

`@kumiki/components` and `@kumiki/recipes` are **excluded** from `pnpm
size`, `pnpm attw`, and `pnpm agadoo` because svelte-package emits
`.svelte` files that those tools' esbuild loader cannot read. Those
two packages still pass `pnpm publint` and svelte-check.

## 9.4 Scaling pressure: what we do when a component starts to overflow

When a subpath's measurement creeps within 10% of its budget, the response is, in priority order:

1. **Find dead code.** Recheck `agadoo`. Often a polyfill or a debug helper has snuck in.
2. **Inline a primitive vs depending on it.** If a 50-byte usage of `@kumiki/primitives/dismissable` brings 150 bytes of import overhead, inline.
3. **Extract a `with*`** for the bloating feature. If async support inside Combobox costs 1 KB and 60% of users don't want it, ship it as `@kumiki/headless/combobox/with-async-search` ([11-composition.md](11-composition.md)) and lower the base.
4. **Adjust the budget**, only after (1)–(3) have been exhausted, and only with an ADR documenting the new number and why.

## 9.5 Pre-1.0 expectation

Pre-1.0, budgets are **aspirational**. We expect to be at or below the published budget on the day of release. The CI gate is set at the budget number from day 1, so growth is visible early.

## 9.6 Measurement methodology

The budget number is "what the user sees" — i.e. what gets included in their bundle when they import only the public API.

### How `size-limit` measures

`size-limit` with `@size-limit/preset-small-lib`:

- Bundles the entry with esbuild in production mode.
- Marks `peerDependencies` external (so `svelte` and `@floating-ui/dom` are not included in the measurement).
- Brotlies the result and reports the number.

The "incremental" budget is computed by listing workspace-internal peers in the `ignore` array, modeling the case where another component has already paid for them on the same page.

### Tree-shake check

In addition to `size-limit`, we run a **tree-shake regression test** in `apps/docs/sizes/` (Phase 0c):

```ts
// apps/docs/sizes/combobox.size.test.ts
import { test, expect } from 'vitest';
import { build } from 'vite';

test('Combobox.Root only pulls combobox-related machines/headless code', async () => {
  const result = await build({
    build: {
      lib: { entry: './fixture-combobox.svelte', formats: ['es'] },
      // ...
    },
  });
  // assert no 'machines/dialog' or 'machines/tabs' content in the output bundle
});
```

This catches accidental cross-component imports (e.g., a `dialog` subpath unintentionally pulling `tabs` machine code).

### `agadoo` for `sideEffects: false` honesty

`agadoo` rolls up `pkg.module` and reports any side-effects the bundler can detect. CI rejects. Skipped for `@kumiki/components` and `@kumiki/recipes` per §9.3.

## 9.7 What the budget does not include

- The Svelte runtime (assumed present; it's a peer dep).
- `@floating-ui/dom` for components that need floating positioning (assumed present; peer dep).
- `@internationalized/date` for Phase 2 Calendar (peer dep).
- User application styles.
- Layer 5 recipe CSS for users that copy-paste recipes.

This means: a real-world page using `@kumiki/components/combobox` adds _only_ the Layer 4 target above to its JS chunk, _plus_ whatever Floating UI was already included.

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

- **Resolved:** brotli measurement was made the default in 2026-05 with the move to size-limit v12. Gzip numbers in §9.1's competitor table are kept for like-for-like comparison.
- **TBD:** Are the `1 KB / locale` budgets achievable for languages with longer messages (e.g., German, French)? Likely OK because the message set is tiny (~10 strings), but worth a Phase 0c verification.
- **Open:** Should size-limit gain a `.svelte` loader so Layer 4 budgets become first-class CI gates instead of indirect (Lighthouse + Layer 3)? Tracked as a Phase 0c stretch goal.
- **TBD:** Whether to publish a `kumiki-bundle-report.json` per release for downstream tooling (e.g., bundlephobia ingestion).
