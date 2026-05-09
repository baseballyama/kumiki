#!/usr/bin/env node
/**
 * Run @microsoft/api-extractor against every Kumiki workspace package.
 *
 * Generates `<pkg>/etc/<unscoped>.api.md` — a git-diffable plaintext
 * snapshot of the public API surface. Any change to the surface
 * shows up as a diff; reviewers can spot a breaking change without
 * digging through `dist/`.
 *
 * Skips:
 * - `@kumiki/components` and `@kumiki/atelier` — they ship `.svelte` files;
 *   api-extractor doesn't understand the Svelte compiler. Their type
 *   surface is verified by `pnpm typecheck` (svelte-check) instead.
 * - The CLI and the docs app.
 * - Placeholder packages with no built `dist/index.d.mts` yet.
 *
 * Each package is initialised with a minimal `api-extractor.json` on
 * its first run; subsequent runs reuse the existing config.
 *
 * Use `--check` to fail when reports are out of date (CI mode).
 * Default mode (`--local`) updates the report files in-place.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = join(dirname(__filename), '..');

const args = new Set(process.argv.slice(2));
const isCheck = args.has('--check');

const DEFAULT_CONFIG = {
  $schema:
    'https://developer.microsoft.com/json-schemas/api-extractor/v7/api-extractor.schema.json',
  mainEntryPointFilePath: '<projectFolder>/dist/index.d.mts',
  compiler: { tsconfigFilePath: '<projectFolder>/tsconfig.json' },
  apiReport: {
    enabled: true,
    reportFolder: '<projectFolder>/etc/',
    reportFileName: '<unscopedPackageName>.api.md',
  },
  docModel: { enabled: false },
  dtsRollup: { enabled: false },
  tsdocMetadata: { enabled: false },
  messages: {
    compilerMessageReporting: { default: { logLevel: 'warning' } },
    extractorMessageReporting: {
      default: { logLevel: 'warning' },
      'ae-missing-release-tag': { logLevel: 'none' },
      'ae-internal-missing-underscore': { logLevel: 'none' },
    },
    // We use custom block tags `@when-to-use` and `@anti-pattern`
    // throughout our JSDoc; suppress TSDoc's complaint about non-
    // standard tags. (Could move to a tsdoc.json with `tagDefinitions`,
    // but silencing is enough for our purposes.)
    tsdocMessageReporting: {
      default: { logLevel: 'none' },
    },
  },
};

function* walkPackageJsons(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === 'dist' || e.name === 'coverage' || e.name === 'etc')
      continue;
    const p = join(dir, e.name);
    if (e.isSymbolicLink()) continue;
    if (e.isDirectory()) yield* walkPackageJsons(p);
    else if (e.name === 'package.json') yield p;
  }
}

function shouldSkip(pkgName) {
  if (!pkgName?.startsWith('@kumiki/')) return 'not-kumiki';
  if (pkgName === '@kumiki/components' || pkgName === '@kumiki/atelier') return 'svelte-source';
  if (pkgName === '@kumiki/cli') return 'binary';
  if (pkgName === '@kumiki/docs') return 'app';
  return null;
}

const eligible = [];
for (const pkgPath of walkPackageJsons(join(ROOT, 'packages'))) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const skipReason = shouldSkip(pkg.name);
  if (skipReason) continue;
  const dir = dirname(pkgPath);
  const dts = join(dir, 'dist', 'index.d.mts');
  if (!existsSync(dts)) continue; // package not yet built
  eligible.push({ name: pkg.name, dir });
}

if (eligible.length === 0) {
  console.error('✘ no eligible packages found — run `pnpm build` first.');
  process.exit(1);
}

let failed = 0;
for (const { name, dir } of eligible) {
  // Always overwrite the per-package api-extractor.json — it's a
  // generated artifact, not a hand-edited one. Keeping it in source
  // control still makes sense (so individual `pnpm exec api-extractor`
  // invocations from a package dir work without the script).
  const configPath = join(dir, 'api-extractor.json');
  writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2) + '\n');
  const etcDir = join(dir, 'etc');
  if (!existsSync(etcDir)) mkdirSync(etcDir, { recursive: true });

  const flags = isCheck ? ['run'] : ['run', '--local'];
  try {
    execFileSync('pnpm', ['exec', 'api-extractor', ...flags], {
      cwd: dir,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    console.log(`✓ ${name}`);
  } catch (e) {
    failed++;
    const stderr = e.stderr?.toString().trim() ?? '';
    const stdout = e.stdout?.toString().trim() ?? '';
    console.error(`✘ ${name}`);
    if (stdout)
      console.error(
        stdout
          .split('\n')
          .map((l) => `  ${l}`)
          .join('\n'),
      );
    if (stderr)
      console.error(
        stderr
          .split('\n')
          .map((l) => `  ${l}`)
          .join('\n'),
      );
  }
}

if (failed > 0) {
  console.error(`\n${failed} package${failed === 1 ? '' : 's'} failed.`);
  process.exit(1);
}

console.log(
  `\n✓ ${eligible.length} api report${eligible.length === 1 ? '' : 's'} ${isCheck ? 'verified' : 'written'}`,
);
