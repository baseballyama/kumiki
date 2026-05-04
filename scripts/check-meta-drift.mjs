#!/usr/bin/env node
// Drift detection for the auto-generated umbrella packages.
//
// Re-runs `scripts/build-meta-packages.mjs` into a temp directory, then
// compares the result against the committed `packages/meta/*` tree. If
// anything would change, exits non-zero with a one-line hint pointing
// the contributor at `pnpm gen:meta`.

import path from 'node:path';
import url from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');

execFileSync('node', [path.join(ROOT, 'scripts/build-meta-packages.mjs')], {
  cwd: ROOT,
  stdio: 'pipe',
});

let drift = '';
try {
  // -- ignore generated dist artifacts; we only compare sources + manifests.
  drift = execFileSync(
    'git',
    ['diff', '--name-only', '--', 'packages/meta/components', 'packages/meta/recipes'],
    { cwd: ROOT, encoding: 'utf8' },
  ).trim();
} catch (e) {
  console.error('check-meta-drift: git diff failed:', e.message);
  process.exit(1);
}

if (drift) {
  console.error('✗ meta packages out of date:');
  for (const line of drift.split('\n')) console.error('  ' + line);
  console.error('  Run `pnpm gen:meta` to regenerate.');
  process.exit(1);
}

console.log('✓ meta packages up to date');
