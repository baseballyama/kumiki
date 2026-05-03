# ADR 0006 — Locale data via subpath exports per language

**Status:** Accepted
**Date:** 2026-05

## Context

Kumiki ships locale data — translated strings for component messages (Combobox listbox label, Dialog "Close", FormField error messages, etc.). Distribution affects:

- Whether the user pays for languages they don't speak (default-bundled bytes).
- Whether dynamic language switching works without a custom build.
- Whether the locale set is extensible without a major bump.

Comparison library practice:

- **React Aria**: per-locale subpath exports (`react-aria-components/i18n/<lang>`); 30+ locales bundled but tree-shaken individually.
- **Bits UI / Melt UI**: peer-depend on `@internationalized/date`; do not ship strings of their own.
- **Headless UI**: no locale data; user provides everything.

## Decision

Locale data ships as a **single npm package** `@kumiki/locale` with **per-language subpath exports**:

```
@kumiki/locale/en
@kumiki/locale/ja
@kumiki/locale/zh-Hans
@kumiki/locale/zh-Hant
@kumiki/locale/ko
@kumiki/locale/es
@kumiki/locale/fr
@kumiki/locale/de
@kumiki/locale/ar
@kumiki/locale/he
```

A user that imports only `@kumiki/locale/ja` pulls in only Japanese data. Static analysis of `import('@kumiki/locale/${lang}')` produces one chunk per language under Vite/Rollup.

Per-language gzip budget: **≤ 1 KB**.

Initial set: **10 languages** at v1.0 (en/ja/zh-Hans/zh-Hant/ko/es/fr/de/ar/he). Phase 2 expands to 20.

## Alternatives considered

| Option                                                              | Verdict                                                                             |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **One package, per-language subpaths** (chosen)                     | ✅ Familiar to React Aria users; single source of truth; clean dynamic import       |
| One package per language (`@kumiki/locale-ja`, `@kumiki/locale-en`) | ❌ Install ceremony × 10; messy when adding languages                               |
| Bundle all locales into Layer 4 component packages                  | ❌ Every component carries every locale; bundle bloats                              |
| Defer i18n to user-land entirely (Bits UI / Melt UI shape)          | ❌ Loses the i18n competitive differentiator (per the brief and user research §4.3) |

## Consequences

**Easier:**

- Dynamic language switching is `import('@kumiki/locale/${lang}')`. No custom build step.
- Adding a language is a non-breaking minor: ship a new subpath.
- Per-language size-limit checks ensure each language stays compact.

**Harder:**

- Adding a string to one component requires touching 10 (eventually 30+) locale files. Mitigation: a CI script verifies all locales export the same shape. Missing or extra keys → fail.
- The `@kumiki/locale` package's overall size grows with each language, but the consumer pays only for what they import.

## Calendar systems (Phase 2)

Calendar / DatePicker (Phase 2) consume `@internationalized/date` as a peer dependency, which provides 13 calendar systems (Gregorian, Buddhist, Islamic — 3 variants —, Hebrew, Indian, Japanese, Persian, ROC, etc.). Each calendar is its own ES export, tree-shaken when unused.

We do **not** ship calendars in `@kumiki/locale`. They're a `@internationalized/date` concern.

## TC39 Temporal migration (deferred)

TC39 Temporal reached Stage 4 in March 2026 ([proposal-temporal](https://tc39.es/proposal-temporal/)); Firefox 139 + Chrome/Edge 144 ship. Safari and Node 22 lag. Polyfill cost is ~20 KB.

We do **not** target Temporal at v1.0 — most users would still need a polyfill. We design the calendar API to be Temporal-portable. Decision to migrate is deferred to v1.x once Safari + Node ship.

## References

- React Aria internationalization: https://react-aria.adobe.com/internationalization.html
- `@internationalized/date`: https://react-spectrum.adobe.com/internationalized/date/
- TC39 Temporal: https://tc39.es/proposal-temporal/
- User's market research §4.3 (i18n distribution).
