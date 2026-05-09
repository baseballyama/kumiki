# Kumiki

> Headless, composable, deeply accessible UI primitives for **Svelte 5** — built on framework-agnostic state machines, with surgical bundle sizes and CI-enforced a11y / i18n / size budgets.

**Status: pre-alpha (preview), code-side v1.0 complete.** All 18 Phase 1 + Phase 2 components ship end-to-end (machine + headless + component + sandbox + e2e + axe + APG keyboard contract + screen-reader smoke). 720 unit tests, 86 APG keyboard cases, 19 SR smoke cases, 10 locales — every gate green. Nothing is published to npm yet; what's left is maintainer-only registry / hosting setup. See [`STATUS.md`](STATUS.md).

## Why Kumiki?

Pick Kumiki when **any one** of the following matters more than "I want a styled component library tomorrow":

### 1. You're shipping to users who don't read English (and you mean it)

Most Svelte component libraries treat i18n as "translate the strings." Kumiki treats it as a first-class architectural concern:

- **Per-locale subpath imports** — `@kumiki/locale/ja` loads only Japanese, **133–289 B brotli per locale** (budget: 1 KB). Ten locales ship at v1.0: `en`, `ja`, `zh-Hans`, `zh-Hant`, `ko`, `es`, `fr`, `de`, `ar`, `he`.
- **RTL navigation belongs in the machine, not the consumer.** Tabs `ArrowRight`/`ArrowLeft`, Slider direction, Combobox typeahead — all read `direction` from machine context, so swapping locales flips behavior without code changes.
- **Non-Gregorian calendars without a separate dependency.** Calendar / DatePicker ship with Gregorian + Japanese imperial at v1.0 (per ADR 0013); Buddhist / Hijri / Hebrew arrive incrementally as additive imports — your bundle stays the same size if you don't use them.

No other Svelte library does all three. React Aria does; Bits UI and Melt UI don't.

### 2. You owe someone a WCAG 2.2 AA audit

Accessibility is the hardest claim to verify. Kumiki backs it with four layered checks, each running in CI:

| Pillar                    | What it asserts                           | How                                                         |
| ------------------------- | ----------------------------------------- | ----------------------------------------------------------- |
| APG conformance           | Behavior matches the WAI-ARIA APG pattern | Per-component `.md` cites the APG URL; reviewed at PR time  |
| axe-core in CI            | No WCAG 2.2 AA violations                 | `@axe-core/playwright` × LTR / RTL × every documented state |
| APG-driven keyboard tests | Every documented key works                | YAML-driven harness, **86 cases across 18 components**      |
| Real screen-reader output | NVDA / VoiceOver say sensible things      | Guidepup matrix on macOS-VoiceOver + Windows-NVDA, nightly  |

axe alone catches ~30–40% of WCAG violations ([Deque](https://www.deque.com/axe/)). The other 60% comes from the keyboard harness and Guidepup. Kumiki is the only Svelte library running all four.

### 3. You measure your bundle in bytes, not megabytes

Bundle budgets aren't aspirational — they're a **hard CI gate** (`size-limit` per subpath, brotli, fails the build):

| Subpath                     | Measured  | Budget |
| --------------------------- | --------- | ------ |
| `@kumiki/runtime`           | 676 B     | 1 KB   |
| `@kumiki/primitives/locale` | 133 B     | 500 B  |
| `@kumiki/machines/toggle`   | 399 B     | 500 B  |
| `@kumiki/machines/combobox` | 1.16 KB   | 3 KB   |
| `@kumiki/headless/calendar` | 1.21 KB   | 1.5 KB |
| `@kumiki/locale/<lang>`     | 197–289 B | 1 KB   |

Adjusting a budget upward requires a new ADR with measurement evidence. No `--ignore` flags allowed on `publint` / `attw` / `agadoo` / `size-limit`. Cross-library comparison lives at `/sizes/compare` in the docs site.

### 4. You want logic you can reason about, not a closed runtime

Every component is a **pure-TS finite state machine** in `@kumiki/machines/<name>`. No DOM, no Svelte import, no framework coupling. You can:

- run them in Node / server validation contexts unchanged;
- export an XState-compatible JSON config to [stately.ai/viz](https://stately.ai/viz) for visual inspection;
- exercise them in plain Vitest with `environment: 'node'` (no jsdom);
- port them to another framework — the machine is the source of truth, attachments are the renderer.

The minimal FSM runtime at `@kumiki/runtime` is **676 B brotli**. Not XState, not Zag — purpose-built for this size budget.

### 5. You want forms that work with any validator, today and in five years

`@kumiki/components/form-field` accepts any [Standard Schema v1](https://standardschema.dev) validator. The same component works with **Zod, Valibot, ArkType, Effect Schema** — no per-validator adapter, no version pinning. `aria-invalid` / `aria-describedby` / live-region wiring is automatic.

### 6. You want to compose features instead of paying for them

Optional behavior is a separate subpath that tree-shakes when not imported:

- `@kumiki/headless/combobox/with-validation` — Standard Schema validator (≤ 750 B)
- `@kumiki/headless/combobox/with-async-search` — abort-aware fetcher (≤ 750 B)
- `@kumiki/headless/combobox/with-multi-select` — `selected: T[]` (≤ 750 B)
- `@kumiki/headless/combobox/with-virtualization` — viewport-windowed listbox (≤ 750 B)

Total optional surface for Combobox: **1.77 KB**. Pay only for the features you use.

---

The name comes from **kumiki** (組木), the Japanese woodworking technique that joins parts by their shape alone — without nails or glue. Kumiki the library carries the same spirit: the parts are composable enough that nothing extra is needed to hold them together.

## What ships today

| Surface                   | Count                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| Phase 1 components        | 10 — Toggle, Switch, Combobox, Checkbox, RadioGroup, Tabs, Dialog, Tooltip, Select, Field/Form |
| Phase 2 components        | 8 — Slider, Accordion, NumberField, Popover, Toast, Menu, Calendar, DatePicker                 |
| Combobox composition      | 4 — `withValidation`, `withAsyncSearch`, `withMultiSelect`, `withVirtualization`               |
| Locales                   | 10                                                                                             |
| Atelier preview (Layer 5) | Toggle, Dialog (Tailwind v4 + vanilla CSS variants)                                            |
| Unit tests                | **720**                                                                                        |
| APG keyboard cases        | **86**                                                                                         |
| Screen-reader smoke cases | **19** across 18 components                                                                    |
| Microbenchmarks           | 109                                                                                            |

Every component goes through the full pipeline: **machine + attachment + component + sandbox + e2e + axe + APG keyboard + SR smoke**. See [`STATUS.md`](STATUS.md) for the live snapshot.

## Quick start (preview API — not yet on npm)

Kumiki ships as **9 per-layer packages** with subpaths per component (see [ADR 0012](docs/design/16-decisions/0012-package-consolidation.md)). Pick the layer that fits your workflow:

```bash
# Full Svelte UI (default user surface):
pnpm add @kumiki/components

# Headless — own DOM markup, take the behavior:
pnpm add @kumiki/headless

# Pure FSM, no DOM (server validation, framework ports):
pnpm add @kumiki/machines

# Copy-paste styled variants (Atelier, like shadcn-svelte):
pnpm add -D @kumiki/cli @kumiki/atelier@preview
npx kumiki add toggle           # Tailwind v4 default
npx kumiki add dialog --variant=vanilla
```

### Layer 4 — compound components (default)

```svelte
<script lang="ts" generics="T extends { id: string; label: string }">
  import { Combobox } from '@kumiki/components';
  import { withValidation } from '@kumiki/headless/combobox/with-validation';
  import { z } from 'zod';

  let { options }: { options: T[] } = $props();
  let value = $state<T | null>(null);

  const cb = withValidation(z.object({ id: z.string() }));
</script>

<Combobox.Root bind:value {options} {...cb}>
  <Combobox.Input placeholder="Search…" />
  <Combobox.Listbox>
    {#snippet item(opt)}
      <Combobox.Item value={opt}>{opt.label}</Combobox.Item>
    {/snippet}
  </Combobox.Listbox>
</Combobox.Root>
```

### Layer 3 — attachments (own your markup)

```svelte
<script lang="ts">
  import { createCombobox } from '@kumiki/headless/combobox';
  const cb = createCombobox({ options });
</script>

<input {@attach cb.input} />
<ul {@attach cb.listbox}>
  {#each cb.filtered as opt}
    <li {@attach cb.option(opt)}>{opt.label}</li>
  {/each}
</ul>
```

### Layer 2 — pure machine (no DOM)

```ts
import { createComboboxMachine } from '@kumiki/machines/combobox';
const machine = createComboboxMachine({ options });
machine.send({ type: 'INPUT.CHANGE', value: 'hello' });
console.log(machine.state, machine.derived.filtered);
```

## Repository layout

```text
packages/
  core/
    primitives/               @kumiki/primitives — focus-trap, dismissable, id, locale, …
    locale/                   @kumiki/locale — dynamically importable per language
    runtime/                  @kumiki/runtime — minimal FSM (676 B brotli)
    types/                    @kumiki/types — shared TS types
  machines/                   @kumiki/machines (Layer 2) — subpath per component
  headless/                   @kumiki/headless (Layer 3) — subpath per component
                              + @kumiki/headless/combobox/with-* composition subpaths
  components/                 @kumiki/components (Layer 4) — subpath + dot-namespace barrel
  atelier/                    @kumiki/atelier (Layer 5 preview) — Tailwind v4 + vanilla
  tooling/
    cli/                      @kumiki/cli — `kumiki add` binary
apps/
  docs/                       SvelteKit docs site (Pagefind search, /api, /sizes, /sizes/compare)
docs/                         Architecture design docs + ADRs
references/                   Competitor source as shallow git submodules (opt-in)
```

> 9 packages total. Each layer is one published package; components live as
> subpaths (`@kumiki/machines/toggle`, `@kumiki/components/toggle`, …).
> Subpath imports tree-shake on every bundler; the dot-namespace barrel
> (`import { Toggle } from '@kumiki/components'`) ships alongside.

## CI gates (all must pass on every PR)

- **Format / lint / typecheck** — oxfmt, oxlint, TS strict, svelte-check.
- **Layering** — Layer N may not depend on Layer >N (`scripts/check-layering.mjs`).
- **Locale shape** — all 10 locale files keep identical shape.
- **Node compat** — Layers 1–3 import without DOM globals.
- **API report drift** — `.api.md` checked into the tree.
- **Coverage** — 80% lines / 65% branches / 60% funcs / 80% statements.
- **Distribution health** — `publint` + `arethetypeswrong` + `agadoo` (side-effect honesty) + `size-limit` (brotli budget per subpath).
- **Browser e2e + axe** — LTR + RTL × every documented state.
- **APG keyboard harness** — 86 cases across 18 components.
- **Screen-reader smoke** — role + accessible-name on 18 components.
- **Lighthouse CI** — 5 docs pages, a11y ≥ 0.95.
- **Nightly** — Guidepup VoiceOver + NVDA matrix; APG snapshot drift.

Going over a bundle budget is a build failure. **Never** add `--ignore` flags to the health gates.

## Documentation

- **Live docs** — SvelteKit site under `apps/docs/` (Pagefind search; `/api` TypeDoc reference; `/sizes` + `/sizes/compare` for measured bundles).
- **AI-friendly** — `/llms.txt` and `/llms-full.txt` published with stable URLs.
- **Design overview** — [docs/design.md](docs/design.md)
- **Architecture** — [docs/design/02-architecture.md](docs/design/02-architecture.md)
- **Bundle budget** — [docs/design/09-bundle-budget.md](docs/design/09-bundle-budget.md)
- **Accessibility strategy** — [docs/design/05-accessibility.md](docs/design/05-accessibility.md)
- **i18n / RTL** — [docs/design/06-i18n.md](docs/design/06-i18n.md)
- **Roadmap** — [docs/design/15-roadmap.md](docs/design/15-roadmap.md)
- **Architecture decisions (ADRs)** — [docs/design/16-decisions/](docs/design/16-decisions/)

## Non-goals (v1.0)

- **React / Vue / Solid adapters.** Svelte 5 idioms (runes + attachments + snippets) are central. Cross-framework needs a Zag-style imperative core — a different library.
- **Style libraries / design-system presets.** Atelier (Layer 5) is the only opinionated styling, and it's an opt-in preview.
- **App-level state management.** Component state only.
- **Animation engines.** Components emit `data-state="open|closed|opening|closing"`; users compose Svelte transitions, the View Transitions API, motion libraries.

## Contributing

Pre-alpha. The fastest way to help:

1. Read the design docs ([`docs/design/`](docs/design/)) and open issues on anything unclear, contradictory, or under-specified.
2. Try `kumiki add toggle` against the preview build and report what breaks.
3. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full flow.

## License

[MIT](LICENSE) © 2026 Yuichiro Yamashita
