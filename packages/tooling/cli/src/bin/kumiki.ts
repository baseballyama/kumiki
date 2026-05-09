#!/usr/bin/env node
/**
 * `kumiki` CLI binary.
 *
 * Usage:
 *   kumiki add <component> [--variant=tailwind|vanilla] [--dest=<dir>]
 *                          [--force] [--dry-run]
 *   kumiki --help
 *
 * Phase 1 entry point. The implementation lives in `../index.ts` so it's
 * also importable from other tooling.
 */

import {
  AtelierNotInstalledError,
  FileExistsError,
  UnknownComponentError,
  add,
  REGISTRY,
  type Variant,
} from '../index.js';

const HELP_TEXT = `kumiki — copy Layer 5 Atelier components into your project

Usage:
  kumiki add <component> [options]

Available components:
${REGISTRY.map((s) => `  ${s.name}`).join('\n')}

Options:
  --variant=<tailwind|vanilla>   styled variant to copy (default: tailwind)
  --dest=<dir>                   destination dir, relative to cwd
                                 (default: src/lib/components/ui)
  --force                        overwrite existing files
  --dry-run                      print actions without writing
  -h, --help                     show this help
`;

interface ParsedArgs {
  command: string | null;
  positional: string[];
  variant: Variant;
  dest?: string;
  force: boolean;
  dryRun: boolean;
  help: boolean;
}

function parseArgs(argv: ReadonlyArray<string>): ParsedArgs {
  const out: ParsedArgs = {
    command: null,
    positional: [],
    variant: 'tailwind',
    force: false,
    dryRun: false,
    help: false,
  };

  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      out.help = true;
      continue;
    }
    if (arg === '--force') {
      out.force = true;
      continue;
    }
    if (arg === '--dry-run') {
      out.dryRun = true;
      continue;
    }
    if (arg.startsWith('--variant=')) {
      const v = arg.slice('--variant='.length);
      if (v !== 'tailwind' && v !== 'vanilla') {
        process.stderr.write(`kumiki: invalid --variant "${v}" (expected tailwind | vanilla)\n`);
        process.exit(2);
      }
      out.variant = v;
      continue;
    }
    if (arg.startsWith('--dest=')) {
      out.dest = arg.slice('--dest='.length);
      continue;
    }
    if (arg.startsWith('--')) {
      process.stderr.write(`kumiki: unknown option "${arg}"\n`);
      process.exit(2);
    }
    if (out.command === null) {
      out.command = arg;
      continue;
    }
    out.positional.push(arg);
  }

  return out;
}

function main(): void {
  const argv = process.argv.slice(2);

  if (argv.length === 0) {
    process.stdout.write(HELP_TEXT);
    process.exit(0);
  }

  const args = parseArgs(argv);

  if (args.help) {
    process.stdout.write(HELP_TEXT);
    process.exit(0);
  }

  if (args.command !== 'add') {
    process.stderr.write(`kumiki: unknown command "${args.command}"\n\n${HELP_TEXT}`);
    process.exit(2);
  }

  const componentName = args.positional[0];
  if (!componentName) {
    process.stderr.write('kumiki add: missing <component> argument\n');
    process.exit(2);
  }

  try {
    const result = add(componentName, {
      variant: args.variant,
      dest: args.dest,
      force: args.force,
      dryRun: args.dryRun,
    });

    const verb = args.dryRun ? 'Would write' : 'Wrote';
    process.stdout.write(
      `${verb} ${result.written.length} file${result.written.length === 1 ? '' : 's'} for ${result.component} (${result.variant}):\n`,
    );
    for (const path of result.written) process.stdout.write(`  ${path}\n`);
    if (result.skipped.length > 0) {
      process.stdout.write(`Skipped ${result.skipped.length} (already exist):\n`);
      for (const s of result.skipped) process.stdout.write(`  ${s.path}\n`);
    }
    if (!args.dryRun) {
      const spec = REGISTRY.find((s) => s.name === componentName);
      if (spec) {
        process.stdout.write(`\nImport hint:\n  ${spec.importHint(args.variant)}\n`);
      }
    }
    process.exit(0);
  } catch (err) {
    if (err instanceof UnknownComponentError) {
      process.stderr.write(`kumiki: ${err.message}\n`);
      process.exit(2);
    }
    if (err instanceof AtelierNotInstalledError) {
      process.stderr.write(`kumiki: ${err.message}\n`);
      process.exit(1);
    }
    if (err instanceof FileExistsError) {
      process.stderr.write(`kumiki: ${err.message}\n`);
      process.exit(1);
    }
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`kumiki: ${message}\n`);
    process.exit(1);
  }
}

main();
