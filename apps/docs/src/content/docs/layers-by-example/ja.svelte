<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);

  const matrix = [
    { task: 'FSM(状態遷移)', l2: 'Kumiki', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    {
      task: 'Svelte リアクティビティブリッジ',
      l2: 'あなた',
      l3: 'あなた※',
      l4: 'Kumiki',
      l5: 'Kumiki',
    },
    { task: '<button> 要素', l2: 'あなた', l3: 'あなた', l4: 'Kumiki', l5: 'コピー済み' },
    { task: 'ARIA 属性 (aria-pressed 等)', l2: 'あなた', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'data-state 出力', l2: 'あなた', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'クリック / キーハンドリング', l2: 'あなた', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'アクセシブル名 (aria-label)', l2: 'あなた', l3: 'あなた', l4: 'あなた', l5: 'Kumiki' },
    { task: 'スタイル', l2: 'あなた', l3: 'あなた', l4: 'あなた', l5: 'コピー済み' },
  ];
</script>

<svelte:head>
  <title>例で見る各階層 — Toggle · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基礎 — 06"
  title="例で見る各階層: Toggle"
  lede="同じ Toggle を Layer 2 / 3 / 4 / 5 で書くと、ユーザーランドのコードはどう変わるか。抽象度を 1 段下げるたびに増える責務を、横並びで観察します。"
>
  <p>
    Kumiki の階層は <strong>同じ動作を、異なる抽象度で提供します</strong>。下の階層に降りるほど
    DOM・ARIA・イベントハンドリングへの直接の責任が増えますが、その代わり構造を完全に自由に設計できます。逆に上の階層に行くほど決まった構造を受け入れる代わりに、書くコードが減ります。
  </p>

  <p>
    題材として <a href={resolve('/components/component-toggle')}>Toggle</a>
    を選びました。挙動は単純(押したら反転)ですが、<strong>4 階層すべてで実装が揃っている</strong
    >ので比較に最適です。
  </p>

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

  <h2>1. Layer 4 — 複合コンポーネント【既定の入口】</h2>
  <p>
    最も書くコードが少ない経路。<code>Toggle.Root</code> が <code>&lt;button&gt;</code>
    を出力し、ARIA・<code>data-state</code>・キーボード・SSR まで全部面倒を見ます。あなたの責任は
    <strong>2 つだけ</strong>: <code>bind:pressed</code> でステートを受け取ること、<code
      >aria-label</code
    >(または可視ラベル) を渡すこと。
  </p>

  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="ミュート">
  {pressed ? 'ミュート中' : 'オン'}
</Toggle.Root>`}</code
    ></pre>

  <p>出力される DOM:</p>
  <pre><code
      >{`<button type="button" aria-pressed="false" data-state="off" id="toggle-…">
  オン
</button>`}</code
    ></pre>

  <p>
    <strong>選ぶべきとき:</strong> 9 割のケース。標準の <code>&lt;button&gt;</code> 要素で、構造的な装飾に異論がないとき。
  </p>

  <h2>2. Layer 3 — Headless attachment</h2>
  <p>
    要素を自分で書きたいとき(<code>&lt;a&gt;</code> にしたい、<code>&lt;div role="button"&gt;</code>
    にしたい、特殊なラッパーを噛ませたい等)。<code>createToggle()</code> が
    <code>{`{@attach}`}</code> 用のファクトリを返すので、好きな要素にスプレッドします。
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggle } from '@kumiki/headless/toggle';

  const t = createToggle({ initial: false });

  // controller.pressed は素の getter。テキスト表示に使うなら
  // subscribe して $state にミラーする必要がある(CSS で完結するなら不要)。
  let pressed = $state(t.pressed);
  $effect(() => t.subscribe(({ context }) => (pressed = context.pressed)));
<\/script>

<button {@attach t.root} aria-label="ミュート" class="my-btn">
  {pressed ? 'ミュート中' : 'オン'}
</button>`}</code
    ></pre>

  <p>
    <code>{`{@attach t.root}`}</code> がマウント時に DOM 側の属性 (<code>type</code>,
    <code>aria-pressed</code>, <code>data-state</code>, <code>id</code>) を書き込み、クリック / キー
    (Space / Enter) のリスナーも仕掛けます。<strong>あなたの責任で増えるもの:</strong>
    要素の選択、スタイリング、可視ラベル、(必要なら)状態をテキストにミラーする
    <code>subscribe</code>。
  </p>

  <p>
    <strong>選ぶべきとき:</strong> Layer 4 の固定構造(<code>&lt;button&gt;</code
    >)が要件と合わないとき。例: ボタン全体を <code>&lt;label&gt;</code> 内に置きたい、外側に独自の React
    Wrapper を被せたい。
  </p>

  <h2>3. Layer 2 — Pure machine</h2>
  <p>
    Svelte ですらない、純粋な TypeScript の有限状態機械。<strong
      >DOM・ARIA・イベント・キーボード — すべてを自分で書きます。</strong
    >
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggleMachine } from '@kumiki/machines/toggle';

  const m = createToggleMachine({ initial: false });
  let pressed = $state(m.context.pressed);
  m.subscribe(({ context }) => (pressed = context.pressed));
<\/script>

<button
  type="button"
  aria-pressed={pressed ? 'true' : 'false'}
  data-state={pressed ? 'on' : 'off'}
  aria-label="ミュート"
  onclick={() => m.send({ type: 'TOGGLE' })}
>
  {pressed ? 'ミュート中' : 'オン'}
</button>`}</code
    ></pre>

  <p>
    <strong>Layer 2 を選ぶ動機は通常 UI ではなく ロジック の再利用です:</strong>
  </p>
  <ul>
    <li>サーバーサイドで Toggle ロジックを検証する(SvelteKit のサーバールート / Workers)。</li>
    <li>Vitest で純粋な FSM 単体テストを書く(jsdom 不要、~20μs/transition)。</li>
    <li>
      Toggle の遷移を <a href="https://stately.ai/viz">stately.ai/viz</a> で可視化する(<code
        >machine.toJSON()</code
      > が XState 互換 JSON を返す)。
    </li>
    <li>Svelte 以外のホスト(vanilla JS、Web Components、別フレームワーク)に組み込む。</li>
  </ul>

  <h2>4. Layer 5 — Atelier(コピペ可能なスタイル付きバリアント)</h2>
  <p>
    CLI でユーザーリポジトリにソースをコピーします。コピー後は <strong>あなたのコード</strong> として自由に編集可能。
  </p>

  <pre><code
      >{`# Tailwind v4 バリアント
npx kumiki add toggle --variant=tailwind

# vanilla CSS バリアント
npx kumiki add toggle --variant=vanilla`}</code
    ></pre>

  <p>生成されたファイル:</p>

  <pre><code
      >{`src/lib/components/Toggle.svelte   # スタイル付きラッパー(Layer 4 の Toggle.Root を内部で使用)`}</code
    ></pre>

  <p>使い方は普通の Svelte コンポーネント:</p>

  <pre><code
      >{`<script lang="ts">
  import Toggle from '$lib/components/Toggle.svelte';
  let pressed = $state(false);
<\/script>

<Toggle bind:pressed>ミュート</Toggle>`}</code
    ></pre>

  <p>
    <strong>選ぶべきとき:</strong> ゼロからスタイルを組みたくない、まず動くものが欲しい。Layer 5 は
    v1.0 期間中は <code>0.x.x-preview</code>(将来 API が変わる可能性)
    なので、安定性重視のプロジェクトでは Layer 4 + 自前スタイルを推奨。
  </p>

  <h2>責務マトリックス</h2>

  <p>
    各 Layer であなたが書く必要があるもの。「Kumiki」= ライブラリ側でやってくれる、「あなた」=
    ユーザーランドで実装が必要。
  </p>

  <table class="matrix">
    <thead>
      <tr>
        <th>責務</th>
        <th>L2 (machine)</th>
        <th>L3 (headless)</th>
        <th>L4 (component)</th>
        <th>L5 (atelier)</th>
      </tr>
    </thead>
    <tbody>
      {#each matrix as row (row.task)}
        <tr>
          <td class="task">{row.task}</td>
          <td class:you={row.l2 === 'あなた'} class:them={row.l2 === 'Kumiki'}>{row.l2}</td>
          <td class:you={row.l3.startsWith('あなた')} class:them={row.l3 === 'Kumiki'}>{row.l3}</td>
          <td class:you={row.l4 === 'あなた'} class:them={row.l4 === 'Kumiki'}>{row.l4}</td>
          <td class:them={row.l5 === 'Kumiki'}>{row.l5}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <p class="note">
    ※ L3 で「Svelte リアクティビティブリッジ」が必要なのは、<code>controller.pressed</code> の値を
    Svelte のテンプレート内に表示したい場合だけです。スタイルだけで完結するなら(CSS が
    <code>data-state</code>
    を読む)、<code>subscribe</code> は不要です。
  </p>

  <h2>どの Layer を選ぶか — 決定木</h2>

  <ul>
    <li>
      <strong>スタイル込みで今すぐ動かしたい?</strong> → <strong>Layer 5</strong>
      (<code>npx kumiki add</code>)。ただし v1.0 期間中はプレビュー扱い。
    </li>
    <li>
      <strong>標準的な &lt;button&gt; で OK で、自分でスタイルを当てたい?</strong> →
      <strong>Layer 4</strong>
      (<code>{`<Toggle.Root>`}</code>)。これが既定の入口。
    </li>
    <li>
      <strong>要素の種類や構造を自分で決めたい?</strong> → <strong>Layer 3</strong>
      (<code>{`{@attach t.root}`}</code>)。Layer 4 が <code>child</code> snippet で吸収できる範囲なら
      Layer 4 を続ける方が楽。
    </li>
    <li>
      <strong>Svelte 以外で動かす / サーバーで検証する / FSM だけ欲しい?</strong> →
      <strong>Layer 2</strong>
      (<code>createToggleMachine</code>)。
    </li>
  </ul>

  <h2>次に読むもの</h2>
  <ul>
    <li>
      <a href={resolve('/docs/styling')}>スタイリング</a> — Layer 4 の <code>data-*</code>・<code
        >class</code
      >
      パススルー・<code>child</code> snippet の使い分け。
    </li>
    <li><a href={resolve('/docs/architecture')}>アーキテクチャ</a> — 5 階層モデルの全景。</li>
    <li>
      <a href={resolve('/docs/composition')}>合成</a> — <code>with*</code> パターンによる任意機能の追加。
    </li>
  </ul>
</Prose>

<style>
  table.matrix {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 13px;
  }
  table.matrix th,
  table.matrix td {
    padding: 10px 12px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: middle;
  }
  table.matrix th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    border-block-end-color: var(--k-line-2);
    font-weight: 500;
  }
  table.matrix .task {
    color: var(--k-ink-2);
    font-weight: 500;
  }
  table.matrix td.you {
    color: var(--k-shu);
    font-family: var(--k-font-mono);
    font-size: 12px;
  }
  table.matrix td.them {
    color: var(--k-ink-4);
    font-family: var(--k-font-mono);
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
