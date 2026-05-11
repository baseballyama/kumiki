/**
 * Localized summaries per playground slug.
 *
 * The canonical source-of-truth English summary still lives on the registry
 * entry (`PlaygroundEntry.summary`). This module supplies translations for
 * the locales the docs site supports. Missing entries fall back to the
 * English summary on the registry.
 *
 * Backtick spans (`` `code` ``) are rendered as inline code chips on the
 * detail page — translators may use the same markdown-like syntax.
 */

export type LocaleCode = 'en' | 'ja';

export const SUMMARIES_JA: Record<string, string> = {
  // ── Layer 2 (machines) ────────────────────────────────────────────────
  'machine-accordion':
    '純粋 TS で書かれた Accordion 用 FSM。single / multiple 展開モード、フォーカスナビゲーション対応。',

  // ── Layer 3 (headless attachments) ────────────────────────────────────
  'attachment-accordion':
    'Accordion 用の Svelte 5 attachment。`root` / `item` / `trigger` / `panel` を任意の DOM に貼り、ARIA とローピング tabindex を管理。',

  // ── Layer 4 (compound components) ─────────────────────────────────────
  'component-accordion':
    '`<Root>` / `<Item>` / `<Trigger>` / `<Panel>` のコンパウンド構造で stacked disclosure を提供。`V` 型に対してジェネリック、`single` / `multiple` モードに対応。',

  // ── Layer 5 (atelier styled presets) ──────────────────────────────────
  'atelier-accordion':
    'Atelier プレビュー — スタイル付き Accordion(single + multiple 展開モード対応)。',
};

export function localizedSummary(
  slug: string,
  fallback: string,
  locale: LocaleCode | string,
): string {
  if (locale === 'ja') {
    return SUMMARIES_JA[slug] ?? fallback;
  }
  return fallback;
}
