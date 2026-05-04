# Contributing to Kumiki

Thanks for your interest! Kumiki is in **pre-alpha** — the design is still being refined and breaking changes happen weekly. The most useful contributions right now are:

1. **Read [docs/design.md](docs/design.md)** and open an issue for anything that is unclear, contradictory, or under-specified.
2. **Try competitive scenarios on paper.** Pick a real component you've built before; map its requirements onto Kumiki's planned API and tell us where the seams chafe.
3. **Validate the bundle budget assumptions** — see [docs/design/09-bundle-budget.md](docs/design/09-bundle-budget.md). If you've shipped a Svelte headless component, your numbers are gold.

Once Phase 0 lands (mid-2026), we'll open up code contributions in earnest.

## Development setup

Requires **Node 22+** and **pnpm 9+**. The repo uses pnpm workspaces — there is no Turborepo / Nx layer.

### Recommended: Nix dev shell

Every contributor runs the same toolchain via [Nix flakes](https://nixos.wiki/wiki/Flakes). Node 22 + corepack-managed pnpm are pinned in `flake.nix`; `flake.lock` freezes them per commit.

```bash
# One-time:
#  - Install Nix (https://nixos.org/download). On macOS the Determinate
#    installer is the painless option.
#  - (Optional) Install direnv + nix-direnv so cd-ing into the repo
#    auto-loads the shell.

nix develop          # drops you into a shell with node + pnpm pinned
# or, with direnv:
direnv allow         # one-off; subsequent `cd` loads the shell silently

pnpm install
pnpm build
```

### Without Nix

Manage Node and pnpm yourself (asdf / fnm / Volta / mise). Match the
versions in `package.json#engines` and `package.json#packageManager` —
otherwise lockfile drift will hit you.

```bash
git clone https://github.com/baseballyama/kumiki
cd kumiki
pnpm install
pnpm build       # builds every package
pnpm test        # runs Vitest across the workspace
pnpm typecheck   # tsc / svelte-check
pnpm size        # size-limit per package
```

## Commit style

[Conventional Commits](https://www.conventionalcommits.org/). Scope is the package name minus `@kumiki/`:

```
feat(machine-combobox): add async option fetcher
fix(component-dialog): focus restore after close
docs(design): clarify Layer 3 vs 4 boundary
```

## Changesets

Every PR that touches a package under `packages/` must include a `.changeset/*.md`:

```bash
pnpm changeset
```

Pick the affected packages and the bump (`patch` / `minor` / `major`). Commit the generated file alongside your code.

## Running a single component's tests

```bash
pnpm --filter @kumiki/machine-combobox test
pnpm --filter @kumiki/component-combobox test
```

## a11y testing

Two layers locally:

- **axe-core** (fast, runs on every PR). `pnpm --filter @kumiki/docs run test:a11y`.
- **Guidepup** (real screen-reader, slow, runs in scheduled CI on macOS/Windows). Locally: `GUIDEPUP=1 pnpm --filter @kumiki/docs run test:sr` (requires NVDA on Windows or VoiceOver permissions on macOS).

## Reference repositories (optional)

`references/` holds shallow git submodules of competitor/reference libraries (Bits UI, Melt UI, Zag, Radix, React Aria via react-spectrum, Ark UI, shadcn-svelte, Base UI). It is **opt-in**:

```bash
git submodule update --init --depth=1   # ~400 MB total
```

CI does not fetch references. Lint, typecheck, format, and the workspace all skip this directory. See [`references/README.md`](references/README.md) for details.

## Repository layout

See [README.md](README.md#repository-layout) and [docs/design/03-package-structure.md](docs/design/03-package-structure.md).

## Code of conduct

Be considerate. Disagreements about design are welcome; personal attacks are not.

## Licensing

By contributing, you agree your contribution will be MIT-licensed under [LICENSE](LICENSE).
