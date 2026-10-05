#!/usr/bin/env node
/**
 * Package smoke test — verifies what npm would actually receive, without
 * publishing anything.
 *
 * Usage: node scripts/check-pack-smoke.mjs <tarball-dir> <consumer-dir>
 *
 * `<tarball-dir>` holds the output of `pnpm pack` for every publishable
 * `@kumiki/*` package. `<consumer-dir>` must live outside the workspace so
 * pnpm treats it as an ordinary consumer project.
 *
 * 1. Tarball shape — every tarball is extracted and checked:
 *    - no `workspace:` / `catalog:` specifier survived `pnpm pack`
 *    - `dist/` is present, no `*.test.*` file leaked past `files`
 *    - every `exports` / `main` / `module` / `types` / `svelte` / `bin`
 *      target exists inside the tarball
 * 2. Clean install — the tarballs are installed into the consumer, with
 *    `pnpm.overrides` pointing every `@kumiki/*` at its tarball so the
 *    cross-package dependencies resolve from the tarballs, never the registry.
 *    Peers (`svelte`, `@internationalized/date`) come from the catalog range.
 * 3. Import — from inside the consumer, in pure Node (no DOM globals):
 *    - TS-only packages (including `@kumiki/cli`): `import()` every subpath
 *    - Svelte packages (`components`, `atelier`): resolve every subpath and
 *      check the file exists (`.svelte` needs a compiler, so no execution;
 *      same split as `check-node-compat.mjs`)
 *    - `@kumiki/cli`: the installed `kumiki --help` bin also exits 0
 *
 * Nothing here writes to a registry. Unlike `check-node-compat.mjs`, which
 * imports the workspace `dist/`, this goes through the tarball, so a file
 * missing from `files` or a broken `workspace:*` rewrite fails here.
 */

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const [tarballArg, consumerArg] = process.argv.slice(2);
if (!tarballArg || !consumerArg) {
  console.error('usage: node scripts/check-pack-smoke.mjs <tarball-dir> <consumer-dir>');
  process.exit(2);
}
const TARBALLS = resolve(tarballArg);
const CONSUMER = resolve(consumerArg);
if (CONSUMER.startsWith(ROOT + '/') || CONSUMER === ROOT) {
  console.error(`✘ consumer dir must be outside the workspace: ${CONSUMER}`);
  process.exit(2);
}

// Packages whose dist ships `.svelte` source — resolve only, never execute.
const SVELTE_PACKAGES = new Set(['@kumiki/components', '@kumiki/atelier']);

let errors = 0;
const fail = (msg) => {
  console.error(`✘ ${msg}`);
  errors++;
};

// ─── 1. Tarball shape ────────────────────────────────────────────────────

const tgzs = readdirSync(TARBALLS)
  .filter((f) => f.endsWith('.tgz'))
  .sort();
if (tgzs.length === 0) {
  console.error(`✘ no .tgz files in ${TARBALLS}`);
  process.exit(1);
}

// Every publishable workspace package must have produced a tarball.
const expected = [];
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'dist' || e.isSymbolicLink()) continue;
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'package.json') {
      const pkg = JSON.parse(readFileSync(p, 'utf8'));
      if (pkg.name?.startsWith('@kumiki/') && !pkg.private) expected.push(pkg.name);
    }
  }
};
walk(join(ROOT, 'packages'));

const EXTRACT = join(CONSUMER, '..', 'kumiki-pack-extracted');
rmSync(EXTRACT, { recursive: true, force: true });
mkdirSync(EXTRACT, { recursive: true });

/** @type {Map<string, { file: string, pkg: any, dir: string }>} */
const packed = new Map();
const rows = [];

function* exportTargets(value) {
  if (typeof value === 'string') yield value;
  else if (value && typeof value === 'object') {
    for (const v of Object.values(value)) yield* exportTargets(v);
  }
}

function* listFiles(dir, base = '') {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) yield* listFiles(join(dir, e.name), rel);
    else yield rel;
  }
}

for (const tgz of tgzs) {
  const file = join(TARBALLS, tgz);
  const dest = join(EXTRACT, tgz.replace(/\.tgz$/, ''));
  mkdirSync(dest, { recursive: true });
  execFileSync('tar', ['-xzf', file, '-C', dest]);
  const dir = join(dest, 'package');
  const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  packed.set(pkg.name, { file, pkg, dir });
  rows.push([
    pkg.name,
    pkg.version,
    tgz,
    createHash('sha256').update(readFileSync(file)).digest('hex'),
  ]);

  for (const field of [
    'dependencies',
    'peerDependencies',
    'optionalDependencies',
    'devDependencies',
  ]) {
    for (const [dep, spec] of Object.entries(pkg[field] ?? {})) {
      if (/^(workspace|catalog):/.test(spec)) {
        fail(`${pkg.name}: ${field}.${dep} = "${spec}" was not rewritten by pnpm pack`);
      }
    }
  }

  if (!existsSync(join(dir, 'dist'))) fail(`${pkg.name}: dist/ missing from tarball`);
  for (const rel of listFiles(dir)) {
    if (/\.test\./.test(rel)) fail(`${pkg.name}: test file leaked into tarball: ${rel}`);
  }

  const targets = new Set();
  for (const t of exportTargets(pkg.exports ?? {})) targets.add(t);
  for (const f of ['main', 'module', 'types', 'svelte']) if (pkg[f]) targets.add(pkg[f]);
  if (typeof pkg.bin === 'string') targets.add(pkg.bin);
  else for (const t of Object.values(pkg.bin ?? {})) targets.add(t);
  for (const t of targets) {
    if (!existsSync(join(dir, t))) {
      fail(`${pkg.name}: "${t}" is referenced by package.json but missing from tarball`);
    }
  }
}

for (const name of expected) {
  if (!packed.has(name)) fail(`${name}: no tarball produced`);
}

console.log('\nPacked tarballs:');
console.log('| package | version | file | sha256 |');
console.log('|---|---|---|---|');
for (const r of rows) console.log(`| ${r.join(' | ')} |`);

if (errors > 0) {
  console.error(`\n${errors} tarball shape failure${errors === 1 ? '' : 's'}.`);
  process.exit(1);
}
console.log(`\n✓ ${packed.size} tarballs have a consistent shape.`);

// ─── 2. Clean install ────────────────────────────────────────────────────

// Peer ranges come from the workspace catalog so the consumer matches what
// the packages are developed against.
const workspaceYaml = readFileSync(join(ROOT, 'pnpm-workspace.yaml'), 'utf8');
const catalogRange = (name) => {
  const escaped = name.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  const m = workspaceYaml.match(new RegExp(`^\\s+'?${escaped}'?:\\s*(\\S+)`, 'm'));
  if (!m) throw new Error(`catalog entry for ${name} not found in pnpm-workspace.yaml`);
  return m[1];
};

const kumikiSpecs = Object.fromEntries(
  [...packed].map(([name, { file }]) => [name, `file:${file}`]),
);

rmSync(CONSUMER, { recursive: true, force: true });
mkdirSync(CONSUMER, { recursive: true });
writeFileSync(
  join(CONSUMER, 'package.json'),
  JSON.stringify(
    {
      name: 'kumiki-pack-smoke-consumer',
      private: true,
      type: 'module',
      dependencies: {
        ...kumikiSpecs,
        svelte: catalogRange('svelte'),
        '@internationalized/date': catalogRange('@internationalized/date'),
      },
      pnpm: { overrides: kumikiSpecs },
    },
    null,
    2,
  ) + '\n',
);

console.log('\nInstalling tarballs into a clean consumer…');
execFileSync('pnpm', ['install', '--no-frozen-lockfile', '--ignore-workspace'], {
  cwd: CONSUMER,
  stdio: 'inherit',
});

// Every @kumiki package in the consumer — direct or transitive — must be the
// tarball. A registry resolution shows up in the lockfile as `<name>@<semver>`;
// tarball resolutions are `<name>@file:…`.
const lock = readFileSync(join(CONSUMER, 'pnpm-lock.yaml'), 'utf8');
for (const name of packed.keys()) {
  const fromRegistry = lock.match(new RegExp(`${name.replace('/', '\\/')}@\\d[^\\s':]*`, 'g'));
  if (fromRegistry) {
    fail(
      `${name}: resolved from the registry instead of its tarball: ${[...new Set(fromRegistry)]}`,
    );
  }
}
if (errors > 0) process.exit(1);

// ─── 3. Import from the consumer ─────────────────────────────────────────

const plan = [...packed].map(([name, { pkg }]) => ({
  name,
  subpaths: Object.keys(pkg.exports ?? { '.': pkg.main }).filter((s) => s !== './package.json'),
  mode: SVELTE_PACKAGES.has(name) ? 'resolve' : 'import',
}));

// Runs inside the consumer so bare specifiers resolve through its node_modules.
const runner = `
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';


const plan = ${JSON.stringify(plan)};
let errors = 0;
let imported = 0;
let resolved = 0;
for (const { name, subpaths, mode } of plan) {
  for (const sub of subpaths) {
    const spec = sub === '.' ? name : name + sub.slice(1);
    try {
      if (mode === 'import') {
        await import(spec);
        imported++;
      } else {
        const url = import.meta.resolve(spec);
        if (!existsSync(fileURLToPath(url))) throw new Error('resolved to a missing file: ' + url);
        resolved++;
      }
    } catch (err) {
      console.error('✘ ' + spec + ': ' + (err?.message ?? err));
      errors++;
    }
  }
}
console.log('✓ ' + imported + ' subpaths imported, ' + resolved + ' subpaths resolved (pure Node, from tarballs).');
process.exit(errors > 0 ? 1 : 0);
`;
writeFileSync(join(CONSUMER, 'smoke.mjs'), runner);

try {
  execFileSync(process.execPath, ['smoke.mjs'], { cwd: CONSUMER, stdio: 'inherit' });
} catch {
  fail('import / resolve from the consumer failed (see above)');
}

if (packed.has('@kumiki/cli')) {
  try {
    const out = execFileSync('pnpm', ['exec', 'kumiki', '--help'], {
      cwd: CONSUMER,
      encoding: 'utf8',
    });
    if (!/kumiki/i.test(out)) throw new Error('unexpected --help output');
    console.log('✓ kumiki --help exits 0 from the installed tarball.');
  } catch (err) {
    fail(`kumiki --help failed: ${err?.message ?? err}`);
  }
}

if (errors > 0) {
  console.error(`\n${errors} package smoke failure${errors === 1 ? '' : 's'}.`);
  process.exit(1);
}
console.log(
  `\n✓ ${packed.size} packages install from their tarballs and load in a clean consumer.`,
);
