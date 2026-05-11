/**
 * Local audit script: navigate to every /components/<slug> page, run axe-core's
 * color-contrast rule against the preview area (and any iframe), and print
 * any violations.
 *
 * Run while a dev server is up on http://localhost:5173:
 *   node apps/docs/scripts/audit-atelier.mjs
 *
 * Not wired into CI yet (that's `*.a11y.test.ts` under `apps/docs/tests/`).
 * This script is a developer aid for sweeping the docs UI.
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const axeSource = readFileSync(resolve(__dirname, '../node_modules/axe-core/axe.min.js'), 'utf-8');

const SLUGS =
  process.argv.slice(2).length > 0
    ? process.argv.slice(2)
    : [
        'atelier-button',
        'atelier-icon-button',
        'atelier-alert',
        'atelier-badge',
        'atelier-loading-spinner',
        'atelier-horizontal-rule',
        'atelier-definition-list',
        'atelier-avatar',
        'atelier-avatar-group',
        'atelier-chips',
        'atelier-breadcrumb',
        'atelier-pagination',
        'atelier-table',
        'atelier-toggle',
        'atelier-switch',
        'atelier-checkbox',
        'atelier-radio-group',
        'atelier-tabs',
        'atelier-dialog',
        'atelier-tooltip',
        'atelier-popover',
        'atelier-menu',
        'atelier-toast',
        'atelier-select',
        'atelier-combobox',
        'atelier-form-field',
        'atelier-accordion',
        'atelier-slider',
        'atelier-number-field',
        'atelier-calendar',
        'atelier-date-picker',
        'atelier-datetime-field',
        'atelier-time-field',
        'atelier-toolbar',
      ];

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();

const results = {};
for (const slug of SLUGS) {
  try {
    const url = `http://localhost:5173/components/${slug}`;
    await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(1000);
    await page.addScriptTag({ content: axeSource });
    const violations = await page.evaluate(async (axeSrc) => {
      const all = [];
      const root = document.querySelector('.panel') || document;
      const top = await window.axe.run(root, {
        runOnly: { type: 'rule', values: ['color-contrast'] },
      });
      all.push(...top.violations);
      const frames = Array.from(document.querySelectorAll('iframe'));
      for (const f of frames) {
        try {
          const doc = f.contentDocument;
          if (!doc) continue;
          if (!f.contentWindow.axe) {
            const s = doc.createElement('script');
            s.textContent = axeSrc;
            doc.head.appendChild(s);
            await new Promise((r) => setTimeout(r, 100));
          }
          const ir = await f.contentWindow.axe.run(doc, {
            runOnly: { type: 'rule', values: ['color-contrast'] },
          });
          all.push(...ir.violations);
        } catch {
          // ignore frame errors
        }
      }
      return all.map((v) => ({
        id: v.id,
        nodes: v.nodes.slice(0, 12).map((n) => ({
          target: n.target,
          summary: (n.failureSummary || '').split('\n').join(' | ').slice(0, 300),
          html: n.html.slice(0, 220),
        })),
      }));
    }, axeSource);
    if (violations.length > 0) {
      results[slug] = violations;
    }
  } catch (e) {
    results[slug] = [{ error: String(e) }];
  }
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
