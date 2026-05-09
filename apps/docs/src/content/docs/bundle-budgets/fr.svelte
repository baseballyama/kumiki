<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';

  const budgets = [
    { name: '@kumiki/primitives/<each>', limit: '500 B' },
    { name: '@kumiki/runtime', limit: '1 KB' },
    { name: '@kumiki/machines/toggle', limit: '800 B' },
    { name: '@kumiki/machines/combobox', limit: '3 KB' },
    { name: '@kumiki/components/toggle', limit: '1.5 KB' },
    { name: '@kumiki/components/dialog', limit: '3.5 KB' },
    { name: '@kumiki/components/combobox', limit: '4.5 KB' },
    { name: '@kumiki/locale/<lang>', limit: '1 KB' },
  ];
</script>

<svelte:head>
  <title>Budgets de bundle · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Fondations — 05"
  title="Les octets sont une fonctionnalité."
  lede="Chaque sous-chemin de composant a un budget brotli. La CI échoue si une PR dérive. Augmenter un budget impose un nouvel ADR avec preuves mesurées — jamais un incrément désinvolte."
>
  <h2>Les chiffres</h2>
  <table class="budgets">
    <thead>
      <tr><th>Sous-chemin</th><th class="num">Brotli</th></tr>
    </thead>
    <tbody>
      {#each budgets as b (b.name)}
        <tr><td><code>{b.name}</code></td><td class="num">{b.limit}</td></tr>
      {/each}
    </tbody>
  </table>

  <p>
    Le tableau complet — chaque sous-chemin, chaque justification — se trouve dans
    <a href="https://github.com/baseballyama/kumiki/blob/main/docs/design/09-bundle-budget.md"
      >docs/design/09-bundle-budget.md</a
    >. Les valeurs mesurées actuelles sont visibles sur
    <a href="/sizes">/sizes</a> ; les comparaisons concurrentes sur
    <a href="/sizes/compare">/sizes/compare</a>.
  </p>

  <h2>Comment les budgets sont imposés</h2>
  <ol>
    <li><code>size-limit</code> mesure chaque sous-chemin à chaque exécution CI.</li>
    <li>
      Si une mesure dépasse la limite, la build échoue. Pas de <code>--ignore</code>.
    </li>
    <li>
      <code>agadoo</code> vérifie le tree-shaking — chaque paquet déclare
      <code>sideEffects: false</code> et est contrôlé.
    </li>
    <li>
      <code>publint</code> + <code>arethetypeswrong</code> vérifient que la forme publiée correspond
      aux <code>exports</code> déclarés.
    </li>
  </ol>

  <h2>Pourquoi c'est dans la doc</h2>
  <p>
    Parce que les revieweurs devraient le savoir. Une PR qui pousse Combobox de 4,5 Ko à 4,8 Ko
    n'est pas un petit changement — c'est une décision qui exige un ADR correspondant. Le chiffre
    est visible pour les consommateurs ; la discipline doit l'être aussi.
  </p>
</Prose>

<style>
  table.budgets {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 14px;
  }
  table.budgets th,
  table.budgets td {
    padding: 10px 14px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
  }
  table.budgets th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    font-weight: 500;
  }
  table.budgets .num {
    text-align: end;
    font-family: var(--k-font-mono);
    color: var(--k-shu-ink);
  }
  :global([data-theme='dark']) table.budgets .num {
    color: var(--k-shu);
  }
  table.budgets code {
    font-size: 12px;
    background: transparent;
    border: 0;
    padding: 0;
  }
</style>
