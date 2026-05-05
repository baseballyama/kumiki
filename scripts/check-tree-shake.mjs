#!/usr/bin/env node
/**
 * Tree-shake regression check.
 *
 * The auto-generated umbrella packages (`@kumiki/components`,
 * `@kumiki/recipes`) expose each underlying package as its own
 * subpath. Each subpath's `dist/<slug>.mjs` MUST consist of exactly
 * one `export * from '@kumiki/<inner>'` re-export — anything else
 * means a regression that would leak unrelated component code into
 * a consumer's bundle when they import a single subpath.
 *
 * Combined with:
 *   - `pnpm check:meta-drift` (the source matches the generator's output)
 *   - `pnpm agadoo` (every package is sideEffects-honest)
 *   - per-package `size-limit` budgets
 *
 * this guarantees that `import * as Dialog from '@kumiki/components/dialog'`
 * resolves to `@kumiki/component-dialog` and nothing else — tree-shake
 * stays intact.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = join(dirname(__filename), '..');

/** @type {Array<{ slug: string, distFile: string, expectedTarget: RegExp }>} */
const checks = [];

function pushChecksForUmbrella(metaDir, expectedPrefix) {
  const dir = join(ROOT, 'packages/meta', metaDir);
  if (!existsSync(dir)) return;
  const distDir = join(dir, 'dist');
  if (!existsSync(distDir)) {
    console.warn(`⚠ ${metaDir}: no dist/ — run pnpm --filter @kumiki/${metaDir} build first`);
    return;
  }
  const srcDir = join(dir, 'src');
  for (const entry of readdirSync(srcDir)) {
    if (entry === 'index.ts' || !entry.endsWith('.ts')) continue;
    const slug = entry.replace(/\.ts$/, '');
    const distFile = join(distDir, `${slug}.mjs`);
    if (!existsSync(distFile)) continue;
    checks.push({
      slug: `@kumiki/${metaDir}/${slug}`,
      distFile,
      // The umbrella's source is `export * from '@kumiki/<expectedPrefix>-<slug>';`
      // tsdown leaves it as that exact re-export; allow either single or double quotes.
      expectedTarget: new RegExp(
        `^export \\* from ['"]@kumiki/${expectedPrefix}-${slug}['"];?\\s*(?:export\\s*\\{\\}\\s*;?\\s*)?$`,
      ),
    });
  }
}

pushChecksForUmbrella('components', 'component');
pushChecksForUmbrella('recipes', 'recipes');

if (checks.length === 0) {
  console.error('✘ no umbrella subpaths found — did pnpm gen:meta + pnpm build run?');
  process.exit(1);
}

let failures = 0;
for (const check of checks) {
  const raw = readFileSync(check.distFile, 'utf8').trim();
  if (!check.expectedTarget.test(raw)) {
    console.error(`✘ ${check.slug}: dist subpath leaks beyond a single re-export.`);
    console.error(`    expected match for: ${check.expectedTarget}`);
    console.error(`    got:`);
    for (const line of raw.split('\n')) console.error(`      ${line}`);
    failures++;
  }
}

if (failures > 0) {
  console.error(`\n${failures} tree-shake violation${failures === 1 ? '' : 's'}.`);
  process.exit(1);
}

console.log(`✓ tree-shake invariant holds for ${checks.length} umbrella subpaths`);
