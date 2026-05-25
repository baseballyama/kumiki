#!/usr/bin/env node
/**
 * One-shot codemod: rewrite hardcoded `href="/..."` (and similar) inside
 * `apps/docs/src` to use `resolve()` from `$app/paths`. Idempotent — safe to
 * re-run; already-converted callsites are skipped.
 *
 * Conversions:
 *   href="/foo"                 → href={resolve('/foo')}
 *   href="/foo/{slug}"          → href={resolve(`/foo/${slug}`)}
 *   href="/foo/{a}/bar/{b}"     → href={resolve(`/foo/${a}/bar/${b}`)}
 *
 * Anchor-only links (`href="#section"`) and absolute external URLs
 * (`href="https://..."`) are left untouched.
 *
 * Also auto-inserts `import { resolve } from '$app/paths';` into each
 * `<script>` block that gains a `resolve(` reference and doesn't already have
 * the import.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { globSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('../src/', import.meta.url));

function rewriteHref(source) {
  // Match `href="/..."` where `/...` does NOT start with `//` (protocol-relative).
  // The value may contain Svelte interpolations `{expr}`. We avoid matching
  // already-converted `href={...}` expressions.
  return source.replace(/href="(\/(?!\/)[^"]*)"/g, (_match, pathLiteral) => {
    // If the path is purely static (no `{` interpolations), wrap in a plain string.
    if (!pathLiteral.includes('{')) {
      return `href={resolve('${pathLiteral}')}`;
    }
    // Otherwise rebuild as a template literal: `{slug}` → `${slug}`.
    const tpl = pathLiteral.replace(/\{([^}]+)\}/g, '${$1}');
    return `href={resolve(\`${tpl}\`)}`;
  });
}

function ensureResolveImport(source) {
  if (!source.includes('resolve(')) return source;
  if (/from\s+['"]\$app\/paths['"]/.test(source)) {
    // Existing $app/paths import — make sure `resolve` is in the named list.
    return source.replace(/import\s*\{([^}]+)\}\s*from\s*(['"])\$app\/paths\2/, (full, names) => {
      const list = names
        .split(',')
        .map((n) => n.trim())
        .filter(Boolean);
      if (list.includes('resolve')) return full;
      list.push('resolve');
      return `import { ${list.join(', ')} } from '$app/paths'`;
    });
  }
  // Inject a new import at the top of the first <script> block.
  return source.replace(
    /<script\b([^>]*)>/,
    (m) => `${m}\n  import { resolve } from '$app/paths';`,
  );
}

const files = globSync('**/*.svelte', { cwd: ROOT }).map((p) => join(ROOT, p));
let changed = 0;
for (const file of files) {
  const src = await readFile(file, 'utf8');
  const next = ensureResolveImport(rewriteHref(src));
  if (next !== src) {
    await writeFile(file, next);
    changed++;
  }
}
console.log(`Rewrote ${changed} files`);
