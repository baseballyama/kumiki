#!/usr/bin/env node
/**
 * Lint that every public Layer 4 component subpath in `@kumiki/components`
 * references the matching APG pattern URL in its source.
 *
 * Promised in `docs/design/13-docs-strategy.md` §13.6 and used as the seed for
 * `llms-full.txt`. With ADR 0012 the Layer 4 surface is one package
 * (`@kumiki/components`) with per-component subpaths under `src/<name>/`;
 * this script walks each subpath's `index.ts` (or the first .svelte file
 * if index.ts is just a re-export) and asserts at least one `@see` URL
 * pointing at `w3.org/WAI/ARIA/apg/`.
 *
 * Form-field is exempt (no APG pattern; native input semantics — see
 * `apps/docs/keyboard/form-field.kb.ts` for the same exemption).
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = join(dirname(__filename), '..');
const COMPONENTS_SRC = join(ROOT, 'packages/components/src');

const APG_EXEMPT = new Set(['form-field']);

let errors = 0;
let warnings = 0;

if (!existsSync(COMPONENTS_SRC)) {
  console.warn(`⚠ ${COMPONENTS_SRC} not found; skipping JSDoc check.`);
  process.exit(0);
}

const entries = readdirSync(COMPONENTS_SRC, { withFileTypes: true });
let checked = 0;
for (const e of entries) {
  if (!e.isDirectory()) continue;
  const compName = e.name;
  if (APG_EXEMPT.has(compName)) continue;

  const compDir = join(COMPONENTS_SRC, compName);
  // Concatenate every .ts / .svelte file in the subdir so APG references
  // anywhere in the component's surface count toward the requirement.
  let combined = '';
  for (const f of readdirSync(compDir)) {
    const p = join(compDir, f);
    if (!statSync(p).isFile()) continue;
    if (f.endsWith('.ts') || f.endsWith('.svelte')) {
      combined += '\n' + readFileSync(p, 'utf8');
    }
  }

  if (!/w3\.org\/WAI\/ARIA\/apg\//.test(combined)) {
    console.error(`✘ @kumiki/components/${compName}: no APG pattern URL referenced in source`);
    errors++;
  }
  checked++;
}

if (errors > 0) {
  console.error(`\n${errors} JSDoc requirement violation${errors === 1 ? '' : 's'}.`);
  process.exit(1);
}
if (warnings > 0) {
  console.warn(`\n${warnings} JSDoc warning${warnings === 1 ? '' : 's'}.`);
}
console.log(`✓ JSDoc requirements OK (${checked} component subpaths checked).`);
