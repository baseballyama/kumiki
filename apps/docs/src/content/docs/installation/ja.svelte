<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>インストール · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ はじめに — 02"
  title="インストール"
  lede="Kumiki は npm 上で独立にバージョン管理された複数のパッケージとして配布されます。必要な階層だけインストールしてください。サブパスインポートにより tree-shaking は徹底されます。"
>
  <h2>動作要件</h2>
  <ul>
    <li>Node.js 22 以降。</li>
    <li>Svelte 5.29 以降(<code>{'{@attach}'}</code> ディレクティブのため)。</li>
    <li>ESM 対応バンドラ — Vite 5+、Rollup 4+、esbuild 0.25+。CJS は同梱しません。</li>
  </ul>

  <h2>階層を選ぶ</h2>
  <p>多くのユーザーは Layer 4(複合コンポーネント)とロケールバンドルで足ります:</p>
  <pre><code>pnpm add @kumiki/components @kumiki/locale</code></pre>

  <p>
    DOM を完全に手で書きたい場合は、コンポーネントを飛ばして Layer 3 の attachment を直接消費します:
  </p>
  <pre><code>pnpm add @kumiki/headless</code></pre>

  <p>独自プリミティブを書く場合は、ステートマシンを単独で利用できます:</p>
  <pre><code>pnpm add @kumiki/machines</code></pre>

  <h2>ロケールを供給する</h2>
  <p>
    アプリのルートを <code>LocaleProvider</code> で一度だけ包んでください。配下のすべての Kumiki コンポーネントが、メッセージと書字方向を自動的に拾います。
  </p>
  <pre><code
      >{`<script lang="ts">
  import { LocaleProvider } from '@kumiki/components';
  import { messages, direction } from '@kumiki/locale/ja';

  let { children } = $props();
<\/script>

<LocaleProvider.Root locale="ja" {messages} dir={direction}>
  {@render children()}
</LocaleProvider.Root>`}</code
    ></pre>

  <p>
    ロケールバンドルはサブパスインポートで、各 ≤ 1 KB(brotli)に収まります。実行時に <code
      >messages</code
    >
    を入れ替えれば言語切替が可能で、コンポーネントは ARIA テキストを自動的に再計算します。
  </p>

  <h2>動作確認</h2>
  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="ミュート">
  {pressed ? 'ミュート中' : 'オン'}
</Toggle.Root>`}</code
    ></pre>

  <p>これで完了です。<a href="/components">コンポーネントカタログ</a> を覗いてみてください。</p>
</Prose>
