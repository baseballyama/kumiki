# ADR 0009 — tsdown for TS-only packages, svelte-package for Svelte

**Status:** Accepted
**Date:** 2026-05

## Context

Kumiki has two kinds of packages:

- **Pure TypeScript** (`@kumiki/machines`, `@kumiki/headless`, `@kumiki/primitives`, `@kumiki/runtime`, `@kumiki/locale`, `@kumiki/types`).
- **Svelte components** (`@kumiki/components`, `@kumiki/recipes`).

Each kind has different build requirements:

- TS packages need fast TS-to-JS, DTS bundling, and ES module output.
- Svelte packages need `.svelte` preprocessing (TS / PostCSS stripped) and `.svelte.d.ts` generation. The consumer's bundler does the actual `.svelte` compilation.

`tsup` was the standard for TS libraries in 2024-2025 (esbuild-based, fast, simple). `tsdown` (Rolldown-powered, VoidZero-maintained — same team behind Vite/Vitest) is its successor as of 2026: faster (3–10×), with built-in `package.json#exports` autogeneration, and tighter integration with the Vite ecosystem.

User preference (Q4 in the design brief): role-split, with **tsdown** instead of tsup.

## Decision

- **TS-only packages**: build with **tsdown** (~0.21.x as of May 2026). Configured per-package via `tsdown.config.ts`.
- **Svelte component packages**: build with **`@sveltejs/package`** (svelte-package). Output goes to `dist/`; `.svelte` is preprocessed but uncompiled; `.svelte.d.ts` is generated.

Both produce ESM-only output. We do not ship CJS.

## Alternatives considered

| Option                                                   | Verdict                                                                                         |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **tsdown + svelte-package** (chosen)                     | ✅ Each tool plays to its strengths; tsdown is the modern TS choice                             |
| **tsup + svelte-package**                                | ⚠️ Works, but tsup is in maintenance mode as of 2026; tsdown is the chosen successor            |
| **`@sveltejs/package` only**, including TS-only packages | ❌ svelte-package isn't optimized for pure TS; produces less optimal output and no DTS bundling |
| **Vite library mode for everything**                     | ❌ Heavier config per package; not as well-tuned as tsdown for this use case                    |

## Consequences

**Easier:**

- Pure TS packages get fast, modern, Rolldown-powered builds with built-in DTS support.
- Svelte packages use the canonical Svelte tool — minimal surprise for contributors.
- Both toolchains output to `dist/`, so the rest of the pipeline (size-limit, publint, attw, agadoo) is uniform.

**Harder:**

- tsdown is **pre-1.0** (`~0.21.x` in May 2026). Pin tightly; expect breaking changes. We pin via the workspace catalog and bump deliberately.
- Two build tools instead of one. Mitigation: each package has a single `pnpm build` script; the polyrepo-style choice is invisible to consumers.
- Edge case: a package mixing `.ts` and `.svelte` files needs both tools. We avoid this by keeping each package single-language. (Layer 3 attachments are `.svelte.ts`, which `tsdown` handles via Svelte preprocessor plugins; if that path proves brittle, we move attachments to use svelte-package.)

## tsdown config sample

```ts
// tsdown.config.ts (per package)
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  treeshake: true,
  clean: true,
  // pure TS packages mark Svelte as an external (not present in TS-only packages, but good defaults)
  external: [/^@kumiki\//, 'svelte', 'svelte/store', '@floating-ui/dom'],
});
```

## svelte-package usage

Svelte packages do not need a config file in most cases. The build script invokes svelte-package with input/output flags:

```json
{
  "scripts": {
    "build": "svelte-package -i src -o dist && publint"
  }
}
```

## Integration with `package.json` `exports`

Both tools cooperate with the `exports` field we author by hand. We do not autogenerate `exports` — subpath layout is a design decision (per [03-package-structure.md](../03-package-structure.md)), not a build artifact.

## References

- tsdown: https://tsdown.dev/
- VoidZero (maintainers of Vite, Vitest, Rolldown, tsdown): https://voidzero.dev/
- svelte-package: https://svelte.dev/docs/kit/packaging
- User's Q4 answer (May 2026): chose B with tsdown.
