<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);
</script>

<svelte:head>
  <title>Tu primer componente · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Primeros pasos — 03"
  title="Tu primer componente"
  lede="Un recorrido guiado de cinco minutos. Conectaremos un Toggle, observaremos su contrato ARIA y cambiaremos su idioma sin tocar el componente."
>
  <h2>1. Inclúyelo</h2>
  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="Silenciar audio">
  {pressed ? 'Silenciado' : 'Activado'}
</Toggle.Root>`}</code
    ></pre>

  <h2>2. Míralo reaccionar</h2>
  <p>El toggle de abajo está conectado a tu estado local, no al registro de demos — pruébalo.</p>

  <PreviewFrame>
    <div style="display: flex; gap: 16px; align-items: center;">
      <Toggle.Root bind:pressed aria-label="Silenciar audio">
        {pressed ? 'Silenciado' : 'Activado'}
      </Toggle.Root>
      <span style="font-family: var(--k-font-mono); font-size: 12px; color: var(--k-ink-3);">
        pressed = {pressed}
      </span>
    </div>
  </PreviewFrame>

  <h2>3. Inspecciona el contrato</h2>
  <p>
    Abre el inspector. El botón tiene <code>aria-pressed</code> dirigido por el estado, además de un
    gancho <code>data-state="on"</code> para estilizar con CSS. Sin CSS global, sin opiniones de diseño
    — estilízalo como quieras.
  </p>
  <pre><code
      >{`<button aria-pressed="true" data-state="on" type="button">
  Silenciado
</button>`}</code
    ></pre>

  <h2>4. Localízalo</h2>
  <p>
    Cambia el idioma en la cabecera. El propio Toggle no tiene cadenas localizadas, pero componentes
    como Combobox, Dialog y FormField cambian al instante. Prueba la
    <a href={resolve('/components/component-combobox')}>demo de Combobox</a> tras cambiar al japonés.
  </p>

  <h2>¿Y ahora?</h2>
  <ul>
    <li>Lee la <a href={resolve('/docs/architecture')}>arquitectura de cinco capas</a>.</li>
    <li>Repasa el <a href={resolve('/docs/accessibility')}>modelo de accesibilidad</a>.</li>
    <li>Explora <a href={resolve('/components')}>todos los componentes</a> con demos en vivo.</li>
  </ul>
</Prose>
