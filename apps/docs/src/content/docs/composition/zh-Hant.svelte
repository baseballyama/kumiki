<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>組合 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基礎 — 02"
  title="組合優於設定。"
  lede="Kumiki 元件是複合原語。Root 設定狀態,具名子元件呈現它。child snippet 模式讓你在不失去行為的前提下替換任何元素。"
>
  <h2>複合形態</h2>
  <p>每個 Layer 4 元件都遵循相同的輪廓:</p>
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

  <h2><code>child</code> snippet</h2>
  <p>
    想渲染 <code>{`<a>`}</code> 而非 <code>{`<button>`}</code>?使用 <code>child</code>
    snippet。元件會把原本要 spread 的 props 交給你;你決定放在哪個標籤上。這取代了 Radix/Bits v1 的
    <code>asChild</code> 模式。
  </p>
  <pre><code
      >{`<Toggle.Root>
  {#snippet child({ props })}
    <a href="/destination" {...props}>前往</a>
  {/snippet}
</Toggle.Root>`}</code
    ></pre>

  <p>
    元件仍掌控 ARIA — 只是渲染的標籤變了。Kumiki 沒有 <code>asChild</code> prop,將來也不會有。
  </p>

  <h2>分層逃生口</h2>
  <p>
    若 <code>child</code> 仍不夠 — 例如需要協調三個自訂 DOM 節點 — 往下一層。使用
    <code>@kumiki/headless</code> 的 attachment 工廠,自行用 JSX/HTML 包覆。
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggle } from '@kumiki/headless/toggle';
  const t = createToggle({ pressed: $state(false) });
<\/script>

<button {@attach t.root} class="my-fancy-toggle">
  {t.pressed ? '開' : '關'}
</button>`}</code
    ></pre>

  <h2>泛型自動傳播</h2>
  <p>
    接收型別化值的元件(Combobox、RadioGroup、Select、FormField)會從 Root 傳播泛型。內部子元件透過
    <code>getContext</code> 接收,無需於每層重複型別。
  </p>
</Prose>
