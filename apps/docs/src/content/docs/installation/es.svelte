<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>Instalación · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Primeros pasos — 02"
  title="Instalación"
  lede="Kumiki se distribuye como un conjunto de paquetes versionados de forma independiente en npm. Instala solo la capa que necesites; los imports por subpath mantienen el tree-shaking despiadado."
>
  <h2>Requisitos</h2>
  <ul>
    <li>Node.js 22 o superior.</li>
    <li>Svelte 5.29+ (para la directiva <code>{'{@attach}'}</code>).</li>
    <li>Un bundler compatible con ESM — Vite 5+, Rollup 4+, esbuild 0.25+. No se publica CJS.</li>
  </ul>

  <h2>Elige tu capa</h2>
  <p>La mayoría querrá la Layer 4 — componentes compuestos — y un bundle de locale:</p>
  <pre><code>pnpm add @kumiki/components @kumiki/locale</code></pre>

  <p>
    ¿Necesitas control total del DOM? Salta los componentes y consume directamente los attachments
    de Layer 3:
  </p>
  <pre><code>pnpm add @kumiki/headless</code></pre>

  <p>
    ¿Estás construyendo tus propias primitivas? Puedes usar cualquier máquina de estado por
    separado:
  </p>
  <pre><code>pnpm add @kumiki/machines</code></pre>

  <h2>Proporciona un locale</h2>
  <p>
    Envuelve tu app en <code>LocaleProvider</code> una vez. Cada componente Kumiki por debajo recoge los
    mensajes y la dirección de lectura.
  </p>
  <pre><code
      >{`<script lang="ts">
  import { LocaleProvider } from '@kumiki/components';
  import { messages, direction } from '@kumiki/locale/es';

  let { children } = $props();
<\/script>

<LocaleProvider.Root locale="es" {messages} dir={direction}>
  {@render children()}
</LocaleProvider.Root>`}</code
    ></pre>

  <p>
    Los bundles de locale son imports por subpath — cada uno pesa ≤ 1 KB brotli. Cambia el idioma en
    runtime intercambiando el bundle de <code>messages</code>; los componentes recalculan su texto
    ARIA automáticamente.
  </p>

  <h2>Verifica la instalación</h2>
  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="Silenciar audio">
  {pressed ? 'Silenciado' : 'Activado'}
</Toggle.Root>`}</code
    ></pre>

  <p>Eso es todo. Pásate al <a href="/components">catálogo de componentes</a>.</p>
</Prose>
