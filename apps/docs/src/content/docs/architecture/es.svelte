<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';

  const layers = [
    {
      n: 0,
      ji: '型',
      name: 'Types',
      pkg: '@kumiki/types',
      role: 'Superficie TypeScript compartida — lo único en lo que toda capa superior coincide.',
    },
    {
      n: 1,
      ji: '基',
      name: 'Primitives',
      pkg: '@kumiki/primitives',
      role: 'Helpers agnósticos al framework (focus trap, dismissable, ID, locale, motion).',
    },
    {
      n: 2,
      ji: '機',
      name: 'Machines',
      pkg: '@kumiki/machines',
      role: 'Máquinas de estado finitas en TS puro. ~1 KB de runtime, JSON inspeccionable.',
    },
    {
      n: 3,
      ji: '装',
      name: 'Attachments',
      pkg: '@kumiki/headless',
      role: 'Fábricas {@attach} de Svelte 5 — conducen ARIA + data-state en DOM real.',
    },
    {
      n: 4,
      ji: '組',
      name: 'Components',
      pkg: '@kumiki/components',
      role: 'Primitivas compuestas. API ergonómica con espacio de nombres por punto.',
    },
    {
      n: 5,
      ji: '釉',
      name: 'Atelier',
      pkg: '@kumiki/atelier',
      role: 'Vista previa de Layer 5 — variantes con estilo para copiar y pegar.',
    },
  ];
</script>

<svelte:head>
  <title>Arquitectura · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Fundamentos — 01"
  title="Cinco capas, un modelo mental."
  lede="Cada primitiva de Kumiki vive en exactamente una capa. Elige la capa que se ajuste a tu necesidad de control — y envía solo los bytes de esa capa. Los exports por subpath mantienen el tree-shaking quirúrgico."
>
  <p>
    Los nombres se prestan del ensamblaje <em>Kumiki</em>. Cada capa es una pieza que encaja con la
    siguiente sin clavos ni cola.
  </p>

  <table class="layers">
    <thead>
      <tr>
        <th>L</th>
        <th>Nombre</th>
        <th>Paquete</th>
        <th>Rol</th>
      </tr>
    </thead>
    <tbody>
      {#each layers as l (l.n)}
        <tr>
          <td class="num">L{l.n}</td>
          <td><span class="ji">{l.ji}</span><strong>{l.name}</strong></td>
          <td><code>{l.pkg}</code></td>
          <td class="role">{l.role}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <h2>Elige una capa</h2>
  <p>La mayoría de las apps viven en Layer 4. Bájate solo cuando necesites:</p>
  <ul>
    <li>
      <strong>Layer 3 (attachments)</strong> cuando controlas el DOM con precisión — estás estilando
      con un <code>&lt;button&gt;</code> nativo, no con un wrapper de Svelte.
    </li>
    <li>
      <strong>Layer 2 (machines)</strong> para validación SSR / server-side, o para correr la lógica en
      un contexto no-Svelte (Cypress, Vitest, un worker).
    </li>
    <li>
      <strong>Layer 1 (primitives)</strong> cuando estás escribiendo tu propio componente sobre los motores
      dismissable / focus-trap / ID.
    </li>
  </ul>

  <h2>¿Por qué no traerlo todo?</h2>
  <p>
    Presupuestos de bundle. Cada subpath tiene un presupuesto brotli aplicado en CI — Toggle envía
    1,5 KB, Combobox 4,5 KB. Traer las variantes con estilo de Layer 5 a un proyecto que ya tiene
    sus propios design tokens son bytes desperdiciados; el paquete Atelier es opt-in, no la opción
    por defecto.
  </p>

  <h2>Lectura autorizada</h2>
  <p>
    Los documentos internos de diseño viven en
    <a href="https://github.com/baseballyama/kumiki/tree/main/docs/design">/docs/design</a>.
    Especialmente:
  </p>
  <ul>
    <li><code>02-architecture.md</code> — este modelo de capas, con diagramas.</li>
    <li><code>03-package-structure.md</code> — fronteras de paquetes.</li>
    <li><code>04-state-machines.md</code> — la especificación del runtime FSM.</li>
    <li><code>09-bundle-budget.md</code> — los presupuestos brotli por subpath.</li>
  </ul>
</Prose>

<style>
  table.layers {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 14px;
  }
  table.layers th,
  table.layers td {
    padding: 12px 14px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: middle;
  }
  table.layers th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    border-block-end-color: var(--k-line-2);
    font-weight: 500;
  }
  table.layers .num {
    color: var(--k-shu);
    font-family: var(--k-font-mono);
    font-size: 12px;
    width: 5%;
  }
  table.layers .ji {
    font-family: var(--k-font-display);
    font-size: 22px;
    color: var(--k-ink-1);
    margin-inline-end: 8px;
    font-variation-settings:
      'opsz' 36,
      'SOFT' 30;
  }
  table.layers .role {
    color: var(--k-ink-3);
  }
  table.layers code {
    font-size: 11px;
  }
</style>
