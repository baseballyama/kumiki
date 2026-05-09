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
  <title>번들 예산 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 기초 — 05"
  title="바이트도 기능이다."
  lede="모든 컴포넌트 서브패스에는 brotli 예산이 있습니다. PR 이 초과하면 CI 가 실패합니다. 예산을 위로 올리려면 측정 근거가 있는 새 ADR 이 필요합니다 — 가벼운 증가는 결코 허용되지 않습니다."
>
  <h2>숫자</h2>
  <table class="budgets">
    <thead>
      <tr><th>서브패스</th><th class="num">Brotli</th></tr>
    </thead>
    <tbody>
      {#each budgets as b (b.name)}
        <tr><td><code>{b.name}</code></td><td class="num">{b.limit}</td></tr>
      {/each}
    </tbody>
  </table>

  <p>
    전체 표 — 모든 서브패스와 그 근거 — 는
    <a href="https://github.com/baseballyama/kumiki/blob/main/docs/design/09-bundle-budget.md"
      >docs/design/09-bundle-budget.md</a
    > 에 있습니다. 현재 측정값은
    <a href="/sizes">/sizes</a> 에서 확인 가능하며, 경쟁 제품과의 비교는
    <a href="/sizes/compare">/sizes/compare</a> 에 있습니다.
  </p>

  <h2>예산은 어떻게 강제되는가</h2>
  <ol>
    <li><code>size-limit</code> 이 모든 CI 실행마다 모든 서브패스를 측정합니다.</li>
    <li>측정값이 한도를 넘으면 빌드는 실패합니다. <code>--ignore</code> 는 없습니다.</li>
    <li>
      <code>agadoo</code> 가 tree-shaking 을 검증합니다 — 모든 패키지가
      <code>sideEffects: false</code> 를 선언하고 검사받습니다.
    </li>
    <li>
      <code>publint</code> + <code>arethetypeswrong</code> 가 게시된 형태가 선언한
      <code>exports</code> 와 일치하는지 검증합니다.
    </li>
  </ol>

  <h2>왜 문서에 두는가</h2>
  <p>
    리뷰어가 알아야 하기 때문입니다. Combobox 를 4.5 KB 에서 4.8 KB 로 올리는 PR 은 작은 변경이 아닙니다 —
    그에 상응하는 ADR 이 필요한 결정입니다. 숫자는 소비자에게 보이고, 규율도 보여야 합니다.
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
