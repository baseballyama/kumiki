#!/usr/bin/env node
/**
 * Measure brotli bundle size for `@kumiki/components/<name>` and
 * `@kumiki/atelier/<name>` subpaths.
 *
 * Phase 0c gap (per [`v1-execution-plan` A-2 / C-4](../../../docs/release/v1-execution-plan.md)):
 * `size-limit` cannot gate Layer 4 / Atelier subpaths because esbuild's loader
 * can't read `.svelte` files. We use Vite (which already understands `.svelte`
 * via `@sveltejs/vite-plugin-svelte`) in `lib` mode to bundle a single
 * subpath, then brotli-compress the bundled JavaScript.
 *
 * Lives under `apps/docs/scripts/` because Vite + the Svelte plugin are
 * already in this app's `node_modules`. The pnpm-root alias is
 * `pnpm measure:svelte-size`.
 *
 * Usage:
 *   node apps/docs/scripts/measure-svelte-size.mjs                   # all known L4 + Atelier subpaths
 *   node apps/docs/scripts/measure-svelte-size.mjs --filter=toggle   # one subpath name
 *   node apps/docs/scripts/measure-svelte-size.mjs --json            # machine-readable output
 *   node apps/docs/scripts/measure-svelte-size.mjs --check           # exit 1 on any over-budget
 *
 * The pnpm-root alias adds `--check` automatically when invoked via
 * `pnpm measure:svelte-size:check`.
 *
 * Approach:
 *   - Use Vite's programmatic build API in `lib` mode.
 *   - Mark workspace foundations + peer deps as `external` so the number
 *     reflects the *incremental* cost (matching the L3 gating model in
 *     `docs/design/09-bundle-budget.md` §9.3).
 *   - Compress with brotli at quality 11 (size-limit's default).
 */

import { readdirSync, readFileSync, existsSync, statSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, constants as zlibConstants } from 'node:zlib';
import { tmpdir } from 'node:os';

const __filename = fileURLToPath(import.meta.url);
const SCRIPT_DIR = dirname(__filename);
const ROOT = join(SCRIPT_DIR, '..', '..', '..');

const args = process.argv.slice(2);
const flags = {
  filter: null,
  json: false,
  check: false,
};
for (const a of args) {
  if (a === '--json') flags.json = true;
  else if (a === '--check') flags.check = true;
  else if (a.startsWith('--filter=')) flags.filter = a.slice('--filter='.length);
}

// Per-subpath budget table. Canonical source: docs/design/09-bundle-budget.md §9.2.
// When that file changes, this table changes in the same PR (and the size script
// enforces it).
//
// Numbers are brotli, in bytes. `null` ⇒ not yet budgeted (informational).
//
// Two annotations:
// - "[ADR 0018]" — budget revised based on measured cost (formula:
//   ceil(measured × 1.05) rounded up to nearest 50 B). Both low-severity (<30 %)
//   and architecturally-blocked high-severity reductions land here; the latter
//   carry an additional "Reduction target" entry in
//   docs/design/09-bundle-budget.md §9.2 + ADR 0018 implementation update.
// - No annotation — declared budget hits its measurement, no revision needed.
const L4_BUDGET = {
  // Phase 1 (docs/design/09-bundle-budget.md §"@kumiki/components/<name> — Layer 4")
  toggle: 3_100, // [ADR 0018] reduction target 1_950 B (L3↔L4 attribute dedup)
  switch: 1_650, // [ADR 0018]
  checkbox: 1_800, // [ADR 0018]
  'radio-group': 2_400, // [ADR 0018]
  tabs: 2_950, // [ADR 0018]
  tooltip: 2_000,
  dialog: 3_500,
  'form-field': 2_800, // [ADR 0018] reduction target 1_950 B (with-validation split)
  select: 3_000,
  combobox: 4_500,
  accordion: 2_800, // [ADR 0018] reduction target 1_950 B (Item ctx simplification)
  slider: 2_650, // [ADR 0018]
  'number-field': 2_900, // [ADR 0018]
  popover: 2_500,
  toast: 3_000,
  menu: 3_000,
  calendar: 5_500,
  'date-picker': 7_000,
  // Phase 1.5
  badge: 500,
  'horizontal-rule': 350, // [ADR 0018] reduction target 300 B (Svelte runtime floor)
  'definition-list': 400,
  'loading-spinner': 600,
  breadcrumb: 950, // [ADR 0018]
  button: 1_250, // [ADR 0018] reduction target 800 B (L3 paint() dedup)
  avatar: 1_000,
  'avatar-group': 1_000,
  'icon-button': 1_350, // [ADR 0018]
  alert: 1_600, // [ADR 0018] reduction target 1_000 B (locale-provider inlining)
  chips: 1_200,
  pagination: 2_000, // [ADR 0018] reduction target 1_400 B (further consolidation)
  toolbar: 1_800,
  table: 2_500,
  'time-field': 2_750, // [ADR 0018]
  'datetime-field': 9_000, // [ADR 0018] reduction target 4_000 B (DatePart/TimePart subpath split)
  // popover/with-confirm — Popconfirm subpath
  // Handled separately as a sub-subpath below.
};

// Atelier subpath budgets per docs/design/09-bundle-budget.md §"@kumiki/atelier/<name>".
// Each number is the per-variant ceiling (the larger of the two; both Tailwind and
// Vanilla are measured separately and gated against the same number).
const ATELIER_BUDGET_DEFAULT = 8_000;
const ATELIER_BUDGET_OVERRIDES = {
  toggle: 6_000,
  dialog: 6_000,
  'datetime-field': 9_250, // [ADR 0018] — bound by Tailwind variant
};

const COMPONENTS_PKG_DIR = join(ROOT, 'packages', 'components');
const ATELIER_PKG_DIR = join(ROOT, 'packages', 'atelier');

const externals = [
  // Svelte runtime — peer dep, present in every consumer.
  'svelte',
  'svelte/internal',
  'svelte/internal/client',
  'svelte/internal/server',
  'svelte/internal/disclose-version',
  'svelte/store',
  // Optional peers per docs/design/17-integration-boundaries.md.
  '@floating-ui/dom',
  '@internationalized/date',
  // Workspace foundations — counted once per page, not per component.
  '@kumiki/runtime',
  '@kumiki/runtime/internal',
  '@kumiki/types',
  '@kumiki/locale',
  // Per-package peers within the workspace are component-specific
  // (e.g. @kumiki/headless/toggle is the unique attachment for Toggle), so
  // they ARE included in the measurement. That matches the L3 incremental
  // model in docs/design/09-bundle-budget.md §9.3.
];

const externalRegexes = [
  /^@kumiki\/primitives(\/.*)?$/,
  /^@kumiki\/locale(\/.*)?$/,
  /^@kumiki\/runtime(\/.*)?$/,
  /^@kumiki\/types(\/.*)?$/,
  /^svelte\/.*/,
];

function isExternalId(id) {
  if (externals.includes(id)) return true;
  return externalRegexes.some((re) => re.test(id));
}

async function buildOne(entry, label) {
  // Vite/Rollup `lib` mode produces a single ES module bundle; we read it
  // out of the tmp dir and brotli it ourselves.
  const { build } = await import('vite');
  const { svelte } = await import('@sveltejs/vite-plugin-svelte');

  const outDir = join(
    tmpdir(),
    `kumiki-size-${process.pid}-${Math.random().toString(36).slice(2, 8)}`,
  );
  mkdirSync(outDir, { recursive: true });

  try {
    await build({
      configFile: false,
      logLevel: 'error',
      plugins: [svelte()],
      build: {
        outDir,
        emptyOutDir: true,
        write: true,
        minify: 'esbuild',
        target: 'es2022',
        cssCodeSplit: false,
        lib: {
          entry,
          name: 'KumikiSizeProbe',
          formats: ['es'],
          fileName: () => 'bundle.js',
        },
        rollupOptions: {
          external: (id) => isExternalId(id),
        },
      },
      // Vite 8 deprecated `inlineDynamicImports`; the replacement is the
      // top-level `experimental.codeSplitting: false` (off by default in lib
      // mode anyway). We rely on lib-mode's single-bundle default.
      experimental: {
        codeSplitting: false,
      },
    });
    const bundlePath = join(outDir, 'bundle.js');
    if (!existsSync(bundlePath)) {
      throw new Error(`Vite did not emit bundle for ${label}.`);
    }
    const raw = readFileSync(bundlePath);
    const compressed = brotliCompressSync(raw, {
      params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 11 },
    });
    return { rawSize: raw.length, brotliSize: compressed.length };
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
}

function listAtelierSubpaths(pkgDir) {
  const src = join(pkgDir, 'src');
  if (!existsSync(src)) return [];
  return readdirSync(src)
    .filter((name) => statSync(join(src, name)).isDirectory())
    .sort();
}

async function measureL4Subpath(name) {
  const dist = join(COMPONENTS_PKG_DIR, 'dist', name, 'index.js');
  if (!existsSync(dist)) {
    return {
      kind: 'l4',
      subpath: `@kumiki/components/${name}`,
      error: `dist not found at ${relative(ROOT, dist)} — run \`pnpm --filter='@kumiki/components' build\` first`,
    };
  }
  const budget = L4_BUDGET[name] ?? null;
  const result = await buildOne(dist, `@kumiki/components/${name}`);
  return {
    kind: 'l4',
    subpath: `@kumiki/components/${name}`,
    ...result,
    budget,
    passed: budget == null ? null : result.brotliSize <= budget,
  };
}

async function measureAtelierVariant(name, variant) {
  const pkgSrc = join(ATELIER_PKG_DIR, 'dist', name);
  // Atelier ships in two shapes — folder (tailwind/index.js + vanilla/index.js)
  // or 2-file (single index.js that re-exports both). We measure each variant
  // separately by importing its dedicated entry.
  let entry;
  const folderEntry = join(pkgSrc, variant, 'index.js');
  if (existsSync(folderEntry)) {
    entry = folderEntry;
  } else {
    // 2-file shape — synthesize a tiny entry that picks one variant.
    const idx = join(pkgSrc, 'index.js');
    if (!existsSync(idx)) {
      return {
        kind: 'atelier',
        subpath: `@kumiki/atelier/${name}`,
        variant,
        error: `dist missing at ${relative(ROOT, idx)} — run \`pnpm --filter='@kumiki/atelier' build\``,
      };
    }
    // Write a synthetic single-variant entry so we measure only the chosen file.
    const probeDir = join(
      tmpdir(),
      `kumiki-size-probe-${process.pid}-${Math.random().toString(36).slice(2, 8)}`,
    );
    mkdirSync(probeDir, { recursive: true });
    const probe = join(probeDir, 'probe.mjs');
    const variantExport = variant.charAt(0).toUpperCase() + variant.slice(1);
    const code = `export { ${variantExport} } from '${idx.replace(/\\/g, '/')}';\n`;
    const { writeFileSync } = await import('node:fs');
    writeFileSync(probe, code, 'utf8');
    entry = probe;
  }
  const budget = ATELIER_BUDGET_OVERRIDES[name] ?? ATELIER_BUDGET_DEFAULT;
  const result = await buildOne(entry, `@kumiki/atelier/${name} (${variant})`);
  return {
    kind: 'atelier',
    subpath: `@kumiki/atelier/${name}`,
    variant,
    ...result,
    budget,
    passed: result.brotliSize <= budget,
  };
}

async function main() {
  const targets = [];
  // L4 — every subdir of packages/components/src that is a real component (has dist/<name>/index.js).
  if (existsSync(join(COMPONENTS_PKG_DIR, 'src'))) {
    const names = readdirSync(join(COMPONENTS_PKG_DIR, 'src'))
      .filter((n) => statSync(join(COMPONENTS_PKG_DIR, 'src', n)).isDirectory())
      .filter((n) => !['testing', 'locale-provider'].includes(n))
      .sort();
    for (const n of names) {
      if (flags.filter && n !== flags.filter) continue;
      targets.push({ kind: 'l4', name: n });
    }
  }
  // Atelier — two variants per subdir.
  for (const n of listAtelierSubpaths(ATELIER_PKG_DIR)) {
    if (flags.filter && n !== flags.filter) continue;
    for (const v of ['tailwind', 'vanilla']) {
      targets.push({ kind: 'atelier', name: n, variant: v });
    }
  }

  if (targets.length === 0) {
    console.error(
      flags.filter
        ? `No targets matched --filter=${flags.filter}.`
        : 'No targets discovered. Run `pnpm build` first.',
    );
    process.exit(1);
  }

  const results = [];
  for (const t of targets) {
    let r;
    try {
      r =
        t.kind === 'l4'
          ? await measureL4Subpath(t.name)
          : await measureAtelierVariant(t.name, t.variant);
    } catch (err) {
      r = {
        kind: t.kind,
        subpath: t.kind === 'l4' ? `@kumiki/components/${t.name}` : `@kumiki/atelier/${t.name}`,
        ...(t.variant ? { variant: t.variant } : {}),
        error: err.message,
      };
    }
    results.push(r);
    if (!flags.json) reportLine(r);
  }

  if (flags.json) {
    console.log(JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));
  } else {
    summarize(results);
  }

  if (flags.check) {
    const failed = results.filter((r) => r.passed === false || r.error);
    if (failed.length > 0) {
      console.error(
        `\n✘ ${failed.length} subpath${failed.length === 1 ? '' : 's'} over budget or errored.`,
      );
      process.exit(1);
    }
  }
}

function fmtBytes(n) {
  if (n == null) return '?';
  if (n >= 1024) return `${(n / 1024).toFixed(2)} kB`;
  return `${n} B`;
}

function reportLine(r) {
  const label = r.variant ? `${r.subpath} (${r.variant})` : r.subpath;
  if (r.error) {
    console.log(`  ✘ ${label}: ${r.error}`);
    return;
  }
  const budget = r.budget ?? null;
  const status = r.passed === true ? '✓' : r.passed === false ? '✘' : '·';
  const ratio = budget ? ` / ${fmtBytes(budget)}` : '';
  console.log(
    `  ${status} ${label}: ${fmtBytes(r.brotliSize)}${ratio} brotli (${fmtBytes(r.rawSize)} raw)`,
  );
}

function summarize(results) {
  const ok = results.filter((r) => r.passed === true).length;
  const over = results.filter((r) => r.passed === false).length;
  const informational = results.filter((r) => r.passed == null && !r.error).length;
  const errored = results.filter((r) => r.error).length;
  console.log(
    `\nMeasured ${results.length} subpath${results.length === 1 ? '' : 's'} ` +
      `(✓ ${ok} within budget, ✘ ${over} over, · ${informational} informational, ✘ ${errored} errored).`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
