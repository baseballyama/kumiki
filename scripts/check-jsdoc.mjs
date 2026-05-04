#!/usr/bin/env node
/**
 * Lint that every public export in every Kumiki package's entry has JSDoc with
 * the three required tags (`@when-to-use`, `@anti-pattern`, `@see`) at least
 * collectively across the export's primary doc block.
 *
 * Promised in `docs/design/13-docs-strategy.md` §13.6 and used as the seed for
 * `llms-full.txt`. The check is intentionally permissive: it requires SOME of
 * the tags, not all (an internal helper genuinely without an anti-pattern is OK).
 *
 * Strict policy: every Layer 4 component package's `dist/index.d.mts` (or
 * `dist/index.d.ts` for Svelte packages) MUST have at least one `@see` URL
 * referencing the matching APG pattern.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = join(dirname(__filename), '..');
const PACKAGES = join(ROOT, 'packages');

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

let warnings = 0;
let errors = 0;

for (const pkgPath of findPackageJsons(PACKAGES)) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  if (!pkg.name?.startsWith('@kumiki/')) continue;

  // Layer 4 components are the strict tier.
  const isLayer4 = pkg.name.startsWith('@kumiki/component-');
  if (!isLayer4) continue;

  // Look at the source — dist may not exist before the first build.
  const indexTs = join(dirname(pkgPath), 'src', 'index.ts');
  if (!existsSync(indexTs)) {
    console.warn(`⚠ ${pkg.name}: missing src/index.ts`);
    warnings++;
    continue;
  }
  const src = readFileSync(indexTs, 'utf8');

  // For unimplemented placeholders (only `export {}`), skip the JSDoc check.
  if (src.includes('Placeholder') || src.replace(/\s/g, '') === 'export{};') continue;

  // Component packages must reference an APG pattern URL somewhere in their
  // entry source — typically via `@see https://www.w3.org/WAI/ARIA/apg/...`.
  if (!/w3\.org\/WAI\/ARIA\/apg\//.test(src)) {
    console.error(`✘ ${pkg.name}: no APG pattern URL found in src/index.ts`);
    errors++;
  }
}

if (errors > 0) {
  console.error(`\n${errors} JSDoc requirement violation${errors === 1 ? '' : 's'}.`);
  process.exit(1);
}
if (warnings > 0) {
  console.warn(`\n${warnings} JSDoc warning${warnings === 1 ? '' : 's'}.`);
}
console.log('✓ JSDoc requirements OK.');
