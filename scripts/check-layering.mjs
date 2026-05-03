#!/usr/bin/env node
/**
 * Layer dependency check.
 *
 * Each Kumiki package belongs to a Layer (0–5). Layer N may import only from
 * Layer N or below. Crossing this rule pollutes the architecture and was
 * promised in `docs/design/02-architecture.md` §2.2 — this script enforces it.
 *
 * Usage: `node scripts/check-layering.mjs`. Run as part of CI.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const ROOT = join(dirname(__filename), '..');
const PACKAGES = join(ROOT, 'packages');

/** Map a package name to its Layer (0–5). */
function layerOf(pkgName) {
  if (pkgName === '@kumiki/types') return 0;
  if (pkgName === '@kumiki/primitives' || pkgName === '@kumiki/locale') return 1;
  if (pkgName === '@kumiki/runtime' || pkgName.startsWith('@kumiki/machine-')) return 2;
  if (pkgName.startsWith('@kumiki/attachment-')) return 3;
  if (pkgName.startsWith('@kumiki/component-')) return 4;
  if (pkgName.startsWith('@kumiki/recipes-')) return 5;
  if (pkgName === '@kumiki/cli') return 5; // tooling, treated as Layer 5
  if (pkgName === '@kumiki/docs') return 5; // app
  return null;
}

/** All `@kumiki/*` deps from a package.json — runtime + peer + workspace. */
function depsOf(pkg) {
  const out = new Set();
  for (const field of ['dependencies', 'peerDependencies']) {
    for (const name of Object.keys(pkg[field] ?? {})) {
      if (name.startsWith('@kumiki/')) out.add(name);
    }
  }
  return [...out];
}

let errors = 0;

for (const dir of readdirSync(PACKAGES)) {
  const pkgPath = join(PACKAGES, dir, 'package.json');
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  } catch {
    continue;
  }
  const ownLayer = layerOf(pkg.name);
  if (ownLayer === null) {
    console.warn(`⚠ Unknown package layer for ${pkg.name}; skipped.`);
    continue;
  }
  for (const dep of depsOf(pkg)) {
    const depLayer = layerOf(dep);
    if (depLayer === null) {
      console.error(`✘ ${pkg.name} depends on unknown package ${dep}`);
      errors++;
      continue;
    }
    if (depLayer > ownLayer) {
      console.error(
        `✘ ${pkg.name} (Layer ${ownLayer}) depends on ${dep} (Layer ${depLayer}). Layer N may only depend on Layer ≤ N.`,
      );
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} layering violation${errors === 1 ? '' : 's'}.`);
  process.exit(1);
}
console.log('✓ Layering OK.');
