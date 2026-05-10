#!/usr/bin/env node
/**
 * Verify every `@kumiki/atelier/<name>` subpath exposes both Tailwind and
 * Vanilla variants, with one of two recognized shapes:
 *
 * - **2-file** — `Name.tailwind.svelte` + `Name.vanilla.svelte` next to
 *   `index.ts`. Used for atomic single-element components (Toggle, Button,
 *   Switch, etc.).
 * - **folder** — `tailwind/` + `vanilla/` directories, each containing the
 *   compound surface (Root.svelte, Trigger.svelte, …). Used for compound
 *   components (Dialog, Combobox, Menu, …).
 *
 * Mixed shapes within one component (e.g. tailwind file + vanilla folder)
 * are an error. The script also verifies that `index.ts` re-exports both
 * variants under the `Tailwind` / `Vanilla` names.
 *
 * Promised in `docs/release/v1-execution-plan.md` Track C-2.
 *
 * Usage: `node scripts/check-atelier-shape.mjs`
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ATELIER_SRC = join(dirname(__filename), '..', 'packages', 'atelier', 'src');

const components = readdirSync(ATELIER_SRC)
  .filter((name) => {
    const p = join(ATELIER_SRC, name);
    return statSync(p).isDirectory();
  })
  .sort();

if (components.length === 0) {
  console.error('✘ No atelier components found under packages/atelier/src.');
  process.exit(1);
}

let errors = 0;
const shapes = { '2-file': 0, folder: 0 };

for (const name of components) {
  const dir = join(ATELIER_SRC, name);
  const indexFile = join(dir, 'index.ts');
  if (!existsSync(indexFile)) {
    console.error(`✘ ${name}: missing index.ts.`);
    errors++;
    continue;
  }

  const entries = readdirSync(dir);
  const tailwindFile = entries.find((e) => e.endsWith('.tailwind.svelte'));
  const vanillaFile = entries.find((e) => e.endsWith('.vanilla.svelte'));
  const tailwindDir = entries.includes('tailwind') && statSync(join(dir, 'tailwind')).isDirectory();
  const vanillaDir = entries.includes('vanilla') && statSync(join(dir, 'vanilla')).isDirectory();

  let shape;
  if (tailwindFile && vanillaFile && !tailwindDir && !vanillaDir) shape = '2-file';
  else if (tailwindDir && vanillaDir && !tailwindFile && !vanillaFile) shape = 'folder';
  else {
    console.error(
      `✘ ${name}: mixed or incomplete variant shape ` +
        `(tailwindFile=${!!tailwindFile} vanillaFile=${!!vanillaFile} ` +
        `tailwindDir=${!!tailwindDir} vanillaDir=${!!vanillaDir}). ` +
        `Pick either the 2-file (.tailwind.svelte / .vanilla.svelte) or ` +
        `folder (tailwind/ / vanilla/) shape, not both.`,
    );
    errors++;
    continue;
  }
  shapes[shape]++;

  // For folder shape, both subdirs must contain an index.ts.
  if (shape === 'folder') {
    for (const variant of ['tailwind', 'vanilla']) {
      const variantIndex = join(dir, variant, 'index.ts');
      if (!existsSync(variantIndex)) {
        console.error(`✘ ${name}/${variant}: missing index.ts.`);
        errors++;
      }
    }
  }

  // Every index.ts must export `Tailwind` and `Vanilla`.
  const indexSrc = readFileSync(indexFile, 'utf8');
  for (const variantName of ['Tailwind', 'Vanilla']) {
    const reExport = new RegExp(
      `export\\s*(\\*\\s*as\\s+${variantName}|\\{[^}]*\\b${variantName}\\b[^}]*\\})`,
    );
    if (!reExport.test(indexSrc)) {
      console.error(`✘ ${name}/index.ts: missing \`export … ${variantName}\`.`);
      errors++;
    }
  }
}

const total = components.length;
const summary =
  `${total} atelier component${total === 1 ? '' : 's'} ` +
  `(${shapes['2-file']} 2-file, ${shapes.folder} folder)`;

if (errors > 0) {
  console.error(`\n✘ ${errors} atelier shape error${errors === 1 ? '' : 's'} across ${summary}.`);
  process.exit(1);
}

console.log(`✓ Atelier shape OK — ${summary}.`);
