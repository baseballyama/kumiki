/**
 * `useLocale()` — read the current locale, direction, and messages from the
 * nearest `<LocaleProvider>` ancestor.
 *
 * Component authors call this from inside their `<script>` block:
 *
 * ```svelte
 * <script lang="ts">
 *   import { useLocale } from '@kumiki/components/locale-provider';
 *   const { messages, dir, locale } = useLocale();
 * </script>
 * ```
 *
 * @anti-pattern Don't call `useLocale()` outside of a Svelte component instance —
 *   `getContext` only resolves during component initialization.
 */
import { getContext } from 'svelte';
import { LOCALE_CONTEXT_KEY, type LocaleContextValue } from './context.js';

export class LocaleProviderMissingError extends Error {
  constructor() {
    super('`useLocale()` requires a <LocaleProvider> ancestor. Wrap your app once near the root.');
    this.name = 'LocaleProviderMissingError';
  }
}

/**
 * Read the locale context. Throws {@link LocaleProviderMissingError} if no
 * `<LocaleProvider>` is in the component tree.
 */
export function useLocale(): LocaleContextValue {
  const ctx = getContext<LocaleContextValue | undefined>(LOCALE_CONTEXT_KEY);
  if (!ctx) throw new LocaleProviderMissingError();
  return ctx;
}

/**
 * Read the locale context, returning `undefined` if no `<LocaleProvider>` is
 * present. Useful for components that want to gracefully fall back to a
 * default English message bundle when used outside a provider.
 */
export function tryUseLocale(): LocaleContextValue | undefined {
  return getContext<LocaleContextValue | undefined>(LOCALE_CONTEXT_KEY);
}
