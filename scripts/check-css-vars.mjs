#!/usr/bin/env node
/**
 * Verify the CSS-variable contract for `@kumiki/atelier/*` components.
 *
 * The atelier stylesheets MUST only reference leaf variables that follow
 * the [`docs/design/18-css-variable-contract.md`](../docs/design/18-css-variable-contract.md)
 * naming convention:
 *
 *   --kumiki-<component>-<part>-<property>[-<state>]
 *
 * Plus a small set of allowed non-component-leaf prefixes:
 *
 *   --kumiki-panel-*       (shared floating-panel sub-contract, §18.3)
 *   --kumiki-color-*       (atelier-internal palette, §18.4)
 *   --kumiki-radius-*      (atelier-internal radius scale, §18.4)
 *   --kumiki-shadow-*      (atelier-internal shadow scale, §18.4)
 *   --kumiki-spacing-*     (atelier-internal spacing scale)
 *
 * What this script enforces (hard CI gate — v1.0 freeze):
 *   1. Every `var(--kumiki-...)` reference inside `packages/atelier/src/**\/*.svelte`
 *      uses the `<component>` prefix that matches the directory the file
 *      lives in — or one of the explicitly-allowed shared prefixes above.
 *   2. Variable names use kebab-case ASCII letters / digits / hyphens only.
 *   3. **Every referenced leaf var is listed in §18.3 of the contract doc.**
 *      A leaf is considered listed iff the doc contains the literal token
 *      `--kumiki-<...>` somewhere (typically inside a backticked cell of a
 *      §18.3 table). New atelier vars MUST be added to §18.3 in the same
 *      PR that introduces them.
 *
 * Usage:
 *   node scripts/check-css-vars.mjs            # exit 1 on any violation or drift
 *   node scripts/check-css-vars.mjs --report   # also print the per-component
 *                                              # leaves found (informational tail)
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = join(dirname(__filename), '..');
const ATELIER_SRC = join(ROOT, 'packages', 'atelier', 'src');
const CONTRACT_MD = join(ROOT, 'docs', 'design', '18-css-variable-contract.md');

const REPORT = process.argv.includes('--report');

const SHARED_PREFIXES = new Set([
  // Documented in §18.3 ("Popover / Menu / Combobox listbox / Tooltip" panel preset).
  'panel',
  // §18.4 atelier-internal palette / scales — consumers may use them but they
  // are atelier-unstable. Atelier itself is allowed to reference them.
  'color',
  'radius',
  'shadow',
  'spacing',
]);

// Some component dirs share a stylistic vocabulary with another (e.g.
// `radio-group` borrows `--kumiki-radio-*` per §18.3 RadioGroup).
// Keep this map as the single source of truth for those exceptions; expand
// only with a corresponding contract-doc note.
const COMPONENT_ALIAS = {
  'radio-group': ['radio-group', 'radio'],
  'avatar-group': ['avatar-group', 'avatar'],
  'date-picker': ['date-picker', 'calendar'],
  'datetime-field': ['datetime-field', 'time-field', 'date-picker', 'calendar'],
  // §18.3 "Popover / Menu / Combobox listbox / Tooltip" share the panel preset
  // and §18.3 "Items inside menus / listboxes" share `--kumiki-menu-item-*`.
  combobox: ['combobox', 'panel', 'menu-item', 'combobox-listbox'],
  select: ['select', 'panel', 'menu-item', 'combobox-listbox'],
  menu: ['menu', 'panel', 'menu-item'],
  popover: ['popover', 'panel'],
  tooltip: ['tooltip', 'panel'],
  // Alert mirrors Toast surface per §18.3.
  alert: ['alert', 'toast'],
  // Toolbar borrows the button-style vocabulary for its items.
  toolbar: ['toolbar', 'button'],
  'icon-button': ['icon-button', 'button'],
  // Stable abbreviated prefixes for components whose full kebab name is
  // overlong for a tokens file. Documented in §18.2 "Stable abbreviations".
  // No new entries here without a contract-doc update + ADR.
  'definition-list': ['definition-list', 'dl'],
  'horizontal-rule': ['horizontal-rule', 'hr'],
  'loading-spinner': ['loading-spinner', 'spinner'],
};

function allowedComponentPrefixes(component) {
  return COMPONENT_ALIAS[component] ?? [component];
}

const VAR_REF_RE = /var\((--kumiki-[a-z0-9-]+)/g;
const NAME_RE = /^--kumiki-[a-z][a-z0-9]*(?:-[a-z0-9]+)+$/;

function* walkSvelte(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) yield* walkSvelte(join(dir, e.name));
    else if (e.name.endsWith('.svelte')) yield join(dir, e.name);
  }
}

function componentForFile(filePath) {
  const rel = filePath.slice(ATELIER_SRC.length + 1);
  // First path segment is always the component name (e.g. `toggle`,
  // `dialog/tailwind/Root.svelte` → `dialog`).
  return rel.split('/')[0];
}

function extractContractLeaves(text) {
  // Pull every --kumiki-* identifier out of the contract markdown.
  const out = new Set();
  for (const m of text.matchAll(/`?(--kumiki-[a-z0-9-]+)`?/g)) {
    out.add(m[1]);
  }
  return out;
}

const errors = [];
const referencedByComponent = new Map();

for (const filePath of walkSvelte(ATELIER_SRC)) {
  const component = componentForFile(filePath);
  const allowed = allowedComponentPrefixes(component);
  const src = readFileSync(filePath, 'utf8');
  let m;
  VAR_REF_RE.lastIndex = 0;
  while ((m = VAR_REF_RE.exec(src)) !== null) {
    const name = m[1];
    if (!NAME_RE.test(name)) {
      errors.push(`${rel(filePath)}: var name fails naming convention: ${name}`);
      continue;
    }
    // Strip the `--kumiki-` prefix and read the first path segment.
    const tail = name.slice('--kumiki-'.length);
    let prefix = tail;
    // Two-segment component names like `radio-group`, `time-field`,
    // `date-picker`, `datetime-field`, `avatar-group`, `icon-button`,
    // `form-field`, `loading-spinner`, `horizontal-rule`, `definition-list`
    // need to be matched against their full kebab name.
    const candidates = [...allowed, ...SHARED_PREFIXES].sort((a, b) => b.length - a.length);
    for (const candidate of candidates) {
      if (tail === candidate || tail.startsWith(`${candidate}-`)) {
        prefix = candidate;
        break;
      }
    }
    if (!allowed.includes(prefix) && !SHARED_PREFIXES.has(prefix)) {
      errors.push(
        `${rel(filePath)}: ${name} uses prefix "${prefix}" not in component "${component}"'s allowed set [${allowed.join(', ')}] or shared prefixes [${[...SHARED_PREFIXES].join(', ')}].`,
      );
      continue;
    }
    if (!referencedByComponent.has(component)) referencedByComponent.set(component, new Set());
    referencedByComponent.get(component).add(name);
  }
}

if (errors.length > 0) {
  for (const e of errors) console.error(`✘ ${e}`);
  console.error(
    `\n${errors.length} CSS variable contract violation${errors.length === 1 ? '' : 's'}.`,
  );
  process.exit(1);
}

// Hard gate (v1.0 freeze): every referenced leaf var MUST be listed in §18.3.
if (!existsSync(CONTRACT_MD)) {
  console.error(`✘ Cannot find ${CONTRACT_MD} to verify §18.3 coverage.`);
  process.exit(1);
}
const contractLeaves = extractContractLeaves(readFileSync(CONTRACT_MD, 'utf8'));
const driftLines = [];
for (const [component, vars] of [...referencedByComponent.entries()].sort()) {
  const missing = [...vars].filter((v) => !contractLeaves.has(v)).sort();
  if (missing.length === 0) continue;
  driftLines.push(`  ${component}:`);
  for (const v of missing) driftLines.push(`    - ${v}`);
}
if (driftLines.length > 0) {
  console.error(
    '✘ CSS-variable contract drift — vars referenced in atelier source but missing from docs/design/18-css-variable-contract.md §18.3:',
  );
  for (const line of driftLines) console.error(line);
  console.error(
    '\nAdd the missing leaves to §18.3 in the same PR that introduces them. This is a hard gate (v1.0 freeze).',
  );
  process.exit(1);
}

const total = [...referencedByComponent.values()].reduce((acc, s) => acc + s.size, 0);
console.log(
  `✓ Atelier CSS-var contract OK — ${referencedByComponent.size} components, ${total} unique --kumiki-* references.`,
);

if (REPORT) {
  console.log('\nPer-component leaf inventory (informational):');
  for (const [component, vars] of [...referencedByComponent.entries()].sort()) {
    console.log(`  ${component} (${vars.size}):`);
    for (const v of [...vars].sort()) console.log(`    - ${v}`);
  }
}

function rel(p) {
  return p.slice(ROOT.length + 1);
}
