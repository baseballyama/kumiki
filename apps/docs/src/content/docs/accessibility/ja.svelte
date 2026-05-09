<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>アクセシビリティ · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基礎 — 03"
  title="本気のアクセシビリティ。"
  lede="axe-core が拾えるのは WCAG 違反の 30〜40% にすぎません。残り 60% は APG キーボードテストと実機スクリーンリーダーの仕事です。Kumiki ではこの 3 つすべてをマージのゲートにしています。"
>
  <h2>3 層のテスト</h2>

  <table class="strata">
    <thead>
      <tr>
        <th>なに</th>
        <th>いつ</th>
        <th>何を捕える</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>axe-core</strong></td>
        <td>すべての PR — LTR & RTL × 文書化されたすべての状態</td>
        <td>静的違反:ラベル不足、コントラスト、ロール妥当性。</td>
      </tr>
      <tr>
        <td><strong>APG キーボード</strong></td>
        <td>すべての PR — Playwright によるパターン別テスト</td>
        <td>Tab 順序、矢印キーナビ、Home / End / Page セマンティクス、Escape。</td>
      </tr>
      <tr>
        <td><strong>Guidepup スクリーンリーダー</strong></td>
        <td>ナイトリースケジュール</td>
        <td>VoiceOver と NVDA が実際に何をどの順番で読むか。</td>
      </tr>
    </tbody>
  </table>

  <h2>型レベルで強制される必須名</h2>
  <p>
    WAI-ARIA APG が必須としているアクセシブル名(ダイアログなど)は、TypeScript 側で強制されます。<code
      >{`<Dialog.Root>`}</code
    >
    は <code>title</code>、<code>aria-label</code>、<code>aria-labelledby</code> のいずれかが無ければコンパイルできません。
  </p>

  <pre><code
      >{`<Dialog.Root title="削除を確認">
  <!-- コンパイル可 -->
</Dialog.Root>

<Dialog.Root>
  <!-- 型エラー: アクセシブル名がありません -->
</Dialog.Root>`}</code
    ></pre>

  <h2>キーボード契約</h2>
  <p>
    各コンポーネントのキーマップは、コンポーネント詳細ページ(<strong>アクセシビリティ</strong> タブ)に記載されています。APG
    がパターンを定義している場合、Kumiki はそれを忠実に再現します — 創造的解釈は行いません。
  </p>

  <h2>Reduced motion、RTL、High contrast</h2>
  <ul>
    <li>
      <code>prefers-reduced-motion</code>
      がオンのときは、ドキュメントサイト全体ですべてのトランジションを約 10ms に縮めます。
    </li>
    <li>
      RTL は後付けではありません。方向に依存するキーマップ(Tabs、Slider)は、DOM
      ではなくマシンのコンテキストから方向を読みます。
    </li>
    <li>
      Forced-colors モードを尊重します — コンポーネントは背景のみで状態を示すような表現を避けます。
    </li>
  </ul>

  <h2>「Kumiki-ready」チェックリスト</h2>
  <p>
    すべてのコンポーネントは、マージ前に
    <a href="https://github.com/baseballyama/kumiki/blob/main/docs/design/05-accessibility.md"
      >docs/design/05-accessibility.md §5.6</a
    >
    のチェックリストを満たす必要があります。例外無し、<code>--ignore</code> フラグ無し。
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
