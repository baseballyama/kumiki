<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import { LOCALES } from '$lib/i18n/dict.js';
</script>

<svelte:head>
  <title>國際化與 RTL · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基礎 — 04"
  title="語言作為子路徑匯入。"
  lede="沒有翻譯的大套件。每個 locale 都是自身的子路徑匯入,brotli ≤ 1 KB,按需延遲載入。RTL 反轉活在狀態機中,而非 CSS。"
>
  <h2>Phase 1 的 locale</h2>
  <ul class="locales">
    {#each LOCALES as l (l.code)}
      <li>
        <span class="native">{l.native}</span>
        <span class="meta"><code>@kumiki/locale/{l.code}</code> · {l.name}</span>
      </li>
    {/each}
  </ul>

  <h2>執行時切換</h2>
  <p>將應用程式包裹一次,然後隨時切換匯入的 locale 套件。其下的元件會在每次變動時重讀訊息。</p>
  <pre><code
      >{`<script lang="ts">
  import { LocaleProvider } from '@kumiki/components';
  import * as ja from '@kumiki/locale/ja';
  import * as en from '@kumiki/locale/en';

  let active = $state<'ja' | 'en'>('ja');
  const bundle = $derived(active === 'ja' ? ja : en);
<\/script>

<button onclick={() => (active = active === 'ja' ? 'en' : 'ja')}>
  {active.toUpperCase()}
</button>

<LocaleProvider.Root locale={active} messages={bundle.messages} dir={bundle.direction}>
  {@render children()}
</LocaleProvider.Root>`}</code
    ></pre>

  <h2>RTL 不是事後補丁</h2>
  <p>
    讀字方向從 <code>LocaleProvider</code> 透過 context 傳遞。方向敏感的鍵盤對應(Tabs 的
    <code>ArrowRight</code>、Slider、RadioGroup)從機器內容讀取方向 — controller 並不知道 RTL。
  </p>

  <p>
    每個元件詳細頁的 <strong>方向切換</strong> 讓你在不切換語言的情況下預覽任何 locale 的 RTL,用以驗證樣式。
  </p>

  <h2>已本地化的內容</h2>
  <p><code>@kumiki/locale</code> 套件涵蓋:</p>
  <ul>
    <li><code>combobox</code>:listbox 標籤、「無結果」、清除按鈕。</li>
    <li><code>dialog</code>:關閉按鈕標籤。</li>
    <li><code>tabs</code>:預設 tablist 標籤。</li>
    <li><code>formField</code>:必填標記、「必填」/「型別不符」錯誤。</li>
  </ul>
  <p>
    Form Field 組合的驗證訊息可以整體替換,或透過 Standard Schema 擴充 — 不需要逐個 validator
    的轉接層。
  </p>
</Prose>

<style>
  ul.locales {
    list-style: none;
    margin: 24px 0;
    padding: 0;
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    overflow: hidden;
  }
  ul.locales li {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 24px;
    padding: 12px 16px;
    border-block-end: 1px solid var(--k-line-1);
  }
  ul.locales li:last-child {
    border-block-end: 0;
  }
  ul.locales .native {
    font-family: var(--k-font-display);
    font-size: 17px;
    color: var(--k-ink-1);
    font-variation-settings: 'opsz' 36;
  }
  ul.locales .meta {
    font-family: var(--k-font-mono);
    font-size: 11px;
    color: var(--k-ink-3);
  }
</style>
