<!--
  @component LocaleProvider.Root — sets the locale context (locale code,
  direction, message bundle) so descendant Kumiki components can localize
  themselves via `useLocale()`.

  Wrap your app once, typically in your root layout:

  ```svelte
  <script lang="ts">
    import { LocaleProvider } from '@kumiki/components/locale-provider';
    import { messages, direction } from '@kumiki/locale/ja';

    let { children } = $props();
  </script>

  <LocaleProvider.Root locale="ja" {messages} dir={direction}>
    {@render children()}
  </LocaleProvider.Root>
  ```

  Pass `dir="auto"` (or omit it entirely) to infer direction from the locale
  via `inferDirection()`. RTL locales emit `data-direction="rtl"` on the
  wrapping element so CSS can hook into it.
-->
<script lang="ts">
  import { setContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { inferDirection } from '@kumiki/primitives/locale';
  import type { Messages } from '@kumiki/locale';
  import { LOCALE_CONTEXT_KEY, type Direction, type LocaleContextValue } from './context.js';

  type Props = {
    /** BCP-47 locale tag, e.g. `'en'`, `'ja'`, `'ar-EG'`. */
    locale: string;
    /** Per-locale message bundle. Import from `@kumiki/locale/<lang>`. */
    messages: Messages;
    /** Layout direction. `'auto'` infers from the locale; defaults to `'auto'`. */
    dir?: Direction | 'auto';
    /** Whether to render a wrapping `<div>` with `dir` and `data-direction`. Default: `true`. */
    wrap?: boolean;
    children: Snippet;
  };

  let { locale, messages, dir = 'auto', wrap = true, children }: Props = $props();

  const resolved: Direction = $derived(dir === 'auto' ? inferDirection(locale) : dir);

  setContext<LocaleContextValue>(LOCALE_CONTEXT_KEY, {
    get locale() {
      return locale;
    },
    get dir() {
      return resolved;
    },
    get messages() {
      return messages;
    },
  });
</script>

{#if wrap}
  <div dir={resolved} data-direction={resolved}>
    {@render children()}
  </div>
{:else}
  {@render children()}
{/if}
