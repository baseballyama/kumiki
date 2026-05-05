# @kumiki/recipes

Layer 5 — opinionated, styled recipe templates built on top of
`@kumiki/components`. Subpath per recipe.

> **Preview, scaffolding only.** This package ships under the `preview` npm
> dist-tag during the v1.0 series. The recipe implementations themselves land
> in Phase 2 — current sources are empty placeholders. See
> [ADR 0010](../../docs/design/16-decisions/0010-layer5-preview-in-v1.md) and
> [docs/design/15-roadmap.md](../../docs/design/15-roadmap.md).

## Install (when shipped)

```bash
pnpm add @kumiki/recipes@preview
```

## Planned subpaths

| Subpath                  | What it will ship                                |
| ------------------------ | ------------------------------------------------ |
| `@kumiki/recipes/toggle` | styled `Toggle` recipe                           |
| `@kumiki/recipes/dialog` | styled `Dialog` recipe with overlay + animations |

## See also

- [`@kumiki/components`](../components) — Layer 4, headless components.
