<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>イントロダクション · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ はじめに — 01"
  title="イントロダクション"
  lede="Kumiki — 組木 — は Svelte 5 のためのアクセシビリティ最優先の UI プリミティブ群です。「a11y も国際化もテーマ化も軽量化も全部欲しい」という問いに、リポジトリごとに 50 回も答え直したくないから生まれました。"
>
  <h2>なぜ Kumiki か</h2>
  <p>
    多くのアクセシブルなコンポーネントライブラリは、何らかのトレードオフを選んでそこに留まります。ヘッドレスで
    ARIA
    の配線を利用者に任せるもの、スタイル込みで設計システムを丸ごと押しつけるもの、特定のステートマシンに固定するもの、ステートマシンが無いもの。Kumiki
    はそのトレードオフを拒否します — 5 つの組み合わせ可能な階層、それぞれを単独で利用できます。
  </p>

  <ul>
    <li><strong>Layer 0 — Types。</strong>すべての階層が共有する TypeScript の型契約。</li>
    <li>
      <strong>Layer 1 — Primitives。</strong
      >フレームワーク非依存のヘルパー(focus-trap、dismissable、ID、locale)。
    </li>
    <li>
      <strong>Layer 2 — Machines。</strong>純粋 TS の有限状態機械。約 1 KB のランタイム、JSON
      で完全にインスペクト可能。
    </li>
    <li>
      <strong>Layer 3 — Attachments。</strong><code>{'{@attach}'}</code> ファクトリーが実 DOM
      ノードに ARIA と <code>data-state</code> を駆動。
    </li>
    <li>
      <strong>Layer 4 — Components。</strong><code>{`<Combobox.Root>`}</code> のような複合プリミティブ、すぐ使えるエルゴノミクス。
    </li>
    <li>
      <strong>Layer 5 — Atelier。</strong>意見を持ったコピペ可能なスタイル付きバリアント。<code
        >0.x-preview</code
      >として出荷。
    </li>
  </ul>

  <h2>ステータス</h2>
  <p>
    Kumiki は <strong>プレアルファ</strong> です。アーキテクチャは確定し、バンドル予算は CI
    で強制され、スクリーンリーダーのナイトリーも回っています — ただし、まだ npm
    に公開されたバージョンはありません。API は変わる前提で扱ってください。Issue は
    <a href="https://github.com/baseballyama/kumiki/issues">baseballyama/kumiki</a> までどうぞ。
  </p>

  <h2>次のステップ</h2>
  <p>
    次は <a href={resolve('/docs/installation')}>インストール</a> か
    <a href={resolve('/docs/architecture')}>アーキテクチャ</a> へ。先に動くものを見たい方は
    <a href={resolve('/components')}>コンポーネント一覧</a> を覗いてみてください。
  </p>
</Prose>
