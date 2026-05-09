<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>可访问性 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基础 — 03"
  title="可访问性的完整版本。"
  lede="axe-core 能捕获 WCAG 违规的 30–40%。剩下的 60% 来自 APG 键盘测试与真实屏幕阅读器运行。Kumiki 将三者都设为合并门禁。"
>
  <h2>三层测试</h2>

  <table class="strata">
    <thead>
      <tr>
        <th>内容</th>
        <th>时机</th>
        <th>捕获</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>axe-core</strong></td>
        <td>每个 PR — LTR 与 RTL × 每个有记录的状态</td>
        <td>静态违规:缺少标签、对比度、角色合法性。</td>
      </tr>
      <tr>
        <td><strong>APG 键盘</strong></td>
        <td>每个 PR — 按模式编写的 Playwright</td>
        <td>Tab 顺序、方向键导航、Home / End / Page 语义、Escape。</td>
      </tr>
      <tr>
        <td><strong>Guidepup 屏幕阅读器</strong></td>
        <td>夜间调度</td>
        <td>VoiceOver 与 NVDA 实际说的内容,以及实际顺序。</td>
      </tr>
    </tbody>
  </table>

  <h2>类型层强制无障碍名称</h2>
  <p>
    在 WAI-ARIA APG 要求可访问名称的位置(比如对话框),该要求由 TypeScript 强制。
    <code>{`<Dialog.Root>`}</code> 在没有
    <code>title</code>、<code>aria-label</code> 或 <code>aria-labelledby</code> 之一时无法编译。
  </p>

  <pre><code
      >{`<Dialog.Root title="确认删除">
  <!-- 通过编译 -->
</Dialog.Root>

<Dialog.Root>
  <!-- 类型错误:缺少可访问名称 -->
</Dialog.Root>`}</code
    ></pre>

  <h2>键盘契约</h2>
  <p>
    每个组件在其详情页面(<strong>可访问性</strong> 标签)中记录键盘映射。在 APG 定义模式的地方,Kumiki
    一字不漏地遵循 — 不作创造性解释。
  </p>

  <h2>减少动画、RTL、高对比度</h2>
  <ul>
    <li><code>prefers-reduced-motion</code> 在整个文档站点将所有过渡缩短到约 10 毫秒。</li>
    <li>
      RTL 并非后补。方向敏感的键盘映射(Tabs、Slider)从机器上下文读取方向,而非 DOM。
    </li>
    <li>遵循 Forced-colors 模式 — 组件避免仅使用背景表示状态。</li>
  </ul>

  <h2>「Kumiki-ready」清单</h2>
  <p>
    每个组件在合并前必须满足
    <a href="https://github.com/baseballyama/kumiki/blob/main/docs/design/05-accessibility.md"
      >docs/design/05-accessibility.md §5.6</a
    >
    中的清单。无例外,不可使用 <code>--ignore</code> 标志。
  </p>
</Prose>

<style>
  table.strata {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 14px;
  }
  table.strata th,
  table.strata td {
    padding: 12px 14px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: top;
  }
  table.strata th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    font-weight: 500;
  }
  table.strata td {
    color: var(--k-ink-3);
  }
  table.strata td:first-child {
    color: var(--k-ink-1);
    width: 22%;
  }
  table.strata td:nth-child(2) {
    width: 32%;
  }
</style>
