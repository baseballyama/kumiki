# @kumiki/recipes

Layer 5 — opinionated, styled recipe templates built on top of
`@kumiki/components`. Subpath per recipe.

> **Preview.** This package ships under the `preview` npm dist-tag during
> the v1.0 series. Public API may change between minor releases. See
> [ADR 0010](../../docs/design/16-decisions/0010-layer5-preview-in-v1.md).

## Install

```bash
pnpm add @kumiki/recipes@preview
```

## Use

```svelte
<script>
  import { Toggle } from '@kumiki/recipes/toggle';
</script>

<Toggle bind:pressed>Bold</Toggle>
```

## Available subpaths

| Subpath                  | What it ships                                    |
| ------------------------ | ------------------------------------------------ |
| `@kumiki/recipes/toggle` | styled `Toggle` recipe                           |
| `@kumiki/recipes/dialog` | styled `Dialog` recipe with overlay + animations |

## See also

- [`@kumiki/components`](../components) — Layer 4, headless components.
