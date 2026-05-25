<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);
</script>

<svelte:head>
  <title>第一个组件 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 入门 — 03"
  title="第一个组件"
  lede="五分钟的导览之旅。我们将接入一个 Toggle、观察它的 ARIA 契约,并在不修改组件的情况下切换显示语言。"
>
  <h2>1. 直接放进去</h2>
  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="静音">
  {pressed ? '已静音' : '开启'}
</Toggle.Root>`}</code
    ></pre>

  <h2>2. 看它响应</h2>
  <p>下面的 Toggle 接入了你本地的状态,不是注册的演示 — 试试看。</p>

  <PreviewFrame>
    <div style="display: flex; gap: 16px; align-items: center;">
      <Toggle.Root bind:pressed aria-label="静音">
        {pressed ? '已静音' : '开启'}
      </Toggle.Root>
      <span style="font-family: var(--k-font-mono); font-size: 12px; color: var(--k-ink-3);">
        pressed = {pressed}
      </span>
    </div>
  </PreviewFrame>

  <h2>3. 检查契约</h2>
  <p>
    打开开发者工具。该按钮的 <code>aria-pressed</code> 由状态驱动,还有一个用于 CSS 样式的
    <code>data-state="on"</code> 钩子。没有全局 CSS,没有设计意见 — 想怎么样式都行。
  </p>
  <pre><code
      >{`<button aria-pressed="true" data-state="on" type="button">
  已静音
</button>`}</code
    ></pre>

  <h2>4. 本地化</h2>
  <p>
    在页面顶部切换语言。Toggle 本身没有本地化字符串,但 Combobox、Dialog、FormField
    等组件会立即切换。切换到日语后试试
    <a href={resolve('/components/component-combobox')}>Combobox 演示</a>。
  </p>

  <h2>接下来呢?</h2>
  <ul>
    <li>阅读 <a href={resolve('/docs/architecture')}>五层架构</a>。</li>
    <li>浏览 <a href={resolve('/docs/accessibility')}>可访问性模型</a>。</li>
    <li>查看带实时演示的 <a href={resolve('/components')}>所有组件</a>。</li>
  </ul>
</Prose>
