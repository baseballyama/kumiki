/**
 * `@kumiki/atelier/dialog` (preview) — styled Dialog variants built on
 * `@kumiki/components/dialog`.
 *
 * Two variants ship side-by-side, each as a namespace with the full
 * compound surface (Root / Trigger / Overlay / Content / Title /
 * Description / Close):
 *
 * - `Tailwind` — Tailwind v4 utility classes.
 * - `Vanilla` — Vanilla CSS with `kumiki-dialog-*` classes and CSS
 *   custom properties for theming.
 *
 * Pick one at the import site:
 *
 * ```svelte
 * <script>
 *   import { Tailwind as Dialog } from '@kumiki/atelier/dialog';
 * </script>
 * <Dialog.Root>…</Dialog.Root>
 * ```
 *
 * The CLI (`kumiki add dialog --variant=…`) copies the matching source
 * files into your project so you can keep tweaking them without
 * re-installing.
 *
 * @see docs/design/16-decisions/0010-layer5-preview-in-v1.md
 */
export * as Tailwind from './tailwind/index.js';
export * as Vanilla from './vanilla/index.js';
