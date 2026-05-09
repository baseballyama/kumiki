/**
 * `@kumiki/components/locale-provider` — `<LocaleProvider>` Svelte component
 * plus the `useLocale()` / `tryUseLocale()` consumer helpers.
 *
 * @see docs/design/06-i18n.md §6.4 The provider model
 */
import Root from './Root.svelte';

export { Root };
export { LOCALE_CONTEXT_KEY } from './context.js';
export type { Direction, LocaleContextValue } from './context.js';
export { LocaleProviderMissingError, tryUseLocale, useLocale } from './use-locale.js';
