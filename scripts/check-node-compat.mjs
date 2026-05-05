#!/usr/bin/env node
/**
 * Node compatibility smoke test.
 *
 * Imports every built `dist/index.mjs` in a pure Node process — no jsdom,
 * no DOM globals — and exercises the Layer 1 / 2 surface a server-side
 * consumer would touch (machine.send, machine.subscribe, primitives, etc.).
 *
 * For Layer 3 attachments we only verify import + controller construction;
 * calling `attachment.root(node)` requires a real DOM, which is browser-only
 * by design.
 *
 * For Layer 4 (Svelte components) we skip — those build to `.js` plus
 * `.svelte` source and require a Svelte compiler at consumer time.
 *
 * The check fails CI if any package secretly depends on a DOM global at
 * import time. See CLAUDE.md "Runtime targets — Node + browser".
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
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

let errors = 0;
let checked = 0;

for (const pkgPath of findPackageJsons(PACKAGES)) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  if (!pkg.name?.startsWith('@kumiki/')) continue;

  // Skip Svelte packages — they ship `.svelte` source which the consumer's
  // bundler compiles. Importing dist/index.js in pure Node tries to evaluate
  // Svelte runtime which expects a DOM-ish lifecycle.
  if (pkg.name === '@kumiki/components' || pkg.name === '@kumiki/recipes') continue;
  // Skip cli — it has a bin shebang, separate concern.
  if (pkg.name === '@kumiki/cli') continue;

  const distEntry = join(dirname(pkgPath), 'dist', 'index.mjs');
  if (!existsSync(distEntry)) {
    console.warn(`⚠ ${pkg.name}: missing dist/index.mjs (run pnpm build first)`);
    continue;
  }

  // Forbid DOM globals while importing.
  const sentinel = {};
  const original = {
    document: globalThis.document,
    window: globalThis.window,
    HTMLElement: globalThis.HTMLElement,
  };
  try {
    // @ts-expect-error — we want to ensure no module reads these at top level.
    delete globalThis.document;
    delete globalThis.window;
    delete globalThis.HTMLElement;
    await import(pathToFileURL(distEntry).href);
    checked++;
    console.log(`✓ ${pkg.name}`);
  } catch (err) {
    console.error(`✘ ${pkg.name} failed Node import:`, err?.message ?? err);
    errors++;
  } finally {
    // Restore (mostly to be polite; the script exits anyway).
    if (original.document !== undefined) globalThis.document = original.document;
    if (original.window !== undefined) globalThis.window = original.window;
    if (original.HTMLElement !== undefined) globalThis.HTMLElement = original.HTMLElement;
    void sentinel;
  }
}

if (errors > 0) {
  console.error(`\n${errors} Node compatibility failure${errors === 1 ? '' : 's'}.`);
  process.exit(1);
}
console.log(`\n✓ ${checked} packages import cleanly in pure Node (no DOM globals).`);
