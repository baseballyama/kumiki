import type { DocDict } from '../types.js';

export const dict: DocDict = {
  nav: {
    docs: 'Docs',
    components: 'Composants',
    architecture: 'Architecture',
    sizes: 'Tailles',
    api: 'API',
    github: 'GitHub',
    skipToContent: 'Aller au contenu',
    toggleTheme: 'Changer de thème',
    selectLocale: "Choisir la langue de l'interface",
    toggleRtl: "Inverser le sens d'écriture",
    search: 'Rechercher dans la doc',
    menu: 'Menu',
  },
  status: { stable: 'Stable', preview: 'Aperçu', unreleased: 'Non publié' },
  landing: {
    eyebrow: 'Headless · Svelte 5 · En couches',
    titleA: 'Des pièces qui s’imbriquent',
    titleB: 'avec une précision millimétrique.',
    lede: 'Kumiki — 組木 — est un système de primitives UI profondément accessible pour Svelte 5. Cinq couches composables, vingt composants, dix locales. Aucune opinion CSS, aucune décision runtime irréversible.',
    ctaPrimary: 'Lire la documentation',
    ctaSecondary: 'Parcourir les composants',
    layersKicker: '/ 02 — Architecture',
    layersTitle: 'Cinq couches, un seul modèle mental.',
    layersLede:
      'Chaque composant vit dans exactement une couche. Choisissez la couche qui correspond à votre besoin de contrôle — et n’expédiez que les octets de cette couche.',
    featuresKicker: '/ 03 — Discipline',
    featuresTitle: 'Conçu pour une accessibilité durable.',
    excerptKicker: '/ 04 — En code',
    excerptTitle: 'Trois lignes, totalement accessibles.',
    glossary: 'n. (J) Kumiki — assemblage de bois imbriqué ; pièces ajustées sans clous ni colle.',
    layers: [
      {
        ja: '型',
        latin: 'Types',
        desc: 'Surface TypeScript partagée — chaque couche au-dessus parle ce contrat.',
      },
      {
        ja: '基',
        latin: 'Primitives',
        desc: 'Helpers agnostiques au framework — focus trap, dismissable, IDs, locale.',
      },
      {
        ja: '機',
        latin: 'Machines',
        desc: 'Machines à états finis en TS pur. JSON inspectable. Runtime de ~1 Ko.',
      },
      {
        ja: '装',
        latin: 'Attachments',
        desc: 'Fabriques {@attach} de Svelte 5. ARIA + data-state sur DOM réel.',
      },
      {
        ja: '組',
        latin: 'Components',
        desc: 'Primitives composées. <Toggle.Root>, <Combobox.Input>, etc.',
      },
      {
        ja: '釉',
        latin: 'Atelier',
        desc: 'Aperçu Layer 5 — variantes stylées prêtes à copier-coller. Livré en 0.x preview.',
      },
    ],
    features: [
      {
        figure: '1.5–4.5 Ko',
        title: 'Budgets de bundle en CI',
        detail:
          'Chaque sous-chemin de composant a un budget brotli. Le dépasser fait échouer la CI. Toggle pèse 1,5 Ko ; Combobox 4,5 Ko.',
      },
      {
        figure: 'WCAG 2.2 AA',
        title: 'Vrais lecteurs d’écran chaque nuit',
        detail:
          'macOS-VoiceOver et Windows-NVDA via Guidepup, planifiés. Tests Axe + clavier APG à chaque PR.',
      },
      {
        figure: '10 locales',
        title: 'Locales en imports par sous-chemin',
        detail:
          'Pas de méga-bundle. @kumiki/locale/<lang> à ≤ 1 Ko chacune. L’inversion RTL réside dans les machines.',
      },
      {
        figure: 'toJSON()',
        title: 'JSON compatible XState',
        detail:
          'Chaque machine.toJSON() produit une configuration visible dans Stately. Inspectez n’importe quelle FSM sur stately.ai/viz.',
      },
    ],
    checklist: [
      'aria-pressed et data-state alignés sur APG.',
      'Clavier : Espace, Entrée, Disabled.',
      'Compatible SSR ; déshydratation / hydratation sans clignotement.',
      '1,5 Ko brotli, imposé par la CI.',
      'Localisé en 10 langues d’origine.',
    ],
    installLabel: "Commande d'installation",
  },
  components: {
    title: 'Composants',
    lede: 'Chaque primitive est livrée avec une démo scriptable. Changez le thème, la langue et le sens d’écriture — toute primitive Kumiki réagit.',
    countLabel: (live, total) =>
      `${total} primitives · ${live} démos en direct · ${total - live} en attente`,
    filter: 'Filtrer',
    filterPlaceholder: 'Filtrer par nom ou description…',
    filterAll: 'Toutes',
    filterLive: 'Démos en direct',
    layerLabel: (n) =>
      ['Types partagés', 'Primitives', 'Machines à états', 'Attachments', 'Composants', 'Atelier'][
        n
      ] ?? `Layer ${n}`,
    livePreview: 'Aperçu en direct',
    code: 'Code',
    a11y: 'Accessibilité',
    rtl: 'Sens',
    direction: 'Sens',
    dirLtr: 'LTR',
    dirRtl: 'RTL',
    locale: 'Locale',
    layoutPreview: 'Aperçu de mise en page',
    apgPattern: 'Modèle WAI-ARIA APG',
    source: 'Source',
    catalogue: 'Catalogue',
    panelMeta:
      "L'aperçu réagit aux changements de thème, de locale et de sens. Utilisez les contrôles dans l'en-tête (et le bouton LTR / RTL ci-dessus) pour vérifier chaque axe séparément.",
    keyboardTitle: 'Clavier',
    keyboardKey: 'Touche',
    keyboardEffect: 'Effet',
    keyboardEmpty:
      'Pas de mapping clavier spécifique. Hérite du comportement standard du navigateur pour le focus / l’activation.',
    testTitle: 'Discipline de tests',
    testItems: [
      'axe-core — exécuté à chaque PR (LTR + RTL × chaque état documenté).',
      'Tests clavier APG — Playwright, écrits à la main par modèle.',
      'VoiceOver / NVDA — planning nocturne via Guidepup.',
      'Noms accessibles requis au niveau du type — title / aria-label / aria-labelledby.',
    ],
    apgRead: 'Lire le modèle W3C ARIA APG ↗',
    placeholder:
      'Cette couche se consomme par code, pas visuellement. Voir les extraits ci-dessous pour des exemples opérationnels.',
    backToCatalogue: '← Composants',
    catalogueAll: 'Tous',
    layerL3: 'L3 — Attach',
    layerL4: 'L4 — Compound',
    layerL5: 'L5 — Atelier',
  },
  sidebar: {
    sections: 'Sections',
    gettingStarted: 'Démarrer',
    introduction: 'Introduction',
    installation: 'Installation',
    firstComponent: 'Votre premier composant',
    foundations: 'Fondations',
    architecture: 'Architecture',
    composition: 'Composition',
    accessibility: 'Accessibilité',
    i18n: 'i18n et RTL',
    bundleBudgets: 'Budgets de bundle',
    layersByExample: 'Couches par l’exemple',
    styling: 'Style',
    components: 'Composants',
    soonBadge: 'bientôt',
    previewBadge: 'preview',
  },
  footer: {
    rights: 'Sous licence MIT · Pré-alpha · Développé en public',
    edit: 'Éditer cette page sur GitHub',
    gettingStarted: 'Démarrer',
    architecture: 'Architecture',
    accessibility: 'Accessibilité',
    i18n: 'i18n et RTL',
    sizes: 'Tailles de bundle',
  },
};
