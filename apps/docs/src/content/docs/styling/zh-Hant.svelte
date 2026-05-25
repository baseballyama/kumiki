<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);

  const stack = [
    {
      layer: '產品基線',
      tool: '全域 CSS [data-component*] 選擇器',
      use: '所有 Dialog 共用的重置樣式',
    },
    { layer: '設計系統部件', tool: '透傳 class 給子元件', use: '<MyDialog> 的結構樣式' },
    { layer: '變體 / 主題', tool: 'CSS 自訂屬性', use: '品牌色、深 / 淺切換' },
    {
      layer: '狀態差異',
      tool: 'data-state 選擇器(或 Tailwind data-[state=open]:)',
      use: '開啟 / 關閉、選取、停用、懸停',
    },
    { layer: '元素替換', tool: 'child snippet', use: '把根元素換成 <a> 或 <MyButton>' },
  ];
</script>

<svelte:head>
  <title>樣式 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基礎 — 07"
  title="樣式"
  lede="Kumiki Layer 4 不附帶任何 CSS 位元。為什麼這樣設計、如何穿衣、以及如何繞過 Svelte scoped style 的限制 — 五個食譜,一個陷阱。"
>
  <PreviewFrame>
    <div style="display: flex; gap: 16px; align-items: center;">
      <Toggle.Root bind:pressed aria-label="靜音">
        {pressed ? '已靜音' : '開啟'}
      </Toggle.Root>
      <span style="font-family: var(--k-font-mono); font-size: 12px; color: var(--k-ink-3);">
        pressed = {pressed}
      </span>
    </div>
  </PreviewFrame>

  <h2>為什麼 Kumiki 不發樣式</h2>
  <p>Layer 4 僅輸出 <strong>語意化 DOM + ARIA + <code>data-*</code> 屬性</strong>。這是有意的:</p>
  <ul>
    <li><strong>體積預算</strong>:Toggle 1.5 KB / Dialog 3.5 KB / Combobox 4.5 KB,容不下 CSS。</li>
    <li>
      <strong>設計系統各異</strong>:Tailwind / UnoCSS / 原生 CSS / CSS-in-JS —
      不替你決定就能適配所有。
    </li>
    <li>
      <strong>動畫亦由 CSS 驅動</strong>:我們僅輸出 <code>data-state="open|closed"</code>,你選擇 CSS
      Transitions、View Transitions 或 motion 函式庫。
    </li>
  </ul>

  <p>因此你需要從 <strong>五種技巧</strong> 組合樣式。以下按推薦順序排列。</p>

  <h2>食譜 1:<code>data-*</code> 選擇器(狀態樣式的標準途徑)</h2>
  <p>透過 CSS 選擇器讀取 Kumiki 輸出的屬性。Radix 驗證過的成熟模式。</p>

  <table class="attrs">
    <thead>
      <tr><th>屬性</th><th>值</th><th>出現位置</th></tr>
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
        ><td>浮動定位元素</td></tr
      >
      <tr
        ><td><code>data-direction</code></td><td><code>ltr</code> / <code>rtl</code></td><td
          >RTL 反轉</td
        ></tr
      >
      <tr><td><code>data-disabled</code></td><td>(空字串)</td><td>停用狀態</td></tr>
      <tr
        ><td><code>data-checked</code></td><td
          ><code>true</code> / <code>false</code> / <code>mixed</code></td
        ><td>Checkbox / Toggle / Switch</td></tr
      >
      <tr
        ><td><code>data-component</code> / <code>data-component-host</code></td><td
          ><code>combobox</code> / <code>dialog</code> / …</td
        ><td>標識元件根元素</td></tr
      >
      <tr
        ><td><code>data-component-part</code></td><td
          ><code>title</code> / <code>close</code> / <code>overlay</code> / …</td
        ><td>標識子元件元素</td></tr
      >
    </tbody>
  </table>

  <pre><code
      >{`/* 全域樣式表 */
[data-state='on'] { background: var(--ds-accent); color: white; }
[data-state='off'] { background: var(--ds-surface-2); }
[data-state='open'] { animation: fade-in 200ms; }
[data-state='closed'] { animation: fade-out 150ms; }`}</code
    ></pre>

  <p>同樣寫法用 Tailwind / UnoCSS:</p>
  <pre><code
      >{`<Toggle.Root class="bg-gray-200 data-[state=on]:bg-blue-500 data-[state=on]:text-white" />`}</code
    ></pre>

  <h2>食譜 2:<code>class</code> / <code>style</code> 透傳</h2>
  <p>
    Layer 4 子元件是 <strong>spread <code>...rest</code> 的薄薄一層單元素包裝</strong>。傳入的
    <code>class</code>、<code>style</code>、額外 <code>data-*</code>、ARIA 都會落到真實 DOM 根上。
  </p>

  <pre><code
      >{`<Toggle.Root class="ds-toggle" style="--ring-color: var(--ds-accent)">
  靜音
</Toggle.Root>`}</code
    ></pre>

  <p>
    實作參考:<code>packages/components/src/toggle/Root.svelte</code> 在 Props 型別中宣告
    <code>[key: string]: unknown</code>,並把 <code>...rest</code> 直接 spread 到
    <code>&lt;button&gt;</code>。
  </p>

  <h2>食譜 3:CSS 自訂屬性(主題傳播的標準途徑)</h2>
  <p>
    與 Svelte 的 scoped CSS 不同,<strong>CSS 變數沿正常層疊流動</strong
    >。在父層宣告即可到達子元件內部 DOM — 完全繞過 Svelte 的作用域屏障。
  </p>

  <pre><code
      >{`<Combobox.Root style="
  --combobox-bg: var(--ds-surface);
  --combobox-border: var(--ds-line-strong);
">
  <Combobox.Input class="ds-input" />
</Combobox.Root>

<style>
  /* MyCombobox.svelte 的 scoped 樣式 — 到達子元件內部 <input> */
  .ds-input {
    background: var(--combobox-bg);
    border: 1px solid var(--combobox-border);
  }
</style>`}</code
    ></pre>

  <p><strong>用於:</strong>品牌色、深色模式切換、需要跨元件邊界的 token。</p>

  <h2>食譜 4:<code>child</code> snippet — 元素替換</h2>
  <p>
    預設 <code>Toggle.Root</code> 渲染 <code>&lt;button&gt;</code>。「我這裡要
    <code>&lt;a&gt;</code>」或「我要用自己的 <code>&lt;MyButton&gt;</code>」的逃生口。
  </p>

  <pre><code
      >{`<Toggle.Root bind:pressed>
  {#snippet child({ props, state })}
    <MyButton {...props} class="brand-btn" disabled={state.disabled}>
      {state.pressed ? '已靜音' : '開啟'}
    </MyButton>
  {/snippet}
</Toggle.Root>`}</code
    ></pre>

  <p>
    <code>props</code> 完整型別化:<code>type</code> / <code>aria-pressed</code> /
    <code>aria-disabled</code>
    / <code>data-state</code> / <code>onclick</code> / <code>onkeydown</code> /
    <code>id</code>。你的工作是把它 spread 到自己的元素上。
  </p>

  <p class="note">
    <strong>不要預設就用這個。</strong><code>child</code> 是逃生口而非常規樣式路徑。能用
    <code>class</code>
    透傳就用 — 並記住,重新 spread <code>props</code> 是你的責任(忘了會丟失 ARIA / 事件)。
  </p>

  <h2>食譜 5:Tailwind / UnoCSS / 原生 CSS</h2>

  <h3>Tailwind v4</h3>
  <pre><code
      >{`<Toggle.Root class="
  inline-flex items-center px-3 py-2 rounded-md
  bg-gray-200 text-gray-700
  data-[state=on]:bg-blue-600 data-[state=on]:text-white
  data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
" />`}</code
    ></pre>

  <h3>UnoCSS(預設模式)</h3>
  <p>
    與 Tailwind 寫法一致。<code>data-[state=on]:</code> 變體由 <code>@unocss/preset-mini</code> /
    <code>preset-wind3</code> 內建。
  </p>

  <h3>UnoCSS svelte-scoped 模式</h3>
  <p>
    <code>@unocss/svelte-scoped</code> 掃描每個父層 <code>.svelte</code>,然後把產生的 CSS
    <strong>包在 <code>:global(...)</code></strong>
    注入到該檔案的 <code>&lt;style&gt;</code>。因為規則是全域的,父層寫的 utility
    不需額外處理就能觸達子元件內部 DOM。
  </p>

  <h3>原生 CSS / CSS Modules</h3>

  <pre><code
      >{`/* app.css(全域) */
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

  <pre><code>{`<Toggle.Root class="ds-toggle">靜音</Toggle.Root>`}</code></pre>

  <h2>模式:在其上構建設計系統</h2>
  <p>把 Kumiki 包進自己的 <code>&lt;MyToggle&gt;</code>,在產品內重複使用。</p>

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
  /* 食譜 2 — class 透傳代表此 scoped 樣式可達真實 DOM */
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

<MyToggle bind:pressed={muted} aria-label="靜音">
  {muted ? '已靜音' : '開啟'}
</MyToggle>`}</code
    ></pre>

  <h2>陷阱:Svelte 的 scoped <code>&lt;style&gt;</code> 不會傳播到子元件</h2>
  <p>
    Svelte 長期以來的限制:在父 <code>.svelte</code> 的 <code>&lt;style&gt;</code> 定義的 class
    <strong>不會到達子元件內部的 DOM 元素</strong>。
  </p>

  <pre><code
      >{`<!-- 不會如預期工作 -->
<Combobox.Root class="my-combo">
  <Combobox.Input />
</Combobox.Root>

<style>
  /* 此檔案模板沒用到 .my-combo,Svelte 可能會剝離,
     而後代 <input> 又位於另一個元件的作用域中。 */
  .my-combo input { padding: 8px; }
</style>`}</code
    ></pre>

  <p>四種解法:</p>
  <ol>
    <li>
      <strong>使用 Tailwind / UnoCSS / 全域樣式表</strong>(食譜 1、5)。本來就不是
      scoped,問題不存在。<strong>首選建議。</strong>
    </li>
    <li>
      <strong>對每個子元件傳 <code>class</code></strong>(食譜 2)。<code
        >&lt;Combobox.Input class="ds-input" /&gt;</code
      >
      會把 class 落到子元件根元素。在父 <code>&lt;style&gt;</code> 你會寫
      <code>:global(.ds-input)</code>(或把規則搬到 <code>app.css</code>)。
    </li>
    <li><strong>CSS 自訂屬性</strong>(食譜 3)。它們越過 Svelte 作用域層疊。最適合主題傳播。</li>
    <li>
      <strong><code>:global(...)</code> 穿透</strong>。最後手段。
      <pre><code
          >{`<style>
  .my-combo :global([data-component-part='item'][data-highlighted]) {
    background: var(--ds-accent-subtle);
  }
</style>`}</code
        ></pre>
      Svelte 5 也支援<code>:global &#123; ... &#125;</code> 區塊語法。
    </li>
  </ol>

  <h2>推薦堆疊</h2>
  <table class="stack">
    <thead>
      <tr><th>層級</th><th>工具</th><th>用途</th></tr>
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

  <h2>接下來閱讀</h2>
  <ul>
    <li>
      <a href={resolve('/docs/layers-by-example')}>分層範例</a> — 使用者程式碼在 Layer 2/3/4/5 的差異。
    </li>
    <li>
      <a href={resolve('/docs/composition')}>組合</a> — 透過 <code>with*</code> 包裝器加入可選功能。
    </li>
    <li>
      <a href={resolve('/docs/i18n')}>國際化與 RTL</a> — 用 <code>data-direction</code> 做 RTL 樣式。
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
