<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import { LOCALES } from '$lib/i18n/dict.js';
</script>

<svelte:head>
  <title>i18n y RTL · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Fundamentos — 04"
  title="Idiomas como imports por subpath."
  lede="No hay un mega-bundle de traducciones. Cada locale es su propio import por subpath de ≤ 1 KB brotli, cargado bajo demanda. La inversión RTL vive en la máquina de estados, no en el CSS."
>
  <h2>Locales de la Fase 1</h2>
  <ul class="locales">
    {#each LOCALES as l (l.code)}
      <li>
        <span class="native">{l.native}</span>
        <span class="meta"><code>@kumiki/locale/{l.code}</code> · {l.name}</span>
      </li>
    {/each}
  </ul>

  <h2>Cambiar en runtime</h2>
  <p>
    Envuelve tu app una vez, luego cambia el bundle de locale importado en cualquier momento. Los
    componentes por debajo releen los mensajes en cada cambio.
  </p>
  <pre><code
      >{`<script lang="ts">
  import { LocaleProvider } from '@kumiki/components';
  import * as ja from '@kumiki/locale/ja';
  import * as en from '@kumiki/locale/en';

  let active = $state<'ja' | 'en'>('ja');
  const bundle = $derived(active === 'ja' ? ja : en);
<\/script>

<button onclick={() => (active = active === 'ja' ? 'en' : 'ja')}>
  {active.toUpperCase()}
</button>

<LocaleProvider.Root locale={active} messages={bundle.messages} dir={bundle.direction}>
  {@render children()}
</LocaleProvider.Root>`}</code
    ></pre>

  <h2>RTL no es algo añadido</h2>
  <p>
    La dirección de lectura se propaga desde <code>LocaleProvider</code> a través del contexto. Los
    mapeos de teclas sensibles a la dirección (Tabs <code>ArrowRight</code>, Slider, RadioGroup) leen
    la dirección del contexto de la máquina — el controlador no sabe nada de RTL.
  </p>

  <p>
    El <strong>toggle de dirección</strong> de cada página de detalle te deja previsualizar RTL para
    cualquier locale, sin cambiar de idioma. Úsalo para verificar tu styling.
  </p>

  <h2>Qué se localiza</h2>
  <p>Los bundles de <code>@kumiki/locale</code> cubren:</p>
  <ul>
    <li><code>combobox</code>: etiqueta del listbox, «sin resultados», botón limpiar.</li>
    <li><code>dialog</code>: etiqueta del botón de cierre.</li>
    <li><code>tabs</code>: etiqueta por defecto del tablist.</li>
    <li><code>formField</code>: marcador requerido, errores «requerido» / «tipo no coincide».</li>
  </ul>
  <p>
    Los mensajes de validación que compone Form Field se pueden reemplazar enteros o extender vía
    Standard Schema — sin necesidad de adaptadores por validador.
  </p>
</Prose>

<style>
  ul.locales {
    list-style: none;
    margin: 24px 0;
    padding: 0;
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    overflow: hidden;
  }
  ul.locales li {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 24px;
    padding: 12px 16px;
    border-block-end: 1px solid var(--k-line-1);
  }
  ul.locales li:last-child {
    border-block-end: 0;
  }
  ul.locales .native {
    font-family: var(--k-font-display);
    font-size: 17px;
    color: var(--k-ink-1);
    font-variation-settings: 'opsz' 36;
  }
  ul.locales .meta {
    font-family: var(--k-font-mono);
    font-size: 11px;
    color: var(--k-ink-3);
  }
</style>
