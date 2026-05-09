<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>简介 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 入门 — 01"
  title="简介"
  lede="Kumiki — 組木 — 是为 Svelte 5 打造的高度可访问 UI 原语系统。它的存在,是为了不让“可访问、可国际化、可主题化、轻量化”这个问题在五十个仓库里被回答五十遍。"
>
  <h2>为什么选择 Kumiki?</h2>
  <p>
    大多数可访问的组件库会选定一种取舍并坚持下去:有些是 headless,把 ARIA
    配线交给你;有些自带样式,强加一整套设计系统;有些把你绑定在某个状态机库上;有些则没有状态机。Kumiki
    拒绝这种取舍 — 五个可组合的层级,各自独立可用。
  </p>

  <ul>
    <li><strong>Layer 0 — Types。</strong>所有上层共享的 TypeScript 表面。</li>
    <li>
      <strong>Layer 1 — Primitives。</strong>与框架无关的辅助工具(focus
      trap、dismissable、ID、locale)。
    </li>
    <li>
      <strong>Layer 2 — Machines。</strong>纯 TS 有限状态机。约 1 KB 运行时,可完整检视的 JSON。
    </li>
    <li>
      <strong>Layer 3 — Attachments。</strong><code>{'{@attach}'}</code> 工厂在真实 DOM 节点上驱动
      ARIA 与 <code>data-state</code>。
    </li>
    <li>
      <strong>Layer 4 — Components。</strong>像 <code>{`<Combobox.Root>`}</code> 这样的复合原语,默认即符合人体工学。
    </li>
    <li>
      <strong>Layer 5 — Atelier。</strong>有意见、可复制粘贴的样式变体。以 <code>0.x-preview</code> 发布。
    </li>
  </ul>

  <h2>状态</h2>
  <p>
    Kumiki 处于 <strong>预 alpha</strong> 阶段。架构已锁定,体积预算在 CI
    中强制执行,屏幕阅读器夜间运行也已就位 — 只是尚未发布到 npm。请预期 API 会变化。Issue 请提交至
    <a href="https://github.com/baseballyama/kumiki/issues">baseballyama/kumiki</a>。
  </p>

  <h2>下一步</h2>
  <p>
    接下来:<a href="/docs/installation">安装</a> 或
    <a href="/docs/architecture">架构</a>。如果你想直接看东西,可以
    <a href="/components">浏览组件</a>。
  </p>
</Prose>
