# ADR 0014 — Icon strategy: consumer-supplied, no icon set

**Status:** Accepted
**Date:** 2026-05-09

## Context

Many components in the v1.0 / v1.5 set need a glyph somewhere in their
default rendering surface or in a recommended atelier preset:

- Combobox / Select — chevron, clear-button "×", checkmark on selected option.
- Calendar / DatePicker — prev/next-month chevrons.
- Dialog — optional close-button "×".
- Tabs — overflow chevrons (when scrollable).
- Toast — severity glyphs (info / success / warn / error) + close.
- Accordion — disclosure chevron.
- Checkbox — check / indeterminate dash.
- Switch — (none required).
- Pagination — prev/next/first/last chevrons.
- Breadcrumb — separator (often `/` or chevron).
- Alert — severity glyphs.
- Avatar — fallback initials, online-indicator dot.
- IconButton — the icon **is** the content.

Three plausible answers:

| Option                                                      | Verdict                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **A. Consumer-supplied via `icon` snippet** (chosen)        | ✅ Headless promise stays intact; zero bytes added to component bundles; aligns with `child` snippet pattern (ADR 0007); consumer's existing icon system (Lucide, Heroicons, Material Symbols, custom SVG sprite) drops in unchanged.                                                |
| B. Ship `@kumiki/icons` (curated set)                       | ❌ ~5 KB minimum even for a tiny set; we'd own a design surface (stroke width, corner radius, fill rules) we have no opinion on; competitors with strong design opinions (Geist, Lucide) already won this category. Forces a styling choice on a library that is otherwise headless. |
| C. Peer-dep on a specific icon library (e.g. lucide-svelte) | ❌ Picks a winner; adds an install step; locks every consumer to one icon system regardless of design language; doesn't help users with their own icon sprite.                                                                                                                       |

The key insight: **icons are a design decision; kumiki doesn't make
design decisions in Layers 1–4.** Layer 5 (atelier) does — but even
there, atelier should _recommend_ an icon snippet shape, not bundle one.

## Decision

### Layer 4 (`@kumiki/components`) — never renders icons

Components in Layer 4 expose an `icon` snippet (or named snippets when
multiple slots exist) wherever a glyph is conventional. The snippet
receives a `state` payload so the consumer can swap icons by state:

```svelte
<!-- Combobox -->
<Combobox.Root>
  <Combobox.Trigger>
    {#snippet icon({ open })}
      {#if open}<ChevronUpIcon />{:else}<ChevronDownIcon />{/if}
    {/snippet}
  </Combobox.Trigger>
</Combobox.Root>
```

```svelte
<!-- Toast -->
<Toast.Root severity="success">
  {#snippet icon({ severity })}
    <SeverityIcon kind={severity} />
  {/snippet}
  <Toast.Title>Saved</Toast.Title>
</Toast.Root>
```

If the consumer provides no icon snippet, the component **renders no
glyph** — the layout reserves no space for one and the markup contains
no placeholder element. The visual default lives in atelier.

### Layer 5 (`@kumiki/atelier`) — opinionated, but icon set is still consumer-supplied

Atelier presets bundle the **slot wiring** but not the icon glyphs.
Each atelier component documents:

- Which icon snippets it expects (e.g. `chevron`, `check`, `close`).
- The recommended size (currently `1em` for inline glyphs, `1.25em` for
  trigger chevrons) and stroke weight (`1.5`) so ad-hoc SVG matches the
  preset's rhythm.
- A copy-pasteable example using Lucide as a non-binding reference.

```svelte
<!-- atelier preset -->
<Combobox.Root>
  <Combobox.Trigger>
    {@render icon?.({ open })}
    <!-- atelier wires the slot -->
  </Combobox.Trigger>
  ...
</Combobox.Root>
```

### IconButton accessible-name guarantee

Because `IconButton` (Phase 1.5) has no text label, it is the most
common a11y regression. The component **enforces an accessible name at
the type level**:

```ts
type IconButtonProps =
  | { 'aria-label': string; icon: Snippet; ... }
  | { 'aria-labelledby': string; icon: Snippet; ... };
```

This mirrors the approach already used for `Dialog.Root` (per
`05-accessibility.md` §5.6).

### Decorative vs meaningful icons

Components passing icon snippets to non-interactive surfaces (Alert,
Toast severity, status badges) **default `aria-hidden="true"` on the
icon wrapper**, with the semantic meaning carried by `role="status"`,
`role="alert"`, or a visible/hidden text label. The
`<Toast.Title>` / `<Alert.Title>` slot is the source of truth for the
accessible name; the icon is decorative.

When the icon is the _only_ meaning carrier on an interactive control
(e.g. a sort-direction indicator on a Table header that is otherwise
unlabeled), the spec requires either visually-hidden text or
`aria-label` on the host element — checked at type-level where possible
and via axe rule otherwise.

### RTL mirroring guidance

Direction-sensitive glyphs (chevrons, arrows, undo/redo) must be
provided as **separate snippets** for the LTR and RTL cases by the
consumer, OR the consumer's snippet must consult `LocaleProvider`
direction. Kumiki components do not auto-mirror icon snippets via CSS
`transform: scaleX(-1)` — that quietly flips letters and currency
symbols inside the snippet and is footgun-prone.

The recommended pattern, documented per-component:

```svelte
{#snippet icon({ open })}
  <span class:rtl-mirror={direction === 'rtl'}>
    <ChevronDownIcon />
  </span>
{/snippet}
```

## Consequences

**Easier:**

- Layer 4 bundle budgets stay clean — zero icon bytes ever ship in
  `@kumiki/components/*`.
- Consumers with an existing icon system (most production apps) plug in
  with no install step.
- `flyle-nexus` migration: their `decorative-icon`, `icon`, and
  `icon-button` components remain on the consumer side; they pass their
  existing icon snippets into kumiki components via the documented
  slots.

**Harder:**

- Documentation burden: each component spec must list its icon snippet
  surface (slot name, size hint, decorative-vs-meaningful default).
  Added to `_template.md` §"Icon slots".
- Storybook / docs site: every example in the docs needs an icon
  snippet wired up. We pick **Lucide** as the docs-site default
  (used in `apps/docs/` only — not a kumiki dep).
- Atelier specs grow an "Icons" section that names recommended sizes /
  stroke weight so atelier defaults look coherent without prescribing a
  set.

**Out of scope, deferred:**

- A `@kumiki/icons` package. Reconsidered only if community signal
  demands it post-v1.0, and then only as a Layer-5-style preset
  shipping under `0.x.x-preview` per ADR 0010.

## References

- ADR 0007 — `child` snippet (the same delegation pattern used here).
- ADR 0010 — Layer 5 preview model.
- `docs/design/05-accessibility.md` §5.6 — accessible-name enforcement.
- `docs/components/_template.md` §"Icon slots" (added in this change).
- Lucide reference: <https://lucide.dev/> — recommended docs-site default,
  not a kumiki dependency.
