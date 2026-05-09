<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>合成 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基礎 — 02"
  title="設定よりも合成。"
  lede="Kumiki のコンポーネントは複合プリミティブです。Root が状態を立ち上げ、名前付きのサブコンポーネントがそれを表示します。child スニペットを使えば、振る舞いを失わずに任意の要素に差し替えられます。"
>
  <h2>複合の形</h2>
  <p>すべての Layer 4 コンポーネントは同じ骨格を持ちます:</p>
  <pre><code
      >{`<Combobox.Root>
  <Combobox.Input />
  <Combobox.Listbox>
    {#each items as item}
      <Combobox.Item value={item}>{item.label}</Combobox.Item>
    {/each}
  </Combobox.Listbox>
</Combobox.Root>`}</code
    ></pre>

  <h2><code>child</code> スニペット</h2>
  <p>
    <code>{`<button>`}</code> ではなく <code>{`<a>`}</code> を描画したい?<code>child</code>
    スニペットを使ってください。コンポーネントは自身が spread するはずだった props を渡してくるので、どのタグに載せるかは利用者が決めます。これは
    Radix / Bits v1 の <code>asChild</code> パターンを置き換えます。
  </p>
  <pre><code
      >{`<Toggle.Root>
  {#snippet child({ props })}
    <a href="/destination" {...props}>移動</a>
  {/snippet}
</Toggle.Root>`}</code
    ></pre>

  <p>
    コンポーネントは依然 ARIA を制御し、変わるのは描画されるタグだけです。Kumiki に <code
      >asChild</code
    >
    プロップは存在しませんし、これからも存在しません。
  </p>

  <h2>段階的な脱出口</h2>
  <p>
    <code>child</code> でも足りない場合 — たとえば 3 つの独自 DOM ノードを協調させたいとき —
    階層を一段下げてください。
    <code>@kumiki/headless</code> の attachment ファクトリーを使い、まわりは自前の HTML/JSX で書けます。
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggle } from '@kumiki/headless/toggle';
  const t = createToggle({ pressed: $state(false) });
<\/script>

<button {@attach t.root} class="my-fancy-toggle">
  {t.pressed ? 'オン' : 'オフ'}
</button>`}</code
    ></pre>

  <h2>ジェネリクスは伝播する</h2>
  <p>
    型付きの値を扱うコンポーネント(Combobox、RadioGroup、Select、FormField)は、ジェネリクスを Root
    から伝播させます。内部のサブコンポーネントは
    <code>getContext</code> で受け取るため、各階層で型を書き直す必要はありません。
  </p>
</Prose>
