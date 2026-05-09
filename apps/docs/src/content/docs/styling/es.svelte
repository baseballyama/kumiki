<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);

  const stack = [
    {
      layer: 'Línea base de producto',
      tool: 'Selectores globales CSS [data-component*]',
      use: 'Reglas tipo reset compartidas por todo Dialog',
    },
    {
      layer: 'Piezas del design system',
      tool: 'Pass-through de class a subcomponentes',
      use: 'Estilos estructurales para <MyDialog>',
    },
    {
      layer: 'Variante / tema',
      tool: 'CSS Custom Properties',
      use: 'Colores de marca, cambio claro / oscuro',
    },
    {
      layer: 'Diferencias de estado',
      tool: 'Selectores data-state (o Tailwind data-[state=open]:)',
      use: 'Abierto / cerrado, seleccionado, deshabilitado, hover',
    },
    {
      layer: 'Cambio de elemento',
      tool: 'snippet child',
      use: 'Renderizar <a> o <MyButton> como elemento raíz',
    },
  ];
</script>

<svelte:head>
  <title>Estilos · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Fundamentos — 07"
  title="Estilos"
  lede="Kumiki Layer 4 envía cero bytes de CSS. Por qué lo construimos así, cómo vestirlo, y cómo navegar los límites de los estilos scoped de Svelte — cinco recetas y un escollo."
>
  <PreviewFrame>
    <div style="display: flex; gap: 16px; align-items: center;">
      <Toggle.Root bind:pressed aria-label="Silenciar">
        {pressed ? 'Silenciado' : 'Activado'}
      </Toggle.Root>
      <span style="font-family: var(--k-font-mono); font-size: 12px; color: var(--k-ink-3);">
        pressed = {pressed}
      </span>
    </div>
  </PreviewFrame>

  <h2>Por qué Kumiki no envía estilos</h2>
  <p>
    Layer 4 emite solo <strong>DOM semántico + ARIA + atributos <code>data-*</code></strong>. Es
    deliberado:
  </p>
  <ul>
    <li>
      <strong>Presupuestos de bundle</strong>: Toggle 1.5 KB / Dialog 3.5 KB / Combobox 4.5 KB no
      dejan espacio para CSS.
    </li>
    <li>
      <strong>Los design systems varían</strong>: Tailwind / UnoCSS / CSS vanilla / CSS-in-JS — al
      no decidir nada, encajamos con todos.
    </li>
    <li>
      <strong>La animación también es CSS</strong>: solo emitimos
      <code>data-state="open|closed"</code>; tú eliges entre CSS Transitions, View Transitions o una
      librería de motion.
    </li>
  </ul>

  <p>
    Así que compones estilos con <strong>cinco técnicas</strong>. Listadas por orden de preferencia.
  </p>

  <h2>Receta 1: selectores <code>data-*</code> (la ruta canónica para estilos por estado)</h2>
  <p>Lee los atributos emitidos por Kumiki vía selectores CSS. Patrón probado por Radix.</p>

  <table class="attrs">
    <thead>
      <tr><th>Atributo</th><th>Valores</th><th>Dónde aparece</th></tr>
    </thead>
    <tbody>
      <tr
        ><td><code>data-state</code></td><td
          ><code>open</code> / <code>closed</code> / <code>opening</code> / <code>closing</code> /
          <code>on</code>
          / <code>off</code></td
        ><td>Dialog, Toggle, Tooltip, Popover</td></tr
      >
      <tr
        ><td><code>data-orientation</code></td><td
          ><code>horizontal</code> / <code>vertical</code></td
        ><td>Tabs, RadioGroup, Slider</td></tr
      >
      <tr
        ><td><code>data-side</code></td><td
          ><code>top</code> / <code>right</code> / <code>bottom</code> / <code>left</code></td
        ><td>Elementos de posición flotante</td></tr
      >
      <tr
        ><td><code>data-direction</code></td><td><code>ltr</code> / <code>rtl</code></td><td
          >Inversión RTL</td
        ></tr
      >
      <tr
        ><td><code>data-disabled</code></td><td>(cadena vacía)</td><td>Estado deshabilitado</td></tr
      >
      <tr
        ><td><code>data-checked</code></td><td
          ><code>true</code> / <code>false</code> / <code>mixed</code></td
        ><td>Checkbox / Toggle / Switch</td></tr
      >
      <tr
        ><td><code>data-component</code> / <code>data-component-host</code></td><td
          ><code>combobox</code> / <code>dialog</code> / …</td
        ><td>Identifica el elemento raíz del componente</td></tr
      >
      <tr
        ><td><code>data-component-part</code></td><td
          ><code>title</code> / <code>close</code> / <code>overlay</code> / …</td
        ><td>Identifica elementos de subcomponentes</td></tr
      >
    </tbody>
  </table>

  <pre><code
      >{`/* hoja de estilos global */
[data-state='on'] { background: var(--ds-accent); color: white; }
[data-state='off'] { background: var(--ds-surface-2); }
[data-state='open'] { animation: fade-in 200ms; }
[data-state='closed'] { animation: fade-out 150ms; }`}</code
    ></pre>

  <p>Lo mismo con utilidades Tailwind / UnoCSS:</p>
  <pre><code
      >{`<Toggle.Root class="bg-gray-200 data-[state=on]:bg-blue-500 data-[state=on]:text-white" />`}</code
    ></pre>

  <h2>Receta 2: pass-through de <code>class</code> / <code>style</code></h2>
  <p>
    Los subcomponentes de Layer 4 son <strong
      >wrappers finos de un solo elemento que propagan <code>...rest</code></strong
    >. Lo que pases — <code>class</code>, <code>style</code>, <code>data-*</code> adicionales, atributos
    ARIA extra — aterriza sobre la raíz DOM real.
  </p>

  <pre><code
      >{`<Toggle.Root class="ds-toggle" style="--ring-color: var(--ds-accent)">
  Silenciar
</Toggle.Root>`}</code
    ></pre>

  <p>
    Referencia de implementación: <code>packages/components/src/toggle/Root.svelte</code> declara
    <code>[key: string]: unknown</code>
    en su tipo Props y propaga <code>...rest</code> directamente sobre su
    <code>&lt;button&gt;</code>.
  </p>

  <h2>Receta 3: CSS Custom Properties (la ruta canónica para propagar tema)</h2>
  <p>
    A diferencia del CSS scoped de Svelte, <strong
      >las variables CSS fluyen por la cascada normal</strong
    >. Declaradas en el padre, llegan al DOM dentro de los componentes hijos — saltándose por
    completo la barrera de scope de Svelte.
  </p>

  <pre><code
      >{`<Combobox.Root style="
  --combobox-bg: var(--ds-surface);
  --combobox-border: var(--ds-line-strong);
">
  <Combobox.Input class="ds-input" />
</Combobox.Root>

<style>
  /* el style scoped de MyCombobox.svelte — alcanza el <input> interno del hijo */
  .ds-input {
    background: var(--combobox-bg);
    border: 1px solid var(--combobox-border);
  }
</style>`}</code
    ></pre>

  <p>
    <strong>Úsalo para:</strong> colores de marca, alternancia de modo oscuro, tokens que necesiten cruzar
    fronteras de componentes.
  </p>

  <h2>Receta 4: snippet <code>child</code> — cambio de elemento</h2>
  <p>
    Por defecto <code>Toggle.Root</code> renderiza un <code>&lt;button&gt;</code>. La salida de
    emergencia para «aquí quiero un <code>&lt;a&gt;</code>» o «quiero mi propio
    <code>&lt;MyButton&gt;</code>».
  </p>

  <pre><code
      >{`<Toggle.Root bind:pressed>
  {#snippet child({ props, state })}
    <MyButton {...props} class="brand-btn" disabled={state.disabled}>
      {state.pressed ? 'Silenciado' : 'Activado'}
    </MyButton>
  {/snippet}
</Toggle.Root>`}</code
    ></pre>

  <p>
    <code>props</code> está totalmente tipado: <code>type</code> / <code>aria-pressed</code> /
    <code>aria-disabled</code>
    / <code>data-state</code> / <code>onclick</code> / <code>onkeydown</code> / <code>id</code>. Tu
    trabajo es propagarlo en tu elemento.
  </p>

  <p class="note">
    <strong>No recurras a esto por defecto.</strong> <code>child</code> es una salida de emergencia,
    no la ruta de estilos estándar. Si un pass-through de <code>class</code> lo cubre, prefiérelo —
    y recuerda que volver a propagar <code>props</code> es responsabilidad tuya (olvidarlo pierde la cableado
    ARIA / eventos).
  </p>

  <h2>Receta 5: Tailwind / UnoCSS / CSS vanilla</h2>

  <h3>Tailwind v4</h3>
  <pre><code
      >{`<Toggle.Root class="
  inline-flex items-center px-3 py-2 rounded-md
  bg-gray-200 text-gray-700
  data-[state=on]:bg-blue-600 data-[state=on]:text-white
  data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
" />`}</code
    ></pre>

  <h3>UnoCSS (modo por defecto)</h3>
  <p>
    Experiencia de autoría idéntica a Tailwind. La variante <code>data-[state=on]:</code> está
    integrada vía <code>@unocss/preset-mini</code> / <code>preset-wind3</code>.
  </p>

  <h3>UnoCSS modo svelte-scoped</h3>
  <p>
    <code>@unocss/svelte-scoped</code> escanea cada <code>.svelte</code> padre y luego inyecta el
    CSS generado <strong>envuelto en <code>:global(...)</code></strong> en el
    <code>&lt;style&gt;</code> de ese fichero. Como las reglas son globales, las utilidades que escribiste
    en el padre alcanzan el DOM dentro de los componentes hijos sin trabajo extra.
  </p>

  <h3>CSS vanilla / CSS Modules</h3>

  <pre><code
      >{`/* app.css (global) */
.ds-toggle {
  display: inline-flex; align-items: center;
  padding: 8px 12px; border-radius: 6px;
  background: var(--ds-surface-2); color: var(--ds-ink);
}
.ds-toggle[data-state='on'] {
  background: var(--ds-accent); color: white;
}
.ds-toggle[data-disabled] { opacity: 0.5; cursor: not-allowed; }`}</code
    ></pre>

  <pre><code>{`<Toggle.Root class="ds-toggle">Silenciar</Toggle.Root>`}</code></pre>

  <h2>Patrón: construir un design system encima</h2>
  <p>
    Envuelve Kumiki en tu propio <code>&lt;MyToggle&gt;</code> para reutilización en todo el producto.
  </p>

  <pre><code
      >{`<!-- src/lib/components/MyToggle.svelte -->
<script lang="ts">
  import { Toggle } from '@kumiki/components';
  import type { Snippet } from 'svelte';

  type Props = {
    pressed?: boolean;
    'aria-label': string;
    children: Snippet;
  };
  let { pressed = $bindable(false), 'aria-label': ariaLabel, children }: Props = $props();
<\/script>

<Toggle.Root bind:pressed aria-label={ariaLabel} class="ds-toggle">
  {@render children()}
</Toggle.Root>

<style>
  /* Receta 2 — el pass-through de class implica que este style scoped llega al DOM real */
  :global(.ds-toggle) {
    display: inline-flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    background: var(--ds-surface-2);
    transition: background 120ms;
  }
  :global(.ds-toggle[data-state='on']) {
    background: var(--ds-accent);
    color: white;
  }
</style>`}</code
    ></pre>

  <p>Lado del consumidor:</p>
  <pre><code
      >{`<script lang="ts">
  import MyToggle from '$lib/components/MyToggle.svelte';
  let muted = $state(false);
<\/script>

<MyToggle bind:pressed={muted} aria-label="Silenciar">
  {muted ? 'Silenciado' : 'Activado'}
</MyToggle>`}</code
    ></pre>

  <h2>Escollo: el <code>&lt;style&gt;</code> scoped de Svelte no se propaga a hijos</h2>
  <p>
    Restricción de Svelte de larga data: las clases definidas en el <code>&lt;style&gt;</code> de un
    <code>.svelte</code>
    padre <strong>no llegan a los elementos DOM dentro de componentes hijos</strong>.
  </p>

  <pre><code
      >{`<!-- No funciona como esperarías -->
<Combobox.Root class="my-combo">
  <Combobox.Input />
</Combobox.Root>

<style>
  /* .my-combo no se usa en la plantilla de este fichero, así que Svelte
     puede eliminarlo, y el <input> descendiente vive en el scope de otro componente. */
  .my-combo input { padding: 8px; }
</style>`}</code
    ></pre>

  <p>Cuatro salidas:</p>
  <ol>
    <li>
      <strong>Usa Tailwind / UnoCSS / hoja de estilos global</strong> (recetas 1, 5). De entrada no
      son scoped, así que el problema no existe. <strong>Recomendación de primera línea.</strong>
    </li>
    <li>
      <strong>Pasa una <code>class</code> a cada subcomponente</strong> (receta 2).
      <code>&lt;Combobox.Input class="ds-input" /&gt;</code>
      aterriza la clase en el elemento raíz del hijo. Dentro del <code>&lt;style&gt;</code> del
      padre escribirías <code>:global(.ds-input)</code> (o mueve la regla a <code>app.css</code>).
    </li>
    <li>
      <strong>CSS Custom Properties</strong> (receta 3). Pasan por encima del scoping de Svelte. Lo mejor
      para propagar tema.
    </li>
    <li>
      <strong>Perforación con <code>:global(...)</code></strong>. Último recurso.
      <pre><code
          >{`<style>
  .my-combo :global([data-component-part='item'][data-highlighted]) {
    background: var(--ds-accent-subtle);
  }
</style>`}</code
        ></pre>
      Svelte 5 también soporta la sintaxis de bloque<code>:global &#123; ... &#125;</code>.
    </li>
  </ol>

  <h2>Stack recomendado</h2>
  <table class="stack">
    <thead>
      <tr><th>Capa</th><th>Herramienta</th><th>Uso</th></tr>
    </thead>
    <tbody>
      {#each stack as row (row.layer)}
        <tr>
          <td class="layer">{row.layer}</td>
          <td><code>{row.tool}</code></td>
          <td class="use">{row.use}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <h2>Qué leer después</h2>
  <ul>
    <li>
      <a href="/docs/layers-by-example">Capas por ejemplo</a> — cómo difiere el código de usuario en Layer
      2/3/4/5.
    </li>
    <li>
      <a href="/docs/composition">Composición</a> — añadir características opcionales con wrappers
      <code>with*</code>.
    </li>
    <li>
      <a href="/docs/i18n">i18n y RTL</a> — usar <code>data-direction</code> para estilos RTL.
    </li>
  </ul>
</Prose>

<style>
  table.attrs,
  table.stack {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 13px;
  }
  table.attrs th,
  table.attrs td,
  table.stack th,
  table.stack td {
    padding: 10px 12px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: middle;
  }
  table.attrs th,
  table.stack th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    border-block-end-color: var(--k-line-2);
    font-weight: 500;
  }
  table.stack .layer {
    color: var(--k-ink-2);
    font-weight: 500;
  }
  table.stack .use,
  table.attrs td:last-child {
    color: var(--k-ink-3);
  }
  table.attrs code,
  table.stack code {
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
