# 18 — CSS variable contract

Kumiki components ship without any opinion about color, radius, or
typography. This doc names the **CSS custom property surface** that
atelier (Layer 5) presets read from and that consumers writing their
own styles MUST drive.

This is the contract that lets a design system swap kumiki in
underneath without painting every component by hand.

## 18.1 Two-layer model

Layer 4 (`@kumiki/components/*`):

- Emits **no styles** beyond `position`, `display`-when-required-for-FSM,
  and ARIA-required visibility (`hidden` attribute on closed disclosure
  surfaces, etc.).
- Emits `data-*` hooks for every state the consumer can target with
  CSS:

| Hook                                                   | Where                                                                              | Meaning                   |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------- | ------------------------- |
| `data-state="open"`/`"closed"`                         | Disclosure-shaped components (Dialog, Popover, Menu, Combobox, Accordion, Tooltip) | Open/closed               |
| `data-state="checked"`/`"unchecked"`/`"indeterminate"` | Checkbox, Switch, Toggle                                                           | Pressed/checked state     |
| `data-disabled=""`                                     | Anything disable-able                                                              | Disabled                  |
| `data-loading=""`                                      | Button (and any component with a busy state)                                       | `aria-busy="true"` mirror |
| `data-orientation="horizontal"`/`"vertical"`           | Tabs, Slider, Toggle.Group, Separator                                              | Layout direction          |
| `data-side="top"`/`"right"`/`"bottom"`/`"left"`        | Floating components (Popover, Menu, Tooltip, DatePicker, Combobox listbox)         | Resolved placement        |
| `data-align="start"`/`"center"`/`"end"`                | Floating components                                                                | Resolved alignment        |
| `data-direction="ltr"`/`"rtl"`                         | Anything that flips                                                                | LocaleProvider direction  |
| `data-active=""`                                       | Tabs.Trigger (when active), Menu.Item (highlighted)                                | Highlighted/active        |
| `data-selected=""`                                     | Combobox.Item, Select.Item (selected)                                              | Selected option           |
| `data-current="page"`                                  | Breadcrumb.Link, Pagination.PageItem (current)                                     | Mirror of `aria-current`  |
| `data-severity="info"`/`"success"`/`"warn"`/`"error"`  | Alert, Toast                                                                       | Severity                  |

Layer 5 (`@kumiki/atelier/*`):

- Reads from a fixed set of CSS custom properties (this contract).
- Provides default values for each via a `:root` style sheet (or
  `:where(...)` to keep specificity low).
- The consumer overrides defaults in their own `:root` (or a scoped
  selector for theme switching).

## 18.2 Naming convention

```
--kumiki-<component>-<part>-<property>[-<state>]
```

- `<component>` — kebab-case component name (`toggle`, `dialog`, `combobox`, `data-table` → `table`).
- `<part>` — anatomy part (`root`, `trigger`, `content`, `overlay`, `item`, `indicator`).
- `<property>` — one of `bg` / `fg` / `border` / `radius` / `shadow` / `padding-x` / `padding-y` / `gap` / `font-size` / `font-weight` / `line-height` / `outline` / `outline-offset`.
- `<state>` (optional) — `hover` / `active` / `focus` / `disabled` / `loading` / `checked` / `selected` / `error`.

Examples:

```css
--kumiki-toggle-bg                 /* default */
--kumiki-toggle-bg-hover
--kumiki-toggle-bg-checked
--kumiki-toggle-fg
--kumiki-toggle-radius
--kumiki-toggle-padding-x
--kumiki-toggle-outline-focus

--kumiki-dialog-overlay-bg
--kumiki-dialog-content-bg
--kumiki-dialog-content-radius
--kumiki-dialog-content-shadow
--kumiki-dialog-content-padding
```

The contract is **flat** — no nested fallbacks like `var(--kumiki-toggle-bg, var(--kumiki-color-primary))`. Atelier may define its own
internal aliases (e.g. `--kumiki-color-primary-500`) but the
component-facing surface is always the leaf property. This keeps
debugging tractable and devtools introspection clean.

## 18.3 Per-component contracts (v1.0 + Phase 1.5 set)

### Button

| Variable                         | Default (atelier) reads from |
| -------------------------------- | ---------------------------- |
| `--kumiki-button-bg`             | per-variant primary          |
| `--kumiki-button-bg-hover`       | per-variant primary-hover    |
| `--kumiki-button-bg-active`      | per-variant primary-active   |
| `--kumiki-button-bg-disabled`    | disabled-bg                  |
| `--kumiki-button-fg`             | per-variant on-primary fg    |
| `--kumiki-button-fg-disabled`    | disabled-fg                  |
| `--kumiki-button-border`         | (transparent for primary)    |
| `--kumiki-button-radius`         | radius-md                    |
| `--kumiki-button-padding-x`      | spacing-md                   |
| `--kumiki-button-padding-y`      | spacing-sm                   |
| `--kumiki-button-font-size`      | font-size-sm                 |
| `--kumiki-button-font-weight`    | font-weight-medium           |
| `--kumiki-button-outline-focus`  | outline-focus                |
| `--kumiki-button-outline-offset` | 2px                          |
| `--kumiki-button-icon-gap`       | spacing-xs                   |

Variants are addressed by stacking selectors: `[data-variant="primary"]`,
`[data-variant="ghost"]`, etc. Atelier's stylesheet provides distinct
values per variant; consumers override per variant by scoping.

### Toggle

| Variable                           | Notes                    |
| ---------------------------------- | ------------------------ |
| `--kumiki-toggle-bg`               | unchecked                |
| `--kumiki-toggle-bg-hover`         |                          |
| `--kumiki-toggle-bg-checked`       | `[data-state="checked"]` |
| `--kumiki-toggle-bg-checked-hover` |                          |
| `--kumiki-toggle-fg`               | unchecked                |
| `--kumiki-toggle-fg-checked`       |                          |
| `--kumiki-toggle-border`           |                          |
| `--kumiki-toggle-radius`           |                          |
| `--kumiki-toggle-padding-x`        |                          |
| `--kumiki-toggle-padding-y`        |                          |
| `--kumiki-toggle-outline-focus`    |                          |

### Switch

| Variable                           | Notes |
| ---------------------------------- | ----- |
| `--kumiki-switch-track-bg`         |       |
| `--kumiki-switch-track-bg-checked` |       |
| `--kumiki-switch-thumb-bg`         |       |
| `--kumiki-switch-thumb-radius`     |       |
| `--kumiki-switch-track-radius`     |       |
| `--kumiki-switch-track-width`      |       |
| `--kumiki-switch-track-height`     |       |
| `--kumiki-switch-thumb-size`       |       |
| `--kumiki-switch-outline-focus`    |       |

### Checkbox / Radio

| Variable                           | Notes                                      |
| ---------------------------------- | ------------------------------------------ |
| `--kumiki-checkbox-bg`             |                                            |
| `--kumiki-checkbox-bg-checked`     | shared with `[data-state="indeterminate"]` |
| `--kumiki-checkbox-border`         |                                            |
| `--kumiki-checkbox-border-checked` |                                            |
| `--kumiki-checkbox-fg`             | the check glyph color                      |
| `--kumiki-checkbox-radius`         |                                            |
| `--kumiki-checkbox-size`           |                                            |
| `--kumiki-checkbox-outline-focus`  |                                            |

(Radio mirrors Checkbox names with `--kumiki-radio-*`.)

### Dialog / Drawer

| Variable                              | Notes                                     |
| ------------------------------------- | ----------------------------------------- |
| `--kumiki-dialog-overlay-bg`          | backdrop                                  |
| `--kumiki-dialog-content-bg`          |                                           |
| `--kumiki-dialog-content-fg`          |                                           |
| `--kumiki-dialog-content-border`      |                                           |
| `--kumiki-dialog-content-radius`      |                                           |
| `--kumiki-dialog-content-shadow`      |                                           |
| `--kumiki-dialog-content-padding`     |                                           |
| `--kumiki-dialog-content-max-width`   | content max-width on `side="center"`      |
| `--kumiki-dialog-content-width-side`  | width when `data-side` is `left`/`right`  |
| `--kumiki-dialog-content-height-side` | height when `data-side` is `top`/`bottom` |

### Popover / Menu / Combobox listbox / Tooltip

These share a "floating panel" sub-contract. Atelier exposes a
**panel preset** that all four read:

| Variable                | Notes                                          |
| ----------------------- | ---------------------------------------------- |
| `--kumiki-panel-bg`     | shared default; per-component override allowed |
| `--kumiki-panel-fg`     |                                                |
| `--kumiki-panel-border` |                                                |
| `--kumiki-panel-radius` |                                                |
| `--kumiki-panel-shadow` |                                                |

Per-component overrides:

```css
--kumiki-popover-bg     /* falls back to --kumiki-panel-bg in atelier */
--kumiki-menu-bg
--kumiki-combobox-listbox-bg
--kumiki-tooltip-bg
```

This is the **only** place the contract permits semantic fallbacks
(panel → component) — and it's expressed in atelier's stylesheet, not
inside the component bundle.

Items inside menus / listboxes:

| Variable                         | Notes                         |
| -------------------------------- | ----------------------------- |
| `--kumiki-menu-item-bg`          |                               |
| `--kumiki-menu-item-bg-active`   | `[data-active]` (highlighted) |
| `--kumiki-menu-item-bg-selected` | `[data-selected]`             |
| `--kumiki-menu-item-fg`          |                               |
| `--kumiki-menu-item-padding`     |                               |

### Tabs

| Variable                             | Notes                         |
| ------------------------------------ | ----------------------------- |
| `--kumiki-tabs-list-border`          | bottom-border under tab strip |
| `--kumiki-tabs-trigger-fg`           |                               |
| `--kumiki-tabs-trigger-fg-active`    | `[data-active]`               |
| `--kumiki-tabs-trigger-indicator-bg` | the underline / pill          |
| `--kumiki-tabs-trigger-padding-x`    |                               |
| `--kumiki-tabs-trigger-padding-y`    |                               |

### Toast

| Variable                    | Notes                          |
| --------------------------- | ------------------------------ |
| `--kumiki-toast-region-gap` | spacing between stacked toasts |
| `--kumiki-toast-bg`         | per-severity                   |
| `--kumiki-toast-fg`         |                                |
| `--kumiki-toast-border`     |                                |
| `--kumiki-toast-radius`     |                                |
| `--kumiki-toast-padding`    |                                |
| `--kumiki-toast-shadow`     |                                |

(`Alert` mirrors Toast surface with `--kumiki-alert-*`.)

### Accordion / Disclosure

| Variable                              | Notes |
| ------------------------------------- | ----- |
| `--kumiki-accordion-trigger-bg`       |       |
| `--kumiki-accordion-trigger-bg-hover` |       |
| `--kumiki-accordion-trigger-fg`       |       |
| `--kumiki-accordion-trigger-padding`  |       |
| `--kumiki-accordion-content-bg`       |       |
| `--kumiki-accordion-content-padding`  |       |
| `--kumiki-accordion-divider`          |       |

### Form-Field

| Variable                                | Notes                           |
| --------------------------------------- | ------------------------------- |
| `--kumiki-form-field-label-fg`          |                                 |
| `--kumiki-form-field-label-fg-required` | when required (the `*` color)   |
| `--kumiki-form-field-description-fg`    |                                 |
| `--kumiki-form-field-error-fg`          |                                 |
| `--kumiki-form-field-gap`               | between label/input/description |

### Calendar / DatePicker / TimeField / DateTimeField

| Variable                               | Notes                                       |
| -------------------------------------- | ------------------------------------------- |
| `--kumiki-calendar-cell-bg-hover`      |                                             |
| `--kumiki-calendar-cell-bg-selected`   | `[data-selected]`                           |
| `--kumiki-calendar-cell-bg-in-range`   | range-select (when withRange composer used) |
| `--kumiki-calendar-cell-bg-today`      |                                             |
| `--kumiki-calendar-cell-fg`            |                                             |
| `--kumiki-calendar-cell-fg-selected`   |                                             |
| `--kumiki-calendar-cell-fg-disabled`   |                                             |
| `--kumiki-calendar-cell-radius`        |                                             |
| `--kumiki-time-field-segment-bg-focus` |                                             |
| `--kumiki-time-field-segment-fg-empty` | placeholder digit color                     |

### Slider

| Variable                        | Notes                   |
| ------------------------------- | ----------------------- |
| `--kumiki-slider-track-bg`      |                         |
| `--kumiki-slider-range-bg`      | the filled portion      |
| `--kumiki-slider-thumb-bg`      |                         |
| `--kumiki-slider-thumb-size`    |                         |
| `--kumiki-slider-track-height`  |                         |
| `--kumiki-slider-outline-focus` | applied to active thumb |

### Pagination / Breadcrumb / Chips / Badge / Avatar

(One row per primitive — see authoritative table in atelier's
`tokens.css`.)

| Variable                              | Notes               |
| ------------------------------------- | ------------------- |
| `--kumiki-pagination-item-bg-current` | current page        |
| `--kumiki-pagination-item-fg`         |                     |
| `--kumiki-breadcrumb-separator-fg`    |                     |
| `--kumiki-breadcrumb-link-fg`         |                     |
| `--kumiki-breadcrumb-link-fg-current` |                     |
| `--kumiki-chips-bg`                   | per-variant         |
| `--kumiki-chips-fg`                   |                     |
| `--kumiki-chips-radius`               |                     |
| `--kumiki-chips-close-bg-hover`       |                     |
| `--kumiki-badge-bg`                   | per-variant         |
| `--kumiki-badge-fg`                   |                     |
| `--kumiki-badge-radius`               |                     |
| `--kumiki-avatar-bg-fallback`         | initials background |
| `--kumiki-avatar-fg-fallback`         |                     |
| `--kumiki-avatar-border`              | ring around image   |
| `--kumiki-avatar-radius`              | round vs squircle   |

### Table

| Variable                          | Notes                       |
| --------------------------------- | --------------------------- |
| `--kumiki-table-bg`               |                             |
| `--kumiki-table-fg`               |                             |
| `--kumiki-table-border`           |                             |
| `--kumiki-table-row-bg-hover`     |                             |
| `--kumiki-table-row-bg-selected`  | `[aria-selected="true"]`    |
| `--kumiki-table-header-bg`        |                             |
| `--kumiki-table-header-fg`        |                             |
| `--kumiki-table-header-bg-sticky` | when `data-sticky="header"` |
| `--kumiki-table-cell-padding-x`   |                             |
| `--kumiki-table-cell-padding-y`   |                             |

## 18.4 Atelier defaults — internal palette aliases

Atelier's internal stylesheet defines a small palette that the
component vars resolve to:

```css
:where(html) {
  --kumiki-color-bg-1: white;
  --kumiki-color-bg-2: hsl(220 10% 96%);
  --kumiki-color-bg-overlay: hsl(0 0% 0% / 0.5);
  --kumiki-color-fg-1: hsl(220 10% 10%);
  --kumiki-color-fg-2: hsl(220 10% 40%);
  --kumiki-color-fg-disabled: hsl(220 10% 60%);
  --kumiki-color-border: hsl(220 10% 86%);
  --kumiki-color-primary: hsl(220 90% 55%);
  --kumiki-color-primary-fg: white;
  --kumiki-color-danger: hsl(0 80% 55%);
  --kumiki-color-danger-fg: white;
  --kumiki-color-success: hsl(140 60% 40%);
  --kumiki-color-warning: hsl(40 95% 50%);
  --kumiki-radius-sm: 4px;
  --kumiki-radius-md: 6px;
  --kumiki-radius-lg: 10px;
  --kumiki-shadow-sm: 0 1px 2px hsl(0 0% 0% / 0.05);
  --kumiki-shadow-md: 0 4px 12px hsl(0 0% 0% / 0.1);
  /* ... */

  --kumiki-button-bg: var(--kumiki-color-primary);
  --kumiki-button-fg: var(--kumiki-color-primary-fg);
  --kumiki-button-radius: var(--kumiki-radius-md);
  /* ... */
}
```

The palette aliases (`--kumiki-color-*`, `--kumiki-radius-*`,
`--kumiki-shadow-*`) are atelier-internal — consumers may use them but
should treat them as unstable across atelier minor versions. The
component-facing leaves (`--kumiki-button-bg`, etc.) are stable
contract.

## 18.5 Mapping an external token system onto kumiki

Two strategies for a consumer who already has a token system (e.g. the
flyle-nexus `--base-background-1` / `--primary-background-inverse-1` /
`--danger-foreground-2` pattern):

### Strategy A — bridge to atelier

Use atelier defaults for layout/sizing, override colors via the
component-facing leaves. The full mapping for the flyle-nexus token
system (`--base-*`, `--primary-*`, `--danger-*`, `--info-*`,
`--success-*`, `--warning-*`, `--space-*`, `--radius-*`,
`--effect-focus-*`, `--shadow-*`) lives in
`packages/frontend/design-system/src/lib/css/kumiki-bridge.css` of
flyle-nexus. The shape is one block per component / per state, e.g.:

```css
:root {
  /* Button — primary variant default */
  --kumiki-button-bg: var(--primary-background-inverse-1);
  --kumiki-button-bg-hover: var(--primary-background-inverse-2);
  --kumiki-button-bg-active: var(--primary-background-inverse-3);
  --kumiki-button-bg-disabled: var(--disabled-background-1);
  --kumiki-button-fg: var(--primary-foreground-on-inverse-1);
  --kumiki-button-fg-disabled: var(--disabled-foreground-1);
  --kumiki-button-radius: var(--radius-m);
  --kumiki-button-padding-x: var(--space-16);
  --kumiki-button-padding-y: var(--space-8);
  --kumiki-button-outline-focus: 0 0 0 var(--effect-focus-strong-default-spread)
    var(--effect-focus-strong-default-color);

  /* Toast / Alert — base; per-severity overrides via [data-severity] */
  --kumiki-toast-bg: var(--base-background-1);
  --kumiki-toast-fg: var(--base-foreground-1);
  --kumiki-toast-border: var(--base-border-1);
  --kumiki-toast-radius: var(--radius-m);
  --kumiki-toast-padding: var(--space-12) var(--space-16);
  --kumiki-toast-shadow: var(--shadow-2);

  /* Form-Field error / required — danger palette */
  --kumiki-form-field-label-fg-required: var(--danger-foreground-1);
  --kumiki-form-field-error-fg: var(--danger-foreground-1);
}

[data-variant='ghost'] {
  --kumiki-button-bg: transparent;
  --kumiki-button-bg-hover: var(--base-background-2);
  --kumiki-button-fg: var(--base-foreground-1);
  --kumiki-button-border: var(--base-border-1);
}

[data-variant='danger'] {
  --kumiki-button-bg: var(--danger-background-inverse-1);
  --kumiki-button-bg-hover: var(--danger-background-inverse-2);
  --kumiki-button-fg: var(--danger-foreground-on-inverse-1);
  --kumiki-button-outline-focus: 0 0 0 var(--effect-focus-strong-destructive-spread)
    var(--effect-focus-strong-destructive-color);
}

[data-severity='error'] {
  --kumiki-toast-bg: var(--danger-background-1);
  --kumiki-toast-fg: var(--danger-foreground-1);
  --kumiki-toast-border: var(--danger-border-1);
}
```

Wire the bridge into the cascade as its own `@layer` so consumers can
override individual leaves higher up without specificity battles:

```css
/* in flyle's design-system index.css */
@layer reset, basic;
@layer color, radius, spacing, typography, shadow, semantic, effect, text;
@layer accessibility, animation, editor;
@layer kumiki-bridge;

@import url('./kumiki-bridge.css') layer(kumiki-bridge);
```

The atelier stylesheet still contributes radii, shadows, paddings,
typography defaults — Strategy A only remaps the color-bearing leaves
plus the focus-ring. Discriminator selectors
(`[data-variant]`, `[data-severity]`, `[data-state]`) are matched
against the same `data-*` hooks Layer 4 emits — see §18.1.

### Strategy B — skip atelier, drive Layer 4 directly

Don't import `@kumiki/atelier/*`. Write component CSS against the
`data-*` hooks and your own tokens:

```css
[data-kumiki-component='dialog-content'] {
  background: var(--base-background-1);
  border-radius: 12px;
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-3);
}
[data-kumiki-component='dialog-overlay'] {
  background: var(--base-background-overlay-1);
}
```

(The `data-kumiki-component` attribute is set by Layer 4; the full
list is generated from `_template.md` for each component spec.)

Strategy B is recommended for apps that already have a complete
visual system — it produces the smallest CSS footprint and keeps
control with the consumer's tokens.

## 18.6 Contract stability

Component-facing leaves (`--kumiki-<comp>-<part>-<prop>`) are
**stable** within a kumiki major version. Adding a new leaf is a
non-breaking change; removing or renaming a leaf is a breaking change
that requires a major bump.

Atelier internals (`--kumiki-color-*`, `--kumiki-radius-*`) are
**unstable** within a major; they may be reorganized when atelier's
visual language evolves. Consumers depending on them are warned in
release notes; the typed contract is at the leaf level.

## 18.7 Pilot

Toggle is the pilot for this contract. Once the leaves above are
implemented in `@kumiki/atelier/toggle`, the same shape rolls out
across the rest of the v1.0 + Phase 1.5 component set.

Tracking issue: see commit history of this file and the `atelier/`
package readme.

## 18.8 References

- ADR 0010 — Layer 5 preview model (atelier).
- `02-architecture.md` §"Layer 5".
- `09-bundle-budget.md` — atelier budgets are independent of Layer 4.
- `17-integration-boundaries.md` §17.1 — themes are the consumer's choice.
