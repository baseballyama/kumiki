#!/usr/bin/env node
/**
 * Snapshot the "Keyboard Interaction" section of every APG pattern we
 * implement, and fail if it has drifted since the last commit.
 *
 * Why: our `apps/docs/keyboard/<name>.kb.ts` files are hand-transcribed
 * from APG. Spec changes to the upstream pages (e.g. APG adds a new
 * recommended key for Tabs, or revises how Tooltip dismiss is supposed
 * to work) won't fail any of our local tests — our hand-transcription
 * is stuck in time. This script is the upstream-drift alarm.
 *
 * Output: one plaintext snapshot per kb file in
 *   `apps/docs/keyboard/.apg-snapshots/<kb-name>.txt`
 *
 * Modes:
 *   pnpm apg:snapshot         → write/update snapshots (network)
 *   pnpm check:apg-snapshots  → compare; fail on drift (network, CI)
 *
 * Both modes hit the network, so the gate is **not** wired into
 * `ci:health`. Run it via a scheduled GitHub Action (weekly) — the
 * APG patterns barely change, and we don't want PR flakiness from
 * w3.org being slow.
 *
 * The snapshot is plaintext (HTML stripped) so any structural change —
 * a new <li>, an added <kbd>, a reworded sentence — produces a clean
 * line-level diff in PR review.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = join(dirname(__filename), '..');
const KB_DIR = join(ROOT, 'apps/docs/keyboard');
const SNAP_DIR = join(KB_DIR, '.apg-snapshots');

const args = new Set(process.argv.slice(2));
const isCheck = args.has('--check');

if (!existsSync(SNAP_DIR)) mkdirSync(SNAP_DIR, { recursive: true });

const kbFiles = readdirSync(KB_DIR).filter((f) => f.endsWith('.kb.ts'));

/**
 * Pull the keyboard-interaction section from an APG pattern page.
 *
 * APG pages are static HTML with predictable structure: an
 * `<h2 id="keyboardinteraction">Keyboard Interaction</h2>` heading
 * followed by content until the next `<h2 id="…">`. We slice that
 * range and strip tags to plaintext for diffability.
 *
 * Returns null if the page doesn't have a keyboard section (e.g. our
 * form-field contract points at the broader forms practices page,
 * which has no single keyboard heading — that's expected).
 */
function extractKeyboardSection(html) {
  const startRe = /<h2[^>]*id="keyboardinteraction"[^>]*>/i;
  const startMatch = startRe.exec(html);
  if (!startMatch) return null;
  const start = startMatch.index;
  const after = html.slice(start + startMatch[0].length);
  const endRe = /<h2[^>]*id="(?!keyboardinteraction)[^"]*"/i;
  const endMatch = endRe.exec(after);
  const end = endMatch ? endMatch.index : after.length;
  return after.slice(0, end);
}

/**
 * Convert APG's HTML fragment to plaintext that diffs cleanly.
 *
 * The conversion is intentionally lossy — we don't preserve attribute
 * markup or class names, only the structural shape (lists, kbd
 * highlights as `[Key]`, paragraph breaks). That keeps trivial APG
 * site-wide style changes from triggering false positives while still
 * surfacing real keyboard-table edits.
 */
function htmlToText(html) {
  return (
    html
      .replace(/<kbd>/g, '[')
      .replace(/<\/kbd>/g, ']')
      // Preserve list-item shape with leading dashes.
      .replace(/<li[^>]*>/g, '\n- ')
      .replace(/<\/li>/g, '')
      // Block elements → paragraph breaks.
      .replace(/<\/?(h[1-6]|p|ul|ol|dl|dt|dd|section|div|table|tr|td|th)[^>]*>/g, '\n')
      // Strip remaining tags.
      .replace(/<[^>]+>/g, '')
      // Decode the few entities that show up in APG content.
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      // Collapse runs of whitespace and excess blank lines.
      .replace(/[ \t]+/g, ' ')
      .replace(/\n[ \t]+/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}

function extractApgUrl(source) {
  const m = /apg:\s*['"]([^'"]+)['"]/.exec(source);
  return m ? m[1] : null;
}

const summary = { ok: 0, drifted: 0, skipped: 0, failed: 0 };
const drifts = [];

for (const file of kbFiles) {
  const kbPath = join(KB_DIR, file);
  const source = readFileSync(kbPath, 'utf8');
  const apgUrl = extractApgUrl(source);
  if (!apgUrl) {
    console.warn(`⚠ ${file}: no apg URL`);
    summary.skipped++;
    continue;
  }
  const snapName = file.replace(/\.kb\.ts$/, '.txt');
  const snapPath = join(SNAP_DIR, snapName);

  let res;
  try {
    res = await fetch(apgUrl, {
      headers: {
        'user-agent': 'kumiki-apg-snapshot/0.1 (+https://github.com/baseballyama/kumiki)',
      },
    });
  } catch (err) {
    console.warn(`⚠ ${file}: fetch failed (${err.message ?? err})`);
    summary.failed++;
    continue;
  }
  if (!res.ok) {
    console.warn(`⚠ ${file}: ${apgUrl} → HTTP ${res.status}`);
    summary.failed++;
    continue;
  }
  const html = await res.text();
  const section = extractKeyboardSection(html);
  if (!section) {
    console.warn(`⚠ ${file}: no #keyboardinteraction heading at ${apgUrl}`);
    summary.skipped++;
    continue;
  }
  const text = htmlToText(section);
  const fresh = `# Keyboard Interaction snapshot\n# source: ${apgUrl}\n# kb: apps/docs/keyboard/${file}\n\n${text}\n`;

  if (isCheck) {
    if (!existsSync(snapPath)) {
      console.error(`✘ ${file}: no snapshot — run \`pnpm apg:snapshot\` to create.`);
      drifts.push(file);
      summary.drifted++;
      continue;
    }
    const stored = readFileSync(snapPath, 'utf8');
    if (stored !== fresh) {
      console.error(`✘ ${file}: APG content drift detected at ${apgUrl}`);
      drifts.push(file);
      summary.drifted++;
      continue;
    }
    console.log(`✓ ${file}`);
    summary.ok++;
  } else {
    writeFileSync(snapPath, fresh);
    console.log(`✓ ${file} → .apg-snapshots/${snapName}`);
    summary.ok++;
  }
}

console.log(
  `\n${summary.ok} ok · ${summary.drifted} drifted · ${summary.skipped} skipped · ${summary.failed} failed`,
);

if (isCheck && summary.drifted > 0) {
  console.error(
    `\nReview the diff against \`apps/docs/keyboard/.apg-snapshots/\`. ` +
      `If APG genuinely updated, refresh the snapshot AND mirror the ` +
      `change into the corresponding kb.ts contract.`,
  );
  process.exit(1);
}
if (summary.failed > 0 && isCheck) {
  // Network failures shouldn't pass --check silently — the maintainer
  // should know the upstream check didn't actually run.
  process.exit(2);
}
