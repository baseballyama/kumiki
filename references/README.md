# References

> Read-only competitor and inspiration sources, kept locally for design + implementation work.

These are **external repositories** mounted as **shallow git submodules** (`depth=1`). They are not part of the Kumiki workspace — `pnpm install`, lint, typecheck, format, and CI all skip this directory.

The contents are subject to each upstream's license. Do not modify, edit, or copy code into Kumiki without explicit attribution and license review.

## What's here

| Folder | Upstream | Why it's here |
|---|---|---|
| `bits-ui/` | [huntabyte/bits-ui](https://github.com/huntabyte/bits-ui) | Svelte 5 native — primary reference for `child` snippet, runes-first design, Compound API on Svelte |
| `melt-ui/` | [melt-ui/melt-ui](https://github.com/melt-ui/melt-ui) | Builder pattern — internal/* subpath exports, the only Svelte lib running `jest-axe` in CI |
| `zag/` | [chakra-ui/zag](https://github.com/chakra-ui/zag) | Framework-agnostic state machines — model for `@kumiki/runtime` |
| `radix-primitives/` | [radix-ui/primitives](https://github.com/radix-ui/primitives) | Compound API gold standard — 59-package split, `Slot`/`asChild`, `data-state` attributes |
| `react-spectrum/` | [adobe/react-spectrum](https://github.com/adobe/react-spectrum) | React Aria + `@internationalized/date` — i18n / a11y depth, per-locale subpath exports |
| `ark-ui/` | [chakra-ui/ark](https://github.com/chakra-ui/ark) | Compound wrappers around Zag machines — cross-framework distribution shape |
| `shadcn-svelte/` | [huntabyte/shadcn-svelte](https://github.com/huntabyte/shadcn-svelte) | Layer 5 distribution model — `npx shadcn add` style copy-paste recipes |
| `base-ui/` | [mui/base-ui](https://github.com/mui/base-ui) | Render-prop / `render` slot design — alternative to `asChild` |

## How to use

### First-time setup

```bash
git submodule update --init --depth=1
```

This is **opt-in** — the default `git clone` does not fetch references. New contributors can skip if they're only working on docs.

### Update one submodule

```bash
git submodule update --remote --depth=1 references/bits-ui
git add references/bits-ui
git commit -m 'chore(references): bump bits-ui to <sha>'
```

### Update all references

```bash
git submodule foreach 'git fetch --depth=1 origin && git checkout origin/HEAD'
git add references
git commit -m 'chore(references): refresh all'
```

### Remove a submodule

```bash
git submodule deinit -f references/<name>
git rm -f references/<name>
rm -rf .git/modules/references/<name>
git commit -m 'chore(references): drop <name>'
```

## What we use them for

- **Reading source.** `package.json` `exports` shapes, machine definitions, test files, `.svelte` patterns. We grep here before designing a new piece.
- **Comparing test strategy.** How does Bits UI structure its test suite? Does Melt UI have an axe rule list? How does Zag organize machine packages? `find references -name '*.test.*'` answers all of those locally without web fetches.
- **Verifying assumptions.** When `docs/design.md` cites a competitor's implementation, we can check it directly here.

## What we *don't* use them for

- **Copying code.** Each upstream has its own license (MIT mostly; Adobe-BSD for some React Spectrum). If we ever need to reuse a snippet, we attribute it explicitly per upstream license.
- **Running their tests.** No `pnpm install` here.
- **CI.** GitHub Actions checkout default (`submodules: false`) skips this folder.

## Sizes (shallow clone)

```
~5 MB    radix-primitives/
~5 MB    melt-ui/
~10 MB   bits-ui/
~18 MB   base-ui/
~34 MB   shadcn-svelte/
~35 MB   zag/
~78 MB   ark-ui/
~217 MB  react-spectrum/
─────────
~400 MB  total
```

react-spectrum is the largest — it is Adobe's full monorepo (RSP + RAC + `@internationalized/*`), and shallow cloning still pulls the entire working tree.
