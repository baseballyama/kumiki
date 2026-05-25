<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>Composition · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Foundations — 02"
  title="Composition over configuration."
  lede="Kumiki components are compound primitives. The Root sets up the state, named subcomponents present it. The child snippet pattern lets you swap any element without losing behaviour."
>
  <h2>Compound shape</h2>
  <p>Every Layer 4 component follows the same outline:</p>
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

  <h2>The <code>child</code> snippet</h2>
  <p>
    Need to render an <code>{`<a>`}</code> instead of a <code>{`<button>`}</code>? Use the
    <code>child</code> snippet. The component hands you the props it would have spread; you decide
    what tag they go on. This replaces the Radix/Bits v1 <code>asChild</code> pattern.
  </p>
  <pre><code
      >{`<Toggle.Root>
  {#snippet child({ props })}
    <a href={resolve('/destination')} {...props}>Navigate</a>
  {/snippet}
</Toggle.Root>`}</code
    ></pre>

  <p>
    The component still controls ARIA — only the rendered tag changes. There is no
    <code>asChild</code> prop in Kumiki and there never will be.
  </p>

  <h2>Layered escape hatches</h2>
  <p>
    If <code>child</code> isn't enough — say you need to coordinate three custom DOM nodes — drop
    down a layer. Use the headless attachment factories at <code>@kumiki/headless</code>
    and write your own JSX/HTML around them.
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggle } from '@kumiki/headless/toggle';
  const t = createToggle({ pressed: $state(false) });
<\/script>

<button {@attach t.root} class="my-fancy-toggle">
  {t.pressed ? 'On' : 'Off'}
</button>`}</code
    ></pre>

  <h2>Generics propagate</h2>
  <p>
    Components that take a typed value (Combobox, RadioGroup, Select, FormField) propagate that
    generic from the Root. Inner subcomponents read it via <code>getContext</code>. No need to
    repeat the type at every level.
  </p>
</Prose>
