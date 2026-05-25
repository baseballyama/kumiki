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
  <title>体积预算 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基础 — 05"
  title="字节也是一种特性。"
  lede="每个组件子路径都有 brotli 预算。PR 一旦超过,CI 就会失败。向上调整预算需要一份带计量证据的新 ADR — 绝非随手增加。"
>
  <h2>数字</h2>
  <table class="budgets">
    <thead>
      <tr><th>子路径</th><th class="num">Brotli</th></tr>
    </thead>
    <tbody>
      {#each budgets as b (b.name)}
        <tr><td><code>{b.name}</code></td><td class="num">{b.limit}</td></tr>
      {/each}
    </tbody>
  </table>

  <p>
    完整表格 — 每个子路径与每条理由 — 位于
    <a href="https://github.com/baseballyama/kumiki/blob/main/docs/design/09-bundle-budget.md"
      >docs/design/09-bundle-budget.md</a
    >。当前的实测数字可见于
    <a href={resolve('/sizes')}>/sizes</a>;竞品对比在
    <a href={resolve('/sizes/compare')}>/sizes/compare</a>。
  </p>

  <h2>预算如何强制</h2>
  <ol>
    <li><code>size-limit</code> 在每次 CI 运行中测量每个子路径。</li>
    <li>若测量值超过上限,构建即失败。不使用 <code>--ignore</code>。</li>
    <li>
      <code>agadoo</code> 验证 tree-shaking — 每个包都声明
      <code>sideEffects: false</code> 并接受检查。
    </li>
    <li>
      <code>publint</code> + <code>arethetypeswrong</code> 验证已发布的形状与声明的
      <code>exports</code> 一致。
    </li>
  </ol>

  <h2>为什么放在文档里</h2>
  <p>
    因为审阅者应该知道。一个把 Combobox 从 4.5 KB 推到 4.8 KB 的 PR 不是小改动 — 它是一个需要相应
    ADR 的决定。数字对消费者可见;那么纪律也必须可见。
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
