<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';

  const layers = [
    {
      n: 0,
      ji: '型',
      name: 'Types',
      pkg: '@kumiki/types',
      role: '共有 TypeScript 型 — 全階層が唯一合意するもの。',
    },
    {
      n: 1,
      ji: '基',
      name: 'Primitives',
      pkg: '@kumiki/primitives',
      role: 'フレームワーク非依存ヘルパー(focus-trap、dismissable、ID、locale、motion)。',
    },
    {
      n: 2,
      ji: '機',
      name: 'Machines',
      pkg: '@kumiki/machines',
      role: '純粋 TS の有限状態機械。約 1 KB ランタイム、JSON 検査可能。',
    },
    {
      n: 3,
      ji: '装',
      name: 'Attachments',
      pkg: '@kumiki/headless',
      role: 'Svelte 5 の {@attach} ファクトリー — 実 DOM に ARIA と data-state を駆動。',
    },
    {
      n: 4,
      ji: '組',
      name: 'Components',
      pkg: '@kumiki/components',
      role: '複合プリミティブ。ドット名前空間のエルゴノミック API。',
    },
    {
      n: 5,
      ji: '釉',
      name: 'Atelier',
      pkg: '@kumiki/atelier',
      role: 'Layer 5 プレビュー — コピペ可能なスタイル付きバリアント。',
    },
  ];
</script>

<svelte:head>
  <title>アーキテクチャ · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基礎 — 01"
  title="5 つの階層、ひとつの思想。"
  lede="Kumiki の各プリミティブはちょうど 1 つの階層に属します。必要な制御の粒度に合わせて階層を選び、その階層のバイトだけを出荷してください。サブパスエクスポートが tree-shaking を外科的に保ちます。"
>
  <p>
    名前は <em>組木</em> 細工から借りています。各階層は釘も糊も使わずに次にぴたりと噛み合う部材です。
  </p>

  <table class="layers">
    <thead>
      <tr>
        <th>L</th>
        <th>名前</th>
        <th>パッケージ</th>
        <th>役割</th>
      </tr>
    </thead>
    <tbody>
      {#each layers as l (l.n)}
        <tr>
          <td class="num">L{l.n}</td>
          <td><span class="ji">{l.ji}</span><strong>{l.name}</strong></td>
          <td><code>{l.pkg}</code></td>
          <td class="role">{l.role}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <h2>階層の選び方</h2>
  <p>多くのアプリは Layer 4 で十分です。下の階層に降りるのは次のような場合です:</p>
  <ul>
    <li>
      <strong>Layer 3 (attachments)</strong> — DOM を厳密に制御している場合。素の
      <code>&lt;button&gt;</code>
      をスタイルしたく、Svelte ラッパーは要らないとき。
    </li>
    <li>
      <strong>Layer 2 (machines)</strong> — SSR やサーバーサイドバリデーション、あるいは Svelte 以外の環境(Cypress、Vitest、Worker)でロジックを動かしたいとき。
    </li>
    <li>
      <strong>Layer 1 (primitives)</strong> — dismissable / focus-trap / ID エンジンの上に独自コンポーネントを設計するとき。
    </li>
  </ul>

  <h2>なぜ全部入りにしないのか?</h2>
  <p>
    バンドル予算のためです。各サブパスごとに brotli の予算が CI で強制されています — Toggle は 1.5
    KB、Combobox は 4.5 KB。設計トークンを既に持っているプロジェクトに Layer 5
    のスタイル付きバリアントを引き込むのは無駄です。Atelier
    パッケージは「オプトイン」であり、デフォルトではありません。
  </p>

  <h2>原典</h2>
  <p>
    内部設計ドキュメントは
    <a href="https://github.com/baseballyama/kumiki/tree/main/docs/design">/docs/design</a>
    にあります。特に重要なもの:
  </p>
  <ul>
    <li><code>02-architecture.md</code> — この階層モデル、図付き。</li>
    <li><code>03-package-structure.md</code> — パッケージ境界。</li>
    <li><code>04-state-machines.md</code> — FSM ランタイム仕様。</li>
    <li><code>09-bundle-budget.md</code> — サブパスごとの brotli 予算。</li>
  </ul>
</Prose>

<style>
  table.layers {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 14px;
  }
  table.layers th,
  table.layers td {
    padding: 12px 14px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: middle;
  }
  table.layers th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    border-block-end-color: var(--k-line-2);
    font-weight: 500;
  }
  table.layers .num {
    color: var(--k-shu);
    font-family: var(--k-font-mono);
    font-size: 12px;
    width: 5%;
  }
  table.layers .ji {
    font-family: var(--k-font-display);
    font-size: 22px;
    color: var(--k-ink-1);
    margin-inline-end: 8px;
    font-variation-settings:
      'opsz' 36,
      'SOFT' 30;
  }
  table.layers .role {
    color: var(--k-ink-3);
  }
  table.layers code {
    font-size: 11px;
  }
</style>
