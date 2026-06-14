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

Compound Svelte components. `size-limit` cannot load `.svelte` (esbuild's loader). Layer 4 is therefore gated by **`pnpm measure:svelte-size`** ([ADR 0018](16-decisions/0018-l4-bundle-budget-revision.md)) which bundles each subpath through Vite + the Svelte plugin and brotli-compresses the output. Run `pnpm measure:svelte-size:check` (also wired into `pnpm ci:health`) to fail on any over-budget subpath.

Two complementary signals are still kept on top of the L4 gate:

1. **Layer 3 budgets above** cap the Svelte-runtime-free behavioral surface.
2. **Lighthouse CI on `apps/docs`** catches per-page regressions that subpath-level numbers might miss.

Layer 4 brotli budgets (measured, gated by `measure:svelte-size:check`):

Two columns: **Gate** is what CI enforces today; **Target** is the long-run reduction goal documented in [ADR 0018](16-decisions/0018-l4-bundle-budget-revision.md). Where they differ, an architectural reduction is tracked as v1.0-non-blocking work; see ADR 0018 §"Implementation update 2026-05-10".

| Subpath                           | Gate    | Target  | Notes                                                                              |
| --------------------------------- | ------- | ------- | ---------------------------------------------------------------------------------- |
| `@kumiki/components/toggle`       | 3_100 B | 1_950 B | L3↔L4 attribute-painting dedup deferred                                            |
| `@kumiki/components/switch`       | 1_650 B | 1_650 B | Revised per ADR 0018                                                               |
| `@kumiki/components/checkbox`     | 1_800 B | 1_800 B | Revised per ADR 0018                                                               |
| `@kumiki/components/radio-group`  | 2_600 B | 2_600 B | Revised per ADR 0022 (RTL inversion moved into machine)                            |
| `@kumiki/components/tabs`         | 3_250 B | 3_250 B | Revised per ADR 0022 (orientation + direction in machine)                          |
| `@kumiki/components/tooltip`      | 2 kB    | 2 kB    | + Floating UI peer dep amortized                                                   |
| `@kumiki/components/dialog`       | 3.5 kB  | 3.5 kB  |                                                                                    |
| `@kumiki/components/form-field`   | 2_800 B | 1_950 B | `with-validation` subpath split deferred                                           |
| `@kumiki/components/select`       | 3 kB    | 3 kB    | + Floating UI peer dep amortized                                                   |
| `@kumiki/components/combobox`     | 4.5 kB  | 4.5 kB  | + Floating UI peer dep amortized                                                   |
| `@kumiki/components/accordion`    | 2_800 B | 1_950 B | Item context simplification deferred                                               |
| `@kumiki/components/slider`       | 2_650 B | 2_650 B | Revised per ADR 0018                                                               |
| `@kumiki/components/number-field` | 2_900 B | 2_900 B | Revised per ADR 0018                                                               |
| `@kumiki/components/popover`      | 2.5 kB  | 2.5 kB  |                                                                                    |
| `@kumiki/components/toast`        | 3 kB    | 3 kB    |                                                                                    |
| `@kumiki/components/menu`         | 3 kB    | 3 kB    |                                                                                    |
| `@kumiki/components/calendar`     | 5.5 kB  | 5.5 kB  | + `@internationalized/date` peer (Gregorian + Japanese imperial at v1.0; ADR 0013) |
| `@kumiki/components/date-picker`  | 7 kB    | 7 kB    | Calendar + Popover composition; same peer dep                                      |

#### Phase 1.5 additions (Layer 4 budgets, brotli)

Numbers track each component's `docs/components/<name>.md` "Bundle (Layer 4 target, brotli)" row. Same gating model as Phase 1 entries above (`measure:svelte-size:check`).

| Subpath                                   | Gate    | Target  | Notes                                                                 |
| ----------------------------------------- | ------- | ------- | --------------------------------------------------------------------- |
| `@kumiki/components/badge`                | 0.5 kB  | 0.5 kB  |                                                                       |
| `@kumiki/components/horizontal-rule`      | 350 B   | 300 B   | Reduced 400 → 330 B via `<svelte:element>`; runtime floor near gate   |
| `@kumiki/components/definition-list`      | 0.4 kB  | 0.4 kB  |                                                                       |
| `@kumiki/components/loading-spinner`      | 0.6 kB  | 0.6 kB  |                                                                       |
| `@kumiki/components/breadcrumb`           | 950 B   | 950 B   | Revised per ADR 0018                                                  |
| `@kumiki/components/button`               | 1_250 B | 800 B   | L3 `paint()` ↔ L4 reactive-binding dedup deferred                     |
| `@kumiki/components/avatar`               | 1.0 kB  | 1.0 kB  |                                                                       |
| `@kumiki/components/avatar-group`         | 1.0 kB  | 1.0 kB  | Composes Avatar; shared layout primitive                              |
| `@kumiki/components/icon-button`          | 1_350 B | 1_350 B | Revised per ADR 0018                                                  |
| `@kumiki/components/alert`                | 1_600 B | 1_000 B | Reduced via `Title` `<svelte:element>`; locale-provider inlining left |
| `@kumiki/components/chips`                | 1.2 kB  | 1.2 kB  |                                                                       |
| `@kumiki/components/pagination`           | 2_000 B | 1_400 B | Reduced via Item/Prev/Next `<svelte:element>`; further deferred       |
| `@kumiki/components/toolbar`              | 1.8 kB  | 1.8 kB  | APG roving tabindex; depends on `@kumiki/primitives/collection`       |
| `@kumiki/components/table`                | 2.5 kB  | 2.5 kB  | Semantic table; ADR 0015 (no virtualize / cell-edit)                  |
| `@kumiki/components/time-field`           | 2_750 B | 2_750 B | Revised per ADR 0018                                                  |
| `@kumiki/components/datetime-field`       | 9_000 B | 4_000 B | DatePart/TimePart subpath split deferred (`exports` change)           |
| `@kumiki/components/popover/with-confirm` | 1.0 kB  | 1.0 kB  | Popconfirm subpath; reuses `popover` core                             |

### `@kumiki/atelier/<name>` — Layer 5 (GA at v1.0 per [ADR 0017](16-decisions/0017-atelier-ga-at-v1.md))

Atelier subpaths are gated by the same `measure:svelte-size:check` flow as `@kumiki/components`. Each subpath is measured **once per variant** (Tailwind, vanilla); both must fit the budget.

| Subpath                          | Budget  | Notes                                                              |
| -------------------------------- | ------- | ------------------------------------------------------------------ |
| `@kumiki/atelier/toggle`         | 6 KB    | Includes Tailwind v4 utility-class strings + scoped CSS variant    |
| `@kumiki/atelier/dialog`         | 6 KB    | Same shape                                                         |
| `@kumiki/atelier/datetime-field` | 9_250 B | Revised per [ADR 0018] — bound by Tailwind variant                 |
| `@kumiki/atelier/<other>`        | ≤ 8 KB  | Each other Phase 1.5 atelier subpath ships both Tailwind + vanilla |

These are larger because they include styles. That's the value proposition of the Atelier; the gate enforces the ceiling.

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

Budgets are enforced by **two complementary tools**:

- **`size-limit`** for L1–L3 (TS-only packages). Configuration lives in each layer package's `package.json`.
- **`measure:svelte-size`** for L4 / Atelier (`.svelte` packages, [ADR 0018](16-decisions/0018-l4-bundle-budget-revision.md)).

Both run on every PR via `pnpm ci:health`. Going over budget = CI failure, no merge.

### `size-limit` for L1–L3

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

### `measure:svelte-size` for L4 / Atelier

`pnpm measure:svelte-size` (source: `apps/docs/scripts/measure-svelte-size.mjs`)
bundles each `@kumiki/components/<name>` and `@kumiki/atelier/<name>` subpath
through Vite + the Svelte plugin in lib mode (since esbuild's loader
cannot read `.svelte`), marks workspace foundations and peer deps
external (matching the L3 incremental model), and brotli-compresses
the produced ESM at quality 11.

The canonical budget table lives in this file (§9.2 above); the
script's `L4_BUDGET` and `ATELIER_BUDGET_OVERRIDES` constants are
duplicated from it. When this file changes, the script changes in the
same PR — and the gate is the script.

`pnpm measure:svelte-size:check` exits non-zero on any over-budget
subpath; it is part of `pnpm ci:health`. Raising any budget requires
a follow-on ADR with measurement evidence — the same contract as
`size-limit`'s `--ignore`.

### Workspace-level skips

`@kumiki/components` and `@kumiki/atelier` are **excluded** from `pnpm
size`, `pnpm attw`, and `pnpm agadoo` because svelte-package emits
`.svelte` files that those tools' esbuild loader cannot read. The
filter strings (`--filter='!@kumiki/components'` etc.) are workspace
exclusions, not `--ignore` flags on the underlying tools — they
preserve the "no `--ignore`" contract. Those two packages still pass
`pnpm publint` and svelte-check, plus the `measure:svelte-size:check`
gate above.

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

`agadoo` rolls up `pkg.module` and reports any side-effects the bundler can detect. CI rejects. Skipped for `@kumiki/components` and `@kumiki/atelier` per §9.3.

## 9.7 What the budget does not include

- The Svelte runtime (assumed present; it's a peer dep).
- `@floating-ui/dom` for components that need floating positioning (assumed present; peer dep).
- `@internationalized/date` for Phase 2 Calendar (peer dep).
- User application styles.
- Layer 5 Atelier CSS for users that copy-paste Atelier components.

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
- **Resolved (2026-05):** Should size-limit gain a `.svelte` loader so Layer 4 budgets become first-class CI gates? Answer: we keep size-limit for L1–L3 and use `measure:svelte-size` (Vite-based) for L4 / Atelier ([ADR 0018](16-decisions/0018-l4-bundle-budget-revision.md)). Both run inside `pnpm ci:health`.
- **TBD:** Whether to publish a `kumiki-bundle-report.json` per release for downstream tooling (e.g., bundlephobia ingestion). The `measure:svelte-size --json` flag already emits the right shape; publishing remains a launch deliverable.
