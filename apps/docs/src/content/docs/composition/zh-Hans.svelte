<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>组合 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基础 — 02"
  title="组合优于配置。"
  lede="Kumiki 组件是复合原语。Root 设置状态,具名子组件呈现它。child snippet 模式让你在不丢失行为的前提下替换任意元素。"
>
  <h2>复合形态</h2>
  <p>每个 Layer 4 组件遵循相同的轮廓:</p>
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
    想渲染 <code>{`<a>`}</code> 而不是 <code>{`<button>`}</code>?使用 <code>child</code> snippet。组件会把它原本要 spread 的 props
    交给你;你决定放在哪个标签上。这取代了 Radix/Bits v1 的 <code>asChild</code> 模式。
  </p>
  <pre><code
      >{`<Toggle.Root>
  {#snippet child({ props })}
    <a href="/destination" {...props}>跳转</a>
  {/snippet}
</Toggle.Root>`}</code
    ></pre>

  <p>
    组件仍然控制 ARIA — 只是渲染的标签变了。Kumiki 没有 <code>asChild</code> 属性,以后也不会有。
  </p>

  <h2>分层逃生口</h2>
  <p>
    如果 <code>child</code> 还不够 — 比如需要协调三个自定义 DOM 节点 — 下降一层。使用
    <code>@kumiki/headless</code> 的 attachment 工厂,自己用 JSX/HTML 包裹它们。
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggle } from '@kumiki/headless/toggle';
  const t = createToggle({ pressed: $state(false) });
<\/script>

<button {@attach t.root} class="my-fancy-toggle">
  {t.pressed ? '开' : '关'}
</button>`}</code
    ></pre>

  <h2>泛型自动传播</h2>
  <p>
    接受类型化值的组件(Combobox、RadioGroup、Select、FormField)会从 Root 传播泛型。内部子组件通过
    <code>getContext</code> 读取,无需在每一层重复类型。
  </p>
</Prose>
