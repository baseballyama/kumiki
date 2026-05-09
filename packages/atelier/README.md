# @kumiki/atelier

Layer 5 — opinionated, styled component variants built on top of
`@kumiki/components`. Subpath per component, two variants per subpath
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

Pick a variant at the import site. **Tailwind**:

```svelte
<script>
  import { Tailwind } from '@kumiki/atelier/toggle';
</script>

<Tailwind size="md" variant="default" bind:pressed>Bold</Tailwind>
```

**Vanilla CSS** (theme via `--kumiki-toggle-*` custom properties):

```svelte
<script>
  import { Vanilla as Toggle } from '@kumiki/atelier/toggle';
</script>

<Toggle bind:pressed>Bold</Toggle>
```

For Dialog, each variant is a namespace with the full compound surface:

```svelte
<script>
  import { Tailwind as Dialog } from '@kumiki/atelier/dialog';
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Overlay />
  <Dialog.Content>
    <Dialog.Title>Are you sure?</Dialog.Title>
    <Dialog.Description>This cannot be undone.</Dialog.Description>
    <Dialog.Close>Confirm</Dialog.Close>
  </Dialog.Content>
</Dialog.Root>
```

## Available subpaths (v1.0 preview)

| Subpath                  | Components                                                      | Variants              |
| ------------------------ | --------------------------------------------------------------- | --------------------- |
| `@kumiki/atelier/toggle` | `Toggle`                                                        | `Tailwind`, `Vanilla` |
| `@kumiki/atelier/dialog` | `Dialog.{Root,Trigger,Overlay,Content,Title,Description,Close}` | `Tailwind`, `Vanilla` |

More Atelier components ship in Phase 2 alongside the rest of the
Phase 1 component set.

## See also

- [`@kumiki/components`](../components) — Layer 4 headless components the Atelier wraps.
- [`@kumiki/cli`](../tooling/cli) — copy Atelier sources into your project.
- [ADR 0010](../../docs/design/16-decisions/0010-layer5-preview-in-v1.md) — why Atelier ships as preview during v1.0.
