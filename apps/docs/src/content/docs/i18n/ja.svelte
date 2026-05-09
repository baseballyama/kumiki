<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import { LOCALES } from '$lib/i18n/dict.js';
</script>

<svelte:head>
  <title>国際化と RTL · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基礎 — 04"
  title="言語はサブパスインポートとして。"
  lede="巨大な翻訳バンドルはありません。各ロケールはサブパスインポートで brotli ≤ 1 KB、必要なときだけ遅延読み込みされます。RTL の反転はステートマシン側に住み、CSS 側にはありません。"
>
  <h2>Phase 1 のロケール</h2>
  <ul class="locales">
    {#each LOCALES as l (l.code)}
      <li>
        <span class="native">{l.native}</span>
        <span class="meta"><code>@kumiki/locale/{l.code}</code> · {l.name}</span>
      </li>
    {/each}
  </ul>

  <h2>実行時に切り替える</h2>
  <p>
    アプリを一度ラップしたら、import
    するロケールバンドルをいつでも切り替えられます。配下のコンポーネントは変更ごとにメッセージを再読み込みします。
  </p>
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

  <h2>RTL は後付けではない</h2>
  <p>
    読字方向は <code>LocaleProvider</code>
    からコンテキストで伝播します。方向に依存するキーマップ(Tabs の
    <code>ArrowRight</code>、Slider、RadioGroup)はマシンのコンテキストから方向を読みます —
    コントローラーは RTL を知りません。
  </p>

  <p>
    各コンポーネント詳細ページには <strong>文字方向トグル</strong> があり、言語を切り替えずに任意のロケールで
    RTL をプレビューできます。スタイルの検証に使ってください。
  </p>

  <h2>ローカライズされる対象</h2>
  <p><code>@kumiki/locale</code> バンドルがカバーするのは:</p>
  <ul>
    <li><code>combobox</code>: リストボックスのラベル、「結果なし」、クリアボタン。</li>
    <li><code>dialog</code>: クローズボタンのラベル。</li>
    <li><code>tabs</code>: タブリストの既定ラベル。</li>
    <li><code>formField</code>: 必須マーカー、「必須」「型不一致」エラー。</li>
  </ul>
  <p>
    Form Field が組み立てるバリデーションメッセージは、ロケール側で丸ごと差し替えるか、Standard
    Schema 経由で拡張できます。バリデータごとのアダプタは不要です。
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
