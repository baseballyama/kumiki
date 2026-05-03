# Kumiki — Design Document

> Headless, composable, deeply accessible UI primitives for Svelte 5 — built on framework-agnostic state machines, with surgical bundle sizes.

This document is the entry point to Kumiki's architecture. It is **the source of truth** for design decisions, scoped to v1.0. Everything in this folder is normative: implementation that contradicts the design must update the design first.

## How to read

| If you want to…                                      | Read                                                        |
| ---------------------------------------------------- | ----------------------------------------------------------- |
| Understand the philosophy                            | [01-vision.md](design/01-vision.md)                         |
| See the layers and what each one owns                | [02-architecture.md](design/02-architecture.md)             |
| Find a package or work out where a feature lives     | [03-package-structure.md](design/03-package-structure.md)   |
| Understand the state-machine model                   | [04-state-machines.md](design/04-state-machines.md)         |
| Know the a11y guarantees and what we test            | [05-accessibility.md](design/05-accessibility.md)           |
| Understand RTL, calendars, locale loading            | [06-i18n.md](design/06-i18n.md)                             |
| Plug a validator or build a Form                     | [07-form-validation.md](design/07-form-validation.md)       |
| Understand generics and `child` snippet              | [08-typescript.md](design/08-typescript.md)                 |
| Know the bundle ceilings                             | [09-bundle-budget.md](design/09-bundle-budget.md)           |
| Know the runtime perf targets                        | [10-performance.md](design/10-performance.md)               |
| Compose `withValidation`, `withVirtualization`, etc. | [11-composition.md](design/11-composition.md)               |
| Know what tests run where                            | [12-testing.md](design/12-testing.md)                       |
| Know how docs and `llms.txt` work                    | [13-docs-strategy.md](design/13-docs-strategy.md)           |
| Understand SemVer and the release flow               | [14-versioning-release.md](design/14-versioning-release.md) |
| Know what ships when                                 | [15-roadmap.md](design/15-roadmap.md)                       |
| Understand a specific decision                       | [16-decisions/](design/16-decisions/)                       |
| Author a new component                               | [components/\_template.md](components/_template.md)         |
| See a worked example                                 | [components/combobox.md](components/combobox.md)            |

## North-star metrics

These six numbers, taken together, define what "good" means for Kumiki. They are restated in detail throughout the design but live here as the elevator pitch.

| Metric                              | Target                                                                                         | Source                                            |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Combobox bundle (Layer 4, gzip)** | ≤ 4.5 KB                                                                                       | [09-bundle-budget.md](design/09-bundle-budget.md) |
| **Dialog bundle (Layer 4, gzip)**   | ≤ 3.5 KB                                                                                       | [09-bundle-budget.md](design/09-bundle-budget.md) |
| **Locale data per language (gzip)** | ≤ 1 KB, dynamically loaded                                                                     | [06-i18n.md](design/06-i18n.md)                   |
| **Initial languages at v1.0**       | 10 (en, ja, zh-Hans, zh-Hant, ko, es, fr, de, ar, he)                                          | [06-i18n.md](design/06-i18n.md)                   |
| **axe-core CI gate**                | 0 violations on every component × every state × LTR/RTL                                        | [05-accessibility.md](design/05-accessibility.md) |
| **Phase 1 components shipped**      | 10 (Toggle, Switch, Checkbox, RadioGroup, Tabs, Dialog, Tooltip, Combobox, Select, Field/Form) | [15-roadmap.md](design/15-roadmap.md)             |

## Design tenets

These appear throughout the docs; collected here for skim-reading.

1. **State machines are the source of truth.** UI logic is a finite state machine in pure TypeScript. Svelte is a thin reactive adapter on top — never the other way around.
2. **Sub-paths over barrels.** Each Layer × component is its own package. Tree-shaking is a fallback, not the plan.
3. **A11y is a type-system concern.** Accessible names, roles, and required ARIA attributes are required at the type level whenever possible. The compiler catches what tests can't.
4. **i18n is lazy by default.** No locale data ships unless the user imports it. Calendar systems are independent: importing Islamic doesn't pull in Buddhist.
5. **`child` snippet replaces `asChild`.** Render delegation in Svelte 5 is a snippet that receives `props`; we do not reinvent React's `cloneElement`.
6. **CI is uncompromising.** size-limit, publint, arethetypeswrong, agadoo, axe-core, and (on schedule) Guidepup gate every PR. If we can't measure it, we don't claim it.

## Document conventions

- **API examples** are illustrative TypeScript / Svelte 5 — not always copy-pasteable. They use the **Phase 1 API**; pre-1.0 deltas are recorded in changesets.
- **Tables compare alternatives** rather than narrate them. If a section has a decision, the alternatives table is mandatory. If a section is descriptive only, no comparison is required.
- **Numbers are sourced.** Every quantitative claim links to either the file that produces it (e.g. `package.json` size-limit block) or the source the number was lifted from.
- **TBD is allowed and labeled.** A TBD must include _why_ it's TBD and _what unblocks it_. We don't paper over uncertainty.

## Out of scope (v1.0)

The brief's Section 3 is normative; restating here so it's discoverable from the index:

- React / Vue / Solid adapters (Svelte 5 only).
- Style libraries (Tailwind preset, etc. — separate ecosystem).
- App-level state management.
- Animation engines (we emit `data-state`; users plug their own).
- Material / iOS HIG conformance.

## See also

- The user-supplied market research, including comparison to Bits UI, Melt UI, Radix, React Aria, Zag, Ark, Headless UI, Ariakit, Base UI, shadcn-svelte, lives at [`docs/market-research.md`](market-research.md). Design decisions cite it inline.
