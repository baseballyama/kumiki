#!/usr/bin/env node
/**
 * Build apps/docs/static/sizes.json — verified bundle measurements aggregated
 * across every Kumiki package that has a size-limit config.
 *
 * Walks packages/, runs `size-limit --json` in each, and concatenates the
 * results into a flat object the docs site (or external dashboards) can
 * consume.
 *
 * Run via:
 *   node apps/docs/scripts/build-sizes.mjs
 *
 * Output schema (v1):
 *   {
 *     "generatedAt": "ISO 8601",
 *     "packages": [
 *       {
 *         "package": "@kumiki/machine-toggle",
 *         "directory": "packages/components/toggle/machine",
 *         "entries": [
 *           { "name": "...", "size": 399, "sizeLimit": 500, "passed": true }
 *         ]
 *       }
 *     ]
 *   }
 *
 * Exits non-zero if any size-limit run fails — useful as a CI gate.
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const SCRIPT_DIR = dirname(__filename);
const ROOT = join(SCRIPT_DIR, '..', '..', '..');
const PACKAGES = join(ROOT, 'packages');
const OUT = join(SCRIPT_DIR, '..', 'static', 'sizes.json');

function* findPackageJsons(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === 'dist') continue;
    const p = join(dir, e.name);
    if (e.isSymbolicLink()) continue;
    if (e.isDirectory()) yield* findPackageJsons(p);
    else if (e.name === 'package.json') yield p;
  }
}

const packages = [];
let anyFailure = false;

for (const pkgPath of findPackageJsons(PACKAGES)) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  if (!pkg.name?.startsWith('@kumiki/')) continue;
  if (!Array.isArray(pkg['size-limit']) || pkg['size-limit'].length === 0) continue;
  // Skip Layer 4 components and recipes — esbuild can't load `.svelte`
  // imports without the Svelte plugin (kept out of root).
  if (pkg.name.startsWith('@kumiki/component-') || pkg.name.startsWith('@kumiki/recipes-')) {
    continue;
  }
  const dir = dirname(pkgPath);
  const distEntry = join(dir, 'dist');
  if (!existsSync(distEntry)) {
    console.warn(`⚠  ${pkg.name}: no dist/ — run \`pnpm build\` first`);
    continue;
  }
  let raw;
  try {
    raw = execFileSync('pnpm', ['exec', 'size-limit', '--json'], {
      cwd: dir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (err) {
    anyFailure = true;
    console.error(`✘ ${pkg.name}: size-limit failed`);
    console.error(err.stderr ?? err.message);
    continue;
  }
  let entries;
  try {
    // size-limit interleaves a CLI banner with the JSON in some terminals.
    // Locate the JSON array start defensively.
    const start = raw.indexOf('[');
    entries = JSON.parse(raw.slice(start));
  } catch (err) {
    anyFailure = true;
    console.error(`✘ ${pkg.name}: could not parse size-limit JSON`);
    console.error(raw);
    continue;
  }
  packages.push({
    package: pkg.name,
    directory: relative(ROOT, dir),
    entries: entries.map((e) => ({
      name: e.name,
      size: e.size,
      sizeLimit: e.sizeLimit,
      passed: e.passed,
    })),
  });
  for (const e of entries) {
    if (!e.passed) anyFailure = true;
  }
}

packages.sort((a, b) => a.package.localeCompare(b.package));
const out = {
  generatedAt: new Date().toISOString(),
  packages,
};
writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(`✓ Wrote ${packages.length} packages to ${relative(ROOT, OUT)}`);
if (anyFailure) {
  console.error('✘ At least one package exceeded its size-limit budget.');
  process.exit(1);
}
