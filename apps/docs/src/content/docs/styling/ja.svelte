<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);

  const stack = [
    {
      layer: '全体ベース',
      tool: 'グローバル CSS の [data-component*] セレクタ',
      use: '全 Dialog 共通の枠取り、Reset 的な層',
    },
    {
      layer: 'デザインシステム部品',
      tool: 'サブコンポーネントへの class パススルー',
      use: '<MyDialog> の構造的スタイル',
    },
    {
      layer: 'バリアント / テーマ',
      tool: 'CSS Custom Properties',
      use: 'ブランドカラー、ダーク / ライト切替',
    },
    {
      layer: 'ステート差分',
      tool: 'data-state セレクタ(または Tailwind data-[state=open]:)',
      use: '開閉、選択、無効、ホバー',
    },
    { layer: '要素差し替え', tool: 'child snippet', use: '<a> や <MyButton> をルートに使いたい' },
  ];
</script>

<svelte:head>
  <title>スタイリング · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基礎 — 07"
  title="スタイリング"
  lede="Kumiki の Layer 4 はスタイルを 1 byte も含みません。なぜそうしたのか、どう着付けるのか、Svelte の scoped style の制約をどう避けるか — 5 つのレシピと 1 つの落とし穴。"
>
  <PreviewFrame>
    <div style="display: flex; gap: 16px; align-items: center;">
      <Toggle.Root bind:pressed aria-label="ミュート">
        {pressed ? 'ミュート中' : 'オン'}
      </Toggle.Root>
      <span style="font-family: var(--k-font-mono); font-size: 12px; color: var(--k-ink-3);">
        pressed = {pressed}
      </span>
    </div>
  </PreviewFrame>

  <h2>なぜ Kumiki にスタイルがないのか</h2>

  <p>
    Layer 4 が出力するのは <strong>セマンティックな DOM + ARIA + <code>data-*</code> 属性</strong
    >のみ。意図的です:
  </p>

  <ul>
    <li>
      <strong>バンドル予算</strong>: Toggle 1.5 KB / Dialog 3.5 KB / Combobox 4.5 KB を実現するには
      CSS を含められない。
    </li>
    <li>
      <strong>デザインシステムは多様</strong>: Tailwind / UnoCSS / vanilla CSS / CSS-in-JS —
      どれにも合うように、何も決めない。
    </li>
    <li>
      <strong>アニメーションも CSS 駆動</strong>: <code>data-state="open|closed"</code> を吐くだけ。CSS
      Transitions / View Transitions / Motion ライブラリのどれを使うかはユーザーが決める。
    </li>
  </ul>

  <p>
    したがってあなたは <strong>5 つの手段の組み合わせ</strong
    >でスタイリングします。下に推奨度順で並べます。
  </p>

  <h2>レシピ 1: <code>data-*</code> セレクタ【ステート差分の正規ルート】</h2>

  <p>Kumiki が吐く属性を CSS セレクタで読みます。Radix が確立した battle-tested なパターン。</p>

  <table class="attrs">
    <thead>
      <tr><th>属性</th><th>値</th><th>使われる場面</th></tr>
    </thead>
    <tbody>
      <tr
        ><td><code>data-state</code></td><td
          ><code>open</code> / <code>closed</code> / <code>opening</code> / <code>closing</code> /
          <code>on</code>
          / <code>off</code></td
        ><td>Dialog、Toggle、Tooltip、Popover</td></tr
      >
      <tr
        ><td><code>data-orientation</code></td><td
          ><code>horizontal</code> / <code>vertical</code></td
        ><td>Tabs、RadioGroup、Slider</td></tr
      >
      <tr
        ><td><code>data-side</code></td><td
          ><code>top</code> / <code>right</code> / <code>bottom</code> / <code>left</code></td
        ><td>フローティング系</td></tr
      >
      <tr
        ><td><code>data-direction</code></td><td><code>ltr</code> / <code>rtl</code></td><td
          >RTL 反転</td
        ></tr
      >
      <tr><td><code>data-disabled</code></td><td>(空文字列)</td><td>無効状態</td></tr>
      <tr
        ><td><code>data-checked</code></td><td
          ><code>true</code> / <code>false</code> / <code>mixed</code></td
        ><td>Checkbox / Toggle / Switch</td></tr
      >
      <tr
        ><td><code>data-component</code> / <code>data-component-host</code></td><td
          ><code>combobox</code> / <code>dialog</code> / …</td
        ><td>コンポーネントのルート要素特定</td></tr
      >
      <tr
        ><td><code>data-component-part</code></td><td
          ><code>title</code> / <code>close</code> / <code>overlay</code> / …</td
        ><td>サブコンポーネント要素特定</td></tr
      >
    </tbody>
  </table>

  <pre><code
      >{`/* グローバル CSS */
[data-state='on'] { background: var(--ds-accent); color: white; }
[data-state='off'] { background: var(--ds-surface-2); }
[data-state='open'] { animation: fade-in 200ms; }
[data-state='closed'] { animation: fade-out 150ms; }`}</code
    ></pre>

  <p>Tailwind / UnoCSS なら同じことを utility で:</p>

  <pre><code
      >{`<Toggle.Root class="bg-gray-200 data-[state=on]:bg-blue-500 data-[state=on]:text-white" />`}</code
    ></pre>

  <h2>レシピ 2: <code>class</code> / <code>style</code> props のパススルー</h2>

  <p>
    Layer 4 のサブコンポーネントは <strong
      >すべて 1 要素ラッパで <code>...rest</code> を素通し</strong
    >します。<code>class</code>、<code>style</code>、追加の <code>data-*</code>、ARIA
    補強属性すべてが実 DOM の root 要素に届きます。
  </p>

  <pre><code
      >{`<Toggle.Root class="ds-toggle" style="--ring-color: var(--ds-accent)">
  ミュート
</Toggle.Root>`}</code
    ></pre>

  <p>
    実装裏付け: <code>packages/components/src/toggle/Root.svelte</code> の Props 型に
    <code>[key: string]: unknown</code>
    があり、<code>...rest</code> が <code>&lt;button&gt;</code> 要素に直接スプレッドされます。
  </p>

  <h2>レシピ 3: CSS Custom Properties【テーマ伝播の正規ルート】</h2>

  <p>
    Svelte の scoped CSS と違い、<strong>CSS 変数は通常のカスケードに乗ります</strong
    >。親で宣言すれば、子コンポーネント内部の DOM まで届く — Svelte scoping を完全に迂回できます。
  </p>

  <pre><code
      >{`<Combobox.Root style="
  --combobox-bg: var(--ds-surface);
  --combobox-border: var(--ds-line-strong);
">
  <Combobox.Input class="ds-input" />
</Combobox.Root>

<style>
  /* MyCombobox.svelte 内の scoped style — 子の内部 <input> にも届く */
  .ds-input {
    background: var(--combobox-bg);
    border: 1px solid var(--combobox-border);
  }
</style>`}</code
    ></pre>

  <p>
    <strong>使い分け:</strong> ブランドカラー、ダークモード切替、コンポーネント横断のトークン伝播。
  </p>

  <h2>レシピ 4: <code>child</code> snippet で要素差し替え</h2>

  <p>
    既定では <code>Toggle.Root</code> は <code>&lt;button&gt;</code> を出力します。<code
      >&lt;a&gt;</code
    >
    にしたい、自作の <code>&lt;MyButton&gt;</code> を流用したい、というときの脱出ハッチ。
  </p>

  <pre><code
      >{`<Toggle.Root bind:pressed>
  {#snippet child({ props, state })}
    <MyButton {...props} class="brand-btn" disabled={state.disabled}>
      {state.pressed ? 'ミュート中' : 'オン'}
    </MyButton>
  {/snippet}
</Toggle.Root>`}</code
    ></pre>

  <p>
    <code>props</code> には <code>type</code> / <code>aria-pressed</code> /
    <code>aria-disabled</code>
    / <code>data-state</code> / <code>onclick</code> / <code>onkeydown</code> / <code>id</code> が型付きで入ってきます。あなたの責任は「自作要素にスプレッドするだけ」。
  </p>

  <p class="note">
    <strong>常用は避ける。</strong> <code>child</code>
    は脱出ハッチで、デフォルトの着付け方ではありません。<code>class</code>
    パススルーで済むなら、それが一番。<code>data-*</code> や ARIA を再スプレッドし忘れるリスクも考慮。
  </p>

  <h2>レシピ 5: Tailwind / UnoCSS / vanilla CSS の対応</h2>

  <h3>Tailwind v4</h3>

  <pre><code
      >{`<Toggle.Root class="
  inline-flex items-center px-3 py-2 rounded-md
  bg-gray-200 text-gray-700
  data-[state=on]:bg-blue-600 data-[state=on]:text-white
  data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
" />`}</code
    ></pre>

  <h3>UnoCSS(通常モード)</h3>
  <p>
    Tailwind と完全に同じ書き味。<code>data-[state=on]:</code> バリアントは
    <code>@unocss/preset-mini</code>
    / <code>preset-wind3</code> に標準装備。
  </p>

  <h3>UnoCSS svelte-scoped モード</h3>
  <p>
    <code>@unocss/svelte-scoped</code> は親 <code>.svelte</code> をスキャンし、生成 CSS を
    <strong><code>:global(...)</code> でラップして親の <code>&lt;style&gt;</code> に注入</strong
    >します。Svelte scoping を貫通するので、親で書いたユーティリティが子コンポーネント内部の DOM
    まで届きます。
  </p>

  <h3>vanilla CSS / CSS Modules</h3>

  <pre><code
      >{`/* app.css(グローバル) */
.ds-toggle {
  display: inline-flex; align-items: center;
  padding: 8px 12px; border-radius: 6px;
  background: var(--ds-surface-2); color: var(--ds-ink);
}
.ds-toggle[data-state='on'] {
  background: var(--ds-accent); color: white;
}
.ds-toggle[data-disabled] { opacity: 0.5; cursor: not-allowed; }`}</code
    ></pre>

  <pre><code>{`<Toggle.Root class="ds-toggle">ミュート</Toggle.Root>`}</code></pre>

  <h2>応用: デザインシステムを組む</h2>

  <p>
    自分のラッパー <code>&lt;MyToggle&gt;</code> を作って、プロダクト全体で再利用するパターン。
  </p>

  <pre><code
      >{`<!-- src/lib/components/MyToggle.svelte -->
<script lang="ts">
  import { Toggle } from '@kumiki/components';
  import type { Snippet } from 'svelte';

  type Props = {
    pressed?: boolean;
    'aria-label': string;
    children: Snippet;
  };
  let { pressed = $bindable(false), 'aria-label': ariaLabel, children }: Props = $props();
<\/script>

<Toggle.Root bind:pressed aria-label={ariaLabel} class="ds-toggle">
  {@render children()}
</Toggle.Root>

<style>
  /* レシピ 2 — class パススルーがあるので scoped でもこのスタイルは効く */
  :global(.ds-toggle) {
    display: inline-flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    background: var(--ds-surface-2);
    transition: background 120ms;
  }
  :global(.ds-toggle[data-state='on']) {
    background: var(--ds-accent);
    color: white;
  }
</style>`}</code
    ></pre>

  <p>使う側:</p>

  <pre><code
      >{`<script lang="ts">
  import MyToggle from '$lib/components/MyToggle.svelte';
  let muted = $state(false);
<\/script>

<MyToggle bind:pressed={muted} aria-label="ミュート">
  {muted ? 'ミュート中' : 'オン'}
</MyToggle>`}</code
    ></pre>

  <h2>落とし穴: Svelte の scoped <code>&lt;style&gt;</code> は子コンポーネントに伝播しない</h2>

  <p>
    Svelte の長年の制約: 親 <code>.svelte</code> の <code>&lt;style&gt;</code> 内のクラスは、<strong
      >子コンポーネント内部の DOM 要素には届きません</strong
    >。
  </p>

  <pre><code
      >{`<!-- 動かない例 -->
<Combobox.Root class="my-combo">
  <Combobox.Input />
</Combobox.Root>

<style>
  /* .my-combo は親 .svelte 内では使われていないので Svelte に削除される、
     または子コンポーネント内部の <input> には scope mismatch で届かない */
  .my-combo input { padding: 8px; }
</style>`}</code
    ></pre>

  <p>4 つの回避策:</p>

  <ol>
    <li>
      <strong>Tailwind / UnoCSS / グローバル CSS を使う</strong>(レシピ 1, 5)。そもそも scoping
      されないので問題が起きない。<strong>第一推奨。</strong>
    </li>
    <li>
      <strong>各サブコンポーネントに <code>class</code> を渡す</strong>(レシピ 2)。<code
        >&lt;Combobox.Input class="ds-input" /&gt;</code
      >
      で子の root 要素にクラスが付く。親の <code>&lt;style&gt;</code> 内では
      <code>:global(.ds-input)</code>
      として書く必要がある(または <code>app.css</code> へ)。
    </li>
    <li>
      <strong>CSS Custom Properties</strong>(レシピ 3)。カスケードに乗るので scoping
      を完全迂回。テーマ伝播に最適。
    </li>
    <li>
      <strong><code>:global(...)</code> による scope 貫通</strong>。最後の手段。
      <pre><code
          >{`<style>
  .my-combo :global([data-component-part='item'][data-highlighted]) {
    background: var(--ds-accent-subtle);
  }
</style>`}</code
        ></pre>
      Svelte 5 では<code>:global &#123; ... &#125;</code> ブロック構文も使えます。
    </li>
  </ol>

  <h2>推奨スタック</h2>

  <table class="stack">
    <thead>
      <tr><th>レイヤ</th><th>手段</th><th>用途</th></tr>
    </thead>
    <tbody>
      {#each stack as row (row.layer)}
        <tr>
          <td class="layer">{row.layer}</td>
          <td><code>{row.tool}</code></td>
          <td class="use">{row.use}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <h2>次に読むもの</h2>
  <ul>
    <li>
      <a href={resolve('/docs/layers-by-example')}>例で見る各階層</a> — Layer 2/3/4/5 でユーザーランド実装がどう変わるか。
    </li>
    <li>
      <a href={resolve('/docs/composition')}>合成</a> — <code>with*</code> パターンによる任意機能の追加。
    </li>
    <li>
      <a href={resolve('/docs/i18n')}>国際化と RTL</a> — <code>data-direction</code> を使った RTL スタイリング。
    </li>
  </ul>
</Prose>

<style>
  table.attrs,
  table.stack {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 13px;
  }
  table.attrs th,
  table.attrs td,
  table.stack th,
  table.stack td {
    padding: 10px 12px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: middle;
  }
  table.attrs th,
  table.stack th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    border-block-end-color: var(--k-line-2);
    font-weight: 500;
  }
  table.stack .layer {
    color: var(--k-ink-2);
    font-weight: 500;
  }
  table.stack .use,
  table.attrs td:last-child {
    color: var(--k-ink-3);
  }
  table.attrs code,
  table.stack code {
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
