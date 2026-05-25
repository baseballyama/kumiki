<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>簡介 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 入門 — 01"
  title="簡介"
  lede="Kumiki — 組木 — 是為 Svelte 5 打造的高度無障礙 UI 原語系統。它的存在,是為了不讓「無障礙、可國際化、可主題化、輕量化」這個問題在五十個專案中被回答五十次。"
>
  <h2>為什麼選擇 Kumiki?</h2>
  <p>
    大多數無障礙元件庫會挑一種取捨並堅持到底:有些是 headless,把 ARIA
    配線交給你;有些附帶樣式,強加一整套設計系統;有些把你綁在某個狀態機函式庫上;有些則沒有狀態機。Kumiki
    拒絕這種取捨 — 五個可組合的層級,各自皆可獨立使用。
  </p>

  <ul>
    <li><strong>Layer 0 — Types。</strong>所有上層共享的 TypeScript 介面。</li>
    <li>
      <strong>Layer 1 — Primitives。</strong>與框架無關的輔助工具(focus
      trap、dismissable、ID、locale)。
    </li>
    <li>
      <strong>Layer 2 — Machines。</strong>純 TS 有限狀態機。約 1 KB 執行時,可完整檢視的 JSON。
    </li>
    <li>
      <strong>Layer 3 — Attachments。</strong><code>{'{@attach}'}</code> 工廠在真實 DOM 節點上驅動
      ARIA 與 <code>data-state</code>。
    </li>
    <li>
      <strong>Layer 4 — Components。</strong>像 <code>{`<Combobox.Root>`}</code> 這樣的複合原語,預設即符合人體工學。
    </li>
    <li>
      <strong>Layer 5 — Atelier。</strong>具立場、可複製貼上的樣式變體。以 <code>0.x-preview</code> 發佈。
    </li>
  </ul>

  <h2>狀態</h2>
  <p>
    Kumiki 處於 <strong>預 alpha</strong> 階段。架構已鎖定,體積預算在 CI
    強制執行,螢幕閱讀器夜間執行亦已就緒 — 但尚未發佈到 npm。預期 API 會變動。請至
    <a href="https://github.com/baseballyama/kumiki/issues">baseballyama/kumiki</a> 回報 Issue。
  </p>

  <h2>下一步</h2>
  <p>
    接下來:<a href={resolve('/docs/installation')}>安裝</a> 或
    <a href={resolve('/docs/architecture')}>架構</a>。若想直接看實際成品,
    <a href={resolve('/components')}>瀏覽元件</a>。
  </p>
</Prose>
