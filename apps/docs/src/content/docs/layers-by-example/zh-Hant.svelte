<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);

  const matrix = [
    { task: 'FSM(狀態轉移)', l2: 'Kumiki', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'Svelte 反應橋', l2: '你', l3: '你*', l4: 'Kumiki', l5: 'Kumiki' },
    { task: '<button> 元素', l2: '你', l3: '你', l4: 'Kumiki', l5: '複製' },
    { task: 'ARIA 屬性 (aria-pressed, …)', l2: '你', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'data-state 輸出', l2: '你', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: '點擊 / 鍵盤處理', l2: '你', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: '可存取名稱 (aria-label)', l2: '你', l3: '你', l4: '你', l5: 'Kumiki' },
    { task: '樣式', l2: '你', l3: '你', l4: '你', l5: '複製' },
  ];
</script>

<svelte:head>
  <title>分層範例 — Toggle · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基礎 — 06"
  title="分層範例:Toggle"
  lede="同一個 Toggle,在 Layer 2、3、4、5 各寫一遍 — 並排觀察。沿著堆疊往下走,每一步都把更多控制權與更多責任交給你。"
>
  <p>
    Kumiki 的所有層級都揭露 <strong>同一行為的不同抽象層級</strong>。下沉一層,你接管更多 DOM、ARIA
    與事件管線 — 但也獲得選擇結構的自由。上升一層,你寫更少程式,代價是接受 Kumiki 的結構性選擇。
  </p>

  <p>
    我們以 <a href={resolve('/components/component-toggle')}>Toggle</a>
    作為實例。行為簡單(按下翻轉),但 實作
    <strong>四層皆有</strong>,非常適合並排比較。
  </p>

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

  <h2>1. Layer 4 — 複合元件(預設入口)</h2>
  <p>
    最短路徑。<code>Toggle.Root</code> 渲染 <code>&lt;button&gt;</code>,管理 ARIA、
    <code>data-state</code>、鍵盤與 SSR。你只負責 <strong>兩件事</strong>:透過
    <code>bind:pressed</code> 接收狀態,以及提供 <code>aria-label</code>(或可見標籤)。
  </p>

  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="靜音">
  {pressed ? '已靜音' : '開啟'}
</Toggle.Root>`}</code
    ></pre>

  <p>結果 DOM:</p>

  <pre><code
      >{`<button type="button" aria-pressed="false" data-state="off" id="toggle-…">
  開啟
</button>`}</code
    ></pre>

  <p>
    <strong>適用時機:</strong>90% 場景。原生 <code>&lt;button&gt;</code> 即可,你不需覆寫包裝結構。
  </p>

  <h2>2. Layer 3 — Headless attachment</h2>
  <p>
    當你需要自行選擇元素時(<code>&lt;a&gt;</code>、<code>&lt;div role="button"&gt;</code
    >、自訂包裝)。
    <code>createToggle()</code> 回傳一個相容 <code>{`{@attach}`}</code> 的工廠,你可以將其 spread 到任意元素。
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggle } from '@kumiki/headless/toggle';

  const t = createToggle({ initial: false });

  // controller.pressed 是普通 getter。要顯示為文字,必須 subscribe
  // 並映射到 $state。(若 CSS 全權處理,則不需要。)
  let pressed = $state(t.pressed);
  $effect(() => t.subscribe(({ context }) => (pressed = context.pressed)));
<\/script>

<button {@attach t.root} aria-label="靜音" class="my-btn">
  {pressed ? '已靜音' : '開啟'}
</button>`}</code
    ></pre>

  <p>
    掛載時,<code>{`{@attach t.root}`}</code> 寫入 DOM 端屬性(<code>type</code>、
    <code>aria-pressed</code>、<code>data-state</code>、<code>id</code>),並接上點擊 + 鍵盤 (Space /
    Enter)監聽。<strong>多出的責任:</strong>挑選元素、樣式、可見標籤,以及(必要時) 透過
    <code>subscribe</code> 映射狀態到反應式區域變數。
  </p>

  <p>
    <strong>適用時機:</strong>Layer 4 的固定結構(<code>&lt;button&gt;</code>)不合適時。例如, 需要把
    toggle 放進 <code>&lt;label&gt;</code>,或包進自訂高階外殼。
  </p>

  <h2>3. Layer 2 — 純狀態機</h2>
  <p>
    完全不依賴 Svelte — 一個純 TypeScript 有限狀態機。<strong
      >DOM、ARIA、事件、鍵盤都由你自行撰寫。</strong
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
  aria-label="靜音"
  onclick={() => m.send({ type: 'TOGGLE' })}
>
  {pressed ? '已靜音' : '開啟'}
</button>`}</code
    ></pre>

  <p><strong>下沉到 Layer 2 的原因通常不是 UI — 而是邏輯重用:</strong></p>
  <ul>
    <li>在伺服器驗證 Toggle 邏輯(SvelteKit server routes / Workers)。</li>
    <li>在 Vitest 撰寫純 FSM 單元測試(無 jsdom,每次轉移約 20μs)。</li>
    <li>
      在 <a href="https://stately.ai/viz">stately.ai/viz</a> 中視覺化轉移(<code
        >machine.toJSON()</code
      > 輸出 XState 相容 JSON)。
    </li>
    <li>嵌入非 Svelte 的宿主(原生 JS、Web Components、其他框架)。</li>
  </ul>

  <h2>4. Layer 5 — Atelier(可複製貼上的樣式變體)</h2>
  <p>CLI 將原始檔複製到你的 repo。複製後即為 <strong>你的程式</strong> — 自由編輯。</p>

  <pre><code
      >{`# Tailwind v4 變體
npx kumiki add toggle --variant=tailwind

# 原生 CSS 變體
npx kumiki add toggle --variant=vanilla`}</code
    ></pre>

  <p>新增的檔案:</p>

  <pre><code>{`src/lib/components/Toggle.svelte   # 包裹 Layer 4 Toggle.Root 的樣式封裝`}</code
    ></pre>

  <p>像其他 Svelte 元件一樣使用:</p>

  <pre><code
      >{`<script lang="ts">
  import Toggle from '$lib/components/Toggle.svelte';
  let pressed = $state(false);
<\/script>

<Toggle bind:pressed>靜音</Toggle>`}</code
    ></pre>

  <p>
    <strong>適用時機:</strong>想先有一個帶樣式的視覺基線,而非先寫 CSS。Layer 5 在 v1.0 期間以
    <code>0.x.x-preview</code> 發佈,所以對穩定度敏感的專案請優先使用 Layer 4 + 自訂樣式。
  </p>

  <h2>責任矩陣</h2>

  <p>每一層你寫的內容。「Kumiki」= 函式庫處理;「你」= 你的程式。</p>

  <table class="matrix">
    <thead>
      <tr>
        <th>責任</th>
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
    * Svelte 反應橋僅在 L3 將 <code>controller.pressed</code> 顯示為文字時需要。若 CSS 透過
    <code>data-state</code> 全部處理,則不需 <code>subscribe</code>。
  </p>

  <h2>選擇層級 — 決策樹</h2>

  <ul>
    <li>
      <strong>現在就要帶樣式跑起來?</strong> → <strong>Layer 5</strong>
      (<code>npx kumiki add</code>)。註:v1.0 期間為 preview 標籤。
    </li>
    <li>
      <strong>標準 &lt;button&gt; 即可,樣式自行撰寫?</strong> → <strong>Layer 4</strong>
      (<code>{`<Toggle.Root>`}</code>)。預設入口。
    </li>
    <li>
      <strong>需要自選元素類型或結構?</strong> → <strong>Layer 3</strong>
      (<code>{`{@attach t.root}`}</code>)。若 Layer 4 的 <code>child</code> snippet 已足夠,留在 Layer
      4 — 程式更少。
    </li>
    <li>
      <strong>在 Svelte 之外執行 / 伺服器驗證 / 只要 FSM?</strong> → <strong>Layer 2</strong>
      (<code>createToggleMachine</code>)。
    </li>
  </ul>

  <h2>接下來閱讀</h2>
  <ul>
    <li>
      <a href={resolve('/docs/styling')}>樣式</a> — 如何在 Layer 4 運用 <code>data-*</code>、
      <code>class</code> 直通,以及 <code>child</code> snippet。
    </li>
    <li><a href={resolve('/docs/architecture')}>架構</a> — 完整的五層模型。</li>
    <li>
      <a href={resolve('/docs/composition')}>組合</a> — 透過 <code>with*</code> 包裝器加入可選功能。
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
