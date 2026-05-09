<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>安装 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 入门 — 02"
  title="安装"
  lede="Kumiki 以独立版本化的多个包形式发布到 npm。只安装你需要的层级;子路径导入让 tree-shaking 保持锋利。"
>
  <h2>环境要求</h2>
  <ul>
    <li>Node.js 22 或更高。</li>
    <li>Svelte 5.29+(用于 <code>{'{@attach}'}</code> 指令)。</li>
    <li>支持 ESM 的打包器 — Vite 5+、Rollup 4+、esbuild 0.25+。不发布 CJS。</li>
  </ul>

  <h2>选择层级</h2>
  <p>大多数用户需要 Layer 4 —— 复合组件 —— 以及一个 locale 包:</p>
  <pre><code>pnpm add @kumiki/components @kumiki/locale</code></pre>

  <p>需要完全控制 DOM?跳过组件,直接使用 Layer 3 attachments:</p>
  <pre><code>pnpm add @kumiki/headless</code></pre>

  <p>正在构建自己的原语?可以单独使用任意状态机:</p>
  <pre><code>pnpm add @kumiki/machines</code></pre>

  <h2>提供一个 locale</h2>
  <p>
    用 <code>LocaleProvider</code> 包裹你的应用一次。其下的每个 Kumiki 组件都会接收消息和阅读方向。
  </p>
  <pre><code
      >{`<script lang="ts">
  import { LocaleProvider } from '@kumiki/components';
  import { messages, direction } from '@kumiki/locale/zh-Hans';

  let { children } = $props();
<\/script>

<LocaleProvider.Root locale="zh-Hans" {messages} dir={direction}>
  {@render children()}
</LocaleProvider.Root>`}</code
    ></pre>

  <p>
    Locale 包是子路径导入 — 每个 brotli ≤ 1 KB。在运行时切换 <code>messages</code> 即可切换语言;组件会自动重新计算
    ARIA 文本。
  </p>

  <h2>验证安装</h2>
  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="静音">
  {pressed ? '已静音' : '开启'}
</Toggle.Root>`}</code
    ></pre>

  <p>就这样。去看看 <a href="/components">组件目录</a> 吧。</p>
</Prose>
