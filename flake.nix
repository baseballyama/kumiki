{
  description = "Kumiki — headless, composable Svelte 5 UI primitives. Reproducible dev shell for every contributor.";

  inputs = {
    # Pinned via `nix flake update`. Uses nixos-unstable so Node 22.x stays
    # current; `flake.lock` freezes the commit so every contributor builds
    # against the same revision.
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
          name = "kumiki";

          packages = [
            # Engines.node ≥ 22 (see package.json). nodejs_22 tracks the
            # latest 22.x patch; nixpkgs bumps minor as upstream ships.
            pkgs.nodejs_22

            # corepack pins pnpm to the version in package.json's
            # `packageManager` field, so every contributor uses pnpm@9.15.0
            # without any global install.
            pkgs.corepack

            # Workspace + repo basics.
            pkgs.git
            pkgs.gnumake
            pkgs.gnused
            pkgs.gawk

            # Playwright browsers are downloaded by the project, but
            # Playwright's Linux runtime needs these system libs. macOS
            # Nix doesn't need them but they're harmless.
            pkgs.cacert
          ];

          shellHook = ''
            # Make corepack-managed pnpm available without a global install.
            # Corepack's "enable" is a no-op if pnpm is already on PATH.
            ${pkgs.corepack}/bin/corepack enable >/dev/null 2>&1 || true

            # Quiet pnpm telemetry; deterministic dev shells should never
            # phone home.
            export DO_NOT_TRACK=1
            export NEXT_TELEMETRY_DISABLED=1
            export ASTRO_TELEMETRY_DISABLED=1

            echo "kumiki dev shell"
            echo "  node: $(node --version)"
            echo "  pnpm: $(pnpm --version 2>/dev/null || echo 'run `corepack enable` if missing')"
          '';
        };
      });
}
