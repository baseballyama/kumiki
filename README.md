# Kumiki

> Headless, composable, deeply accessible UI primitives for **Svelte 5** — built on framework-agnostic state machines, with surgical bundle sizes.

**Status: pre-alpha.** This repository is currently a design document and scaffolding. No runtime code is published yet. See [`docs/design.md`](docs/design.md) for the full architecture plan and [`docs/design/15-roadmap.md`](docs/design/15-roadmap.md) for the milestone schedule.

## Why Kumiki?

The Svelte ecosystem has excellent headless libraries (Bits UI, Melt UI), but no single library matches what teams in the React ecosystem get when they combine Radix's API with React Aria's accessibility and i18n depth. **Kumiki targets all four of these axes at once**, on Svelte 5:

- **Accessibility.** WCAG 2.2 AA, WAI-ARIA 1.2, APG-driven keyboard tests, axe-core in CI, and NVDA/VoiceOver automation via Guidepup.
- **Internationalization.** RTL keyboard navigation, non-Gregorian calendars (Islamic, Buddhist, Japanese), Arabic/Persian/Thai number systems, and locale data that is dynamically imported (1 KB per locale target).
- **Performance.** Tight gzipped budgets enforced in CI: 500 B per primitive, 1.5 KB per machine, 4.5 KB for Combobox, etc. See [bundle budget](docs/design/09-bundle-budget.md).
- **Composability.** Five layers (primitives → state machines → attachments → compound components → styled recipes), each independently importable. Optional features compose through `withValidation`, `withAsyncSearch`, `withVirtualization`, `withMultiSelect`, etc.

The name comes from **kumiki** (組木), the Japanese woodworking technique that joins parts by their shape alone — without nails or glue. Kumiki the library carries the same spirit: the parts are composable enough that nothing extra is needed to hold them together.

## Quick start (planned API — not yet shipping)

Install only what you use. The library is published as ~30 small packages under the `@kumiki/*` scope.

```bash
pnpm add @kumiki/component-combobox
```

```svelte
<script lang="ts" generics="T extends { id: string; label: string }">
  import { Combobox } from '@kumiki/component-combobox';
  import { withValidation } from '@kumiki/component-combobox/with-validation';
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
  import { createCombobox } from '@kumiki/attachment-combobox';
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
import { createComboboxMachine } from '@kumiki/machine-combobox';
const machine = createComboboxMachine({ options });
machine.send({ type: 'INPUT.CHANGE', value: 'hello' });
console.log(machine.state, machine.derived.filtered);
```

## Repository layout

```text
packages/
  primitives/             Layer 1 — focus-trap, dismissable, id, locale, …
  locale/                 Locale data, dynamically importable per language
  runtime/                Layer 2 — minimal FSM runtime
  types/                  Shared types
  machine-{component}/    Layer 2 — pure-TS state machine per component
  attachment-{component}/ Layer 3 — Svelte 5 attachments
  component-{component}/  Layer 4 — compound components (Root/Trigger/Item)
  recipes-{component}/    Layer 5 (preview) — styled, copy-paste templates
  cli/                    `kumiki add` CLI
apps/
  docs/                   SvelteKit documentation site
docs/                     Architecture design documents
```

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
