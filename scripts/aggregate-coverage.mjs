#!/usr/bin/env node
/**
 * Coverage aggregator — walks every workspace package's
 * `coverage/coverage-summary.json` and prints a single rolled-up
 * summary across the workspace.
 *
 * Run after `pnpm -w run coverage` (which executes vitest --coverage
 * in every package). Per-package thresholds live in each
 * `vitest.config.ts`; this aggregator reports the combined picture and
 * flags any package that didn't generate a summary.
 *
 * Not currently a CI gate — some Phase 1 packages have aspirational
 * thresholds set above current coverage. Tighten incrementally and
 * promote to a gate once stable.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = join(dirname(__filename), '..');

function* findPackageJsons(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === 'dist' || e.name === 'coverage') continue;
    const p = join(dir, e.name);
    if (e.isSymbolicLink()) continue;
    if (e.isDirectory()) yield* findPackageJsons(p);
    else if (e.name === 'package.json') yield p;
  }
}

/** @type {Array<{ pkg: string, summary: any | null, dir: string }>} */
const rows = [];

for (const pkgPath of findPackageJsons(join(ROOT, 'packages'))) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  if (!pkg.name?.startsWith('@kumiki/')) continue;
  // Skip umbrella packages (no sources of their own).
  if (pkg.name === '@kumiki/components' || pkg.name === '@kumiki/recipes') continue;

  const dir = dirname(pkgPath);
  // Vitest's default reporters write `coverage-final.json` (per-file
  // counters). We aggregate from that — no per-package vitest config
  // change needed.
  const finalPath = join(dir, 'coverage', 'coverage-final.json');
  if (!existsSync(finalPath)) {
    rows.push({ pkg: pkg.name, summary: null, dir });
    continue;
  }
  let final;
  try {
    final = JSON.parse(readFileSync(finalPath, 'utf8'));
  } catch (e) {
    console.error(`✘ ${pkg.name}: malformed coverage-final.json — ${e.message}`);
    continue;
  }
  // Roll the per-file counters into a single { statements, branches, functions, lines } summary.
  let stmts = { c: 0, t: 0 };
  let branches = { c: 0, t: 0 };
  let funcs = { c: 0, t: 0 };
  for (const file of Object.values(final)) {
    if (!file || typeof file !== 'object') continue;
    const fileObj = /** @type {any} */ (file);
    if (fileObj.s)
      for (const v of Object.values(fileObj.s)) {
        stmts.t++;
        if (Number(v) > 0) stmts.c++;
      }
    if (fileObj.b)
      for (const arr of Object.values(fileObj.b)) {
        if (!Array.isArray(arr)) continue;
        for (const v of arr) {
          branches.t++;
          if (Number(v) > 0) branches.c++;
        }
      }
    if (fileObj.f)
      for (const v of Object.values(fileObj.f)) {
        funcs.t++;
        if (Number(v) > 0) funcs.c++;
      }
  }
  // v8 doesn't track lines distinct from statements; reuse stmts count.
  const summary = {
    total: {
      statements: {
        covered: stmts.c,
        total: stmts.t,
        pct: stmts.t === 0 ? 100 : (stmts.c / stmts.t) * 100,
      },
      branches: {
        covered: branches.c,
        total: branches.t,
        pct: branches.t === 0 ? 100 : (branches.c / branches.t) * 100,
      },
      functions: {
        covered: funcs.c,
        total: funcs.t,
        pct: funcs.t === 0 ? 100 : (funcs.c / funcs.t) * 100,
      },
      lines: {
        covered: stmts.c,
        total: stmts.t,
        pct: stmts.t === 0 ? 100 : (stmts.c / stmts.t) * 100,
      },
    },
  };
  rows.push({ pkg: pkg.name, summary, dir });
}

if (rows.length === 0) {
  console.error('✘ no packages found under packages/');
  process.exit(1);
}

// Roll up totals.
let totals = {
  statements: { c: 0, t: 0 },
  branches: { c: 0, t: 0 },
  functions: { c: 0, t: 0 },
  lines: { c: 0, t: 0 },
};
let withCoverage = 0;
let withoutCoverage = [];

const cols = ['stmts', 'branch', 'funcs', 'lines'];
const fmt = (n) => (Number.isFinite(n) ? n.toFixed(1).padStart(5) + '%' : '   —  ');

console.log('package'.padEnd(40), cols.map((c) => c.padStart(7)).join(' '));
console.log('─'.repeat(40 + 8 * 4 + 4));

for (const row of rows.sort((a, b) => a.pkg.localeCompare(b.pkg))) {
  if (!row.summary) {
    withoutCoverage.push(row.pkg);
    continue;
  }
  const total = row.summary.total;
  withCoverage++;
  const cells = ['statements', 'branches', 'functions', 'lines'].map((k) => {
    const t = total[k];
    if (!t) return fmt(NaN);
    totals[k].c += t.covered ?? 0;
    totals[k].t += t.total ?? 0;
    return fmt(t.pct ?? NaN);
  });
  console.log(row.pkg.padEnd(40), cells.join(' '));
}

console.log('─'.repeat(40 + 8 * 4 + 4));
const aggregateCells = ['statements', 'branches', 'functions', 'lines'].map((k) => {
  const t = totals[k];
  return t.t === 0 ? fmt(NaN) : fmt((t.c / t.t) * 100);
});
console.log('aggregate'.padEnd(40), aggregateCells.join(' '));

if (withoutCoverage.length > 0) {
  console.log('');
  console.log(`packages without coverage data (${withoutCoverage.length}):`);
  for (const name of withoutCoverage) console.log(`  · ${name}`);
  console.log('');
  console.log('run `pnpm -w run coverage` to generate coverage for every package first.');
}

console.log('');
console.log(
  `✓ ${withCoverage} package${withCoverage === 1 ? '' : 's'} with coverage data summarized`,
);
