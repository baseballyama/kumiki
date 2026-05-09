<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>Composición · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Fundamentos — 02"
  title="Composición sobre configuración."
  lede="Los componentes Kumiki son primitivas compuestas. El Root establece el estado, los subcomponentes nombrados lo presentan. El patrón child snippet te deja intercambiar cualquier elemento sin perder comportamiento."
>
  <h2>Forma compuesta</h2>
  <p>Cada componente de Layer 4 sigue el mismo esquema:</p>
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

  <h2>El snippet <code>child</code></h2>
  <p>
    ¿Necesitas renderizar un <code>{`<a>`}</code> en vez de un <code>{`<button>`}</code>? Usa el
    snippet <code>child</code>. El componente te entrega los props que iba a propagar; tú decides en
    qué etiqueta van. Esto reemplaza el patrón <code>asChild</code> de Radix/Bits v1.
  </p>
  <pre><code
      >{`<Toggle.Root>
  {#snippet child({ props })}
    <a href="/destination" {...props}>Navegar</a>
  {/snippet}
</Toggle.Root>`}</code
    ></pre>

  <p>
    El componente sigue controlando ARIA — solo cambia la etiqueta renderizada. No hay un prop
    <code>asChild</code> en Kumiki y nunca lo habrá.
  </p>

  <h2>Salidas escalonadas</h2>
  <p>
    Si <code>child</code> no basta — por ejemplo, necesitas coordinar tres nodos DOM personalizados
    — baja una capa. Usa las fábricas de attachments en <code>@kumiki/headless</code> y escribe tu propio
    JSX/HTML alrededor.
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggle } from '@kumiki/headless/toggle';
  const t = createToggle({ pressed: $state(false) });
<\/script>

<button {@attach t.root} class="my-fancy-toggle">
  {t.pressed ? 'Encendido' : 'Apagado'}
</button>`}</code
    ></pre>

  <h2>Los genéricos se propagan</h2>
  <p>
    Los componentes que reciben un valor tipado (Combobox, RadioGroup, Select, FormField) propagan
    ese genérico desde el Root. Los subcomponentes internos lo leen vía <code>getContext</code>. No
    hace falta repetir el tipo en cada nivel.
  </p>
</Prose>
