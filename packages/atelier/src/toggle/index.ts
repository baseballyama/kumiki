/**
 * `@kumiki/atelier/toggle` (preview) — styled Toggle variants built on
 * `@kumiki/components/toggle`.
 *
 * Two variants ship side-by-side:
 *
 * - `Tailwind` — Tailwind v4 utility classes; size + variant slots.
 * - `Vanilla` — Vanilla CSS with custom properties for theming.
 *
 * Pick one at the import site. The CLI (`kumiki add toggle --variant=…`)
 * copies the matching source file into your project so you can keep
 * tweaking it without re-installing.
 *
 * @see docs/design/16-decisions/0010-layer5-preview-in-v1.md
 */
import Tailwind from './Toggle.tailwind.svelte';
import Vanilla from './Toggle.vanilla.svelte';

export { Tailwind, Vanilla };
