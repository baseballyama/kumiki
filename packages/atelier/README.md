# @kumiki/atelier

Layer 5 — opinionated, styled component variants built on top of
`@kumiki/components`. Subpath per component, variant per subpath
(Tailwind v4 + vanilla CSS).

The Atelier is Kumiki's "finishing workshop": once the structural
joinery (Layers 1–4) is in place, the Atelier applies the surface
treatment so you can drop a polished UI in without writing CSS.

> **Preview.** This package ships under the `preview` npm dist-tag during
> the v1.0 series. Public API may change between minor releases. See
> [ADR 0010](../../docs/design/16-decisions/0010-layer5-preview-in-v1.md).

## Install

```bash
pnpm add @kumiki/atelier@preview
```

…or copy a single component into your project with the CLI:

```bash
pnpm dlx @kumiki/cli add toggle --variant=tailwind
```

## Use

```svelte
<script>
  import { Toggle } from '@kumiki/atelier/toggle';
</script>

<Toggle bind:pressed>Bold</Toggle>
```

## Available subpaths

| Subpath                  | What it ships                                    |
| ------------------------ | ------------------------------------------------ |
| `@kumiki/atelier/toggle` | styled `Toggle` (Tailwind v4 + vanilla variants) |
| `@kumiki/atelier/dialog` | styled `Dialog` with overlay + animations        |

## See also

- [`@kumiki/components`](../components) — Layer 4, headless components.
- [`@kumiki/cli`](../tooling/cli) — copy Atelier sources into your project.
