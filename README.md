# Kumiki

> Headless, composable, deeply accessible UI primitives for **Svelte 5** — built on framework-agnostic state machines, with surgical bundle sizes.

**Status: pre-alpha (preview).** Phase 1 (10 components) + Phase 2 (6 of 7; Calendar / DatePicker pending) + Phase 0b composition (4 of 4) ship end-to-end against measured bundle budgets and APG keyboard contracts; nothing is published to npm yet. See [`STATUS.md`](STATUS.md) for the rolling snapshot, [`docs/design.md`](docs/design.md) for the full architecture plan, and [`docs/design/15-roadmap.md`](docs/design/15-roadmap.md) for the milestone schedule.

## Why Kumiki?

The Svelte ecosystem has excellent headless libraries (Bits UI, Melt UI), but no single library matches what teams in the React ecosystem get when they combine Radix's API with React Aria's accessibility and i18n depth. **Kumiki targets all four of these axes at once**, on Svelte 5:

- **Accessibility.** WCAG 2.2 AA, WAI-ARIA 1.2, APG-driven keyboard tests, axe-core in CI, and NVDA/VoiceOver automation via Guidepup.
- **Internationalization.** RTL keyboard navigation, non-Gregorian calendars (Islamic, Buddhist, Japanese), Arabic/Persian/Thai number systems, and locale data that is dynamically imported (1 KB per locale target).
- **Performance.** Tight gzipped budgets enforced in CI: 500 B per primitive, 1.5 KB per machine, 4.5 KB for Combobox, etc. See [bundle budget](docs/design/09-bundle-budget.md).
- **Composability.** Five layers (primitives → state machines → attachments → compound components → Atelier styled variants), each independently importable. Optional features compose through `withValidation`, `withAsyncSearch`, `withVirtualization`, `withMultiSelect`, etc.

The name comes from **kumiki** (組木), the Japanese woodworking technique that joins parts by their shape alone — without nails or glue. Kumiki the library carries the same spirit: the parts are composable enough that nothing extra is needed to hold them together.

## What's shipping today

Verified end-to-end (machine + attachment + component + sandbox + e2e + axe + APG keyboard contract; see [`STATUS.md`](STATUS.md) for live counts):

- **Phase 1 (10 components)** — Toggle, Switch, Combobox, Checkbox, RadioGroup, Tabs, Dialog, Tooltip, Select, Field/Form.
- **Phase 2 (6 of 7)** — Slider, Accordion, NumberField, Popover, Toast, Menu. Calendar / DatePicker are pending an `@internationalized/date` dependency decision.
- **Phase 0b composition (4 of 4)** — `withValidation`, `withAsyncSearch`, `withMultiSelect`, `withVirtualization` on Combobox. 1.77 KB total optional surface; each tree-shakes when not imported. See [`docs/components/combobox-composition.md`](docs/components/combobox-composition.md).
- **Phase 0c QA gates** — APG keyboard harness, `llms-full.txt` builder, `/sizes` route with verified bundle measurements, per-component reference docs.

## Quick start (preview API — not yet on npm)

Kumiki ships as **9 per-layer packages** with subpaths per component (see [ADR 0012](docs/design/16-decisions/0012-package-consolidation.md)). Most users only need one install:

```bash
# Full Svelte UI:
pnpm add @kumiki/components

# Headless (own DOM markup, just take the behavior):
pnpm add @kumiki/headless

# Pure FSM, no DOM (server validation, framework ports):
pnpm add @kumiki/machines
```

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

Want maximum control? Drop down to Layer 3 attachments:

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

Or run the pure machine in any environment:

```ts
import { createComboboxMachine } from '@kumiki/machines/combobox';
const machine = createComboboxMachine({ options });
machine.send({ type: 'INPUT.CHANGE', value: 'hello' });
console.log(machine.state, machine.derived.filtered);
```

## Repository layout

```text
packages/
  core/                       Shared (layers 0–1)
    primitives/               @kumiki/primitives — focus-trap, dismissable, id, locale, …
    locale/                   @kumiki/locale — dynamically importable per language
    runtime/                  @kumiki/runtime — minimal FSM
    types/                    @kumiki/types — shared TS types
  machines/                   @kumiki/machines (Layer 2) — subpath per component
    src/<name>/index.ts       e.g. @kumiki/machines/toggle, /combobox, …
  headless/                   @kumiki/headless (Layer 3) — subpath per component
    src/<name>/index.ts       e.g. @kumiki/headless/toggle
    src/combobox/with-*/      composition subpaths
                              (@kumiki/headless/combobox/with-validation, …)
  components/                 @kumiki/components (Layer 4) — subpath + dot-namespace barrel
    src/index.ts              { Toggle, Dialog, Combobox, … }
    src/<name>/               Svelte components (Root.svelte, …)
  atelier/                    @kumiki/atelier (Layer 5 preview) — subpath per component
    src/<name>/               styled, copy-paste-friendly variants (Tailwind v4 + vanilla)
  tooling/
    cli/                      @kumiki/cli — `kumiki add` binary
apps/
  docs/                       SvelteKit documentation site
docs/                         Architecture design documents
references/                   Competitor source as shallow git submodules (opt-in)
```

> 9 packages total. Each layer is one published package; components
> live as subpaths (`@kumiki/machines/toggle`, `@kumiki/components/toggle`,
> …). Subpath imports tree-shake; the dot-namespace barrel
> (`import { Toggle } from '@kumiki/components'`) ships alongside.

## Documentation

- **Design overview**: [docs/design.md](docs/design.md)
- **Architecture**: [docs/design/02-architecture.md](docs/design/02-architecture.md)
- **Bundle budget**: [docs/design/09-bundle-budget.md](docs/design/09-bundle-budget.md)
- **Accessibility strategy**: [docs/design/05-accessibility.md](docs/design/05-accessibility.md)
- **Roadmap**: [docs/design/15-roadmap.md](docs/design/15-roadmap.md)
- **Architecture decisions**: [docs/design/16-decisions/](docs/design/16-decisions/)

## Contributing

Pre-alpha. The fastest way to help is to read the design docs and open an issue on anything unclear, contradictory, or under-specified. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2026 Yuichiro Yamashita
