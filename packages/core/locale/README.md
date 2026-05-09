# @kumiki/locale

> Locale message data — dynamically importable per language. Each language ≤ 1 KB brotli target.

**Layer:** Layer 1 (data).

> **Status:** real `messages` bundles for all 10 v1.0 languages. Each
> subpath also exports a `direction: 'ltr' | 'rtl'` constant.

## Install

```bash
pnpm add @kumiki/locale
```

## Use

Static import per language:

```ts
import { messages, direction } from '@kumiki/locale/ja';
```

Pair with `<LocaleProvider>` from `@kumiki/components/locale-provider`:

```svelte
<script lang="ts">
  import { LocaleProvider } from '@kumiki/components/locale-provider';
  import { messages, direction } from '@kumiki/locale/ja';
</script>

<LocaleProvider.Root locale="ja" {messages} dir={direction}>
  <!-- your app -->
</LocaleProvider.Root>
```

Dynamic import based on the user's language:

```ts
const lang = await detectLocale(); // 'ja'
const { messages } = await import(`@kumiki/locale/${lang}`);
```

The dynamic-import form depends on Vite's static analysis of the
template literal — only literal language codes that appear in the
package's `exports` field are bundled.

## Languages at v1.0

| Subpath                  | Language     | Direction |
| ------------------------ | ------------ | --------- |
| `@kumiki/locale/en`      | English      | LTR       |
| `@kumiki/locale/ja`      | 日本語       | LTR       |
| `@kumiki/locale/zh-Hans` | 中文（简体） | LTR       |
| `@kumiki/locale/zh-Hant` | 中文（繁體） | LTR       |
| `@kumiki/locale/ko`      | 한국어       | LTR       |
| `@kumiki/locale/es`      | Español      | LTR       |
| `@kumiki/locale/fr`      | Français     | LTR       |
| `@kumiki/locale/de`      | Deutsch      | LTR       |
| `@kumiki/locale/ar`      | العربية      | RTL       |
| `@kumiki/locale/he`      | עברית        | RTL       |

A `pnpm check:locale-shape` CI gate verifies every language exports
the same key set.

## See also

- [`docs/design/06-i18n.md`](../../../docs/design/06-i18n.md) — i18n + RTL design.
- [ADR 0006](../../../docs/design/16-decisions/0006-locale-data-distribution.md) — locale data distribution decision.
