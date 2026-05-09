<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>Accesibilidad · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Fundamentos — 03"
  title="La versión larga de la accesibilidad."
  lede="axe-core captura un 30–40% de las violaciones WCAG. El otro 60% viene de pruebas de teclado APG y de ejecuciones reales con lectores de pantalla. Kumiki cierra el merge sobre las tres."
>
  <h2>Tres capas de pruebas</h2>

  <table class="strata">
    <thead>
      <tr>
        <th>Qué</th>
        <th>Cuándo</th>
        <th>Captura</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>axe-core</strong></td>
        <td>Cada PR — LTR & RTL × cada estado documentado</td>
        <td>Violaciones estáticas: etiquetas faltantes, contraste, validez del role.</td>
      </tr>
      <tr>
        <td><strong>Teclado APG</strong></td>
        <td>Cada PR — Playwright por patrón</td>
        <td>Orden de tab, navegación con flechas, semántica Home / End / Page, Escape.</td>
      </tr>
      <tr>
        <td><strong>Lectores Guidepup</strong></td>
        <td>Programación nocturna</td>
        <td>Lo que VoiceOver y NVDA dicen realmente, en el orden real.</td>
      </tr>
    </tbody>
  </table>

  <h2>Nombres requeridos a nivel de tipo</h2>
  <p>
    Donde la WAI-ARIA APG exige un nombre accesible (piensa en diálogos), TypeScript hace cumplir
    el requisito. <code>{`<Dialog.Root>`}</code> no compila sin uno de
    <code>title</code>, <code>aria-label</code> o <code>aria-labelledby</code>.
  </p>

  <pre><code
      >{`<Dialog.Root title="Confirmar eliminación">
  <!-- compila -->
</Dialog.Root>

<Dialog.Root>
  <!-- error de tipo: nombre accesible faltante -->
</Dialog.Root>`}</code
    ></pre>

  <h2>Contratos de teclado</h2>
  <p>
    Cada componente documenta su mapa de teclas en la página de detalle (pestaña
    <strong>Accesibilidad</strong>). Donde APG define un patrón, Kumiki lo sigue al pie de la letra
    — sin interpretación creativa.
  </p>

  <h2>Movimiento reducido, RTL, alto contraste</h2>
  <ul>
    <li>
      <code>prefers-reduced-motion</code> reduce todas las transiciones a ~10 ms en todo el sitio
      de docs.
    </li>
    <li>
      RTL no es un añadido. Los mapas de teclas sensibles a la dirección (Tabs, Slider) leen la
      dirección del contexto de la máquina, no del DOM.
    </li>
    <li>Se respeta el modo Forced-colors — los componentes evitan señalar estado solo con fondo.</li>
  </ul>

  <h2>La lista «Kumiki-ready»</h2>
  <p>
    Cada componente debe cumplir la lista en
    <a href="https://github.com/baseballyama/kumiki/blob/main/docs/design/05-accessibility.md"
      >docs/design/05-accessibility.md §5.6</a
    >
    antes del merge. Sin excepciones, sin flags <code>--ignore</code>.
  </p>
</Prose>

<style>
  table.strata {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 14px;
  }
  table.strata th,
  table.strata td {
    padding: 12px 14px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: top;
  }
  table.strata th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    font-weight: 500;
  }
  table.strata td {
    color: var(--k-ink-3);
  }
  table.strata td:first-child {
    color: var(--k-ink-1);
    width: 22%;
  }
  table.strata td:nth-child(2) {
    width: 32%;
  }
</style>
