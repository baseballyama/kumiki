/**
 * `@kumiki/primitives/locale` — pure-TS locale helpers.
 *
 * Framework-agnostic: this module ships zero Svelte runtime. The Svelte-aware
 * `<LocaleProvider>` component and `useLocale()` consumer live in
 * `@kumiki/components/locale-provider`. Both share the {@link LOCALE_CONTEXT_KEY}
 * symbol declared here so any Svelte runtime that participates in the same
 * `getContext` / `setContext` chain can read the same value.
 *
 * @see docs/design/06-i18n.md §6.4 The provider model
 */

/**
 * Layout direction tag. Mirrors `@kumiki/locale`'s `Direction` re-declared
 * locally so primitives stays at Layer 1 with zero `@kumiki/*` dependencies.
 */
export type Direction = 'ltr' | 'rtl';

/**
 * Conservative CLDR-derived set of right-to-left primary language codes.
 *
 * Kept narrow on purpose — a runaway lookup table would blow this primitive's
 * 500 B brotli budget. Add codes only as Kumiki ships locale data for them.
 *
 * @see https://www.unicode.org/cldr/charts/47/supplemental/scripts_and_languages.html
 */
const RTL_LANGUAGE_CODES = new Set([
  'ar', // Arabic
  'fa', // Persian / Farsi
  'he', // Hebrew
  'ps', // Pashto
  'sd', // Sindhi
  'ug', // Uyghur
  'ur', // Urdu
  'yi', // Yiddish
]);

/**
 * Infer the layout direction for a BCP-47 locale tag.
 *
 * Strips any region / script / variant subtags (`ar-EG` → `ar`, `zh-Hans-CN` →
 * `zh`) and consults a small RTL-language allow-list. Unknown locales default
 * to `'ltr'` — the safer fallback for v1.0.
 *
 * @example
 *   inferDirection('en');     // 'ltr'
 *   inferDirection('ar-EG');  // 'rtl'
 *   inferDirection('zh-Hans'); // 'ltr'
 *
 * @when-to-use Reach for this when implementing `dir="auto"` propagation; for
 *   `dir="ltr"` / `dir="rtl"` consumers should pass the value directly.
 */
export function inferDirection(localeCode: string): Direction {
  const primary = localeCode.toLowerCase().split(/[-_]/)[0] ?? '';
  return RTL_LANGUAGE_CODES.has(primary) ? 'rtl' : 'ltr';
}

/**
 * Symbol key used by `<LocaleProvider>` and `useLocale()` to share their
 * Svelte context value. Stable across the entire `@kumiki/*` surface.
 */
export const LOCALE_CONTEXT_KEY: unique symbol = Symbol.for('kumiki.locale');
