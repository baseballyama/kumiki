#!/usr/bin/env node
/**
 * `kumiki` CLI entry point.
 *
 * Phase 0a: stub. Phase 1: `kumiki add <component> [--variant=tailwind|vanilla]`
 * copies a Layer 5 recipe source into the user's project — the same model as
 * shadcn-svelte. See `docs/design/15-roadmap.md` §15.5.
 */

const argv = process.argv.slice(2);

if (argv.length === 0 || argv[0] === '--help' || argv[0] === '-h') {
  process.stdout.write(`kumiki — copy Layer 5 recipes into your project (pre-alpha)

Usage:
  kumiki add <component> [--variant=tailwind|vanilla]

Phase 0a status: this CLI is a stub. The recipe copy flow lands in Phase 1.
Track: https://github.com/baseballyama/kumiki
`);
  process.exit(0);
}

process.stderr.write(`kumiki: command "${argv[0]}" is not implemented yet (Phase 1).\n`);
process.exit(2);
