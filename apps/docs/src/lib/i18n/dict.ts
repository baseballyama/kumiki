/*
 * UI strings for the Kumiki docs site. Separate from `@kumiki/locale` (which
 * ships component-level strings only); this dictionary is for chrome,
 * navigation, and body copy on shell pages (landing, catalog, footer, etc.)
 *
 * The 10 locales here mirror the library's Phase 1 locales (CLAUDE.md).
 * en + ja are full translations; the rest reuse en until volunteer
 * translations land.
 */

export type LocaleCode =
  | 'en'
  | 'ja'
  | 'zh-Hans'
  | 'zh-Hant'
  | 'ko'
  | 'es'
  | 'fr'
  | 'de'
  | 'ar'
  | 'he';

export const LOCALES: ReadonlyArray<{ code: LocaleCode; name: string; native: string }> = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'zh-Hans', name: 'Chinese (Simplified)', native: '简体中文' },
  { code: 'zh-Hant', name: 'Chinese (Traditional)', native: '繁體中文' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'he', name: 'Hebrew', native: 'עברית' },
];

export const RTL_LOCALES: ReadonlyArray<LocaleCode> = ['ar', 'he'];

export type DocDict = {
  nav: {
    docs: string;
    components: string;
    architecture: string;
    sizes: string;
    api: string;
    github: string;
    skipToContent: string;
    toggleTheme: string;
    selectLocale: string;
    toggleRtl: string;
    search: string;
    menu: string;
  };
  status: {
    stable: string;
    preview: string;
    unreleased: string;
  };
  landing: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    lede: string;
    ctaPrimary: string;
    ctaSecondary: string;
    layersKicker: string;
    layersTitle: string;
    layersLede: string;
    featuresKicker: string;
    featuresTitle: string;
    excerptKicker: string;
    excerptTitle: string;
    glossary: string;
    layers: ReadonlyArray<{ ja: string; latin: string; desc: string }>;
    features: ReadonlyArray<{ figure: string; title: string; detail: string }>;
    checklist: ReadonlyArray<string>;
    installLabel: string;
  };
  components: {
    title: string;
    lede: string;
    countLabel: (live: number, total: number) => string;
    filter: string;
    filterPlaceholder: string;
    filterAll: string;
    filterLive: string;
    layerLabel: (n: number) => string;
    livePreview: string;
    code: string;
    a11y: string;
    rtl: string;
    direction: string;
    dirLtr: string;
    dirRtl: string;
    locale: string;
    layoutPreview: string;
    apgPattern: string;
    source: string;
    catalogue: string;
    panelMeta: string;
    keyboardTitle: string;
    keyboardKey: string;
    keyboardEffect: string;
    keyboardEmpty: string;
    testTitle: string;
    testItems: ReadonlyArray<string>;
    apgRead: string;
    placeholder: string;
    backToCatalogue: string;
    catalogueAll: string;
    layerL3: string;
    layerL4: string;
    layerL5: string;
  };
  sidebar: {
    sections: string;
    gettingStarted: string;
    introduction: string;
    installation: string;
    firstComponent: string;
    foundations: string;
    architecture: string;
    composition: string;
    accessibility: string;
    i18n: string;
    bundleBudgets: string;
    layersByExample: string;
    styling: string;
    components: string;
    soonBadge: string;
    previewBadge: string;
  };
  footer: {
    rights: string;
    edit: string;
    gettingStarted: string;
    architecture: string;
    accessibility: string;
    i18n: string;
    sizes: string;
  };
};

const en: DocDict = {
  nav: {
    docs: 'Docs',
    components: 'Components',
    architecture: 'Architecture',
    sizes: 'Sizes',
    api: 'API',
    github: 'GitHub',
    skipToContent: 'Skip to content',
    toggleTheme: 'Toggle theme',
    selectLocale: 'Select interface language',
    toggleRtl: 'Toggle text direction',
    search: 'Search the docs',
    menu: 'Menu',
  },
  status: { stable: 'Stable', preview: 'Preview', unreleased: 'Unreleased' },
  landing: {
    eyebrow: 'Headless · Svelte 5 · Layered',
    titleA: 'Pieces that fit',
    titleB: 'with millimetric precision.',
    lede: 'Kumiki — 組木 — is a deeply accessible UI primitive system for Svelte 5. Five composable layers, twenty components, ten locales. No CSS opinions, no runtime decisions you can’t re-make.',
    ctaPrimary: 'Read the docs',
    ctaSecondary: 'Browse components',
    layersKicker: '/ 02 — Architecture',
    layersTitle: 'Five layers, one mental model.',
    layersLede:
      'Each component lives at exactly one layer. Pick the layer that matches your control needs — and ship the bytes for that layer only.',
    featuresKicker: '/ 03 — Discipline',
    featuresTitle: 'Built for the long version of accessibility.',
    excerptKicker: '/ 04 — In code',
    excerptTitle: 'Three lines, fully accessible.',
    glossary: 'n. (J) Kumiki — interlocking wood joinery; pieces fitted without nails or glue.',
    layers: [
      {
        ja: '型',
        latin: 'Types',
        desc: 'Shared TypeScript surface — every layer above speaks this contract.',
      },
      {
        ja: '基',
        latin: 'Primitives',
        desc: 'Framework-agnostic helpers — focus trap, dismissable, IDs, locale.',
      },
      {
        ja: '機',
        latin: 'Machines',
        desc: 'Pure-TS finite state machines. Inspectable JSON. ~1 KB runtime.',
      },
      {
        ja: '装',
        latin: 'Attachments',
        desc: 'Svelte 5 {@attach} factories. ARIA + data-state on real DOM.',
      },
      {
        ja: '組',
        latin: 'Components',
        desc: 'Compound primitives. <Toggle.Root>, <Combobox.Input>, the lot.',
      },
      {
        ja: '釉',
        latin: 'Atelier',
        desc: 'Layer 5 preview — copy-pasteable styled variants. Ships at 0.x preview.',
      },
    ],
    features: [
      {
        figure: '1.5–4.5 KB',
        title: 'Bundle budgets in CI',
        detail:
          'Every component subpath has a brotli budget. Going over fails CI. Toggle ships in 1.5 KB; Combobox in 4.5 KB.',
      },
      {
        figure: 'WCAG 2.2 AA',
        title: 'Real screen-reader nightlies',
        detail:
          'macOS-VoiceOver and Windows-NVDA via Guidepup, on a schedule. Axe + APG keyboard tests on every PR.',
      },
      {
        figure: '10 locales',
        title: 'Locales as subpath imports',
        detail:
          'No mega-bundle. @kumiki/locale/<lang> at ≤ 1 KB each. RTL inversion lives in the machines.',
      },
      {
        figure: 'toJSON()',
        title: 'XState-compatible JSON',
        detail:
          'Each machine.toJSON() exports a Stately-viewable config. Inspect any FSM in stately.ai/viz.',
      },
    ],
    checklist: [
      'APG-aligned aria-pressed & data-state.',
      'Keyboard: Space, Enter, Disabled.',
      'SSR-safe; dehydrate / hydrate with no flicker.',
      '1.5 KB brotli, enforced by CI.',
      'Localised to 10 languages out of the box.',
    ],
    installLabel: 'Install command',
  },
  components: {
    title: 'Components',
    lede: 'Every primitive ships with a live, scriptable demo. Toggle theme, language and writing direction — every Kumiki primitive responds.',
    countLabel: (live, total) =>
      `${total} primitives · ${live} live demos · ${total - live} pending`,
    filter: 'Filter',
    filterPlaceholder: 'Filter by name or description…',
    filterAll: 'All',
    filterLive: 'Live demos',
    layerLabel: (n) =>
      ['Shared types', 'Primitives', 'State machines', 'Attachments', 'Components', 'Atelier'][n] ??
      `Layer ${n}`,
    livePreview: 'Live preview',
    code: 'Code',
    a11y: 'Accessibility',
    rtl: 'Direction',
    direction: 'Direction',
    dirLtr: 'LTR',
    dirRtl: 'RTL',
    locale: 'Locale',
    layoutPreview: 'Layout preview',
    apgPattern: 'WAI-ARIA APG pattern',
    source: 'Source',
    catalogue: 'Catalogue',
    panelMeta:
      'The preview reacts to theme, locale and direction changes. Use the controls in the page header (and the LTR / RTL toggle above) to verify each axis independently.',
    keyboardTitle: 'Keyboard',
    keyboardKey: 'Key',
    keyboardEffect: 'Effect',
    keyboardEmpty:
      'No component-specific keymap. Inherits standard browser focus / activation behaviour.',
    testTitle: 'Test discipline',
    testItems: [
      'axe-core — run on every PR (LTR + RTL × every documented state).',
      'APG keyboard tests — Playwright, hand-written per pattern.',
      'VoiceOver / NVDA — Guidepup nightly schedule.',
      'Type-level required names — title / aria-label / aria-labelledby.',
    ],
    apgRead: 'Read the W3C ARIA APG pattern ↗',
    placeholder:
      'This Layer is consumed via code, not visually. See the snippets below for working examples.',
    backToCatalogue: '← Components',
    catalogueAll: 'All',
    layerL3: 'L3 — Attach',
    layerL4: 'L4 — Compound',
    layerL5: 'L5 — Atelier',
  },
  sidebar: {
    sections: 'Sections',
    gettingStarted: 'Getting started',
    introduction: 'Introduction',
    installation: 'Installation',
    firstComponent: 'Your first component',
    foundations: 'Foundations',
    architecture: 'Architecture',
    composition: 'Composition',
    accessibility: 'Accessibility',
    i18n: 'i18n & RTL',
    bundleBudgets: 'Bundle budgets',
    layersByExample: 'Layers by example',
    styling: 'Styling',
    components: 'Components',
    soonBadge: 'soon',
    previewBadge: 'preview',
  },
  footer: {
    rights: 'MIT licensed · Pre-alpha · Built in the open',
    edit: 'Edit this page on GitHub',
    gettingStarted: 'Getting Started',
    architecture: 'Architecture',
    accessibility: 'Accessibility',
    i18n: 'i18n & RTL',
    sizes: 'Bundle Sizes',
  },
};

const ja: DocDict = {
  nav: {
    docs: 'ドキュメント',
    components: 'コンポーネント',
    architecture: 'アーキテクチャ',
    sizes: 'サイズ',
    api: 'API',
    github: 'GitHub',
    skipToContent: '本文へスキップ',
    toggleTheme: 'テーマを切り替え',
    selectLocale: '表示言語を選択',
    toggleRtl: '文字方向を切り替え',
    search: 'ドキュメント内を検索',
    menu: 'メニュー',
  },
  status: { stable: '安定版', preview: 'プレビュー', unreleased: '未リリース' },
  landing: {
    eyebrow: 'Headless · Svelte 5 · 階層型',
    titleA: 'ぴたりと組み合う、',
    titleB: 'ミリメートル単位の精度。',
    lede: 'Kumiki — 組木 — は Svelte 5 のためのアクセシビリティ最優先の UI プリミティブ群です。5 階層、20 コンポーネント、10 言語。CSS の押しつけはなく、後から覆せない実装上の決定もありません。',
    ctaPrimary: 'ドキュメントを読む',
    ctaSecondary: 'コンポーネントを見る',
    layersKicker: '/ 02 — アーキテクチャ',
    layersTitle: '5 つの階層、ひとつの思想。',
    layersLede:
      '各コンポーネントは厳密にひとつの階層に属します。必要な制御の粒度に応じて階層を選び、その階層分のバイトだけを出荷してください。',
    featuresKicker: '/ 03 — 規律',
    featuresTitle: '長い目で見たアクセシビリティのために。',
    excerptKicker: '/ 04 — コードで',
    excerptTitle: '3 行で、完全にアクセシブル。',
    glossary: '名詞(日本)組木 — 釘も糊も使わずに組み合う木細工。',
    layers: [
      {
        ja: '型',
        latin: 'Types',
        desc: '共有 TypeScript の型 — 上位のすべての階層がこの契約を語る。',
      },
      {
        ja: '基',
        latin: 'Primitives',
        desc: 'フレームワーク非依存のヘルパー — focus-trap、dismissable、ID、locale。',
      },
      {
        ja: '機',
        latin: 'Machines',
        desc: '純粋 TS の有限状態機械。検査可能な JSON。約 1 KB のランタイム。',
      },
      {
        ja: '装',
        latin: 'Attachments',
        desc: 'Svelte 5 の {@attach} ファクトリー。実 DOM に ARIA と data-state。',
      },
      {
        ja: '組',
        latin: 'Components',
        desc: '複合プリミティブ。<Toggle.Root>、<Combobox.Input>、その他一式。',
      },
      {
        ja: '釉',
        latin: 'Atelier',
        desc: 'Layer 5 プレビュー — コピペ可能なスタイル付きバリアント。0.x プレビュー。',
      },
    ],
    features: [
      {
        figure: '1.5–4.5 KB',
        title: 'CI で予算を守る',
        detail:
          '各コンポーネントのサブパスごとに brotli の予算を設定。超過すれば CI は失敗。Toggle は 1.5 KB、Combobox は 4.5 KB。',
      },
      {
        figure: 'WCAG 2.2 AA',
        title: '本物のスクリーンリーダーを毎晩',
        detail:
          'macOS の VoiceOver と Windows の NVDA を Guidepup でスケジュール実行。axe と APG キーボードテストは PR ごと。',
      },
      {
        figure: '10 言語',
        title: 'ロケールはサブパスインポート',
        detail:
          '巨大バンドルではない。@kumiki/locale/<lang> はそれぞれ ≤ 1 KB。RTL の反転はマシン側に。',
      },
      {
        figure: 'toJSON()',
        title: 'XState 互換の JSON',
        detail:
          'machine.toJSON() は Stately で表示できる設定を返す。任意の FSM を stately.ai/viz で検査可。',
      },
    ],
    checklist: [
      'APG 準拠の aria-pressed と data-state。',
      'キーボード: Space、Enter、Disabled。',
      'SSR 安全。脱水 / 水和でちらつき無し。',
      '1.5 KB(brotli)を CI で強制。',
      '初期状態で 10 言語にローカライズ済み。',
    ],
    installLabel: 'インストールコマンド',
  },
  components: {
    title: 'コンポーネント',
    lede: 'すべてのプリミティブにライブで操作可能なデモが付属します。テーマ・言語・文字方向を切り替えてみてください — Kumiki のプリミティブはすべて追従します。',
    countLabel: (live, total) =>
      `${total} 個のプリミティブ · ${live} 個のライブデモ · ${total - live} 個準備中`,
    filter: 'フィルタ',
    filterPlaceholder: '名前や説明で絞り込み…',
    filterAll: 'すべて',
    filterLive: 'ライブデモ',
    layerLabel: (n) =>
      ['共通型', 'プリミティブ', 'ステートマシン', 'アタッチメント', 'コンポーネント', 'アトリエ'][
        n
      ] ?? `Layer ${n}`,
    livePreview: 'ライブプレビュー',
    code: 'コード',
    a11y: 'アクセシビリティ',
    rtl: '文字方向',
    direction: '文字方向',
    dirLtr: '左→右',
    dirRtl: '右→左',
    locale: 'ロケール',
    layoutPreview: 'レイアウトプレビュー',
    apgPattern: 'WAI-ARIA APG パターン',
    source: 'ソースコード',
    catalogue: 'カタログ',
    panelMeta:
      'プレビューはテーマ・ロケール・文字方向の変更に追従します。ページヘッダーの各コントロールと、上の LTR / RTL トグルを使って、軸ごとに確認してください。',
    keyboardTitle: 'キーボード',
    keyboardKey: 'キー',
    keyboardEffect: '効果',
    keyboardEmpty:
      'コンポーネント固有のキーマップはありません。標準的なブラウザのフォーカス / アクティベートに従います。',
    testTitle: 'テスト規律',
    testItems: [
      'axe-core — すべての PR で実行(LTR + RTL × 文書化された全状態)。',
      'APG キーボードテスト — Playwright、パターン別に手書き。',
      'VoiceOver / NVDA — Guidepup ナイトリースケジュール。',
      '型レベルでアクセシブル名を必須化 — title / aria-label / aria-labelledby。',
    ],
    apgRead: 'W3C ARIA APG パターンを読む ↗',
    placeholder:
      'この階層はコードで消費するもので、視覚的には扱いません。下のスニペットから動く例を確認してください。',
    backToCatalogue: '← コンポーネント',
    catalogueAll: 'すべて',
    layerL3: 'L3 — Attach',
    layerL4: 'L4 — Compound',
    layerL5: 'L5 — Atelier',
  },
  sidebar: {
    sections: 'セクション',
    gettingStarted: 'はじめに',
    introduction: 'イントロダクション',
    installation: 'インストール',
    firstComponent: '最初のコンポーネント',
    foundations: '基礎',
    architecture: 'アーキテクチャ',
    composition: '合成',
    accessibility: 'アクセシビリティ',
    i18n: '国際化と RTL',
    bundleBudgets: 'バンドル予算',
    layersByExample: '例で見る各階層',
    styling: 'スタイリング',
    components: 'コンポーネント',
    soonBadge: '近日',
    previewBadge: 'プレビュー',
  },
  footer: {
    rights: 'MIT ライセンス · プレアルファ · オープンに開発中',
    edit: 'このページを GitHub で編集',
    gettingStarted: 'はじめに',
    architecture: 'アーキテクチャ',
    accessibility: 'アクセシビリティ',
    i18n: '国際化と RTL',
    sizes: 'バンドルサイズ',
  },
};

const stub = (label: string): DocDict => ({
  ...en,
  nav: { ...en.nav },
  components: { ...en.components, title: label },
});

const DICT: Record<LocaleCode, DocDict> = {
  en,
  ja,
  'zh-Hans': stub('组件'),
  'zh-Hant': stub('元件'),
  ko: stub('컴포넌트'),
  es: stub('Componentes'),
  fr: stub('Composants'),
  de: stub('Komponenten'),
  ar: stub('المكونات'),
  he: stub('רכיבים'),
};

export function dict(locale: LocaleCode): DocDict {
  return DICT[locale] ?? en;
}

export function isRtl(locale: LocaleCode): boolean {
  return RTL_LOCALES.includes(locale);
}
