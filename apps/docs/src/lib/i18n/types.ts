/*
 * Shared shape of every locale dictionary. Authoring a new locale is a matter
 * of dropping a `<lang>.ts` file in `./locales/` that exports a `dict`
 * conforming to this type.
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
    /** Section title for the family / cross-layer breakdown. */
    familyTitle: string;
    /** Lede above the family table (one sentence). */
    familyLede: string;
    /** Heading for "when to use this layer" callouts inside the family table. */
    familyWhen: string;
    /** Heading shown above the active entry's layer in the family table. */
    familyCurrent: string;
    /** Per-layer "when to use this layer" copy, indexed by layer number. */
    layerWhen: ReadonlyArray<string>;
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
    /** Layer 0 — Types section title. */
    layer0: string;
    /** Layer 1 — Primitives + Locale section title. */
    layer1: string;
    /** Layer 2 — Runtime + Machines section title. */
    layer2: string;
    /** Layer 3 — Headless attachments section title. */
    layer3: string;
    /** Layer 4 — Compound components section title. */
    layer4: string;
    /** Layer 5 — Atelier styled presets section title. */
    layer5: string;
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
