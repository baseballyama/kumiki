# @kumiki/cli

> The `kumiki` binary — copy Layer 5 Atelier sources into your project. Same `add` model as shadcn-svelte.

**Layer:** Tooling.

## Install

```bash
pnpm add -D @kumiki/cli @kumiki/atelier@preview
# or run on demand without installing:
npx kumiki --help
```

## Use

```bash
# Default — Tailwind v4 variant into ./src/lib/components/ui/
kumiki add toggle
kumiki add dialog

# Vanilla CSS variant
kumiki add toggle --variant=vanilla
kumiki add dialog --variant=vanilla

# Custom destination
kumiki add toggle --dest=app/widgets

# Overwrite existing files (default refuses to clobber)
kumiki add toggle --force

# Print actions without writing
kumiki add toggle --dry-run
```

After a successful `add`, `kumiki` prints an import hint:

```
Wrote 1 file for toggle (tailwind):
  /your-app/src/lib/components/ui/toggle/Toggle.svelte

Import hint:
  import Toggle from '$lib/components/ui/toggle/Toggle.svelte';
```

## Programmatic API

The same operation is available as a function for scaffolding scripts:

```ts
import { add } from '@kumiki/cli';

const { written } = add('toggle', { variant: 'vanilla', force: true });
console.log(`Copied ${written.length} files`);
```

Errors thrown:

| Class                      | When                                                   |
| -------------------------- | ------------------------------------------------------ |
| `UnknownComponentError`    | `<component>` is not in the registry                   |
| `AtelierNotInstalledError` | `@kumiki/atelier` is not in `node_modules`             |
| `FileExistsError`          | A destination file exists and `--force` was not passed |

## See also

- [`@kumiki/atelier`](../../atelier) — Layer 5 Atelier sources the CLI copies from.
- [ADR 0010](../../../docs/design/16-decisions/0010-layer5-preview-in-v1.md) — why Layer 5 ships as `preview` during v1.0.
- [`docs/design/15-roadmap.md`](../../../docs/design/15-roadmap.md) §15.5 — Atelier copy flow.
