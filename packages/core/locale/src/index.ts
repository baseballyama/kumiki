/**
 * `@kumiki/locale` — type-only barrel.
 *
 * This entry exports the `Messages` shape and `Direction` tag. Per-language
 * data is **not** re-exported here — consumers import from the per-language
 * subpath (`@kumiki/locale/en`, `@kumiki/locale/ja`, …) so only the locale
 * they actually use ends up in their bundle.
 *
 * @see docs/design/06-i18n.md
 */
export type { Direction, Messages } from './messages.js';
