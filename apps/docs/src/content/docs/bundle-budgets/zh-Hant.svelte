<script lang="ts">
  import { resolve } from '$app/paths';
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
  <title>體積預算 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基礎 — 05"
  title="位元也是功能。"
  lede="每個元件子路徑都有 brotli 預算。PR 一旦超過,CI 即會失敗。向上調整預算需要一份附量測證據的新 ADR — 絕非隨手增加。"
>
  <h2>數字</h2>
  <table class="budgets">
    <thead>
      <tr><th>子路徑</th><th class="num">Brotli</th></tr>
    </thead>
    <tbody>
      {#each budgets as b (b.name)}
        <tr><td><code>{b.name}</code></td><td class="num">{b.limit}</td></tr>
      {/each}
    </tbody>
  </table>

  <p>
    完整表 — 每個子路徑與每條理由 — 位於
    <a href="https://github.com/baseballyama/kumiki/blob/main/docs/design/09-bundle-budget.md"
      >docs/design/09-bundle-budget.md</a
    >。目前實測數字可見於
    <a href={resolve('/sizes')}>/sizes</a>;與競品的對照位於
    <a href={resolve('/sizes/compare')}>/sizes/compare</a>。
  </p>

  <h2>預算如何強制</h2>
  <ol>
    <li><code>size-limit</code> 在每次 CI 執行時量測每個子路徑。</li>
    <li>若量測值超過上限,建置即失敗。不使用 <code>--ignore</code>。</li>
    <li>
      <code>agadoo</code> 驗證 tree-shaking — 每個套件皆宣告
      <code>sideEffects: false</code> 並接受檢查。
    </li>
    <li>
      <code>publint</code> + <code>arethetypeswrong</code> 驗證發佈的型態符合宣告的
      <code>exports</code>。
    </li>
  </ol>

  <h2>為什麼放在文件裡</h2>
  <p>
    因為審閱者應該知情。把 Combobox 從 4.5 KB 推到 4.8 KB 的 PR 並非小變更 — 是需要相應 ADR 的決定。
    數字對使用者可見;紀律也必須可見。
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
