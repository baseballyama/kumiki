#!/usr/bin/env node
/**
 * Make sure `docs/api/` is fresh enough to power the docs site.
 *
 * Why: TypeDoc output is gitignored — every clean checkout starts without
 * it. The docs site's `prebuild` already runs `pnpm typedoc`, but `dev`
 * has no equivalent, so first-time devs see broken `/api` links and
 * existing devs see stale members after a JSDoc edit.
 *
 * Algorithm:
 *   1. If `docs/api/` is empty or missing → regenerate.
 *   2. Otherwise compare the oldest mtime under `docs/api/` against the
 *      newest mtime under `packages/{core,machines,headless}/**\/*.ts`.
 *      If the source is newer → regenerate.
 *   3. Otherwise skip.
 *
 * Set `KUMIKI_FORCE_TYPEDOC=1` to bypass the freshness check.
 *
 * The actual regen is done by spawning `pnpm typedoc` so the typedoc
 * config and exit code stay authoritative — this script just decides
 * whether to call it.
 */

import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const API_DIR = join(ROOT, 'docs/api');
const SOURCE_GLOB_ROOTS = [
  join(ROOT, 'packages/core'),
  join(ROOT, 'packages/machines/src'),
  join(ROOT, 'packages/headless/src'),
];
const FORCE = process.env.KUMIKI_FORCE_TYPEDOC === '1';

/** Walk a directory and yield every regular-file mtime in ms. */
function* walkMtimes(dir, predicate = () => true) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      yield* walkMtimes(full, predicate);
    } else if (entry.isFile() && predicate(full)) {
      yield statSync(full).mtimeMs;
    }
  }
}

function oldest(it) {
  let best = Infinity;
  for (const t of it) if (t < best) best = t;
  return best;
}

function newest(it) {
  let best = 0;
  for (const t of it) if (t > best) best = t;
  return best;
}

function run() {
  const result = spawnSync('pnpm', ['-w', 'run', 'typedoc'], {
    stdio: 'inherit',
    cwd: ROOT,
  });
  process.exit(result.status ?? 1);
}

if (FORCE) {
  console.log('[ensure-api-docs] KUMIKI_FORCE_TYPEDOC=1 — regenerating.');
  run();
}

if (!existsSync(API_DIR) || readdirSync(API_DIR).length === 0) {
  console.log('[ensure-api-docs] docs/api/ is missing — generating once.');
  run();
}

const apiOldest = oldest(walkMtimes(API_DIR, (p) => p.endsWith('.md')));
const isTs = (p) => p.endsWith('.ts') && !p.endsWith('.test.ts') && !p.endsWith('.bench.ts');
let srcNewest = 0;
for (const dir of SOURCE_GLOB_ROOTS) {
  const t = newest(walkMtimes(dir, isTs));
  if (t > srcNewest) srcNewest = t;
}

if (srcNewest > apiOldest) {
  console.log('[ensure-api-docs] source newer than docs/api/ — regenerating.');
  run();
} else {
  console.log('[ensure-api-docs] docs/api/ is fresh.');
}
