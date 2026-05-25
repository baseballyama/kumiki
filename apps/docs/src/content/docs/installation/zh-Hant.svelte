<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>安裝 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 入門 — 02"
  title="安裝"
  lede="Kumiki 以獨立版本化的多個套件形式發佈到 npm。只安裝你需要的層級;子路徑匯入讓 tree-shaking 保持鋒利。"
>
  <h2>系統需求</h2>
  <ul>
    <li>Node.js 22 或更高。</li>
    <li>Svelte 5.29+(用於 <code>{'{@attach}'}</code> 指示)。</li>
    <li>支援 ESM 的打包工具 — Vite 5+、Rollup 4+、esbuild 0.25+。不發佈 CJS。</li>
  </ul>

  <h2>選擇層級</h2>
  <p>大多數使用者需要 Layer 4 —— 複合元件 —— 以及一個 locale 套件:</p>
  <pre><code>pnpm add @kumiki/components @kumiki/locale</code></pre>

  <p>需要完全控制 DOM?跳過元件,直接使用 Layer 3 attachments:</p>
  <pre><code>pnpm add @kumiki/headless</code></pre>

  <p>在打造自己的原語?可以單獨使用任一狀態機:</p>
  <pre><code>pnpm add @kumiki/machines</code></pre>

  <h2>提供 locale</h2>
  <p>
    用 <code>LocaleProvider</code> 包裹你的應用一次。其下每個 Kumiki 元件都會接收訊息與讀字方向。
  </p>
  <pre><code
      >{`<script lang="ts">
  import { LocaleProvider } from '@kumiki/components';
  import { messages, direction } from '@kumiki/locale/zh-Hant';

  let { children } = $props();
<\/script>

<LocaleProvider.Root locale="zh-Hant" {messages} dir={direction}>
  {@render children()}
</LocaleProvider.Root>`}</code
    ></pre>

  <p>
    Locale 套件採子路徑匯入 — 每個 brotli ≤ 1 KB。執行時切換 <code>messages</code> 即可切換語言;元件會自動重算
    ARIA 文字。
  </p>

  <h2>驗證安裝</h2>
  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="靜音">
  {pressed ? '已靜音' : '開啟'}
</Toggle.Root>`}</code
    ></pre>

  <p>大功告成。去看看 <a href={resolve('/components')}>元件目錄</a> 吧。</p>
</Prose>
