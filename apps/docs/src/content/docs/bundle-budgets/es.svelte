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
  <title>Presupuestos de bundle · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Fundamentos — 05"
  title="Los bytes son una característica."
  lede="Cada subpath de componente tiene un presupuesto brotli. La CI falla si un PR se desvía. Subir un presupuesto exige un nuevo ADR con evidencia medida — nunca un incremento casual."
>
  <h2>Los números</h2>
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
    La tabla completa — cada subpath y cada razonamiento — vive en
    <a href="https://github.com/baseballyama/kumiki/blob/main/docs/design/09-bundle-budget.md"
      >docs/design/09-bundle-budget.md</a
    >. Los números medidos actuales se ven en
    <a href="/sizes">/sizes</a>; las comparativas con la competencia están en
    <a href="/sizes/compare">/sizes/compare</a>.
  </p>

  <h2>Cómo se aplican los presupuestos</h2>
  <ol>
    <li><code>size-limit</code> mide cada subpath en cada ejecución de CI.</li>
    <li>Si una medición excede el límite, la build falla. Sin <code>--ignore</code>.</li>
    <li>
      <code>agadoo</code> verifica el tree-shaking — cada paquete declara
      <code>sideEffects: false</code> y es comprobado.
    </li>
    <li>
      <code>publint</code> + <code>arethetypeswrong</code> verifican que la forma publicada coincide
      con los <code>exports</code> declarados.
    </li>
  </ol>

  <h2>Por qué está en la documentación</h2>
  <p>
    Porque los revisores deberían saberlo. Una pull request que sube Combobox de 4,5 KB a 4,8 KB no
    es un cambio menor — es una decisión que requiere un ADR correspondiente. El número es visible
    para los consumidores; la disciplina también debe serlo.
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
