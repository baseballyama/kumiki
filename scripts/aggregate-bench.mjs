#!/usr/bin/env node
/**
 * Aggregate vitest bench results into a single JSON for the docs site.
 *
 * Walks every package that has a `bench` script, runs `vitest bench --run
 * --outputJson` in it, parses the result, and writes a flat per-bench
 * record to `apps/docs/static/benches.json`. The docs site (or external
 * tooling) can render this for trend tracking.
 *
 * Run via:
 *   pnpm bench:json
 *
 * Output schema (v1):
 *   {
 *     "generatedAt": "ISO 8601",
 *     "packages": [
 *       {
 *         "package": "@kumiki/runtime",
 *         "directory": "packages/core/runtime",
 *         "groups": [
 *           {
 *             "name": "runtime / construction",
 *             "benches": [
 *               { "name": "...", "hz": 2145814.36, "rme": 9.8, "samples": 1073879 }
 *             ]
 *           }
 *         ]
 *       }
 *     ]
 *   }
 *
 * Numbers are machine-dependent; the file's purpose is trend-spotting,
 * not regression-blocking. Run on the maintainer's machine; commit the
 * result if the changes are interesting.
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = join(dirname(__filename), '..');
const OUT = join(ROOT, 'apps/docs/static/benches.json');

const BENCH_PACKAGES = [
  { name: '@kumiki/runtime', dir: 'packages/core/runtime' },
  { name: '@kumiki/primitives', dir: 'packages/core/primitives' },
  { name: '@kumiki/machines', dir: 'packages/machines' },
];

const tmp = mkdtempSync(join(tmpdir(), 'kumiki-bench-'));

const aggregate = {
  generatedAt: new Date().toISOString(),
  packages: [],
};

for (const { name, dir } of BENCH_PACKAGES) {
  const out = join(tmp, `${name.replace(/[/@]/g, '_')}.json`);
  const cwd = join(ROOT, dir);
  console.log(`▶ ${name}`);
  try {
    execFileSync('pnpm', ['exec', 'vitest', 'bench', '--run', '--outputJson', out], {
      cwd,
      stdio: ['ignore', 'ignore', 'pipe'],
    });
  } catch (err) {
    console.error(`✘ ${name}: bench failed`);
    if (err.stderr) console.error(err.stderr.toString());
    process.exit(1);
  }
  const raw = JSON.parse(readFileSync(out, 'utf8'));
  const groups = [];
  for (const file of raw.files ?? []) {
    for (const group of file.groups ?? []) {
      // Strip the `src/...bench.ts > ` filepath prefix from the group fullName.
      const cleanName = (group.fullName ?? '').split(' > ').slice(1).join(' / ') || group.fullName;
      groups.push({
        name: cleanName,
        benches: (group.benchmarks ?? []).map((b) => ({
          name: b.name,
          hz: b.hz,
          rme: b.rme,
          samples: b.sampleCount,
          mean: b.mean,
          p75: b.p75,
          p99: b.p99,
        })),
      });
    }
  }
  aggregate.packages.push({
    package: name,
    directory: relative(ROOT, cwd),
    groups,
  });
}

rmSync(tmp, { recursive: true, force: true });

writeFileSync(OUT, JSON.stringify(aggregate, null, 2) + '\n');

const totalBenches = aggregate.packages.reduce(
  (sum, p) => sum + p.groups.reduce((s, g) => s + g.benches.length, 0),
  0,
);
console.log(
  `\n✓ wrote ${totalBenches} benchmark records across ${aggregate.packages.length} packages → ${relative(ROOT, OUT)}`,
);
