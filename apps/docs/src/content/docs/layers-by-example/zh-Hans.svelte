<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);

  const matrix = [
    { task: 'FSM(状态转移)', l2: 'Kumiki', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'Svelte 响应桥', l2: '你', l3: '你*', l4: 'Kumiki', l5: 'Kumiki' },
    { task: '<button> 元素', l2: '你', l3: '你', l4: 'Kumiki', l5: '复制' },
    { task: 'ARIA 属性 (aria-pressed, …)', l2: '你', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'data-state 输出', l2: '你', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: '点击 / 键盘处理', l2: '你', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: '可访问名称 (aria-label)', l2: '你', l3: '你', l4: '你', l5: 'Kumiki' },
    { task: '样式', l2: '你', l3: '你', l4: '你', l5: '复制' },
  ];
</script>

<svelte:head>
  <title>分层示例 — Toggle · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基础 — 06"
  title="分层示例:Toggle"
  lede="同一个 Toggle,在 Layer 2、3、4、5 各写一遍 — 并排观察。沿着栈往下走,每一步都把更多控制权与更多责任交给你。"
>
  <p>
    Kumiki 的所有层级都暴露 <strong>同一行为的不同抽象层级</strong>。下沉一层,你接管更多 DOM、ARIA
    与事件管道 — 但也获得选择结构的自由。上升一层,你写更少代码,代价是接受 Kumiki 的结构性选择。
  </p>

  <p>
    我们用 <a href={resolve('/components/component-toggle')}>Toggle</a>
    作为示例。行为简单(按下翻转),但 实现
    <strong>四层都有</strong>,非常适合并排比较。
  </p>

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

  <h2>1. Layer 4 — 复合组件(默认入口)</h2>
  <p>
    最短路径。<code>Toggle.Root</code> 渲染 <code>&lt;button&gt;</code>,管理 ARIA、
    <code>data-state</code>、键盘与 SSR。你只负责 <strong>两件事</strong>:通过
    <code>bind:pressed</code> 接收状态,以及提供 <code>aria-label</code>(或可见标签)。
  </p>

  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="静音">
  {pressed ? '已静音' : '开启'}
</Toggle.Root>`}</code
    ></pre>

  <p>结果 DOM:</p>

  <pre><code
      >{`<button type="button" aria-pressed="false" data-state="off" id="toggle-…">
  开启
</button>`}</code
    ></pre>

  <p>
    <strong>选择此时机:</strong>90% 的场景。原生 <code>&lt;button&gt;</code> 够用,你不需要覆写包装结构。
  </p>

  <h2>2. Layer 3 — Headless attachment</h2>
  <p>
    当你需要自己选择元素时(<code>&lt;a&gt;</code>、<code>&lt;div role="button"&gt;</code
    >、自定义包装)。
    <code>createToggle()</code> 返回一个兼容 <code>{`{@attach}`}</code> 的工厂,你可以把它 spread 在你想要的任意元素上。
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggle } from '@kumiki/headless/toggle';

  const t = createToggle({ initial: false });

  // controller.pressed 是普通 getter。要把它显示为文本,必须 subscribe
  // 并镜像到 $state。(若 CSS 完全处理,则不需要。)
  let pressed = $state(t.pressed);
  $effect(() => t.subscribe(({ context }) => (pressed = context.pressed)));
<\/script>

<button {@attach t.root} aria-label="静音" class="my-btn">
  {pressed ? '已静音' : '开启'}
</button>`}</code
    ></pre>

  <p>
    在挂载时,<code>{`{@attach t.root}`}</code> 写入 DOM 端属性(<code>type</code>、
    <code>aria-pressed</code>、<code>data-state</code>、<code>id</code>),并连接点击 + 键盘 (Space /
    Enter)监听器。<strong>多出的责任:</strong>选择元素、样式、可见标签,以及(仅在需要时) 通过
    <code>subscribe</code> 把状态镜像到响应式本地变量。
  </p>

  <p>
    <strong>选择此时机:</strong>Layer 4 的固定结构(<code>&lt;button&gt;</code>)不合适。例如,你需要
    把 toggle 放进 <code>&lt;label&gt;</code> 内,或包装在自定义高阶外壳中。
  </p>

  <h2>3. Layer 2 — 纯状态机</h2>
  <p>
    完全不依赖 Svelte — 一个纯 TypeScript 有限状态机。<strong
      >DOM、ARIA、事件、键盘都由你自己写。</strong
    >
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggleMachine } from '@kumiki/machines/toggle';

  const m = createToggleMachine({ initial: false });
  let pressed = $state(m.context.pressed);
  m.subscribe(({ context }) => (pressed = context.pressed));
<\/script>

<button
  type="button"
  aria-pressed={pressed ? 'true' : 'false'}
  data-state={pressed ? 'on' : 'off'}
  aria-label="静音"
  onclick={() => m.send({ type: 'TOGGLE' })}
>
  {pressed ? '已静音' : '开启'}
</button>`}</code
    ></pre>

  <p><strong>下沉到 Layer 2 的原因通常不是 UI — 是逻辑复用:</strong></p>
  <ul>
    <li>在服务端校验 Toggle 逻辑(SvelteKit server routes / Workers)。</li>
    <li>在 Vitest 中编写纯 FSM 单元测试(无需 jsdom,每次转换约 20μs)。</li>
    <li>
      在 <a href="https://stately.ai/viz">stately.ai/viz</a> 中可视化转换(<code
        >machine.toJSON()</code
      > 输出 XState 兼容 JSON)。
    </li>
    <li>嵌入非 Svelte 宿主(原生 JS、Web Components、其他框架)。</li>
  </ul>

  <h2>4. Layer 5 — Atelier(可复制粘贴的样式变体)</h2>
  <p>CLI 把源文件复制到你的仓库。复制之后它们就是 <strong>你的代码</strong> — 自由编辑。</p>

  <pre><code
      >{`# Tailwind v4 变体
npx kumiki add toggle --variant=tailwind

# 原生 CSS 变体
npx kumiki add toggle --variant=vanilla`}</code
    ></pre>

  <p>添加的文件:</p>

  <pre><code>{`src/lib/components/Toggle.svelte   # 包裹 Layer 4 Toggle.Root 的样式化封装`}</code
    ></pre>

  <p>像使用其他 Svelte 组件一样使用它:</p>

  <pre><code
      >{`<script lang="ts">
  import Toggle from '$lib/components/Toggle.svelte';
  let pressed = $state(false);
<\/script>

<Toggle bind:pressed>静音</Toggle>`}</code
    ></pre>

  <p>
    <strong>选择此时机:</strong>你想先有一个能用的视觉基线,而不必先写 CSS。Layer 5 在 v1.0 期间以
    <code>0.x.x-preview</code> 发布,因此对稳定性敏感的项目优先使用 Layer 4 + 自定义样式。
  </p>

  <h2>责任矩阵</h2>

  <p>每一层你写什么。「Kumiki」= 库处理;「你」= 你的代码。</p>

  <table class="matrix">
    <thead>
      <tr>
        <th>责任</th>
        <th>L2(machine)</th>
        <th>L3(headless)</th>
        <th>L4(component)</th>
        <th>L5(atelier)</th>
      </tr>
    </thead>
    <tbody>
      {#each matrix as row (row.task)}
        <tr>
          <td class="task">{row.task}</td>
          <td class:you={row.l2 === '你'} class:them={row.l2 === 'Kumiki'}>{row.l2}</td>
          <td class:you={row.l3.startsWith('你')} class:them={row.l3 === 'Kumiki'}>{row.l3}</td>
          <td class:you={row.l4 === '你'} class:them={row.l4 === 'Kumiki'}>{row.l4}</td>
          <td class:them={row.l5 === 'Kumiki'}>{row.l5}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <p class="note">
    * Svelte 响应桥仅在 L3 中你以文本形式显示 <code>controller.pressed</code> 时才需要。若 CSS 通过
    <code>data-state</code> 处理一切,则无需 <code>subscribe</code>。
  </p>

  <h2>选择一层 — 决策树</h2>

  <ul>
    <li>
      <strong>现在就要带样式跑起来?</strong> → <strong>Layer 5</strong>
      (<code>npx kumiki add</code>)。注意:v1.0 期间为 preview 标签。
    </li>
    <li>
      <strong>原生 &lt;button&gt; 够用,样式自己写?</strong> → <strong>Layer 4</strong>
      (<code>{`<Toggle.Root>`}</code>)。默认入口。
    </li>
    <li>
      <strong>需要自己选择元素类型或结构?</strong> → <strong>Layer 3</strong>
      (<code>{`{@attach t.root}`}</code>)。如果 Layer 4 的 <code>child</code> snippet 已能满足, 留在 Layer
      4 — 代码更少。
    </li>
    <li>
      <strong>在 Svelte 之外运行 / 服务端校验 / 只要 FSM?</strong> → <strong>Layer 2</strong>
      (<code>createToggleMachine</code>)。
    </li>
  </ul>

  <h2>下一步阅读</h2>
  <ul>
    <li>
      <a href={resolve('/docs/styling')}>样式</a> — 如何在 Layer 4 使用 <code>data-*</code>、
      <code>class</code> 透传与 <code>child</code> snippet。
    </li>
    <li><a href={resolve('/docs/architecture')}>架构</a> — 完整的五层模型。</li>
    <li>
      <a href={resolve('/docs/composition')}>组合</a> — 通过 <code>with*</code> 包装器添加可选功能。
    </li>
  </ul>
</Prose>

<style>
  table.matrix {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 13px;
  }
  table.matrix th,
  table.matrix td {
    padding: 10px 12px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: middle;
  }
  table.matrix th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    border-block-end-color: var(--k-line-2);
    font-weight: 500;
  }
  table.matrix .task {
    color: var(--k-ink-2);
    font-weight: 500;
  }
  table.matrix td.you {
    color: var(--k-shu);
    font-family: var(--k-font-mono);
    font-size: 12px;
  }
  table.matrix td.them {
    color: var(--k-ink-4);
    font-family: var(--k-font-mono);
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
