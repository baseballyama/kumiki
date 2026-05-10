/**
 * `@kumiki/atelier/toggle` (preview) — styled Toggle variants built on
 * `@kumiki/components/toggle`.
 *
 * Two variants ship side-by-side under namespace exports:
 *
 * - `Tailwind` — Tailwind v4 utility classes; size + variant slots.
 * - `Vanilla` — Vanilla CSS with custom properties for theming.
 *
 * Pick one at the import site, e.g.:
 *
 *   import { Tailwind } from '@kumiki/atelier/toggle';
 *   <Tailwind.Root pressed={…}>…</Tailwind.Root>
 *
 * The CLI (`kumiki add toggle --variant=…`) copies the matching source
 * file into your project so you can keep tweaking it without
 * re-installing.
 *
 * @see docs/design/16-decisions/0017-atelier-ga-at-v1.md
 */
export * as Tailwind from './tailwind/index.js';
export * as Vanilla from './vanilla/index.js';
