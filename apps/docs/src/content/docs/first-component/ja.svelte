<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);
</script>

<svelte:head>
  <title>最初のコンポーネント · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ はじめに — 03"
  title="最初のコンポーネント"
  lede="5 分で歩ける案内ツアー。Toggle を組み込み、ARIA 契約を観察し、コンポーネントに触れずに表示言語を切り替えます。"
>
  <h2>1. 配置する</h2>
  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="ミュート">
  {pressed ? 'ミュート中' : 'オン'}
</Toggle.Root>`}</code
    ></pre>

  <h2>2. 反応を見る</h2>
  <p>
    下の Toggle は登録済みデモではなく、このページのローカル状態に直接配線されています —
    触ってみてください。
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

  <h2>3. 契約を点検する</h2>
  <p>
    開発者ツールを開いてください。ボタンには状態に応じた <code>aria-pressed</code> と、CSS
    フックのための
    <code>data-state="on"</code> が付与されています。グローバル CSS もデザイン上の意見もありません — どのようにでもスタイルできます。
  </p>
  <pre><code
      >{`<button aria-pressed="true" data-state="on" type="button">
  ミュート中
</button>`}</code
    ></pre>

  <h2>4. 国際化する</h2>
  <p>
    ヘッダーのロケールを変更してみてください。Toggle
    自体には翻訳された文字列がありませんが、Combobox、Dialog、FormField
    といったコンポーネントは即座に切り替わります。日本語に切り替えたあと
    <a href={resolve('/components/component-combobox')}>Combobox のデモ</a> を試してみてください。
  </p>

  <h2>次は?</h2>
  <ul>
    <li><a href={resolve('/docs/architecture')}>5 階層アーキテクチャ</a> を読む。</li>
    <li><a href={resolve('/docs/accessibility')}>アクセシビリティモデル</a> をざっと眺める。</li>
    <li><a href={resolve('/components')}>全コンポーネント</a> をライブデモ付きで見る。</li>
  </ul>
</Prose>
