<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';

  const layers = [
    {
      n: 0,
      ji: '型',
      name: 'Types',
      pkg: '@kumiki/types',
      role: 'Geteilte TypeScript-Oberfläche — das Einzige, worauf sich jede höhere Schicht einigt.',
    },
    {
      n: 1,
      ji: '基',
      name: 'Primitives',
      pkg: '@kumiki/primitives',
      role: 'Framework-unabhängige Helfer (Focus-Trap, Dismissable, ID, Locale, Motion).',
    },
    {
      n: 2,
      ji: '機',
      name: 'Machines',
      pkg: '@kumiki/machines',
      role: 'Reine TS-Zustandsautomaten. ~1 KB Runtime, inspizierbares JSON.',
    },
    {
      n: 3,
      ji: '装',
      name: 'Attachments',
      pkg: '@kumiki/headless',
      role: 'Svelte-5-{@attach}-Fabriken — treiben ARIA + data-state am echten DOM an.',
    },
    {
      n: 4,
      ji: '組',
      name: 'Components',
      pkg: '@kumiki/components',
      role: 'Zusammengesetzte Primitive. Ergonomische API mit Punkt-Namespace.',
    },
    {
      n: 5,
      ji: '釉',
      name: 'Atelier',
      pkg: '@kumiki/atelier',
      role: 'Layer-5-Vorschau — kopierbare gestylte Varianten.',
    },
  ];
</script>

<svelte:head>
  <title>Architektur · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Grundlagen — 01"
  title="Fünf Schichten, ein mentales Modell."
  lede="Jede Kumiki-Primitive lebt in genau einer Schicht. Wähle die Schicht, die zu deinem Steuerungs­bedarf passt — und liefere nur die Bytes dieser Schicht aus. Subpath-Exports halten das Tree-Shaking chirurgisch."
>
  <p>
    Die Namen leihen sich von der <em>Kumiki</em>-Holzverbindung. Jede Schicht ist ein Teil, das
    sich ohne Nägel oder Leim ins nächste fügt.
  </p>

  <table class="layers">
    <thead>
      <tr>
        <th>L</th>
        <th>Name</th>
        <th>Paket</th>
        <th>Rolle</th>
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

  <h2>Eine Schicht wählen</h2>
  <p>Die meisten Apps leben in Layer 4. Geh nur tiefer, wenn du:</p>
  <ul>
    <li>
      <strong>Layer 3 (Attachments)</strong>, wenn du das DOM eng kontrollierst — du stylst mit
      einem nativen <code>&lt;button&gt;</code>, nicht mit einem Svelte-Wrapper.
    </li>
    <li>
      <strong>Layer 2 (Machines)</strong> für SSR / serverseitige Validierung oder zum Ausführen der Logik
      in einem Nicht-Svelte-Kontext (Cypress, Vitest, ein Worker).
    </li>
    <li>
      <strong>Layer 1 (Primitives)</strong>, wenn du deine eigene Komponente auf den Dismissable- /
      Focus-Trap- / ID-Engines schreibst.
    </li>
  </ul>

  <h2>Warum nicht alles reinholen?</h2>
  <p>
    Bundle-Budgets. Jeder Subpath hat ein in der CI erzwungenes Brotli-Budget — Toggle wiegt 1,5 KB,
    Combobox 4,5 KB. Layer-5-Style-Varianten in ein Projekt zu ziehen, das bereits eigene
    Design-Tokens hat, sind verschwendete Bytes; das Atelier-Paket ist opt-in, nicht der Standard.
  </p>

  <h2>Maßgebliche Lektüre</h2>
  <p>
    Die internen Design-Dokumente liegen unter
    <a href="https://github.com/baseballyama/kumiki/tree/main/docs/design">/docs/design</a>.
    Besonders bemerkenswert:
  </p>
  <ul>
    <li><code>02-architecture.md</code> — dieses Schichtenmodell, mit Diagrammen.</li>
    <li><code>03-package-structure.md</code> — Paketgrenzen.</li>
    <li><code>04-state-machines.md</code> — die FSM-Runtime-Spezifikation.</li>
    <li><code>09-bundle-budget.md</code> — die Brotli-Budgets pro Subpath.</li>
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
