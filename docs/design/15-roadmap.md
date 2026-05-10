# 15 — Roadmap

## 15.1 Phase calendar (target)

| Phase                      | Window (target)         | Deliverable                                                                                                              |
| -------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **0a — Foundation**        | mid-2026, ~6 weeks      | Monorepo + CI + Layer 1 (3 primitives) + Toggle (all layers)                                                             |
| **0b — Design validation** | +6 weeks (~3 months in) | Combobox across all layers; APG-driven test harness; `with*` composition spike                                           |
| **0c — Documentation**     | +4 weeks (~4 months in) | Auto-generated docs site (bundle badges, APG links, keyboard tables); `llms.txt` + `llms-full.txt`; size comparison page |
| **1 — MVP**                | end of 2026             | Phase 1 components × 10; English-only docs site live; v1.0 published                                                     |
| **2 — Expansion**          | first half of 2027      | More components (Calendar, DatePicker, NumberField, Slider, Menu, …); locale set → 20                                    |
| **3 — Maturity**           | second half of 2027     | NVDA/VoiceOver automation production-grade; devtools (machine inspector); MCP integration; cross-framework explore       |

Dates are **targets**, not commitments. We measure progress by deliverable, not by calendar.

## 15.2 Phase 0a — Foundation (mid-2026)

**Goal:** validate the build pipeline end-to-end on the simplest possible component.

Deliverables:

- ✅ Monorepo + pnpm workspace + catalog (this scaffolding).
- ✅ CI workflow (build + test + size + publint + attw + agadoo).
- ✅ Architecture decisions (ADRs) finalized.
- ✅ Layer 1: `focus-trap`, `dismissable`, `id` primitives — plus `collection`, `interactions`, `live-region`, `motion`, `portal`, `locale` — implemented + tested.
- ✅ `@kumiki/runtime` — minimal FSM runtime — implemented + tested + benchmarked.
- ✅ Toggle: all four layers (`@kumiki/machines/toggle`, `@kumiki/headless/toggle`, `@kumiki/components/toggle`, `@kumiki/atelier/toggle`) — implemented + tested.
- ✅ SvelteKit docs site running locally with the Toggle component embedded.
- 🟡 First publish to npm (under `0.0.x`) — packages locally publishable, public 0.0.x publish pending v1.0 launch sequence.

Exit criteria:

- `pnpm install && pnpm build && pnpm test && pnpm size && pnpm ci:health` is green from a clean clone.
- Toggle component passes axe in LTR + RTL.
- `@kumiki/components/toggle` measures within budget.

## 15.3 Phase 0b — Design validation (+6 weeks)

**Goal:** validate the architecture on the most complex Phase 1 component.

Deliverables:

- ✅ Combobox: all four layers — including `withAsyncSearch`, `withMultiSelect`, `withVirtualization`, `withValidation`.
- ✅ APG-driven keyboard test harness — reads `keyboard.yaml` (`apps/docs/keyboard/`), emits Playwright tests via `scripts/check-apg-snapshots.mjs`.
- ✅ `withX(withY(...))` composition end-to-end with type inference verified (`@kumiki/headless/combobox/with-*`).
- ✅ Stately.ai visualizer integration — `createXMachine().toJSON()` produces XState-compatible config.
- ✅ Performance baseline measurement on Combobox (`combobox.bench.ts`).

Exit criteria:

- Combobox passes axe + APG keyboard + Guidepup smoke (manual at this stage) on macOS-VoiceOver.
- All `with*` compose pairwise with type-correct results.
- The bundle-budget number for `@kumiki/components/combobox` is achievable (≤ 4.5 KB) — not necessarily achieved yet, but the path is clear.

## 15.4 Phase 0c — Documentation (+4 weeks)

**Goal:** the docs site users will see at v1.0 launch is live.

Deliverables:

- ✅ Per-component reference auto-generated from JSDoc + api-extractor + keyboard YAML (TypeDoc + `apps/docs/keyboard/`).
- 🟡 Bundle-size badges live, tied to size-limit output — L1〜L3 wired; L4 / Atelier still ungated (see [`v1-execution-plan` A-2 / C-4](../release/v1-execution-plan.md)).
- ✅ `llms.txt` and `llms-full.txt` builders running on every build (`apps/docs/scripts/build-llms-full.mjs`, output under `apps/docs/static/`).
- 🟡 Size comparison page (`apps/docs/sizes/`): scaffolded, public publish pending — see [`v1-execution-plan` D-2](../release/v1-execution-plan.md).
- ✅ Search (Pagefind) live (`postbuild` hook in `apps/docs/package.json`).
- ✅ Cloudflare Pages deploy automated on every `main` push (`@sveltejs/adapter-cloudflare` + `.github/workflows/docs.yml`).

## 15.5 Phase 1 — MVP (end of 2026)

**Goal:** v1.0 published to npm with the Phase 1 component set.

Components in priority order:

1. **Toggle** ✅ (Phase 0a) — all layers shipped.
2. **Combobox** ✅ (Phase 0b) — all layers + `with*` shipped.
3. **Switch** ✅ — all layers shipped.
4. **Checkbox** ✅ (with `mixed` state) — all layers shipped.
5. **RadioGroup** ✅ — all layers shipped.
6. **Tabs** ✅ (manual + automatic activation) — all layers shipped.
7. **Dialog** ✅ (modal + non-modal variants) — all layers shipped.
8. **Tooltip** ✅ (with delay; respects `prefers-reduced-motion`) — all layers shipped.
9. **Select** ✅ (listbox-popup style) — all layers shipped.
10. **Field/Form** ✅ (with Standard Schema validation) — all layers shipped.

Plus:

- ✅ All 10 locales shipped under `@kumiki/locale/<lang>` (`en`, `ja`, `zh-Hans`, `zh-Hant`, `ko`, `es`, `fr`, `de`, `ar`, `he`).
- ✅ Layer 5 (Atelier) shipped for **all** Phase 1 components — promoted to GA at v1.0 per [ADR 0017](16-decisions/0017-atelier-ga-at-v1.md) (supersedes ADR 0010's "preview only Toggle + Dialog" plan).
- 🟡 `@kumiki/cli` with `kumiki add toggle | dialog` working — see [`v1-execution-plan` C-6](../release/v1-execution-plan.md) for the full-coverage validation gate.
- 🟡 Screen-reader smoke tests automated for all 10 components on the nightly schedule — workflow at `.github/workflows/scheduled-screen-reader.yml`, public log handoff pending (plan A-2 a11y Guidepup row).

Exit criteria for v1.0:

- All Phase 1 components meet the [Kumiki-ready checklist](05-accessibility.md#56-what-every-component-must-satisfy-at-v10).
- Bundle budgets met for every component.
- Docs site is live, search works, llms.txt and llms-full.txt are accurate.
- One outside contributor has shipped a non-trivial PR (per [01-vision.md §1.6](01-vision.md#16-what-success-looks-like-in-12-months)).

## 15.5b Phase 1.5 — Primitive completion (early 2027)

**Goal:** close the gap between v1.0 and the "we can replace a real
business design system" bar. Driven by an external migration target
that exposed the gaps in the Phase 1 set (see
[`docs/design/17-integration-boundaries.md`](17-integration-boundaries.md)).
The full handoff for the migration work is at
[`docs/migrations/flyle-nexus.md`](../migrations/flyle-nexus.md).

Components added (priority order):

1. **Button** — primary/secondary/ghost slots, loading state (`aria-busy`), icon snippet.
2. **IconButton** — accessible-name enforced at type level (per ADR 0014).
3. **Alert / Banner** — `role="status"` / `role="alert"`, severity, dismissible variant.
4. **Badge** — non-interactive surface, `aria-label` when count-only.
5. **Avatar / AvatarGroup** — image fallback, decorative-by-default.
6. **Chips / Tag** — non-interactive + dismissible variants.
7. **Breadcrumb** — `nav[aria-label="Breadcrumb"]`, `aria-current="page"`.
8. **Pagination** — `nav[aria-label]`, page-button + prev/next + ellipsis.
9. **LoadingSpinner** — `role="status"`, `prefers-reduced-motion`.
10. **DefinitionList** / **HorizontalRule** / **PageHeader** / **Text** — semantic-only Layer 4 primitives (cheap to ship together).
11. **Table** (semantic) — see [ADR 0015](16-decisions/0015-table-primitive-scope.md). Sort, select, tree rows, sticky header. **No virtualization, no cell-edit.**
12. **Toolbar** — APG `toolbar` pattern, roving tabindex. Used by editor consumers (per [ADR 0016](16-decisions/0016-editor-dnd-out-of-scope.md)).

Plus variant additions to Phase 1 components:

- **Dialog → Drawer** — side-positioning variant (left/right/top/bottom).
- **Combobox → withMultiSelect** — multi-select + chip rendering.
- **Toggle → Toggle.Group** — `role="group"` with multi or radio mode.
- **DatePicker → TimePicker / DateTimeField** — locale-aware time-of-day.
- **Popover → Popconfirm pattern** — recipe (popover + button + i18n string).

Exit criteria:

- All 12 new components meet the Kumiki-ready checklist.
- Bundle budgets met (logged in `09-bundle-budget.md`).
- flyle-nexus has at least one production page running fully on kumiki.

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
- Deeper Form support (FieldArray, Wizard).
- _Layer 5 (Atelier) is GA at v1.0 per [ADR 0017](16-decisions/0017-atelier-ga-at-v1.md); no separate "Layer 5 stable" milestone in Phase 2._

## 15.7 Phase 3 — Maturity (second half of 2027)

- **Devtools** — machine inspector overlay for development builds.
- **NVDA/VoiceOver automation production-grade** — wider test surface, less flake.
- **MCP integration** — a Kumiki MCP server exposing component spec to AI assistants.
- **Cross-framework spike** — extract `@kumiki/runtime` + machines as React / Vue / Solid adapters. (Decision deferred until adoption signals justify the effort.)
- **Locale set 30+**.
- **WAI-ARIA 1.3 features** added incrementally as 1.3 lands and SR support catches up.

## 15.8 De-prioritized / explicitly deferred

| Item                                  | Why                                                                                                                                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Data Grid (virtualization, cell-edit) | Deferred to Phase 3 with measured demand. Semantic `<table>` (sortable headers, row select, tree rows) is **in scope** — see [ADR 0015](16-decisions/0015-table-primitive-scope.md). |
| Rich-text editor primitives           | **Permanently out of scope.** See [ADR 0016](16-decisions/0016-editor-dnd-out-of-scope.md). Consumers compose tiptap / Lexical / ProseMirror with kumiki Toolbar + Toggle.           |
| Drag-and-drop primitives              | **Permanently out of scope.** See [ADR 0016](16-decisions/0016-editor-dnd-out-of-scope.md). Consumers compose dnd-kit-svelte / sortablejs.                                           |
| `@kumiki/icons` package               | **Permanently out of scope.** Icons are consumer-supplied via snippets — see [ADR 0014](16-decisions/0014-icon-strategy.md).                                                         |
| Charting / data visualization         | Out of scope; refer users to e.g. LayerChart.                                                                                                                                        |
| Mobile / touch-specific UX            | We support touch via standard pointer events; specialized mobile patterns (swipe gestures) are out of scope.                                                                         |

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
- **Resolved (2026-05):** Whether v1.0 ships Layer 5 preview for _all_ Phase 1 components or just the two flagged. Decision: ship Atelier **GA** for all Phase 1 + Phase 1.5 components per [ADR 0017](16-decisions/0017-atelier-ga-at-v1.md). The CSS-variable contract ([18-css-variable-contract.md](18-css-variable-contract.md)) became the API boundary that lets us stabilize all surfaces simultaneously.
