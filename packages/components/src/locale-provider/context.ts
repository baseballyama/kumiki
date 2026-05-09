/**
 * Internal context for `<LocaleProvider>` and `useLocale()`.
 *
 * The key is re-exported from `@kumiki/primitives/locale` so any consumer
 * (custom provider, third-party adapter, or test helper) can share the same
 * context channel as the canonical Svelte component.
 */
import { LOCALE_CONTEXT_KEY, type Direction } from '@kumiki/primitives/locale';
import type { Messages } from '@kumiki/locale';

export { LOCALE_CONTEXT_KEY };
export type { Direction };

export interface LocaleContextValue {
  /** BCP-47 locale tag, e.g. `'ja'`, `'en-US'`, `'zh-Hant'`. */
  readonly locale: string;
  /** Resolved layout direction for the locale (always `'ltr'` or `'rtl'`, never `'auto'`). */
  readonly dir: Direction;
  /** Per-locale message bundle imported from `@kumiki/locale/<lang>`. */
  readonly messages: Messages;
}
