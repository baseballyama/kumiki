# ADR 0023 — Budget revision for the Svelte 5.57 toolchain upgrade

**Status:** Accepted
**Date:** 2026-10-05
**Complements:** [ADR 0018 — L4 bundle budget revision](0018-l4-bundle-budget-revision.md), [ADR 0022](0022-tabs-radio-group-rtl-budget-revision.md), [`docs/design/09-bundle-budget.md`](../09-bundle-budget.md)

## Context

The October 2026 dependency refresh moves the workspace from Svelte 5.55.5 to
5.57.1 (plus SvelteKit 3, Vite 8.3, vite-plugin-svelte 7.3). No Kumiki source
changed for the affected components, yet `measure:svelte-size:check` reports
eight subpaths over budget.

The growth is compiler / runtime output. For example `horizontal-rule`'s
compiled client code now hoists the `$.rest_props` exclusion list into a
module-level `Set`:

```diff
+var rest_excludes = new Set(['$$slots', '$$events', '$$legacy', 'as', 'orientation']);
-rest = $.rest_props($$props, ['$$slots', '$$events', '$$legacy', 'as', 'orientation']);
+rest = $.rest_props($$props, rest_excludes);
```

plus the matching `svelte/internal` runtime changes pulled into each bundle.

## Measurement

`apps/docs/scripts/measure-svelte-size.mjs` (Vite + Svelte lib mode, brotli
q=11). Baseline = `main` @ 1f22f89 with Svelte 5.55.5; after = same source with
Svelte 5.57.1 (Accordion measured after the APG drift fix in #14, so it is no
longer over).

| Subpath                                     | old budget | 5.55.5  | 5.57.1  | Δ       |
| ------------------------------------------- | ---------- | ------- | ------- | ------- |
| `@kumiki/components/alert`                  | 1_600 B    | 1.54 kB | 1_619 B | ~+40 B  |
| `@kumiki/components/breadcrumb`             | 950 B      | 887 B   | 952 B   | +65 B   |
| `@kumiki/components/horizontal-rule`        | 350 B      | 330 B   | 376 B   | +46 B   |
| `@kumiki/components/loading-spinner`        | 600 B      | 591 B   | 619 B   | +28 B   |
| `@kumiki/components/menu`                   | 3_000 B    | 2.92 kB | 3_023 B | ~+30 B  |
| `@kumiki/components/select`                 | 3_000 B    | 2.93 kB | 3_006 B | ~+10 B  |
| `@kumiki/components/slider`                 | 2_650 B    | 2.58 kB | 2_660 B | ~+20 B  |
| `@kumiki/atelier/datetime-field` (tailwind) | 9_250 B    | 9.02 kB | 9_373 B | ~+130 B |

## Decision

Apply the ADR 0018 case (2) formula: revised budget = `ceil(measured × 1.05)`
rounded up to the nearest 50 B.

| Subpath                                     | measured | × 1.05 | revised budget |
| ------------------------------------------- | -------- | ------ | -------------- |
| `@kumiki/components/alert`                  | 1_619 B  | 1_700  | **1_700 B**    |
| `@kumiki/components/breadcrumb`             | 952 B    | 1_000  | **1_000 B**    |
| `@kumiki/components/horizontal-rule`        | 376 B    | 395    | **400 B**      |
| `@kumiki/components/loading-spinner`        | 619 B    | 650    | **650 B**      |
| `@kumiki/components/menu`                   | 3_023 B  | 3_175  | **3_200 B**    |
| `@kumiki/components/select`                 | 3_006 B  | 3_157  | **3_200 B**    |
| `@kumiki/components/slider`                 | 2_660 B  | 2_793  | **2_800 B**    |
| `@kumiki/atelier/datetime-field` (tailwind) | 9_373 B  | 9_842  | **9_850 B**    |

Every overrun is a toolchain cost under 15 %, not a Kumiki duplication smell.
Existing reduction targets (e.g. `horizontal-rule` 300 B, `alert` 1_000 B) are
unchanged.

- `measure-svelte-size.mjs` budgets annotated `[ADR 0023]`.
- `docs/design/09-bundle-budget.md` rows updated.
- No `--ignore`, no gate weakening.

## Alternatives

- **Pin Svelte to 5.55.** Rejected: blocks SvelteKit 3 (peer `svelte ^5.57.1`)
  and upstream fixes.
- **Golf the components.** Rejected for this change: the bytes are not in
  Kumiki source. Code-reduction work tracked by ADR 0018/0019/0020/0021 still
  applies and supersedes rows here when it lands.

## Consequences

- Eight gates tick up 10–50 B (datetime-field 600 B). Headline Phase 1
  budgets in `CLAUDE.md` (toggle, dialog, combobox, machines, runtime,
  primitives, locale) are unaffected.
- Reversible: a later Svelte release or reduction PR that brings a subpath
  back under its old number supersedes the row with a follow-on ADR.
