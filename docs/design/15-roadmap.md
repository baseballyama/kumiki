# 15 — Roadmap

## 15.1 Phase calendar (target)

| Phase                      | Window (target)         | Deliverable                                                                                                              |
| -------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **0a — Foundation**        | mid-2026, ~6 weeks      | Monorepo + CI + Layer 1 (3 primitives) + Toggle (all layers)                                                             |
| **0b — Design validation** | +6 weeks (~3 months in) | Combobox across all layers; APG-driven test harness; `with*` composition spike                                           |
| **0c — Documentation**     | +4 weeks (~4 months in) | Auto-generated docs site (bundle badges, APG links, keyboard tables); `llms.txt` + `llms-full.txt`; size comparison page |
| **1 — MVP**                | end of 2026             | Phase 1 components × 10; English-only docs site live; v1.0 published                                                     |
| **2 — Expansion**          | first half of 2027      | More components (Calendar, DatePicker, NumberField, Slider, Menu, …); locale set → 20; Layer 5 stable                    |
| **3 — Maturity**           | second half of 2027     | NVDA/VoiceOver automation production-grade; devtools (machine inspector); MCP integration; cross-framework explore       |

Dates are **targets**, not commitments. We measure progress by deliverable, not by calendar.

## 15.2 Phase 0a — Foundation (mid-2026)

**Goal:** validate the build pipeline end-to-end on the simplest possible component.

Deliverables:

- ✅ Monorepo + pnpm workspace + catalog (this scaffolding).
- ✅ CI workflow (build + test + size + publint + attw + agadoo).
- ✅ Architecture decisions (ADRs) finalized.
- 🟡 Layer 1: `focus-trap`, `dismissable`, `id` primitives — implemented + tested + published.
- 🟡 `@kumiki/runtime` — minimal FSM runtime — implemented + tested.
- 🟡 Toggle: all four layers (`machine-toggle`, `attachment-toggle`, `component-toggle`, optional `recipes-toggle` preview) — implemented + tested + published.
- 🟡 SvelteKit docs site running locally with the Toggle component embedded.
- 🟡 First publish to npm (under `0.0.x`).

Exit criteria:

- `pnpm install && pnpm build && pnpm test && pnpm size && pnpm ci:health` is green from a clean clone.
- Toggle component passes axe in LTR + RTL.
- `@kumiki/components/toggle` measures within budget.

## 15.3 Phase 0b — Design validation (+6 weeks)

**Goal:** validate the architecture on the most complex Phase 1 component.

Deliverables:

- 🟡 Combobox: all four layers — including `withAsyncSearch`, `withMultiSelect`, `withVirtualization`, `withValidation`.
- 🟡 APG-driven keyboard test harness — reads `keyboard.yaml`, emits Playwright tests.
- 🟡 `withX(withY(...))` composition end-to-end with type inference verified.
- 🟡 Stately.ai visualizer integration — Combobox JSON loadable.
- 🟡 Performance baseline measurement on Combobox.

Exit criteria:

- Combobox passes axe + APG keyboard + Guidepup smoke (manual at this stage) on macOS-VoiceOver.
- All `with*` compose pairwise with type-correct results.
- The bundle-budget number for `@kumiki/components/combobox` is achievable (≤ 4.5 KB) — not necessarily achieved yet, but the path is clear.

## 15.4 Phase 0c — Documentation (+4 weeks)

**Goal:** the docs site users will see at v1.0 launch is live.

Deliverables:

- 🟡 Per-component reference auto-generated from JSDoc + api-extractor + keyboard YAML.
- 🟡 Bundle-size badges live, tied to size-limit output.
- 🟡 `llms.txt` and `llms-full.txt` builders running on every release.
- 🟡 Size comparison page (`apps/docs/sizes/`): Kumiki vs Bits UI vs Radix vs React Aria vs Zag, on a uniform scale.
- 🟡 Search (Pagefind) live.
- 🟡 Cloudflare Pages deploy automated on every `main` push.

## 15.5 Phase 1 — MVP (end of 2026)

**Goal:** v1.0 published to npm with the Phase 1 component set.

Components in priority order:

1. **Toggle** ✅ (Phase 0a)
2. **Combobox** ✅ (Phase 0b)
3. **Switch**
4. **Checkbox** (with `mixed` state)
5. **RadioGroup**
6. **Tabs** (manual + automatic activation)
7. **Dialog** (modal + non-modal variants)
8. **Tooltip** (with delay; respects `prefers-reduced-motion`)
9. **Select** (listbox-popup style)
10. **Field/Form** (with Standard Schema validation)

Plus:

- All 10 locales shipped under `@kumiki/locale/*`.
- Layer 5 preview for Toggle and Dialog.
- `@kumiki/cli` with `kumiki add toggle | dialog` working.
- Screen-reader smoke tests automated for all 10 components on the nightly schedule.

Exit criteria for v1.0:

- All Phase 1 components meet the [Kumiki-ready checklist](05-accessibility.md#56-what-every-component-must-satisfy-at-v10).
- Bundle budgets met for every component.
- Docs site is live, search works, llms.txt and llms-full.txt are accurate.
- One outside contributor has shipped a non-trivial PR (per [01-vision.md §1.6](01-vision.md#16-what-success-looks-like-in-12-months)).

## 15.6 Phase 2 — Expansion (first half of 2027)

Components added (priority order):

- **Calendar** — using `@internationalized/date`; Gregorian + Japanese + Buddhist + Islamic + Hebrew calendars.
- **DatePicker** — Calendar + popover.
- **NumberField** — locale-aware numeric input.
- **Slider** — with two-handle range support.
- **Menu / DropdownMenu** — keyboard nav, submenus, type-ahead.
- **Accordion** — single + multi-expand.
- **Popover** — lower-level than Dialog.
- **Toast / Notification** — via live region.

Plus:

- Locale set expansion to 20.
- Layer 5 stable releases (Tailwind v4 + vanilla CSS variants for all Phase 1 components).
- Deeper Form support (FieldArray, Wizard).

## 15.7 Phase 3 — Maturity (second half of 2027)

- **Devtools** — machine inspector overlay for development builds.
- **NVDA/VoiceOver automation production-grade** — wider test surface, less flake.
- **MCP integration** — a Kumiki MCP server exposing component spec to AI assistants.
- **Cross-framework spike** — extract `@kumiki/runtime` + machines as React / Vue / Solid adapters. (Decision deferred until adoption signals justify the effort.)
- **Locale set 30+**.
- **WAI-ARIA 1.3 features** added incrementally as 1.3 lands and SR support catches up.

## 15.8 De-prioritized / explicitly deferred

| Item                           | Why deferred                                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Data Grid / virtualized tables | Significant project; not a hosted Phase 1 / 2 priority. Tracked.                                             |
| Rich text editor primitives    | Scope blow-out. Out of vision.                                                                               |
| Charting / data visualization  | Out of scope; refer users to e.g. LayerChart.                                                                |
| Drag-and-drop primitives       | Phase 3+ if at all.                                                                                          |
| Mobile / touch-specific UX     | We support touch via standard pointer events; specialized mobile patterns (swipe gestures) are out of scope. |

## 15.9 Risks

| Risk                                                                          | Mitigation                                                                                                                                             |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Single-maintainer dependency (Reach UI failure mode flagged by user research) | Start contributor onboarding from Phase 0c. Aim for one outside committer at v1.0.                                                                     |
| svelte-package + tsdown integration stalls in Phase 0a                        | Phase 0a's scope is small enough to swap to plain `svelte-package` if tsdown fails. ADR has fallback documented.                                       |
| Guidepup project pause                                                        | Manual SR testing pre-release as fallback. ADR 0005 covers this.                                                                                       |
| Bundle budgets prove too aggressive                                           | Adjust per-component in an ADR, with measurement evidence.                                                                                             |
| Svelte 5 generic inference issues delay Phase 0b                              | Scope the generics surface to outermost-only (per [08-typescript.md](08-typescript.md)); fall back to `unknown`-typed Combobox.Item if needed at v1.0. |

## 15.10 Open questions

- **TBD:** Should Phase 0a include `@kumiki/components/form-field`? Forms are a heavy part of MVP value; landing them earlier signals the integration story. Lean: no, defer to Phase 1; Toggle is the right "is the build pipeline real" signal.
- **TBD:** Whether v1.0 ships Layer 5 preview for _all_ Phase 1 components or just the two flagged. Lean: just two; the recipes API stabilizes faster with fewer surfaces.
