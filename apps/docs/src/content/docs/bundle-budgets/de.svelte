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
  <title>Bundle-Budgets · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Grundlagen — 05"
  title="Bytes sind ein Feature."
  lede="Jeder Komponenten-Subpath hat ein Brotli-Budget. Die CI scheitert, wenn ein PR darüber driftet. Ein Budget anzuheben verlangt einen neuen ADR mit Mess-Evidenz — nie ein beiläufiges Inkrement."
>
  <h2>Die Zahlen</h2>
  <table class="budgets">
    <thead>
      <tr><th>Subpath</th><th class="num">Brotli</th></tr>
    </thead>
    <tbody>
      {#each budgets as b (b.name)}
        <tr><td><code>{b.name}</code></td><td class="num">{b.limit}</td></tr>
      {/each}
    </tbody>
  </table>

  <p>
    Die vollständige Tabelle — jeder Subpath, jede Begründung — lebt in
    <a href="https://github.com/baseballyama/kumiki/blob/main/docs/design/09-bundle-budget.md"
      >docs/design/09-bundle-budget.md</a
    >. Die aktuell gemessenen Werte sind unter
    <a href="/sizes">/sizes</a> sichtbar; Wettbewerbsvergleiche unter
    <a href="/sizes/compare">/sizes/compare</a>.
  </p>

  <h2>Wie Budgets erzwungen werden</h2>
  <ol>
    <li><code>size-limit</code> misst jeden Subpath bei jedem CI-Lauf.</li>
    <li>
      Überschreitet eine Messung das Limit, schlägt der Build fehl. Kein <code>--ignore</code>.
    </li>
    <li>
      <code>agadoo</code> verifiziert das Tree-Shaking — jedes Paket deklariert
      <code>sideEffects: false</code> und wird geprüft.
    </li>
    <li>
      <code>publint</code> + <code>arethetypeswrong</code> verifizieren, dass die veröffentlichte
      Form den deklarierten <code>exports</code> entspricht.
    </li>
  </ol>

  <h2>Warum das in der Doku steht</h2>
  <p>
    Weil Reviewer es wissen sollten. Eine Pull-Request, die Combobox von 4,5 KB auf 4,8 KB hebt, ist
    keine kleine Änderung — es ist eine Entscheidung, die einen entsprechenden ADR braucht. Die Zahl
    ist für Konsumenten sichtbar; die Disziplin muss es ebenso sein.
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
