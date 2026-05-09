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
  <title>バンドル予算 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基礎 — 05"
  title="バイトもまた機能である。"
  lede="すべてのコンポーネントサブパスには brotli 予算があります。PR が予算を超えたら CI は失敗します。予算の引き上げには、計測の根拠を伴う新しい ADR が必要です — 軽い気持ちでの増やし直しは絶対にしません。"
>
  <h2>数字</h2>
  <table class="budgets">
    <thead>
      <tr><th>サブパス</th><th class="num">Brotli</th></tr>
    </thead>
    <tbody>
      {#each budgets as b (b.name)}
        <tr><td><code>{b.name}</code></td><td class="num">{b.limit}</td></tr>
      {/each}
    </tbody>
  </table>

  <p>
    完全な一覧 — すべてのサブパスとその根拠 — は
    <a href="https://github.com/baseballyama/kumiki/blob/main/docs/design/09-bundle-budget.md"
      >docs/design/09-bundle-budget.md</a
    >
    にあります。現状の計測値は <a href="/sizes">/sizes</a> で、競合との比較は
    <a href="/sizes/compare">/sizes/compare</a> です。
  </p>

  <h2>予算の強制方法</h2>
  <ol>
    <li>CI 実行のたびに <code>size-limit</code> が全サブパスを計測する。</li>
    <li>計測値が上限を超えるとビルドは失敗する。<code>--ignore</code> は不可。</li>
    <li>
      <code>agadoo</code> が tree-shaking を検証 — 各パッケージは <code>sideEffects: false</code>
      を宣言し、ここでチェックされる。
    </li>
    <li>
      <code>publint</code> と <code>arethetypeswrong</code> が、公開された形と宣言された
      <code>exports</code> の整合を検証する。
    </li>
  </ol>

  <h2>なぜ docs に置くのか</h2>
  <p>
    レビュー担当者にも見えていてほしいからです。Combobox を 4.5 KB から 4.8 KB に上げる PR
    は小さな変更ではなく、対応する ADR
    が必要な決定です。数字は消費者から見えています。規律もまた、見えていなければなりません。
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
