<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';

  const layers = [
    {
      n: 0,
      ji: '型',
      name: 'Types',
      pkg: '@kumiki/types',
      role: '共享 TypeScript 表面 — 所有上层都唯一遵循的契约。',
    },
    {
      n: 1,
      ji: '基',
      name: 'Primitives',
      pkg: '@kumiki/primitives',
      role: '与框架无关的辅助工具(focus trap、dismissable、ID、locale、motion)。',
    },
    {
      n: 2,
      ji: '機',
      name: 'Machines',
      pkg: '@kumiki/machines',
      role: '纯 TS 有限状态机。约 1 KB 运行时,可检视的 JSON。',
    },
    {
      n: 3,
      ji: '装',
      name: 'Attachments',
      pkg: '@kumiki/headless',
      role: 'Svelte 5 的 {@attach} 工厂 — 在真实 DOM 上驱动 ARIA 与 data-state。',
    },
    {
      n: 4,
      ji: '組',
      name: 'Components',
      pkg: '@kumiki/components',
      role: '复合原语。点命名空间的人体工学 API。',
    },
    {
      n: 5,
      ji: '釉',
      name: 'Atelier',
      pkg: '@kumiki/atelier',
      role: 'Layer 5 预览 — 可复制粘贴的样式变体。',
    },
  ];
</script>

<svelte:head>
  <title>架构 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基础 — 01"
  title="五层结构,一个心智模型。"
  lede="每个 Kumiki 原语恰好处于一层。根据所需的控制粒度选择层级 — 然后只发送该层的字节。子路径导出让 tree-shaking 保持外科手术般精准。"
>
  <p>
    名字借自 <em>组木</em> 榫接。每一层都像一块部件,严丝合缝地与下一块咬合,不用钉胶。
  </p>

  <table class="layers">
    <thead>
      <tr>
        <th>L</th>
        <th>名称</th>
        <th>包</th>
        <th>职责</th>
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

  <h2>选择一个层级</h2>
  <p>大多数应用居于 Layer 4。只有在以下情况下才往下走:</p>
  <ul>
    <li>
      <strong>Layer 3(attachments)</strong>:当你严格控制 DOM 时 — 你想用原生
      <code>&lt;button&gt;</code> 来设计样式,而不是 Svelte 包装。
    </li>
    <li>
      <strong>Layer 2(machines)</strong>:用于 SSR / 服务端校验,或在非 Svelte
      环境(Cypress、Vitest、worker)运行逻辑。
    </li>
    <li>
      <strong>Layer 1(primitives)</strong>:当你在 dismissable / focus-trap / ID
      引擎之上构建自己的组件时。
    </li>
  </ul>

  <h2>为什么不全都引入?</h2>
  <p>
    体积预算。每个子路径在 CI 中都有一个 brotli 预算 — Toggle 是 1.5 KB,Combobox 是 4.5 KB。把 Layer
    5 带样式的变体引入已经拥有自己设计 token 的项目会浪费字节;Atelier 包是按需选用,而非默认。
  </p>

  <h2>权威阅读</h2>
  <p>
    内部设计文档位于
    <a href="https://github.com/baseballyama/kumiki/tree/main/docs/design">/docs/design</a
    >,特别要看:
  </p>
  <ul>
    <li><code>02-architecture.md</code> — 这个分层模型,带图解。</li>
    <li><code>03-package-structure.md</code> — 包边界。</li>
    <li><code>04-state-machines.md</code> — FSM 运行时规范。</li>
    <li><code>09-bundle-budget.md</code> — 各子路径的 brotli 预算。</li>
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
