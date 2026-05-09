<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';

  const layers = [
    {
      n: 0,
      ji: '型',
      name: 'Types',
      pkg: '@kumiki/types',
      role: "Surface TypeScript partagée — la seule chose sur laquelle chaque couche au-dessus s'accorde.",
    },
    {
      n: 1,
      ji: '基',
      name: 'Primitives',
      pkg: '@kumiki/primitives',
      role: 'Helpers agnostiques au framework (focus trap, dismissable, ID, locale, motion).',
    },
    {
      n: 2,
      ji: '機',
      name: 'Machines',
      pkg: '@kumiki/machines',
      role: 'Machines à états finis en TS pur. Runtime ~1 Ko, JSON inspectable.',
    },
    {
      n: 3,
      ji: '装',
      name: 'Attachments',
      pkg: '@kumiki/headless',
      role: 'Fabriques {@attach} de Svelte 5 — pilotent ARIA + data-state sur du DOM réel.',
    },
    {
      n: 4,
      ji: '組',
      name: 'Components',
      pkg: '@kumiki/components',
      role: 'Primitives composées. API ergonomique en espace de noms à points.',
    },
    {
      n: 5,
      ji: '釉',
      name: 'Atelier',
      pkg: '@kumiki/atelier',
      role: 'Aperçu Layer 5 — variantes stylées prêtes au copier-coller.',
    },
  ];
</script>

<svelte:head>
  <title>Architecture · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Fondations — 01"
  title="Cinq couches, un seul modèle mental."
  lede="Chaque primitive Kumiki vit dans exactement une couche. Choisissez la couche qui correspond à votre besoin de contrôle — et n'expédiez que les octets de cette couche. Les exports par sous-chemin gardent le tree-shaking chirurgical."
>
  <p>
    Les noms empruntent à l'assemblage <em>Kumiki</em>. Chaque couche est une pièce qui s'imbrique
    dans la suivante sans clous ni colle.
  </p>

  <table class="layers">
    <thead>
      <tr>
        <th>L</th>
        <th>Nom</th>
        <th>Paquet</th>
        <th>Rôle</th>
      </tr>
    </thead>
    <tbody>
      {#each layers as l (l.n)}
        <tr>
          <td class="num">L{l.n}</td>
          <td><span class="ji">{l.ji}</span><strong>{l.name}</strong></td>
          <td><code>{l.pkg}</code></td>
          <td class="role">{l.role}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <h2>Choisir une couche</h2>
  <p>La plupart des apps vivent en Layer 4. Descendez seulement quand vous devez :</p>
  <ul>
    <li>
      <strong>Layer 3 (attachments)</strong> quand vous contrôlez le DOM finement — vous stylez avec
      un <code>&lt;button&gt;</code> natif, pas un wrapper Svelte.
    </li>
    <li>
      <strong>Layer 2 (machines)</strong> pour la validation SSR / côté serveur, ou pour exécuter la logique
      dans un contexte non-Svelte (Cypress, Vitest, un worker).
    </li>
    <li>
      <strong>Layer 1 (primitives)</strong> quand vous écrivez votre propre composant au-dessus des moteurs
      dismissable / focus-trap / ID.
    </li>
  </ul>

  <h2>Pourquoi ne pas tout importer ?</h2>
  <p>
    Budgets de bundle. Chaque sous-chemin a un budget brotli appliqué en CI — Toggle pèse 1,5 Ko,
    Combobox 4,5 Ko. Tirer les variantes stylées de Layer 5 dans un projet qui possède déjà ses
    design tokens, ce sont des octets gaspillés ; le paquet Atelier est opt-in, pas la valeur par
    défaut.
  </p>

  <h2>Lecture de référence</h2>
  <p>
    Les docs internes de design vivent dans
    <a href="https://github.com/baseballyama/kumiki/tree/main/docs/design">/docs/design</a>. À noter
    en particulier :
  </p>
  <ul>
    <li><code>02-architecture.md</code> — ce modèle de couches, avec schémas.</li>
    <li><code>03-package-structure.md</code> — frontières des paquets.</li>
    <li><code>04-state-machines.md</code> — la spécification du runtime FSM.</li>
    <li><code>09-bundle-budget.md</code> — les budgets brotli par sous-chemin.</li>
  </ul>
</Prose>

<style>
  table.layers {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 14px;
  }
  table.layers th,
  table.layers td {
    padding: 12px 14px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: middle;
  }
  table.layers th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    border-block-end-color: var(--k-line-2);
    font-weight: 500;
  }
  table.layers .num {
    color: var(--k-shu);
    font-family: var(--k-font-mono);
    font-size: 12px;
    width: 5%;
  }
  table.layers .ji {
    font-family: var(--k-font-display);
    font-size: 22px;
    color: var(--k-ink-1);
    margin-inline-end: 8px;
    font-variation-settings:
      'opsz' 36,
      'SOFT' 30;
  }
  table.layers .role {
    color: var(--k-ink-3);
  }
  table.layers code {
    font-size: 11px;
  }
</style>
