# 13 — Documentation Strategy

## 13.1 The audiences

Kumiki's docs serve three audiences with overlapping but not identical needs:

| Audience                                  | Primary need                                                          |
| ----------------------------------------- | --------------------------------------------------------------------- |
| **Human developers** integrating Kumiki   | Working examples, API reference, troubleshooting                      |
| **AI assistants / LLMs**                  | Stable, parsable spec — `llms.txt`, `llms-full.txt`, structured JSDoc |
| **Reviewers / auditors** (a11y, security) | Evidence: APG citations, axe transcripts, type contracts              |

Treating LLMs as a first-class audience is part of the brief (Section 2.F) and increasingly a competitive necessity.

## 13.2 Site structure (`apps/docs`)

```
/                        Landing — pitch, install, links
/docs/getting-started    Setup, providers, first component
/docs/concepts/layers    The 5 layers explained
/docs/concepts/machines  How machines work, visualizer link
/docs/concepts/i18n      LocaleProvider, dynamic loading, RTL
/docs/concepts/forms     Field/Form/FieldGroup, Standard Schema
/docs/concepts/composition  with* pattern
/components              Index of all components
/components/<name>       Per-component reference (see §13.4)
/atelier                 Layer 5 preview (the Atelier)
/perf                    Bundle + runtime measurements
/llms.txt                LLM-targeted summary
/llms-full.txt           Full type definitions + anti-patterns
```

Built with **SvelteKit + adapter-static** (full prerender; sandbox routes are
SPA-fallback hydrated). Deployed to **GitHub Pages** at
`https://baseballyama.github.io/kumiki/` — the deploy workflow sets
`BASE_PATH=/kumiki` so internal links work under that project path. When a
custom domain (`kumiki.dev`) is wired up, drop `BASE_PATH` and the site moves
back to the root. Source: `apps/docs/`.

## 13.3 The component reference template

Each `docs/components/<name>.md` follows a fixed shape (template at `docs/components/_template.md`):

```
# <Name>

> One-sentence description.

**APG pattern**: <link>
**Bundle (Layer 4 gzip)**: <number> / <budget>
**Status**: stable | preview | unreleased

## Anatomy

Tree of compound parts (Root, Trigger, Item, Listbox, …).

## Keyboard

A table mirroring the APG keyboard interactions. Generated from keyboard.yaml.

## ARIA

A table of `role` / `aria-*` attributes per part and per state.

## State machine

Link to the visualizer (stately.ai) with the embedded XState JSON.

## API

Per part: props, snippets, types. Generated from JSDoc + api-extractor.

## Examples

- Basic
- With validation (Standard Schema)
- With async fetcher
- With virtualization
- With multi-select
- RTL

## Accessibility checklist

The list from [05-accessibility.md §5.6](../design/05-accessibility.md#56-what-every-component-must-satisfy-at-v10) checked off.

## Anti-patterns
- "Don't compose Tooltip in a Combobox option without escape handling"
- ...

## Related
- Links to other components.
```

A worked instance lives at [`components/combobox.md`](../components/combobox.md) (mostly populated; complete as Combobox lands in Phase 0b).

## 13.4 Per-component badges (auto-generated)

The component page top includes machine-readable badges:

- **Bundle size** — shields.io endpoint reading from `apps/docs/sizes/<name>.json` (output of `size-limit`).
- **APG link** — the URL of the matching pattern.
- **Status** — `preview` / `stable`.
- **Last a11y run** — date of latest scheduled axe + Guidepup run.

Badges fail loudly when stale (CSS turns the badge red after 7 days).

## 13.5 `llms.txt` and `llms-full.txt`

Following the [llms.txt convention](https://llmstxt.org/) and Bits UI's lead.

### `static/llms.txt`

A short markdown file describing what Kumiki is and where to find more. ~50 lines. Already drafted at [`apps/docs/static/llms.txt`](../../apps/docs/static/llms.txt).

### `static/llms-full.txt`

Auto-generated, much larger. Contains:

- The complete public API surface (one TypeScript declaration per export, with full JSDoc).
- The "When to use" / "Anti-pattern" / "APG link" annotations from JSDoc.
- The machine config JSON for each component (the `toJSON()` output).
- The keyboard YAML for each component.
- Versioned per release.

Source-of-truth: each package's `dist/index.d.ts` plus its `keyboard.yaml`. The build script `apps/docs/scripts/build-llms-full.ts` (Phase 0c) compiles them.

### Content-Type for `/llms.txt`

GitHub Pages infers `Content-Type` from the file extension, so `/llms.txt` and
`/llms-full.txt` are already served as `text/plain` — no per-file headers
file is needed. If we later switch back to Cloudflare Pages (or any host that
honours `_headers`) we can drop a static `_headers` file in `apps/docs/static/`
to override caching.

## 13.6 JSDoc conventions

Every public type, function, and component prop has JSDoc with three required sections:

```ts
/**
 * Compound combobox root. Owns the machine instance and exposes context to children.
 *
 * @when-to-use Use when you want a single-select combobox with both filtering and async option fetching.
 *              For multi-select, compose `withMultiSelect`.
 *
 * @anti-pattern Don't put `Combobox.Root` inside a `Form.Root`'s submit handler if you want validation.
 *               Wrap with `Field.Root` instead and validate via Standard Schema.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */
```

These tags are picked up by:

- TypeScript LSP — users see them on hover.
- TypeDoc — included in human-readable reference.
- `llms-full.txt` builder — included in the LLM-readable spec.

## 13.7 API reference: TypeDoc + api-extractor

Two tools, two purposes:

- **TypeDoc** (with `typedoc-plugin-markdown`) generates a _readable reference_ for humans. Per-package, embedded into the SvelteKit docs site.
- **api-extractor** generates an _API report_ (`api/<pkg>.api.md` per package). PRs that change public types update the report; reviewers see a line-level diff. This is the breaking-change detection mechanism.

The two are complementary: TypeDoc renders the docs people read; api-extractor enforces the SemVer contract. See [16-decisions/0011-typedoc-and-api-extractor.md](16-decisions/0011-typedoc-and-api-extractor.md) (TBD if this needs an ADR; covered in §10.3 of the design tools choice).

## 13.8 Dev playground

`/playground` (Phase 0c+) hosts an interactive sandbox using a stripped-down REPL. Users can paste compose patterns and see them run. Implementation TBD (likely Vite + Monaco).

## 13.9 Translation of docs

v1.0 docs ship in **English only**. Japanese translations land in v1.x as the Japanese-speaking author + community contribute. We do not gate v1.0 on translated docs — `apps/docs` is plumbing-ready (Svelte i18n via `@kumiki/locale`), but translations are content work.

## 13.10 Search

In-site search via [Pagefind](https://pagefind.app/) (static, no server). Phase 0c.

## 13.11 Versioning of docs

The docs site at `kumiki.dev` (or wherever) reflects the current `main` branch. Older versions live at `vN.kumiki.dev/` (subdomain or `/v0.x/` path; TBD per Cloudflare Pages routing). v1.0+ guarantees URL stability for `/components/<name>`.

## 13.12 Open questions

- **TBD:** Should component pages embed a live runnable example (Stackblitz / WebContainer)? Cost: heavy. Value: high. Likely v1.1.
- **TBD:** Whether to publish `llms-full.txt` as JSON instead of plain text. Plain text is the convention; JSON would be more parsable. Probably both.
- **TBD:** A `kumiki.dev/changelog` page aggregating changesets. Likely yes — the source data exists; it's just rendering.
