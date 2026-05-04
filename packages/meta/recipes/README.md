# @kumiki/recipes

Umbrella package — every Layer 5 (`@kumiki/recipes-*`) under one install. Auto-generated; published 0.x.x-preview during the v1.0 series.

This is an **auto-generated umbrella package**. Do not edit by hand —
`scripts/build-meta-packages.mjs` regenerates it from the workspace.
CI fails the build on drift.

## Why

`@kumiki/recipes` lets consumers install the entire recipes surface in one step:

```bash
pnpm add @kumiki/recipes
```

vs. installing every individual sibling package one at a time.

## Subpath imports

Each item is exposed under its own subpath. Tree-shake stays intact
because every sub-package is `sideEffects: false` — importing one
subpath does not pull the others.

```ts
import * as Dialog from '@kumiki/recipes/dialog';
import * as Toggle from '@kumiki/recipes/toggle';
```

## Subpaths

- `@kumiki/recipes/dialog` → `@kumiki/recipes-dialog`
- `@kumiki/recipes/toggle` → `@kumiki/recipes-toggle`

## Status

⚠️ Layer 5 preview — published as `0.x.x-preview` during the v1.0 series. APIs may change.
