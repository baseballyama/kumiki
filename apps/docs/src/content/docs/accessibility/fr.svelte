<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>Accessibilité · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Fondations — 03"
  title="La version longue de l'accessibilité."
  lede="axe-core attrape 30–40 % des violations WCAG. Les 60 % restants viennent des tests clavier APG et de l'exécution réelle de lecteurs d'écran. Kumiki conditionne les merges aux trois."
>
  <h2>Trois couches de tests</h2>

  <table class="strata">
    <thead>
      <tr>
        <th>Quoi</th>
        <th>Quand</th>
        <th>Détecte</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>axe-core</strong></td>
        <td>Chaque PR — LTR & RTL × chaque état documenté</td>
        <td>Violations statiques : labels manquants, contraste, validité du rôle.</td>
      </tr>
      <tr>
        <td><strong>Clavier APG</strong></td>
        <td>Chaque PR — Playwright par modèle</td>
        <td>Ordre de tabulation, nav fléchée, sémantique Home / End / Page, Escape.</td>
      </tr>
      <tr>
        <td><strong>Lecteurs Guidepup</strong></td>
        <td>Planning nocturne</td>
        <td>Ce que VoiceOver et NVDA disent réellement, dans l'ordre réel.</td>
      </tr>
    </tbody>
  </table>

  <h2>Noms requis au niveau du type</h2>
  <p>
    Là où la WAI-ARIA APG exige un nom accessible (pensez aux dialogues), TypeScript impose
    l'exigence. <code>{`<Dialog.Root>`}</code> ne compile pas sans l'un de
    <code>title</code>, <code>aria-label</code> ou <code>aria-labelledby</code>.
  </p>

  <pre><code
      >{`<Dialog.Root title="Confirmer la suppression">
  <!-- compile -->
</Dialog.Root>

<Dialog.Root>
  <!-- erreur de type : nom accessible manquant -->
</Dialog.Root>`}</code
    ></pre>

  <h2>Contrats clavier</h2>
  <p>
    Chaque composant documente son mapping clavier sur sa page de détail (onglet
    <strong>Accessibilité</strong>). Là où APG définit un modèle, Kumiki le suit à la lettre — sans
    interprétation créative.
  </p>

  <h2>Réduction du mouvement, RTL, fort contraste</h2>
  <ul>
    <li>
      <code>prefers-reduced-motion</code> réduit toutes les transitions à ~10 ms sur tout le site de docs.
    </li>
    <li>
      RTL n'est pas une réflexion d'après-coup. Les mappings clavier sensibles au sens (Tabs,
      Slider) lisent le sens dans le contexte de la machine, pas dans le DOM.
    </li>
    <li>
      Le mode Forced-colors est respecté — les composants évitent les indices d'état basés
      uniquement sur le fond.
    </li>
  </ul>

  <h2>La checklist « Kumiki-ready »</h2>
  <p>
    Chaque composant doit satisfaire la checklist dans
    <a href="https://github.com/baseballyama/kumiki/blob/main/docs/design/05-accessibility.md"
      >docs/design/05-accessibility.md §5.6</a
    >
    avant merge. Aucune exception, aucun flag <code>--ignore</code>.
  </p>
</Prose>

<style>
  table.strata {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 14px;
  }
  table.strata th,
  table.strata td {
    padding: 12px 14px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: top;
  }
  table.strata th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    font-weight: 500;
  }
  table.strata td {
    color: var(--k-ink-3);
  }
  table.strata td:first-child {
    color: var(--k-ink-1);
    width: 22%;
  }
  table.strata td:nth-child(2) {
    width: 32%;
  }
</style>
