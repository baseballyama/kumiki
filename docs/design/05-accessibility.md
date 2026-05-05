# 05 — Accessibility Strategy

## 5.1 The four pillars

Every Phase 1 component is held to four standards. None of them is sufficient alone; the combination is what makes the claim "deeply accessible" credible.

| Pillar                                | What it asserts                                                 | How we verify                                                                                    |
| ------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1. **APG conformance**                | Behavior matches the WAI-ARIA Authoring Practices Guide pattern | Each component's `.md` cites the APG URL; keyboard tests are derived from the APG keyboard table |
| 2. **axe-core in CI**                 | No detectable WCAG 2.2 AA violations in any state we test       | `@axe-core/playwright` runs on every PR against every Phase 1 component × every state we declare |
| 3. **APG-driven keyboard tests**      | Every documented keyboard interaction is exercised              | Test harness ingests a per-component YAML of the APG keyboard table and emits Playwright tests   |
| 4. **Real screen-reader smoke tests** | Components produce sensible NVDA / VoiceOver output             | Guidepup-driven tests on a nightly schedule (macOS-VoiceOver, Windows-NVDA)                      |

## 5.2 Standards we target

| Standard     | Version      | Status                                                                                                                                                                                                                             |
| ------------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **WCAG**     | 2.2 Level AA | Required at v1.0. WCAG 3.0 is a draft ([w3.org/WAI/wcag3-intro](https://www.w3.org/WAI/standards-guidelines/wcag/wcag3-intro/)); we track its progress and ensure design choices don't preclude future conformance.                |
| **WAI-ARIA** | 1.2          | Required. WAI-ARIA 1.3 is on track to land late 2026 ([WAI-ARIA 1.3 working draft](https://www.w3.org/TR/wai-aria-1.3/)) and adds `suggestion`, `comment`, refinements to `switch`. We design so 1.3 features can land additively. |
| **APG**      | Current      | Each component cites and follows the matching pattern.                                                                                                                                                                             |

We do not target WAI-ARIA 1.3 features at v1.0 — we mark the components that can later add 1.3 affordances ("1.3-ready") in their `.md`.

## 5.3 axe-core in CI — what it actually catches

axe-core detects 30–40% of WCAG violations ([Deque source, 2018+](https://www.deque.com/axe/)) — explicitly **not all of them**. We are honest about this: axe is necessary, not sufficient.

axe **catches**:

- Missing `aria-label` / `aria-labelledby` on interactive elements without text.
- Inadequate color contrast.
- Invalid ARIA attribute values.
- Missing `for` / `id` associations on form controls.
- Improperly nested headings within a region.
- Improperly grouped form fields.

axe **does not catch**:

- Whether a screen reader actually announces the right thing.
- Whether keyboard order is logical.
- Whether the focus management on a popover is intuitive.
- Whether the live region's politeness level is appropriate.
- Whether non-visual cues are sufficient when a status changes silently.

The pillars 3 (APG-driven keyboard) and 4 (Guidepup) cover the gap.

### CI configuration

```ts
// apps/docs/tests/component.a11y.test.ts (sketch)
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STATES = ['default', 'open', 'closed', 'focused', 'disabled', 'error'] as const;
const DIRECTIONS = ['ltr', 'rtl'] as const;

for (const dir of DIRECTIONS) {
  for (const state of STATES) {
    test(`combobox ${dir} ${state}`, async ({ page }) => {
      await page.goto(`/sandbox/combobox?state=${state}&dir=${dir}`);
      const results = await new AxeBuilder({ page })
        .include('[data-component="combobox"]') // also includes portal content
        .disableRules(['region']) // sandbox pages have no landmarks
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
}
```

Disabled rules are documented per-component in their `.md` with rationale.

### Known false-positives we tolerate

| Rule                                       | When it fires falsely                                                                                                                           | How we handle                                                                                       |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `color-contrast` against modal backgrounds | When a modal overlays `aria-hidden` siblings, axe still computes contrast ([axe-core #1813](https://github.com/dequelabs/axe-core/issues/1813)) | Disabled in modal-only fixtures; run separately on full-page integration tests                      |
| `region` on component-fixture pages        | Sandbox pages have no `<main>` landmark                                                                                                         | Disabled in `disableRules(['region'])` for sandbox; full landing-page test exercises landmark rules |

## 5.4 APG-driven keyboard tests

The APG keyboard tables are HTML, not JSON. We transcribe each Phase 1 component's keyboard table into a structured YAML in the component's package:

```yaml
# packages/component-combobox/keyboard.yaml
component: combobox
apg: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/#keyboardinteraction
on: input
keys:
  - key: ArrowDown
    when: closed
    expect:
      open: true
      focused: option-first
  - key: ArrowDown
    when: open
    expect:
      focused: option-next
  - key: Enter
    when: open && hasFocusedOption
    expect:
      selected: focused-option
      open: false
  - key: Escape
    when: open
    expect:
      open: false
      focused: input
  # ... entire APG keyboard table
```

A Vitest harness in Phase 0c reads this YAML and emits test cases against the running Combobox in Playwright. Adding a key the APG documents but the YAML omits → CI failure (the harness diffs against the published APG table at build time using a small scraper).

The harness lives in `packages/tooling-keyboard-test/` (Phase 0c) — not shipped to npm.

## 5.5 Screen-reader automation (Guidepup)

Real screen-reader output is the gold-standard verification. We use [Guidepup](https://www.guidepup.dev/) to drive **VoiceOver on macOS** and **NVDA on Windows**.

| What we automate                                                                                                  | What we don't                                                    |
| ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Smoke tests: open Combobox, type, verify SR speaks "results updated, 3 results, navigate with up and down arrows" | JAWS (Guidepup doesn't drive JAWS; we test manually pre-release) |
| Critical user flows for Phase 1 components on macOS-VoiceOver and Windows-NVDA                                    | Linux (no first-class supported SR)                              |
| Schedule: nightly + on-demand via `workflow_dispatch`                                                             | Per-PR (too slow; flake-prone; macOS runner cost)                |

**Risk accepted:** Guidepup is solo-maintained ([Craig Morten / @cmorten](https://github.com/cmorten)). If it stalls, we fall back to manual NVDA / VoiceOver testing pre-release. We track maintenance health and document the fallback in [16-decisions/0005-guidepup-adoption.md](16-decisions/0005-guidepup-adoption.md).

### Guidepup test sketch

```ts
// apps/docs/tests/combobox.sr.test.ts
import { voTest, expect } from '@guidepup/playwright';

voTest('VoiceOver announces filtered results count', async ({ page, voiceOver }) => {
  await page.goto('/sandbox/combobox');
  await voiceOver.interact();
  await voiceOver.next(); // focuses the input
  await voiceOver.type('al');
  // Assert that VO has spoken something containing "3 results" within 2s.
  await voiceOver.waitForSpoken(/3 results/, { timeout: 2000 });
});
```

### Guidepup output as artifact

Each scheduled SR run uploads a transcript to GitHub Actions artifacts (retention 14 days). Failures attach the relevant transcript snippet to the PR / issue.

## 5.6 What every component must satisfy at v1.0

A component is "Kumiki-ready" only when **all** are true:

- [ ] APG link in its `.md`, with the matching pattern name.
- [ ] All keys in the APG keyboard table are implemented and tested.
- [ ] Default `aria-*` attributes match the APG.
- [ ] axe-core passes for every documented state in LTR and RTL.
- [ ] Required accessible name is enforced at the type level (e.g. `Dialog.Root` requires `title` or `aria-label`).
- [ ] `:focus-visible` is supported (we set no `outline: none` defaults).
- [ ] `prefers-reduced-motion` is honored where the component animates conceptually (e.g. autoscroll).
- [ ] `prefers-contrast` is documented as an integration concern (recipes use it; library doesn't paint).
- [ ] Screen-reader smoke test passes on macOS-VoiceOver and Windows-NVDA.

The component's `.md` (under `docs/components/`) is the canonical evidence.

## 5.7 Type-level a11y enforcement — examples

We push as much as possible into the type system. Examples:

```ts
// @kumiki/components/dialog — Root requires an accessible name.
type DialogRootProps =
  | { title: string; children: Snippet }
  | { 'aria-label': string; children: Snippet }
  | { 'aria-labelledby': string; children: Snippet };
```

The TS error on `<Dialog.Root>` with neither `title`, `aria-label`, nor `aria-labelledby` is the first-class user feedback. The brief calls this out as a goal in Section 7.4.

```ts
// @kumiki/components/tooltip — Tooltip requires a non-empty trigger label.
// Tooltip itself doesn't add an accessible name; the trigger must already have one.
type TooltipTriggerProps = {
  children: Snippet; // user controls text or icon+aria-label
  // No way to make 'must have an accessible name' compile-time without parsing the snippet's
  // output. We compromise: dev-time runtime check in development build that warns
  // if the trigger has no accessible name.
};
```

Where types can't enforce, we add a development-only runtime check that warns. These checks tree-shake out in production.

## 5.8 RTL is an a11y concern

RTL bugs are a11y bugs for half a billion users. Coverage:

- Every component's a11y test runs in both `dir="ltr"` and `dir="rtl"` (sandbox URL `?dir=rtl`).
- Keyboard logic that depends on physical direction (Combobox: `ArrowLeft` should _not_ move within a horizontal Tabs group's RTL layout) is encoded in the machine, not the controller. The machine reads `direction` from `@kumiki/primitives/locale`.
- We test combinations that historically break: Tabs in RTL with `ArrowLeft`/`ArrowRight`, RadioGroup in RTL, Slider in RTL.

Reference: [react-aria's RTL keyboard handling notes](https://react-aria.adobe.com/internationalization.html#rtl-locales).

## 5.9 Reduced motion / contrast

We expose two utilities from `@kumiki/primitives/motion`:

```ts
export function prefersReducedMotion(): boolean; // true if user has set the OS pref
export function prefersContrast(): 'no-preference' | 'more' | 'less' | 'custom';
```

Components that can perform meaningful motion (autoscroll on Combobox arrow navigation, Dialog overlay fade) consult `prefersReducedMotion()` and short-circuit the motion. The library does not impose contrast — that is a Layer 5 / theme concern.

## 5.10 What we _don't_ claim

- We don't claim WCAG 2.2 AAA.
- We don't claim accessibility for **animations users supply themselves**. If a user wires a 4 Hz flicker into Dialog's transition, we cannot save them.
- We don't claim conformance with regional standards beyond WCAG (e.g. EN 301 549, Section 508). They tend to wrap WCAG; if a customer needs an audit referencing them, we provide our axe / Guidepup transcripts as raw evidence.

## 5.11 Open questions

- **TBD:** Is `jest-axe` (in Vitest) worth adding as a parallel signal alongside `@axe-core/playwright`? It runs faster but has worse coverage of portal content. Lean: no, adding a second a11y harness has maintenance cost. Re-evaluate if axe-Playwright's portal flakes return.
- **TBD:** Whether to publish a "Kumiki a11y scorecard" as a public dashboard linking the latest axe + Guidepup results per component. High-signal trust artifact, low-cost to build, but maintenance overhead. Defer to v1.1.
