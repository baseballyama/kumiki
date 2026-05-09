<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);

  const stack = [
    {
      layer: '产品基线',
      tool: '全局 CSS [data-component*] 选择器',
      use: '所有 Dialog 共用的重置样式',
    },
    { layer: '设计系统部件', tool: '向子组件透传 class', use: '<MyDialog> 的结构化样式' },
    { layer: '变体 / 主题', tool: 'CSS 自定义属性', use: '品牌色、深 / 浅切换' },
    {
      layer: '状态差异',
      tool: 'data-state 选择器(或 Tailwind data-[state=open]:)',
      use: '打开 / 关闭、选中、禁用、悬停',
    },
    { layer: '元素替换', tool: 'child snippet', use: '把根元素换成 <a> 或 <MyButton>' },
  ];
</script>

<svelte:head>
  <title>样式 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基础 — 07"
  title="样式"
  lede="Kumiki Layer 4 不携带任何 CSS 字节。我们为何这样设计、如何为它穿衣,以及如何绕开 Svelte 作用域样式的限制 — 五个配方,一个陷阱。"
>
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

  <h2>为什么 Kumiki 不发样式</h2>

  <p>Layer 4 仅输出 <strong>语义化 DOM + ARIA + <code>data-*</code> 属性</strong>。这是有意的:</p>

  <ul>
    <li><strong>体积预算</strong>:Toggle 1.5 KB / Dialog 3.5 KB / Combobox 4.5 KB,容不下 CSS。</li>
    <li>
      <strong>设计系统千差万别</strong>:Tailwind / UnoCSS / 原生 CSS / CSS-in-JS —
      不替你做决定就能适配所有人。
    </li>
    <li>
      <strong>动画也由 CSS 驱动</strong>:我们只输出
      <code>data-state="open|closed"</code>,你来选 CSS Transitions、View Transitions 或 motion 库。
    </li>
  </ul>

  <p>所以你需要从 <strong>五种技巧</strong> 里组合样式。下面按推荐顺序排列。</p>

  <h2>配方 1:<code>data-*</code> 选择器(状态样式的标准做法)</h2>

  <p>通过 CSS 选择器读取 Kumiki 输出的属性。Radix 验证过的成熟模式。</p>

  <table class="attrs">
    <thead>
      <tr><th>属性</th><th>值</th><th>出现位置</th></tr>
    </thead>
    <tbody>
      <tr
        ><td><code>data-state</code></td><td
          ><code>open</code> / <code>closed</code> / <code>opening</code> / <code>closing</code> /
          <code>on</code>
          / <code>off</code></td
        ><td>Dialog、Toggle、Tooltip、Popover</td></tr
      >
      <tr
        ><td><code>data-orientation</code></td><td
          ><code>horizontal</code> / <code>vertical</code></td
        ><td>Tabs、RadioGroup、Slider</td></tr
      >
      <tr
        ><td><code>data-side</code></td><td
          ><code>top</code> / <code>right</code> / <code>bottom</code> / <code>left</code></td
        ><td>浮动定位元素</td></tr
      >
      <tr
        ><td><code>data-direction</code></td><td><code>ltr</code> / <code>rtl</code></td><td
          >RTL 反转</td
        ></tr
      >
      <tr><td><code>data-disabled</code></td><td>(空字符串)</td><td>禁用状态</td></tr>
      <tr
        ><td><code>data-checked</code></td><td
          ><code>true</code> / <code>false</code> / <code>mixed</code></td
        ><td>Checkbox / Toggle / Switch</td></tr
      >
      <tr
        ><td><code>data-component</code> / <code>data-component-host</code></td><td
          ><code>combobox</code> / <code>dialog</code> / …</td
        ><td>标识组件根元素</td></tr
      >
      <tr
        ><td><code>data-component-part</code></td><td
          ><code>title</code> / <code>close</code> / <code>overlay</code> / …</td
        ><td>标识子组件元素</td></tr
      >
    </tbody>
  </table>

  <pre><code
      >{`/* 全局样式表 */
[data-state='on'] { background: var(--ds-accent); color: white; }
[data-state='off'] { background: var(--ds-surface-2); }
[data-state='open'] { animation: fade-in 200ms; }
[data-state='closed'] { animation: fade-out 150ms; }`}</code
    ></pre>

  <p>同样写法用 Tailwind / UnoCSS:</p>

  <pre><code
      >{`<Toggle.Root class="bg-gray-200 data-[state=on]:bg-blue-500 data-[state=on]:text-white" />`}</code
    ></pre>

  <h2>配方 2:<code>class</code> / <code>style</code> 透传</h2>

  <p>
    Layer 4 的子组件是 <strong>spread <code>...rest</code> 的薄薄一层单元素包装</strong>。你传入的
    <code>class</code>、<code>style</code>、额外 <code>data-*</code>、附加的 ARIA 都会落到真实 DOM
    根上。
  </p>

  <pre><code
      >{`<Toggle.Root class="ds-toggle" style="--ring-color: var(--ds-accent)">
  静音
</Toggle.Root>`}</code
    ></pre>

  <p>
    实现参考:<code>packages/components/src/toggle/Root.svelte</code> 在 Props 类型中声明
    <code>[key: string]: unknown</code> 并把 <code>...rest</code> 直接 spread 在
    <code>&lt;button&gt;</code> 上。
  </p>

  <h2>配方 3:CSS 自定义属性(主题传播的标准做法)</h2>

  <p>
    与 Svelte 的作用域 CSS 不同,<strong>CSS 变量沿正常级联流动</strong
    >。在父级声明,会到达子组件内部的 DOM — 完全绕开 Svelte 的作用域屏障。
  </p>

  <pre><code
      >{`<Combobox.Root style="
  --combobox-bg: var(--ds-surface);
  --combobox-border: var(--ds-line-strong);
">
  <Combobox.Input class="ds-input" />
</Combobox.Root>

<style>
  /* MyCombobox.svelte 的作用域样式 — 到达子组件内部的 <input> */
  .ds-input {
    background: var(--combobox-bg);
    border: 1px solid var(--combobox-border);
  }
</style>`}</code
    ></pre>

  <p><strong>用于:</strong>品牌色、深色模式切换,以及任何需要跨组件边界的 token。</p>

  <h2>配方 4:<code>child</code> snippet — 元素替换</h2>

  <p>
    默认 <code>Toggle.Root</code> 渲染 <code>&lt;button&gt;</code>。这是「我这里要个
    <code>&lt;a&gt;</code>」 或「我要用自己的 <code>&lt;MyButton&gt;</code>」的逃生口。
  </p>

  <pre><code
      >{`<Toggle.Root bind:pressed>
  {#snippet child({ props, state })}
    <MyButton {...props} class="brand-btn" disabled={state.disabled}>
      {state.pressed ? '已静音' : '开启'}
    </MyButton>
  {/snippet}
</Toggle.Root>`}</code
    ></pre>

  <p>
    <code>props</code> 完整带类型:<code>type</code> / <code>aria-pressed</code> /
    <code>aria-disabled</code> / <code>data-state</code> / <code>onclick</code> /
    <code>onkeydown</code> / <code>id</code>。你的工作就是把它 spread 到你的元素上。
  </p>

  <p class="note">
    <strong>不要默认就用这个。</strong><code>child</code> 是逃生口,不是常规样式路径。能用
    <code>class</code> 透传就用 — 而且记住,重新 spread <code>props</code> 是你的责任(忘了会丢失 ARIA /
    事件)。
  </p>

  <h2>配方 5:Tailwind / UnoCSS / 原生 CSS</h2>

  <h3>Tailwind v4</h3>

  <pre><code
      >{`<Toggle.Root class="
  inline-flex items-center px-3 py-2 rounded-md
  bg-gray-200 text-gray-700
  data-[state=on]:bg-blue-600 data-[state=on]:text-white
  data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
" />`}</code
    ></pre>

  <h3>UnoCSS(默认模式)</h3>
  <p>
    与 Tailwind 写法一致。<code>data-[state=on]:</code> 变体由
    <code>@unocss/preset-mini</code> / <code>preset-wind3</code> 内置。
  </p>

  <h3>UnoCSS svelte-scoped 模式</h3>
  <p>
    <code>@unocss/svelte-scoped</code> 扫描每个父级 <code>.svelte</code>,然后把生成的 CSS
    <strong>包裹在 <code>:global(...)</code> 中</strong>注入到该文件的
    <code>&lt;style&gt;</code>。由于 规则是全局的,父级写的 utility 类无需额外动作即可触达子组件内部
    DOM。
  </p>

  <h3>原生 CSS / CSS Modules</h3>

  <pre><code
      >{`/* app.css(全局) */
.ds-toggle {
  display: inline-flex; align-items: center;
  padding: 8px 12px; border-radius: 6px;
  background: var(--ds-surface-2); color: var(--ds-ink);
}
.ds-toggle[data-state='on'] {
  background: var(--ds-accent); color: white;
}
.ds-toggle[data-disabled] { opacity: 0.5; cursor: not-allowed; }`}</code
    ></pre>

  <pre><code>{`<Toggle.Root class="ds-toggle">静音</Toggle.Root>`}</code></pre>

  <h2>模式:在其上构建设计系统</h2>

  <p>把 Kumiki 包进自己的 <code>&lt;MyToggle&gt;</code>,在产品中复用。</p>

  <pre><code
      >{`<!-- src/lib/components/MyToggle.svelte -->
<script lang="ts">
  import { Toggle } from '@kumiki/components';
  import type { Snippet } from 'svelte';

  type Props = {
    pressed?: boolean;
    'aria-label': string;
    children: Snippet;
  };
  let { pressed = $bindable(false), 'aria-label': ariaLabel, children }: Props = $props();
<\/script>

<Toggle.Root bind:pressed aria-label={ariaLabel} class="ds-toggle">
  {@render children()}
</Toggle.Root>

<style>
  /* 配方 2 — class 透传意味着这条 scoped 样式会到达真实 DOM */
  :global(.ds-toggle) {
    display: inline-flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    background: var(--ds-surface-2);
    transition: background 120ms;
  }
  :global(.ds-toggle[data-state='on']) {
    background: var(--ds-accent);
    color: white;
  }
</style>`}</code
    ></pre>

  <p>使用方:</p>

  <pre><code
      >{`<script lang="ts">
  import MyToggle from '$lib/components/MyToggle.svelte';
  let muted = $state(false);
<\/script>

<MyToggle bind:pressed={muted} aria-label="静音">
  {muted ? '已静音' : '开启'}
</MyToggle>`}</code
    ></pre>

  <h2>陷阱:Svelte 的 scoped <code>&lt;style&gt;</code> 不会传播进子组件</h2>

  <p>
    Svelte 长期以来的限制:在父 <code>.svelte</code> 的 <code>&lt;style&gt;</code> 中定义的 class
    <strong>不会到达子组件内部的 DOM 元素</strong>。
  </p>

  <pre><code
      >{`<!-- 不会按预期工作 -->
<Combobox.Root class="my-combo">
  <Combobox.Input />
</Combobox.Root>

<style>
  /* 当前文件模板里没用到 .my-combo,Svelte 可能将其剥离;
     而后代 <input> 又位于另一个组件的作用域中。 */
  .my-combo input { padding: 8px; }
</style>`}</code
    ></pre>

  <p>四种解决方法:</p>

  <ol>
    <li>
      <strong>使用 Tailwind / UnoCSS / 全局样式表</strong>(配方 1、5)。本来就不是
      scoped,问题不存在。
      <strong>首选建议。</strong>
    </li>
    <li>
      <strong>给每个子组件传 <code>class</code></strong>(配方 2)。
      <code>&lt;Combobox.Input class="ds-input" /&gt;</code>
      会把 class 落到子组件根元素上。在父 <code>&lt;style&gt;</code> 里你会写
      <code>:global(.ds-input)</code>(或把规则搬到 <code>app.css</code>)。
    </li>
    <li>
      <strong>CSS 自定义属性</strong>(配方 3)。它们越过 Svelte 作用域级联。最适合主题传播。
    </li>
    <li>
      <strong><code>:global(...)</code> 穿透</strong>。最后手段。
      <pre><code
          >{`<style>
  .my-combo :global([data-component-part='item'][data-highlighted]) {
    background: var(--ds-accent-subtle);
  }
</style>`}</code
        ></pre>
      Svelte 5 也支持<code>:global &#123; ... &#125;</code> 块语法。
    </li>
  </ol>

  <h2>推荐栈</h2>

  <table class="stack">
    <thead>
      <tr><th>层级</th><th>工具</th><th>用途</th></tr>
    </thead>
    <tbody>
      {#each stack as row (row.layer)}
        <tr>
          <td class="layer">{row.layer}</td>
          <td><code>{row.tool}</code></td>
          <td class="use">{row.use}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <h2>下一步阅读</h2>
  <ul>
    <li><a href="/docs/layers-by-example">分层示例</a> — 用户代码在 Layer 2/3/4/5 的差异。</li>
    <li>
      <a href="/docs/composition">组合</a> — 通过 <code>with*</code> 包装器添加可选功能。
    </li>
    <li>
      <a href="/docs/i18n">国际化与 RTL</a> — 用 <code>data-direction</code> 做 RTL 样式。
    </li>
  </ul>
</Prose>

<style>
  table.attrs,
  table.stack {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 13px;
  }
  table.attrs th,
  table.attrs td,
  table.stack th,
  table.stack td {
    padding: 10px 12px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: middle;
  }
  table.attrs th,
  table.stack th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    border-block-end-color: var(--k-line-2);
    font-weight: 500;
  }
  table.stack .layer {
    color: var(--k-ink-2);
    font-weight: 500;
  }
  table.stack .use,
  table.attrs td:last-child {
    color: var(--k-ink-3);
  }
  table.attrs code,
  table.stack code {
    font-size: 12px;
  }
  .note {
    font-size: 13px;
    color: var(--k-ink-3);
    border-inline-start: 2px solid var(--k-line-2);
    padding-inline-start: 12px;
    margin-block: 16px;
  }
</style>
