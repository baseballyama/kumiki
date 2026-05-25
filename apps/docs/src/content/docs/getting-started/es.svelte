<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>Introducción · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Primeros pasos — 01"
  title="Introducción"
  lede="Kumiki — 組木 — es un sistema de primitivas UI para Svelte 5 con accesibilidad profunda. Existe porque la pregunta «hagamos este componente accesible, internacionalizable, tematizable y ligero» no debería responderse cincuenta veces en cincuenta repositorios distintos."
>
  <h2>¿Por qué Kumiki?</h2>
  <p>
    La mayoría de las librerías de componentes accesibles eligen un compromiso y se quedan ahí.
    Algunas son headless y te dejan cablear ARIA tú mismo. Otras vienen con estilos y te imponen un
    sistema de diseño completo. Algunas te atan a una librería de máquinas de estado; otras no
    tienen ninguna. Kumiki rechaza el compromiso: cinco capas componibles, cada una utilizable de
    forma independiente.
  </p>

  <ul>
    <li>
      <strong>Layer 0 — Types.</strong> Una superficie TypeScript compartida que toda capa superior habla.
    </li>
    <li>
      <strong>Layer 1 — Primitives.</strong> Helpers agnósticos al framework (focus trap, dismissable,
      ID, locale).
    </li>
    <li>
      <strong>Layer 2 — Machines.</strong> Máquinas de estado finitas en TS puro. ~1 KB de runtime, JSON
      totalmente inspeccionable.
    </li>
    <li>
      <strong>Layer 3 — Attachments.</strong> Fábricas <code>{'{@attach}'}</code> que conducen ARIA
      y
      <code>data-state</code> en nodos DOM reales.
    </li>
    <li>
      <strong>Layer 4 — Components.</strong> Primitivas compuestas como
      <code>{`<Combobox.Root>`}</code>, ergonómicas por defecto.
    </li>
    <li>
      <strong>Layer 5 — Atelier.</strong> Variantes con estilo, listas para copiar y pegar. Se
      publica en <code>0.x-preview</code>.
    </li>
  </ul>

  <h2>Estado</h2>
  <p>
    Kumiki está en <strong>pre-alfa</strong>. La arquitectura está bloqueada, los presupuestos de
    bundle se aplican en CI, y los chequeos nocturnos con lectores de pantalla están corriendo —
    pero aún no se ha publicado ninguna versión en npm. Espera que la API cambie. Reporta issues en
    <a href="https://github.com/baseballyama/kumiki/issues">baseballyama/kumiki</a>.
  </p>

  <h2>A continuación</h2>
  <p>
    Siguiente parada: <a href={resolve('/docs/installation')}>instalación</a> o
    <a href={resolve('/docs/architecture')}>arquitectura</a>. Si prefieres ver las cosas
    funcionando,
    <a href={resolve('/components')}>explora los componentes</a>.
  </p>
</Prose>
