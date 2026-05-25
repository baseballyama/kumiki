<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);
</script>

<svelte:head>
  <title>你的第一個元件 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 入門 — 03"
  title="你的第一個元件"
  lede="五分鐘的導覽。我們會接上一個 Toggle、觀察它的 ARIA 契約,並在不修改元件的情況下切換顯示語言。"
>
  <h2>1. 直接放進去</h2>
  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="靜音">
  {pressed ? '已靜音' : '開啟'}
</Toggle.Root>`}</code
    ></pre>

  <h2>2. 看它反應</h2>
  <p>下方的 Toggle 接到你本地的狀態,而非註冊的範例 — 試試看。</p>

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

  <h2>3. 檢視契約</h2>
  <p>
    打開開發者工具。按鈕的 <code>aria-pressed</code> 由狀態驅動,並有 CSS 鉤子
    <code>data-state="on"</code>。沒有全域 CSS,沒有設計立場 — 想怎麼設計都行。
  </p>
  <pre><code
      >{`<button aria-pressed="true" data-state="on" type="button">
  已靜音
</button>`}</code
    ></pre>

  <h2>4. 在地化</h2>
  <p>
    在頁面標頭切換語言。Toggle 本身沒有翻譯字串,但 Combobox、Dialog、FormField
    會立即切換。切到日文後試試
    <a href={resolve('/components/component-combobox')}>Combobox 範例</a>。
  </p>

  <h2>接下來呢?</h2>
  <ul>
    <li>閱讀 <a href={resolve('/docs/architecture')}>五層架構</a>。</li>
    <li>瀏覽 <a href={resolve('/docs/accessibility')}>無障礙模型</a>。</li>
    <li>看附即時範例的 <a href={resolve('/components')}>所有元件</a>。</li>
  </ul>
</Prose>
