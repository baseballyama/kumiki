# @kumiki/cli

> The `kumiki` binary — copy Layer 5 Atelier sources into your project. Same `add` model as shadcn-svelte.

**Layer:** Tooling.

> **Status:** Phase 0a stub. `--help` and the unknown-command branch
> are wired (see `packages/tooling/cli/src/bin/kumiki.test.ts`); the
> real `kumiki add <component>` flow lands in Phase 1 alongside the
> first stable Atelier components.

## Install

```bash
pnpm add -D @kumiki/cli
# or run on demand without installing:
npx kumiki --help
```

## Use (planned)

```bash
# Copy a styled Atelier component into ./src/lib/components/ui/
kumiki add toggle --variant=tailwind
kumiki add dialog --variant=vanilla
```

The variants:

- `tailwind` — Tailwind v4 utility classes.
- `vanilla` — CSS modules with custom properties for theming.

## See also

- [`@kumiki/atelier`](../../atelier) — Layer 5 Atelier sources the CLI copies from.
- [ADR 0010](../../../docs/design/16-decisions/0010-layer5-preview-in-v1.md) — why Layer 5 ships as `preview` during v1.0.
- [`docs/design/15-roadmap.md`](../../../docs/design/15-roadmap.md) §15.5 — Atelier copy flow.
