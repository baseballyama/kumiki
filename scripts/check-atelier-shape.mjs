#!/usr/bin/env node
/**
 * Verify every `@kumiki/atelier/<name>` subpath exposes both Tailwind and
 * Vanilla variants in the **folder shape**:
 *
 *   <name>/
 *     index.ts               (top-level barrel re-exporting both namespaces)
 *     tailwind/
 *       index.ts             (per-variant barrel)
 *       Root.svelte (+ optional Trigger.svelte, Content.svelte, …)
 *     vanilla/
 *       index.ts
 *       Root.svelte (+ …)
 *
 * Atomic single-element components (Toggle, Button, Badge, Switch,
 * Checkbox, IconButton, HorizontalRule, LoadingSpinner) use the same
 * shape with just `Root.svelte` under each variant, so the consumer
 * surface is uniform:
 *
 *   import { Tailwind, Vanilla } from '@kumiki/atelier/<name>';
 *   <Tailwind.Root … />
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

for (const name of components) {
  const dir = join(ATELIER_SRC, name);
  const indexFile = join(dir, 'index.ts');
  if (!existsSync(indexFile)) {
    console.error(`✘ ${name}: missing index.ts.`);
    errors++;
    continue;
  }

  const entries = readdirSync(dir);

  // No 2-file shape allowed any more (C-2 freeze): every component must
  // use the folder shape so the consumer surface is uniform.
  const stray2File = entries.filter(
    (e) => e.endsWith('.tailwind.svelte') || e.endsWith('.vanilla.svelte'),
  );
  if (stray2File.length > 0) {
    console.error(
      `✘ ${name}: legacy 2-file variant present (${stray2File.join(', ')}). ` +
        `Move into ${name}/tailwind/Root.svelte and ${name}/vanilla/Root.svelte ` +
        `with per-variant index.ts barrels.`,
    );
    errors++;
    continue;
  }

  const tailwindDir = entries.includes('tailwind') && statSync(join(dir, 'tailwind')).isDirectory();
  const vanillaDir = entries.includes('vanilla') && statSync(join(dir, 'vanilla')).isDirectory();
  if (!tailwindDir || !vanillaDir) {
    console.error(
      `✘ ${name}: missing variant folder ` +
        `(tailwindDir=${tailwindDir}, vanillaDir=${vanillaDir}). ` +
        `Each component must ship both tailwind/ and vanilla/.`,
    );
    errors++;
    continue;
  }

  // Both variant folders must contain an index.ts and at least one
  // `.svelte` file. Most components ship `Root.svelte`; a few (toast,
  // form-field) ship a differently-named entry point — that is fine as
  // long as the variant index.ts re-exports it.
  for (const variant of ['tailwind', 'vanilla']) {
    const variantDir = join(dir, variant);
    const variantIndex = join(variantDir, 'index.ts');
    if (!existsSync(variantIndex)) {
      console.error(`✘ ${name}/${variant}: missing index.ts.`);
      errors++;
      continue;
    }
    const svelteFiles = readdirSync(variantDir).filter((f) => f.endsWith('.svelte'));
    if (svelteFiles.length === 0) {
      console.error(`✘ ${name}/${variant}: no .svelte files under ${variant}/.`);
      errors++;
    }
  }

  // Every top-level index.ts must export `Tailwind` and `Vanilla` namespaces.
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
const summary = `${total} atelier component${total === 1 ? '' : 's'}`;

if (errors > 0) {
  console.error(`\n✘ ${errors} atelier shape error${errors === 1 ? '' : 's'} across ${summary}.`);
  process.exit(1);
}

console.log(`✓ Atelier shape OK — ${summary} (folder shape uniform).`);
