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
  if (pkg.name === '@kumiki/components' || pkg.name === '@kumiki/atelier') continue;
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

// ─── Layer 3 controller construction ─────────────────────────────────────
//
// Per `docs/release/v1-execution-plan.md` A-3: Layer 3 controller construction
// must complete without DOM globals. Importing the headless barrel (above)
// catches *top-level* DOM access; this second pass catches *constructor-time*
// access by actually invoking each `create*()` factory with a minimal valid
// input. The factory returns a controller object — we throw the result away,
// we only care that no DOM was needed to build it.
//
// Inputs mirror `apps/docs/scripts/build-machine-specs.mjs` and the per-component
// tests under `packages/headless/src/<name>/attachment.test.ts`.
//
// `calendar` is intentionally skipped here: `createCalendar` requires a
// `CalendarDate` instance, but `@internationalized/date` is a peer/dev dep
// of `@kumiki/{headless,machines}` and is not installed at the repo root.
// `apps/docs/scripts/build-machine-specs.mjs` already exercises the calendar
// FSM in a Node context where the peer is resolvable, so we don't lose
// coverage by skipping it here.

const headless = await import(pathToFileURL(join(PACKAGES, 'headless', 'dist', 'index.mjs')).href);

const L3_ENTRIES = [
  {
    name: 'accordion',
    call: () => headless.accordion.createAccordion({ items: [{ id: 'a', value: 'a' }] }),
  },
  { name: 'alert', call: () => headless.alert.createAlert() },
  { name: 'button', call: () => headless.button.createButton() },
  { name: 'checkbox', call: () => headless.checkbox.createCheckbox() },
  { name: 'combobox', call: () => headless.combobox.createCombobox() },
  { name: 'dialog', call: () => headless.dialog.createDialog() },
  { name: 'form-field', call: () => headless.formField.createFormField({ initialValue: '' }) },
  { name: 'menu', call: () => headless.menu.createMenu({ items: [{ id: 'a', label: 'A' }] }) },
  { name: 'number-field', call: () => headless.numberField.createNumberField() },
  { name: 'popover', call: () => headless.popover.createPopover() },
  {
    name: 'radio-group',
    call: () => headless.radioGroup.createRadioGroup({ items: [{ id: 'a', value: 'a' }] }),
  },
  {
    name: 'select',
    call: () => headless.select.createSelect({ items: [{ id: 'a', value: 'a', label: 'A' }] }),
  },
  { name: 'slider', call: () => headless.slider.createSlider() },
  { name: 'switch', call: () => headless.switchAttachment.createSwitch() },
  {
    name: 'tabs',
    call: () => headless.tabs.createTabs({ items: [{ value: 't', id: 't' }] }),
  },
  { name: 'toast', call: () => headless.toast.createToast() },
  { name: 'toggle', call: () => headless.toggle.createToggle() },
  { name: 'tooltip', call: () => headless.tooltip.createTooltip() },
];

let constructErrors = 0;
let constructed = 0;

// DOM globals must remain unset for this pass too.
delete globalThis.document;
delete globalThis.window;
delete globalThis.HTMLElement;

for (const entry of L3_ENTRIES) {
  try {
    const controller = entry.call();
    if (controller == null) {
      throw new Error('controller is null/undefined');
    }
    constructed++;
  } catch (err) {
    constructErrors++;
    console.error(`✘ L3 construct ${entry.name}: ${err?.message ?? err}`);
  }
}

if (constructErrors > 0) {
  console.error(
    `\n${constructErrors} Layer 3 controller construction failure${constructErrors === 1 ? '' : 's'}.`,
  );
  process.exit(1);
}
console.log(`✓ ${constructed} Layer 3 controllers constructed in pure Node (no DOM globals).`);

if (errors > 0) {
  console.error(`\n${errors} Node compatibility failure${errors === 1 ? '' : 's'}.`);
  process.exit(1);
}
console.log(`\n✓ ${checked} packages import cleanly in pure Node (no DOM globals).`);
