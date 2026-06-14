# ADR 0022 — Tabs / RadioGroup budget revision for RTL-in-machine

**Status:** Accepted
**Date:** 2026-06-14
**Complements:** [ADR 0018 — L4 bundle budget revision](0018-l4-bundle-budget-revision.md), [`docs/design/06-i18n.md`](../06-i18n.md), [`docs/design/09-bundle-budget.md`](../09-bundle-budget.md)

## Context

`CLAUDE.md`'s **i18n bar** is explicit about where RTL inversion lives:

> Keyboard logic that depends on physical direction (Tabs `ArrowRight`, Slider)
> reads `direction` from machine context — RTL inversion lives in the machine,
> not the controller.

Until now this contract was only partially honoured:

- **Tabs** resolved arrow keys against a `direction` closure captured in the
  Layer 3 controller, not in the machine. `toJSON()` therefore could not show
  the RTL behaviour, and a server-side consumer driving the machine directly
  got LTR-only navigation.
- **Slider** had the same controller-side closure.
- **RadioGroup** had **no RTL handling at all** — horizontal arrow navigation
  was LTR-only regardless of writing direction, an APG/i18n gap.

This change moves RTL inversion into the three machines:

- `direction` (and, for Tabs, `orientation`) now live in machine **context**.
- A `SET.DIRECTION` (and Tabs `SET.ORIENTATION`) event updates it reactively.
- `NAVIGATE` accepts a **physical** arrow `key`; the machine resolves it to a
  logical `next`/`prev` via a single `resolveArrow` source of truth, inverting
  the horizontal axis under `rtl`.
- The Layer 3 controllers drop their `direction` closures and forward the
  physical key; the Layer 4 `RadioGroup.Root` gains a `direction` prop wired
  through `$effect`.

This is pure i18n-bar compliance plus a net-new RTL capability for RadioGroup.
The cost is a handful of bytes per component (the extra context fields,
`SET.*` actions, and `resolveArrow`), pushing two subpaths past their
[ADR 0018](0018-l4-bundle-budget-revision.md) budgets.

## Measurement

Measured with `apps/docs/scripts/measure-svelte-size.mjs` (Vite + Svelte lib
mode, brotli q=11), post-refactor:

| Subpath                          | ADR 0018 budget | measured (2026-06-14) | over   |
| -------------------------------- | --------------- | --------------------- | ------ |
| `@kumiki/components/tabs`        | 2_950 B         | 3.05 kB               | +3.5 % |
| `@kumiki/components/radio-group` | 2_400 B         | 2.44 kB               | +1.7 % |
| `@kumiki/components/slider`      | 2_650 B         | within budget         | —      |

`slider` already had its RTL closure and absorbed the machine-side move under
its existing 2_650 B headroom — no revision needed. Tabs and RadioGroup do not.

## Decision

Apply the **same formula as ADR 0018 case (2)**: revised budget =
`ceil(measured × 1.05)`, rounded up to the nearest 50 B (5 % headroom absorbs
day-to-day churn; 50 B rounding keeps the gate from flapping sub-byte).

| Subpath                          | measured | × 1.05  | rounded → revised budget |
| -------------------------------- | -------- | ------- | ------------------------ |
| `@kumiki/components/tabs`        | 3_052 B  | 3_205 B | **3_250 B**              |
| `@kumiki/components/radio-group` | 2_441 B  | 2_563 B | **2_600 B**              |

Both overruns are under 5 % — squarely the "honest implementation cost"
category of ADR 0018 (2), not the ≥ 30 % "duplication smell" category that
mandates a code-reduction PR. The cost buys i18n-bar compliance the library
contractually requires, so reducing it away is not an option: the bytes are
the feature.

### Concretely

- **`apps/docs/scripts/measure-svelte-size.mjs`** `L4_BUDGET`: `tabs` →
  `3_250`, `radio-group` → `2_600`, both annotated `[ADR 0022]`.
- **`docs/design/09-bundle-budget.md` §9.2** updates the two rows with the
  revised budgets and an `[ADR 0022]` footnote.
- No `--ignore`, no gate weakening: `measure:svelte-size:check` still fails on
  any future regression beyond these revised numbers.

## Alternatives

- **Keep RTL in the controllers.** Rejected: violates the i18n bar's explicit
  "RTL inversion lives in the machine, not the controller", hides the behaviour
  from `toJSON()`/stately.ai/viz, and leaves server-side machine consumers
  LTR-only. RadioGroup would also keep its RTL gap.

- **Golf the two components back under the old budgets.** Rejected: the new
  bytes are the context fields + `SET.*` actions + `resolveArrow` that _are_
  the i18n feature. Shaving them means shipping the gap. The < 30 % formula in
  ADR 0018 exists precisely for honest cost like this.

- **One shared `resolveArrow` primitive in `@kumiki/primitives`.** Considered;
  deferred. Tabs needs an orientation axis RadioGroup/Slider don't, so the
  three resolvers aren't identical. Extracting a parameterised primitive is a
  net byte win only if all three converge — a follow-on if a fourth
  direction-aware component lands.

## Consequences

### Easier

- The i18n bar is now actually enforced for Tabs/Slider, and RadioGroup gains
  RTL it never had. RTL inversion is `toJSON`-visible and server-drivable.

### Harder

- Two budgets ticked up ~6 % / ~8 %. The headline competitive pitch is
  unaffected — neither Tabs nor RadioGroup is a headline subpath, and both
  remain tighter than the Radix/Zag equivalents (`docs/design/09` §9.1).

### Reversible

- Yes. A future code-reduction (e.g. the shared `resolveArrow` primitive) that
  brings either subpath back under its ADR 0018 number would supersede the
  corresponding row here with a follow-on ADR carrying the new measurement.
