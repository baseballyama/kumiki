<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>無障礙 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基礎 — 03"
  title="無障礙的完整版本。"
  lede="axe-core 能捕捉 WCAG 違規的 30–40%。其餘 60% 來自 APG 鍵盤測試與真實螢幕閱讀器執行。Kumiki 將三者都設為合併閘門。"
>
  <h2>三層測試</h2>

  <table class="strata">
    <thead>
      <tr>
        <th>內容</th>
        <th>時機</th>
        <th>捕捉</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>axe-core</strong></td>
        <td>每個 PR — LTR 與 RTL × 每個記載的狀態</td>
        <td>靜態違規:缺少標籤、對比度、角色合法性。</td>
      </tr>
      <tr>
        <td><strong>APG 鍵盤</strong></td>
        <td>每個 PR — 依模式撰寫的 Playwright</td>
        <td>Tab 順序、方向鍵導覽、Home / End / Page 語意、Escape。</td>
      </tr>
      <tr>
        <td><strong>Guidepup 螢幕閱讀器</strong></td>
        <td>夜間排程</td>
        <td>VoiceOver 與 NVDA 實際讀出的內容,以及實際順序。</td>
      </tr>
    </tbody>
  </table>

  <h2>型別層級強制無障礙名稱</h2>
  <p>
    當 WAI-ARIA APG 要求可存取名稱時(例如對話框),該要求由 TypeScript 強制。
    <code>{`<Dialog.Root>`}</code> 若無 <code>title</code>、<code>aria-label</code> 或
    <code>aria-labelledby</code> 之一將無法編譯。
  </p>

  <pre><code
      >{`<Dialog.Root title="確認刪除">
  <!-- 通過編譯 -->
</Dialog.Root>

<Dialog.Root>
  <!-- 型別錯誤:缺少可存取名稱 -->
</Dialog.Root>`}</code
    ></pre>

  <h2>鍵盤契約</h2>
  <p>
    每個元件在其詳細頁面(<strong>無障礙</strong> 分頁)中記錄鍵盤對應。當 APG 定義模式時,Kumiki 一字不漏地遵循 — 不做創造性詮釋。
  </p>

  <h2>減少動態、RTL、高對比</h2>
  <ul>
    <li><code>prefers-reduced-motion</code> 在整個文件站點將所有過渡縮短至約 10 毫秒。</li>
    <li>
      RTL 並非後補。方向敏感的鍵盤對應(Tabs、Slider)從機器內容讀取方向,而非 DOM。
    </li>
    <li>尊重 Forced-colors 模式 — 元件避免僅以背景表達狀態。</li>
  </ul>

  <h2>「Kumiki-ready」檢查表</h2>
  <p>
    每個元件在合併前必須滿足
    <a href="https://github.com/baseballyama/kumiki/blob/main/docs/design/05-accessibility.md"
      >docs/design/05-accessibility.md §5.6</a
    >
    的檢查表。無例外,禁用 <code>--ignore</code> 旗標。
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
