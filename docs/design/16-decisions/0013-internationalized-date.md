# ADR 0013 — `@internationalized/date` for Calendar & DatePicker

**Status:** Accepted
**Date:** 2026-05-09

## Context

Phase 2 ships two date-related components — `@kumiki/components/calendar` and `@kumiki/components/date-picker`. Both need:

- **Calendar arithmetic** that works for non-Gregorian calendars (Japanese imperial, Buddhist, Hijri, Hebrew, …) without a polyfill.
- **Locale-aware formatting** that integrates with `Intl.DateTimeFormat`.
- **A stable, framework-agnostic API** so the same date logic can sit in `@kumiki/machines` (Layer 2 — pure-TS, no Svelte).

The candidate landscape:

| Option                                  | Verdict                                                                                                                                                                                                                                                                            |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`@internationalized/date`** (chosen)  | ✅ Used in production by React Aria + React Spectrum since 2021. Framework-agnostic despite the `@internationalized` scope. 13 calendars exposed as separate exports — Gregorian-only is ~2.8 KB gzipped, full set ~8 KB. Subpath imports tree-shake. MIT, Apache-2 dual-licensed. |
| TC39 Temporal                           | ❌ Stage 4, but Safari 18 + Node 22 do not ship native — most users still need a ~20 KB polyfill. Revisit when both targets ship; React Aria has signalled the same migration path. (See [§6.8 i18n](../06-i18n.md).)                                                              |
| Luxon                                   | ❌ Gregorian-first. Non-Gregorian calendar support is an afterthought; doesn't compose with `Intl.DateTimeFormat`'s calendar extension cleanly.                                                                                                                                    |
| date-fns / dayjs                        | ❌ Gregorian-only at the core. Plugin systems exist but no clean Hijri / Buddhist / Japanese path.                                                                                                                                                                                 |
| Hand-rolled minimal calendar primitives | ❌ Hijri (especially Umm al-Qura) and Hebrew calendars require lookup tables. Re-implementing these is a 1000+ line project that an experienced i18n team has already shipped and maintained for 4+ years.                                                                         |

## Decision

Add `@internationalized/date` to `pnpm-workspace.yaml`'s `catalog:` (`^3.12.1`, the latest stable release as of 2026-05-09). It is a **peer dependency** of `@kumiki/machines` and `@kumiki/components` (the only layers that need date arithmetic) so consumers control which calendar bundles ship.

Subpath imports inside the library are intentional — Calendar machine code only imports `GregorianCalendar` and `JapaneseCalendar` for v1.0, keeping the bundle near 3 KB:

```ts
import { GregorianCalendar } from '@internationalized/date';
import { JapaneseCalendar } from '@internationalized/date';
```

Phase 2 expands to `BuddhistCalendar`, the three `Islamic*Calendar` variants, and `HebrewCalendar`, each as a separate dynamic import on the docs site so the default Calendar bundle stays small.

### v1.0 calendar scope

| Calendar              | v1.0 stable? | Why                                                                                     |
| --------------------- | :----------: | --------------------------------------------------------------------------------------- |
| Gregorian             |      ✅      | Default; required for any DatePicker.                                                   |
| Japanese imperial     |      ✅      | Maintainer's locale; era-handling is a load-bearing test for the architecture.          |
| Buddhist (Thai)       |      🟡      | Phase 2.1. Locks in once `th` locale ships in the locale-set expansion (Phase 2 §15.6). |
| Hijri (Umm al-Qura)   |      🟡      | Phase 2.1. Saudi government calendar; pairs with `ar` locale.                           |
| Hijri (Civil/Tabular) |      🟡      | Phase 2.1.                                                                              |
| Hebrew                |      🟡      | Phase 2.1. Pairs with `he` locale.                                                      |
| Persian               |      ❌      | Phase 3 — `fa` locale ships in the 20-locale expansion; matches the same release cycle. |
| Indian, Ethiopic, ROC |      ❌      | Locale demand not validated. Add as community contributions request them.               |

Shipping Gregorian + Japanese at v1.0 keeps the v1.0 Calendar bundle within budget while still validating non-Gregorian support architecturally. The Phase 2.1 expansion is a non-breaking addition (each calendar is its own subpath).

### Bundle budget impact

`@kumiki/components/calendar` budget (per `09-bundle-budget.md`) is set at **5.5 KB brotli** to accommodate Calendar + Gregorian + Japanese arithmetic. This is an _additive_ budget — `@internationalized/date` itself is a peer dep, not bundled into our package.

`@kumiki/machines/calendar` stays inside the 3 KB pure-FSM budget by importing only the two calendar classes as `import type` where possible and doing arithmetic via the calendar instance methods (which the consumer's bundle already includes).

## Consequences

**Easier:**

- 13 calendars, 5+ years of i18n battle-testing, in 30 seconds via `pnpm install`.
- React Aria's date-picker test suite is open-source and serves as a reference for our edge-case coverage (era boundaries, leap years, DST transitions).
- API stability: `@internationalized/date` has been at major v3 since 2021 with no breaking changes.

**Harder:**

- One more peer dep for users to install (`pnpm add @internationalized/date` alongside `@kumiki/components`). Documented in the Calendar / DatePicker reference pages.
- License diligence: Adobe ships under Apache-2.0; we re-license under MIT. Compatible (Apache-2.0 → MIT is a one-way fit).
- Migration story when TC39 Temporal lands in Safari + Node: we'll provide a codemod and ship Temporal-based machine variants in parallel during the deprecation window. Tracked in [`docs/design/06-i18n.md`](../06-i18n.md) §6.11.

## References

- [`@internationalized/date` documentation](https://react-spectrum.adobe.com/internationalized/date/)
- [`docs/design/06-i18n.md`](../06-i18n.md) §6.8 — calendar strategy.
- [`docs/design/15-roadmap.md`](../15-roadmap.md) §15.6 — Phase 2 components.
- [`docs/design/09-bundle-budget.md`](../09-bundle-budget.md) — Calendar / DatePicker budgets.
- TC39 Temporal: [Stage 4 progress](https://github.com/tc39/proposal-temporal).
