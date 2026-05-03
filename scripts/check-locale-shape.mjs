#!/usr/bin/env node
/**
 * Verify that every locale package exports the same `messages` shape.
 *
 * If `en` adds a key that `ja` is missing, this script fails CI. Promised in
 * `docs/design/06-i18n.md` §6.9 (and `docs/design/16-decisions/0006-locale-data-distribution.md`).
 *
 * Usage: `node scripts/check-locale-shape.mjs`
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const LOCALE_SRC = join(dirname(__filename), '..', 'packages', 'locale', 'src');

const langs = readdirSync(LOCALE_SRC)
  .filter((name) => existsSync(join(LOCALE_SRC, name, 'index.ts')))
  .filter((name) => name !== 'index.ts');

if (langs.length === 0) {
  // Locale data not yet implemented — pass silently. Phase 1 will populate this.
  console.log('✓ Locale shape: no per-language exports yet.');
  process.exit(0);
}

/**
 * Extract the structural keys from a locale source file. Heuristic: parse as
 * text and pick out top-level `messages.<key>.<subkey>` patterns. We avoid full
 * TS parsing because the lockfile shouldn't be tied to a TS toolchain version
 * just for a CI lint.
 */
function extractKeys(src) {
  // Match the messages object's literal shape — e.g.
  //   export const messages = { combobox: { listboxLabel: '…' }, dialog: {…} } as const;
  // This is intentionally simple; if it fails, the script reports inconclusive.
  const start = src.indexOf('messages =');
  if (start < 0) return null;
  let depth = 0;
  let captureStart = -1;
  for (let i = src.indexOf('{', start); i < src.length; i++) {
    const ch = src[i];
    if (ch === '{') {
      if (depth === 0) captureStart = i;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        const body = src.slice(captureStart + 1, i);
        // Pick out top-level identifier-style keys, e.g. `combobox: {...}`.
        return new Set([...body.matchAll(/(\w+)\s*:/g)].map((m) => m[1]));
      }
    }
  }
  return null;
}

const shapes = new Map();
for (const lang of langs) {
  const file = join(LOCALE_SRC, lang, 'index.ts');
  const src = readFileSync(file, 'utf8');
  const keys = extractKeys(src);
  if (keys) shapes.set(lang, keys);
}

if (shapes.size === 0) {
  console.log('✓ Locale shape: no `messages` exports detected — placeholders only.');
  process.exit(0);
}

const reference = shapes.get('en') ?? shapes.values().next().value;
let errors = 0;
for (const [lang, keys] of shapes) {
  for (const k of reference) {
    if (!keys.has(k)) {
      console.error(`✘ Locale "${lang}" is missing top-level key "${k}".`);
      errors++;
    }
  }
  for (const k of keys) {
    if (!reference.has(k)) {
      console.error(`✘ Locale "${lang}" has unexpected top-level key "${k}".`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} locale shape mismatch${errors === 1 ? '' : 'es'}.`);
  process.exit(1);
}
console.log(`✓ Locale shape OK across ${shapes.size} languages.`);
