# 01 — Vision, Goals & Non-Goals

## 1.1 The opportunity

By 2026 the Svelte ecosystem has two production-grade headless libraries — **Bits UI** (Svelte 5 native, Radix-style API) and **Melt UI** (builder pattern). Both are excellent at what they do. Neither matches the depth that the React ecosystem gets when it combines **Radix's** API design, **React Aria's** a11y/i18n, and **Zag.js's** state-machine separation.

Specifically, no Svelte library today:

- ships **per-locale subpath exports** for tree-shakeable i18n (React Aria does; `@kumiki/locale/ja` will);
- runs **real screen-reader automation** (NVDA / VoiceOver) in CI (Melt UI runs `jest-axe`; React Aria publishes a manual SR matrix; nobody automates it on every PR);
- uses **finite state machines** that can be inspected, exported to a visualizer, and tested independently of any framework (Zag does in the React/Vue/Solid worlds; nothing does it Svelte-natively);
- enforces a **hard gzipped bundle budget** per component (per-package `size-limit` config gates every PR).

**Kumiki's bet:** by combining all four into one Svelte 5 library, we make the design-system layer for ambitious Svelte teams a strictly better choice than mixing Bits UI + hand-rolled a11y plumbing + manual i18n.

## 1.2 Vision statement

> A Svelte 5 team picking up Kumiki should be able to ship an enterprise-grade design system — RTL, multilingual, screen-reader-friendly, surgically lean — **without leaving the library**. Where they currently bolt on `@internationalized/date`, Floating UI, and a hand-rolled `useFormField`, they import a single named export from `@kumiki/*`.

## 1.3 Target users

| Audience                                | Primary need Kumiki solves                                                                         |
| --------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Enterprise / public-sector Svelte teams | WCAG 2.2 AA compliance with auditable evidence (axe-core CI logs, SR transcripts, APG citations)   |
| Global product teams (CJK + RTL)        | Locale data that is small, lazy, and includes non-Gregorian calendars                              |
| Performance-sensitive product teams     | Per-component bundle budgets enforced in CI                                                        |
| Design-system platform teams            | A composable foundation that survives generic refactors and avoids Radix-style React-coupled hooks |

Out of scope (audience): users who want a styled component library day-one — Layer 5 (recipes) is a v1.0 _preview_, not the headline. See [`14-versioning-release.md`](14-versioning-release.md) for the preview policy.

## 1.4 Goals

The brief enumerates seven (A–G); restated here in priority order with the acceptance criterion that ends each one. A goal is **"satisfied"** only when its criterion holds.

### G1 — Surgical bundle sizes

The headline number for users. Crystallized in [`09-bundle-budget.md`](09-bundle-budget.md).

**Acceptance:** every Phase 1 component's Layer 4 gzipped size at v1.0 release is at or below the published budget. Combobox ≤ 4.5 KB, Dialog ≤ 3.5 KB, Toggle ≤ 1.5 KB. Verified by `size-limit` running in CI and by an independent reproduction in a fresh Vite project published with `apps/docs/sizes/`.

### G2 — A11y depth

The hardest claim to verify and the highest-value differentiation. See [`05-accessibility.md`](05-accessibility.md).

**Acceptance:** every Phase 1 component (a) cites the matching APG pattern in its `.md`, (b) passes `axe-core` in every state × theme × direction we care about, (c) passes a published Guidepup smoke test on macOS-VoiceOver and Windows-NVDA on the nightly schedule.

### G3 — i18n / RTL / non-Gregorian calendars

Differentiation against Bits UI, Melt UI, and Headless UI. See [`06-i18n.md`](06-i18n.md).

**Acceptance:** ten locales ship at v1.0; each loads ≤ 1 KB gzipped; RTL navigation tests pass for `ar` and `he`; Calendar/DatePicker (Phase 2) exports Gregorian, Islamic, Buddhist, Japanese, Hebrew calendars as separate dynamic imports.

### G4 — State machines as the source of truth

Differentiation against Bits UI (which uses runes directly) and from React Aria (which couples logic to React). See [`04-state-machines.md`](04-state-machines.md).

**Acceptance:** every component's logic exists as a pure-TS machine in `@kumiki/machine-*`. Each machine can be exercised in Vitest with no DOM. Each machine exports an XState-compatible JSON config consumable by stately.ai's visualizer.

### G5 — Form / validation integration via Standard Schema

The form story is the wedge for adoption inside enterprise apps. See [`07-form-validation.md`](07-form-validation.md).

**Acceptance:** `@kumiki/component-form-field` accepts any `StandardSchemaV1` validator; the same code runs against Zod 3.24+, Valibot 1.x, ArkType 2.0+, Effect Schema 3.x without per-validator adapters; `aria-invalid` / `aria-describedby` / live-region wiring is automatic.

### G6 — Compound API + generic type propagation

The DX the user feels. See [`08-typescript.md`](08-typescript.md).

**Acceptance:** `Combobox.Root<User>` propagates `User` to `Combobox.Item`'s `value` prop and to the `child` snippet payload. No `as` casts in user code in the canonical examples. The strict-bindings rule (Svelte 5) and inference quirks ([sveltejs/svelte#11356](https://github.com/sveltejs/svelte/issues/11356)) are documented and worked around at the library boundary.

### G7 — LLM-friendly distribution

A growing share of Svelte adoption is mediated by AI assistants. See [`13-docs-strategy.md`](13-docs-strategy.md).

**Acceptance:** `llms.txt` and `llms-full.txt` ship at v1.0 with stable URLs. JSDoc on every public type includes "When to use", "Anti-pattern", and the matching APG link. Layer 5 recipes are copy-paste-friendly under `kumiki add <component>`.

## 1.5 Non-goals (v1.0)

Reproduced from the brief Section 3 with rationales:

| Non-goal                           | Why we're saying no                                                                                                                                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React / Vue / Solid adapters       | Svelte 5 idioms (runes + attachments + snippets) are central to the API. Cross-framework requires a Zag-style imperative core, which is a different library. Revisit post-v1.0. |
| Style libraries / Tailwind presets | A separate ecosystem layer. Layer 5 recipes (preview) are the bridge.                                                                                                           |
| App-level state management         | Component state only. Storing a user's session in `@kumiki/runtime` is out of scope.                                                                                            |
| Animation engines                  | We emit `data-state="open\|closed\|opening\|closing"`. Users compose Svelte transitions, View Transitions API, motion libraries. See [02-architecture.md](02-architecture.md).  |
| Material / iOS HIG conformance     | Headless. Recipes can implement them; the core won't.                                                                                                                           |

## 1.6 What success looks like in 12 months

If Kumiki has achieved the vision, by mid-2027:

- A new Svelte enterprise project's design system starts with `pnpm add @kumiki/component-*` and a `kumiki add` invocation, then layers brand styles on top.
- The "should we use Bits UI or Kumiki" question reduces to "do you need RTL / non-Gregorian calendars / Standard Schema form integration / a tighter bundle budget?" — if yes, Kumiki.
- One non-Anthropic / non-author contributor has shipped a non-trivial PR, demonstrating that the contribution model isn't single-maintainer-dependent (the Reach UI failure mode flagged in the user's market research).

## 1.7 Risks to the vision

These are tracked here at high level and detailed in the relevant section.

| Risk                                                                               | Section that mitigates                                                                                                         |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Svelte 5 generic inference is "slow and inconsistent" for deeply nested components | [08-typescript.md](08-typescript.md) — design boundary keeps generics at the outer-most user-facing component                  |
| svelte-package + tsdown integration is unproven for our scale                      | [03-package-structure.md](03-package-structure.md), [16-decisions/0009-tsdown-bundler.md](16-decisions/0009-tsdown-bundler.md) |
| Guidepup is solo-maintained; bus factor 1                                          | [05-accessibility.md](05-accessibility.md), [16-decisions/0005-guidepup-adoption.md](16-decisions/0005-guidepup-adoption.md)   |
| Bundle budgets are aspirational vs measured competitors                            | [09-bundle-budget.md](09-bundle-budget.md)                                                                                     |
| WAI-ARIA 1.3 ships in Q3 2026; we target 1.2                                       | [05-accessibility.md](05-accessibility.md) — 1.3-ready posture                                                                 |
