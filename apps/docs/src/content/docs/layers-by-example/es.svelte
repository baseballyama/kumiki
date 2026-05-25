<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);

  const matrix = [
    {
      task: 'FSM (transiciones de estado)',
      l2: 'Kumiki',
      l3: 'Kumiki',
      l4: 'Kumiki',
      l5: 'Kumiki',
    },
    { task: 'Puente de reactividad de Svelte', l2: 'Tú', l3: 'Tú*', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'Elemento <button>', l2: 'Tú', l3: 'Tú', l4: 'Kumiki', l5: 'Copiado' },
    {
      task: 'Atributos ARIA (aria-pressed, …)',
      l2: 'Tú',
      l3: 'Kumiki',
      l4: 'Kumiki',
      l5: 'Kumiki',
    },
    { task: 'Salida de data-state', l2: 'Tú', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'Manejo de clic / teclas', l2: 'Tú', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'Nombre accesible (aria-label)', l2: 'Tú', l3: 'Tú', l4: 'Tú', l5: 'Kumiki' },
    { task: 'Estilos', l2: 'Tú', l3: 'Tú', l4: 'Tú', l5: 'Copiado' },
  ];
</script>

<svelte:head>
  <title>Capas por ejemplo — Toggle · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Fundamentos — 06"
  title="Capas por ejemplo: Toggle"
  lede="El mismo Toggle, escrito en Layer 2, 3, 4 y 5 — observado lado a lado. Cada paso hacia abajo del stack te da un poco más de control y un poco más de responsabilidad."
>
  <p>
    Las capas de Kumiki exponen <strong
      >el mismo comportamiento en distintos niveles de abstracción</strong
    >. Bajar una capa: asumes más DOM, ARIA y plomería de eventos — pero ganas libertad para elegir
    la estructura. Subir una capa: escribes menos código a cambio de aceptar las elecciones
    estructurales de Kumiki.
  </p>

  <p>
    Usamos <a href={resolve('/components/component-toggle')}>Toggle</a> como ejemplo trabajado. El
    comportamiento es simple (pulsar para alternar) pero la implementación está en
    <strong>las cuatro capas</strong>, ideal para una comparativa lado a lado.
  </p>

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

  <h2>1. Layer 4 — Componente compuesto (el punto de entrada por defecto)</h2>
  <p>
    El camino más corto. <code>Toggle.Root</code> renderiza el <code>&lt;button&gt;</code>, gestiona
    ARIA, <code>data-state</code>, teclado y SSR. Tú te encargas de <strong>dos cosas</strong>:
    recibir estado vía <code>bind:pressed</code> y proveer un <code>aria-label</code> (o etiqueta visible).
  </p>

  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="Silenciar">
  {pressed ? 'Silenciado' : 'Activado'}
</Toggle.Root>`}</code
    ></pre>

  <p>DOM resultante:</p>

  <pre><code
      >{`<button type="button" aria-pressed="false" data-state="off" id="toggle-…">
  Activado
</button>`}</code
    ></pre>

  <p>
    <strong>Elige esto cuando:</strong> el 90 % de los casos. El <code>&lt;button&gt;</code> nativo sirve
    y no necesitas sobrescribir la estructura envolvente.
  </p>

  <h2>2. Layer 3 — Attachment headless</h2>
  <p>
    Cuando necesitas elegir el elemento tú mismo (un <code>&lt;a&gt;</code>, un
    <code>&lt;div role="button"&gt;</code>, un wrapper personalizado). <code>createToggle()</code>
    devuelve una fábrica compatible con <code>{`{@attach}`}</code> que puedes propagar sobre el elemento
    que quieras.
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggle } from '@kumiki/headless/toggle';

  const t = createToggle({ initial: false });

  // controller.pressed es un getter llano. Para mostrarlo como texto debes
  // suscribirte y reflejarlo en $state. (No hace falta si CSS lo hace todo.)
  let pressed = $state(t.pressed);
  $effect(() => t.subscribe(({ context }) => (pressed = context.pressed)));
<\/script>

<button {@attach t.root} aria-label="Silenciar" class="my-btn">
  {pressed ? 'Silenciado' : 'Activado'}
</button>`}</code
    ></pre>

  <p>
    Al montar, <code>{`{@attach t.root}`}</code> escribe atributos del lado DOM (<code>type</code>,
    <code>aria-pressed</code>, <code>data-state</code>, <code>id</code>) y conecta listeners de clic
    + tecla (Espacio / Enter). <strong>Lo que se añade a tus responsabilidades:</strong> elegir el
    elemento, los estilos, la etiqueta visible y (solo si hace falta) un <code>subscribe</code> para reflejar
    el estado en variables reactivas.
  </p>

  <p>
    <strong>Elige esto cuando:</strong> la estructura fija de Layer 4 (<code>&lt;button&gt;</code>)
    no encaja. Por ejemplo, cuando necesitas el toggle dentro de un <code>&lt;label&gt;</code> o envuelto
    en una shell de orden superior.
  </p>

  <h2>3. Layer 2 — Máquina pura</h2>
  <p>
    Sin Svelte en absoluto — una máquina de estados finitos en TypeScript puro. <strong
      >Tú escribes el DOM, ARIA, eventos y teclado.</strong
    >
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggleMachine } from '@kumiki/machines/toggle';

  const m = createToggleMachine({ initial: false });
  let pressed = $state(m.context.pressed);
  m.subscribe(({ context }) => (pressed = context.pressed));
<\/script>

<button
  type="button"
  aria-pressed={pressed ? 'true' : 'false'}
  data-state={pressed ? 'on' : 'off'}
  aria-label="Silenciar"
  onclick={() => m.send({ type: 'TOGGLE' })}
>
  {pressed ? 'Silenciado' : 'Activado'}
</button>`}</code
    ></pre>

  <p>
    <strong>La razón para bajar a Layer 2 normalmente no es UI — es reutilización de lógica:</strong
    >
  </p>
  <ul>
    <li>Validar la lógica del Toggle en el servidor (server routes de SvelteKit / Workers).</li>
    <li>Escribir tests unitarios FSM puros en Vitest (sin jsdom, ~20μs por transición).</li>
    <li>
      Visualizar transiciones en <a href="https://stately.ai/viz">stately.ai/viz</a> (<code
        >machine.toJSON()</code
      > emite JSON compatible con XState).
    </li>
    <li>Embeber en hosts no-Svelte (vanilla JS, Web Components, otro framework).</li>
  </ul>

  <h2>4. Layer 5 — Atelier (variantes con estilo, copia y pega)</h2>
  <p>
    El CLI copia las fuentes a tu repo. Después de copiar son <strong>tu código</strong> — edítalas libremente.
  </p>

  <pre><code
      >{`# Variante Tailwind v4
npx kumiki add toggle --variant=tailwind

# Variante CSS vanilla
npx kumiki add toggle --variant=vanilla`}</code
    ></pre>

  <p>Archivos añadidos:</p>

  <pre><code
      >{`src/lib/components/Toggle.svelte   # wrapper estilizado alrededor de Toggle.Root de Layer 4`}</code
    ></pre>

  <p>Úsalo como cualquier componente Svelte:</p>

  <pre><code
      >{`<script lang="ts">
  import Toggle from '$lib/components/Toggle.svelte';
  let pressed = $state(false);
<\/script>

<Toggle bind:pressed>Silenciar</Toggle>`}</code
    ></pre>

  <p>
    <strong>Elige esto cuando:</strong> quieres una base visual funcional sin escribir CSS primero.
    Layer 5 se publica bajo <code>0.x.x-preview</code> durante la serie v1.0, así que para proyectos sensibles
    a la estabilidad prefiere Layer 4 + tu propio styling.
  </p>

  <h2>Matriz de responsabilidades</h2>

  <p>Lo que escribes en cada capa. «Kumiki» = lo gestiona la librería; «Tú» = tu código.</p>

  <table class="matrix">
    <thead>
      <tr>
        <th>Responsabilidad</th>
        <th>L2 (machine)</th>
        <th>L3 (headless)</th>
        <th>L4 (component)</th>
        <th>L5 (atelier)</th>
      </tr>
    </thead>
    <tbody>
      {#each matrix as row (row.task)}
        <tr>
          <td class="task">{row.task}</td>
          <td class:you={row.l2 === 'Tú'} class:them={row.l2 === 'Kumiki'}>{row.l2}</td>
          <td class:you={row.l3.startsWith('Tú')} class:them={row.l3 === 'Kumiki'}>{row.l3}</td>
          <td class:you={row.l4 === 'Tú'} class:them={row.l4 === 'Kumiki'}>{row.l4}</td>
          <td class:them={row.l5 === 'Kumiki'}>{row.l5}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <p class="note">
    * El puente de reactividad de Svelte solo es necesario en L3 si muestras
    <code>controller.pressed</code> como texto. Si CSS lo gestiona todo vía
    <code>data-state</code>, no hace falta <code>subscribe</code>.
  </p>

  <h2>Elegir una capa — árbol de decisión</h2>

  <ul>
    <li>
      <strong>¿Lo necesitas funcionando con estilos ya?</strong> → <strong>Layer 5</strong>
      (<code>npx kumiki add</code>). Nota: etiquetada como preview durante v1.0.
    </li>
    <li>
      <strong>¿El &lt;button&gt; estándar te vale y lo estilas tú?</strong> →
      <strong>Layer 4</strong>
      (<code>{`<Toggle.Root>`}</code>). Punto de entrada por defecto.
    </li>
    <li>
      <strong>¿Necesitas elegir tú el tipo o estructura del elemento?</strong> →
      <strong>Layer 3</strong>
      (<code>{`{@attach t.root}`}</code>). Si el snippet <code>child</code> de Layer 4 cubre tu caso,
      quédate en Layer 4 — es menos código.
    </li>
    <li>
      <strong>¿Ejecutas fuera de Svelte / validas en el servidor / solo quieres la FSM?</strong> →
      <strong>Layer 2</strong>
      (<code>createToggleMachine</code>).
    </li>
  </ul>

  <h2>Qué leer después</h2>
  <ul>
    <li>
      <a href={resolve('/docs/styling')}>Estilos</a> — cómo usar <code>data-*</code>, paso de
      <code>class</code> y el snippet <code>child</code> en Layer 4.
    </li>
    <li>
      <a href={resolve('/docs/architecture')}>Arquitectura</a> — el modelo completo de cinco capas.
    </li>
    <li>
      <a href={resolve('/docs/composition')}>Composición</a> — añadir características opcionales con
      wrappers
      <code>with*</code>.
    </li>
  </ul>
</Prose>

<style>
  table.matrix {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 13px;
  }
  table.matrix th,
  table.matrix td {
    padding: 10px 12px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: middle;
  }
  table.matrix th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    border-block-end-color: var(--k-line-2);
    font-weight: 500;
  }
  table.matrix .task {
    color: var(--k-ink-2);
    font-weight: 500;
  }
  table.matrix td.you {
    color: var(--k-shu);
    font-family: var(--k-font-mono);
    font-size: 12px;
  }
  table.matrix td.them {
    color: var(--k-ink-4);
    font-family: var(--k-font-mono);
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
