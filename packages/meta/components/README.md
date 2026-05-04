# @kumiki/components

Umbrella package — every Layer 4 (`@kumiki/component-*`) under one install. Auto-generated.

This is an **auto-generated umbrella package**. Do not edit by hand —
`scripts/build-meta-packages.mjs` regenerates it from the workspace.
CI fails the build on drift.

## Why

`@kumiki/components` lets consumers install the entire components surface in one step:

```bash
pnpm add @kumiki/components
```

vs. installing every individual sibling package one at a time.

## Subpath imports

Each item is exposed under its own subpath. Tree-shake stays intact
because every sub-package is `sideEffects: false` — importing one
subpath does not pull the others.

```ts
import * as Accordion from '@kumiki/components/accordion';
import * as Checkbox from '@kumiki/components/checkbox';
import * as Combobox from '@kumiki/components/combobox';
```

## Subpaths

- `@kumiki/components/accordion` → `@kumiki/component-accordion`
- `@kumiki/components/checkbox` → `@kumiki/component-checkbox`
- `@kumiki/components/combobox` → `@kumiki/component-combobox`
- `@kumiki/components/dialog` → `@kumiki/component-dialog`
- `@kumiki/components/form-field` → `@kumiki/component-form-field`
- `@kumiki/components/number-field` → `@kumiki/component-number-field`
- `@kumiki/components/popover` → `@kumiki/component-popover`
- `@kumiki/components/radio-group` → `@kumiki/component-radio-group`
- `@kumiki/components/select` → `@kumiki/component-select`
- `@kumiki/components/slider` → `@kumiki/component-slider`
- `@kumiki/components/switch` → `@kumiki/component-switch`
- `@kumiki/components/tabs` → `@kumiki/component-tabs`
- `@kumiki/components/toast` → `@kumiki/component-toast`
- `@kumiki/components/toggle` → `@kumiki/component-toggle`
- `@kumiki/components/tooltip` → `@kumiki/component-tooltip`

## Status

Stable preview.
