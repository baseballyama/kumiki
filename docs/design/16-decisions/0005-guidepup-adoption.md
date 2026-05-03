# ADR 0005 — Adopt Guidepup for screen-reader automation

**Status:** Accepted
**Date:** 2026-05

## Context

Static accessibility tools (axe-core) detect 30–40 % of WCAG violations. The remainder requires either manual screen-reader testing or automated SR drivers. Real-AT testing in CI is a competitive differentiator that no Svelte library currently offers.

[Guidepup](https://www.guidepup.dev/) automates VoiceOver (macOS) and NVDA (Windows) via its `@guidepup/playwright` adapter. It does **not** drive JAWS. There is no Linux SR target.

Limitations / risks:

- **Solo-maintained** by Craig Morten (`cmorten`); bus factor 1.
- macOS / Windows runners only — `ubuntu-latest` is not viable.
- Tests are slow (real AT speech timing), so they can't run per-PR without making CI slow and flaky.
- Recent versions: `@guidepup/playwright@0.15.x`, `@guidepup/guidepup@0.24.x` — actively released.

## Decision

We **adopt Guidepup** for nightly screen-reader smoke tests on:

- macOS-latest with VoiceOver.
- Windows-latest with NVDA.

Workflow lives in `.github/workflows/scheduled-screen-reader.yml`. Tests live alongside Playwright e2e in `apps/docs/tests/*.sr.test.ts`.

We do **not** run Guidepup on per-PR CI — too slow, too flaky on shared runners. The smoke suite is small (one or two assertions per critical user flow per Phase 1 component).

## Fallback if Guidepup stalls

If Guidepup's maintenance pauses or quality regresses:

1. Keep the existing Guidepup tests running until they break.
2. Augment with manual NVDA/VoiceOver testing pre-each-release. Document in `docs/release/SR-CHECKLIST.md` (added Phase 1).
3. Re-evaluate alternatives:
   - `@guidepup/virtual-screen-reader` (a JS-DOM SR simulator, same maintainer, smaller surface) — usable in Vitest at the controller level. May be added regardless, as fast feedback ([12-testing.md §12.14](../12-testing.md#1214-open-questions)).
   - Manual testing with documented user-flow scripts.

## Alternatives considered

| Option                                         | Verdict                                                   |
| ---------------------------------------------- | --------------------------------------------------------- |
| **Guidepup nightly** (chosen)                  | ✅ Real SR coverage, established workflow, no per-PR cost |
| **Manual SR testing only**                     | ❌ Doesn't catch regressions between releases             |
| **Wait for community-driven CI screen-reader** | ❌ No alternative is mature in May 2026                   |
| **Virtual SR (JSDOM-based) only, no real AT**  | ⚠️ Useful as supplement, insufficient as primary signal   |

## Consequences

**Easier:**

- Differentiation: "Kumiki ships nightly NVDA + VoiceOver verification" is a true and unique claim in the Svelte ecosystem.
- Compliance audit evidence: transcripts uploaded as artifacts.

**Harder:**

- macOS / Windows runner cost (modest for nightly).
- Guidepup setup quirks on macOS (Accessibility permissions). The `guidepup/setup-action` GitHub Action handles most of it; we document the rest.
- Test brittleness: SR output strings can shift across OS / SR versions. We mitigate with regex matchers and keep the suite small.

## Phase plan

- **Phase 0a**: Guidepup setup verified locally on the author's macOS.
- **Phase 0b**: First Guidepup test for Combobox passing on macOS-VoiceOver in CI.
- **Phase 1**: Smoke tests for all 10 Phase 1 components on both macOS and Windows.

## References

- Guidepup: https://www.guidepup.dev/
- `guidepup/setup-action`: https://github.com/marketplace/actions/guidepup-setup
- Maintenance health (May 2026): active, ~bi-weekly releases on `@guidepup/playwright`.
