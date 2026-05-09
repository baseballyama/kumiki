<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';

  const layers = [
    {
      n: 0,
      ji: '型',
      name: 'Types',
      pkg: '@kumiki/types',
      role: '共享 TypeScript 介面 — 上層唯一遵循的契約。',
    },
    {
      n: 1,
      ji: '基',
      name: 'Primitives',
      pkg: '@kumiki/primitives',
      role: '與框架無關的輔助工具(focus trap、dismissable、ID、locale、motion)。',
    },
    {
      n: 2,
      ji: '機',
      name: 'Machines',
      pkg: '@kumiki/machines',
      role: '純 TS 有限狀態機。約 1 KB 執行時,可檢視的 JSON。',
    },
    {
      n: 3,
      ji: '装',
      name: 'Attachments',
      pkg: '@kumiki/headless',
      role: 'Svelte 5 的 {@attach} 工廠 — 在真實 DOM 上驅動 ARIA 與 data-state。',
    },
    {
      n: 4,
      ji: '組',
      name: 'Components',
      pkg: '@kumiki/components',
      role: '複合原語。點命名空間的人體工學 API。',
    },
    {
      n: 5,
      ji: '釉',
      name: 'Atelier',
      pkg: '@kumiki/atelier',
      role: 'Layer 5 預覽 — 可複製貼上的樣式變體。',
    },
  ];
</script>

<svelte:head>
  <title>架構 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基礎 — 01"
  title="五個層級,一個心智模型。"
  lede="每個 Kumiki 原語恰好屬於一層。依需要的控制粒度選擇層級 — 然後只發送該層的位元。子路徑匯出讓 tree-shaking 保持精準如手術。"
>
  <p>
    名字借自 <em>組木</em> 榫接。每一層都像一塊部件,緊密咬合下一塊,不用釘膠。
  </p>

  <table class="layers">
    <thead>
      <tr>
        <th>L</th>
        <th>名稱</th>
        <th>套件</th>
        <th>角色</th>
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

  <h2>挑選層級</h2>
  <p>多數應用待在 Layer 4。只在下列情況才往下走:</p>
  <ul>
    <li>
      <strong>Layer 3(attachments)</strong>:當你嚴格掌控 DOM 時 — 你想以原生
      <code>&lt;button&gt;</code> 進行樣式,而非 Svelte 包裝。
    </li>
    <li>
      <strong>Layer 2(machines)</strong>:用於 SSR / 伺服器驗證,或在非 Svelte
      環境(Cypress、Vitest、worker)執行邏輯。
    </li>
    <li>
      <strong>Layer 1(primitives)</strong>:當你在 dismissable / focus-trap / ID
      引擎之上打造自有元件時。
    </li>
  </ul>

  <h2>為什麼不全部納入?</h2>
  <p>
    體積預算。每個子路徑在 CI 中都有 brotli 預算 — Toggle 為 1.5 KB,Combobox 為 4.5 KB。把 Layer 5
    帶樣式變體引入已擁有自身設計 token 的專案是浪費位元;Atelier 套件採選用即可,並非預設。
  </p>

  <h2>權威閱讀</h2>
  <p>
    內部設計文件位於
    <a href="https://github.com/baseballyama/kumiki/tree/main/docs/design">/docs/design</a
    >,特別重要的:
  </p>
  <ul>
    <li><code>02-architecture.md</code> — 此分層模型,附圖。</li>
    <li><code>03-package-structure.md</code> — 套件邊界。</li>
    <li><code>04-state-machines.md</code> — FSM 執行時規格。</li>
    <li><code>09-bundle-budget.md</code> — 各子路徑的 brotli 預算。</li>
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
