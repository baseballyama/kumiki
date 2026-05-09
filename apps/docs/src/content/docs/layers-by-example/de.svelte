<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);

  const matrix = [
    { task: 'FSM (Zustandsübergänge)', l2: 'Kumiki', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'Svelte-Reaktivitätsbrücke', l2: 'Du', l3: 'Du*', l4: 'Kumiki', l5: 'Kumiki' },
    { task: '<button>-Element', l2: 'Du', l3: 'Du', l4: 'Kumiki', l5: 'Kopiert' },
    {
      task: 'ARIA-Attribute (aria-pressed, …)',
      l2: 'Du',
      l3: 'Kumiki',
      l4: 'Kumiki',
      l5: 'Kumiki',
    },
    { task: 'data-state-Ausgabe', l2: 'Du', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'Klick-/Tasten-Handling', l2: 'Du', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'Zugänglicher Name (aria-label)', l2: 'Du', l3: 'Du', l4: 'Du', l5: 'Kumiki' },
    { task: 'Styling', l2: 'Du', l3: 'Du', l4: 'Du', l5: 'Kopiert' },
  ];
</script>

<svelte:head>
  <title>Schichten am Beispiel — Toggle · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Grundlagen — 06"
  title="Schichten am Beispiel: Toggle"
  lede="Derselbe Toggle, geschrieben in Layer 2, 3, 4 und 5 — nebeneinander beobachtet. Jeder Schritt nach unten im Stack gibt dir etwas mehr Kontrolle und etwas mehr Verantwortung."
>
  <p>
    Kumikis Schichten zeigen alle <strong
      >dasselbe Verhalten auf unterschiedlichen Abstraktionsebenen</strong
    >. Eine Schicht tiefer: du übernimmst mehr DOM, ARIA und Event-Plumbing — gewinnst aber Freiheit
    in der Strukturwahl. Eine Schicht höher: weniger Code, dafür akzeptierst du Kumikis strukturelle
    Entscheidungen.
  </p>

  <p>
    Wir nutzen <a href="/components/component-toggle">Toggle</a> als durchgearbeitetes Beispiel. Das
    Verhalten ist einfach (drücken zum Umschalten), aber die Implementierung existiert in
    <strong>allen vier Schichten</strong>, was den direkten Vergleich ideal macht.
  </p>

  <PreviewFrame>
    <div style="display: flex; gap: 16px; align-items: center;">
      <Toggle.Root bind:pressed aria-label="Stummschalten">
        {pressed ? 'Stumm' : 'An'}
      </Toggle.Root>
      <span style="font-family: var(--k-font-mono); font-size: 12px; color: var(--k-ink-3);">
        pressed = {pressed}
      </span>
    </div>
  </PreviewFrame>

  <h2>1. Layer 4 — Zusammengesetzte Komponente (Standard-Einstieg)</h2>
  <p>
    Der kürzeste Weg. <code>Toggle.Root</code> rendert das <code>&lt;button&gt;</code>, verwaltet
    ARIA, <code>data-state</code>, Tastatur und SSR. Du bist für <strong>zwei Dinge</strong>
    verantwortlich: Zustand via <code>bind:pressed</code> empfangen und ein
    <code>aria-label</code> (oder sichtbares Label) liefern.
  </p>

  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="Stummschalten">
  {pressed ? 'Stumm' : 'An'}
</Toggle.Root>`}</code
    ></pre>

  <p>Resultierendes DOM:</p>

  <pre><code
      >{`<button type="button" aria-pressed="false" data-state="off" id="toggle-…">
  An
</button>`}</code
    ></pre>

  <p>
    <strong>Wähle das, wenn:</strong> 90 % der Fälle. Der native <code>&lt;button&gt;</code> reicht, du
    musst die umhüllende Struktur nicht ersetzen.
  </p>

  <h2>2. Layer 3 — Headless Attachment</h2>
  <p>
    Wenn du das Element selbst wählen musst (ein <code>&lt;a&gt;</code>, ein
    <code>&lt;div role="button"&gt;</code>, ein eigener Wrapper). <code>createToggle()</code> gibt
    eine <code>{`{@attach}`}</code>-kompatible Fabrik zurück, die du auf jedem beliebigen Element
    verteilen kannst.
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggle } from '@kumiki/headless/toggle';

  const t = createToggle({ initial: false });

  // controller.pressed ist ein einfacher Getter. Um es als Text anzuzeigen, musst
  // du subscriben und in $state spiegeln. (Nicht nötig, wenn CSS alles erledigt.)
  let pressed = $state(t.pressed);
  $effect(() => t.subscribe(({ context }) => (pressed = context.pressed)));
<\/script>

<button {@attach t.root} aria-label="Stummschalten" class="my-btn">
  {pressed ? 'Stumm' : 'An'}
</button>`}</code
    ></pre>

  <p>
    Beim Mounten schreibt <code>{`{@attach t.root}`}</code> die DOM-seitigen Attribute (<code
      >type</code
    >, <code>aria-pressed</code>, <code>data-state</code>, <code>id</code>) und verdrahtet Klick +
    Tasten (Leertaste / Eingabe). <strong>Was zu deinen Aufgaben hinzukommt:</strong>
    Element wählen, Styling, sichtbares Label und (nur bei Bedarf) ein <code>subscribe</code>, um
    den Zustand in reaktive Locals zu spiegeln.
  </p>

  <p>
    <strong>Wähle das, wenn:</strong> Layer 4s feste Struktur (<code>&lt;button&gt;</code>) nicht
    passt. Etwa wenn der Toggle in einem <code>&lt;label&gt;</code> stecken oder in eine eigene Higher-Order-Hülle
    gewickelt werden muss.
  </p>

  <h2>3. Layer 2 — Reine Maschine</h2>
  <p>
    Gar kein Svelte — eine reine TypeScript-Zustandsautomatik. <strong
      >Du schreibst DOM, ARIA, Events und Tastatur selbst.</strong
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
  aria-label="Stummschalten"
  onclick={() => m.send({ type: 'TOGGLE' })}
>
  {pressed ? 'Stumm' : 'An'}
</button>`}</code
    ></pre>

  <p>
    <strong
      >Der Grund, auf Layer 2 zu fallen, ist meist nicht UI — sondern Logik-Wiederverwendung:</strong
    >
  </p>
  <ul>
    <li>Toggle-Logik serverseitig validieren (SvelteKit-Server-Routes / Workers).</li>
    <li>Reine FSM-Unit-Tests in Vitest schreiben (kein jsdom, ~20μs pro Übergang).</li>
    <li>
      Übergänge auf <a href="https://stately.ai/viz">stately.ai/viz</a> visualisieren (<code
        >machine.toJSON()</code
      > emittiert XState-kompatibles JSON).
    </li>
    <li>In Nicht-Svelte-Hosts einbetten (Vanilla JS, Web Components, ein anderes Framework).</li>
  </ul>

  <h2>4. Layer 5 — Atelier (kopierbare gestylte Varianten)</h2>
  <p>
    Das CLI kopiert die Quellen in dein Repo. Nach dem Kopieren gehören sie <strong>dir</strong> — bearbeite
    sie nach Belieben.
  </p>

  <pre><code
      >{`# Tailwind-v4-Variante
npx kumiki add toggle --variant=tailwind

# Vanilla-CSS-Variante
npx kumiki add toggle --variant=vanilla`}</code
    ></pre>

  <p>Hinzugefügte Dateien:</p>

  <pre><code
      >{`src/lib/components/Toggle.svelte   # gestylter Wrapper um Toggle.Root von Layer 4`}</code
    ></pre>

  <p>Verwende es wie jede andere Svelte-Komponente:</p>

  <pre><code
      >{`<script lang="ts">
  import Toggle from '$lib/components/Toggle.svelte';
  let pressed = $state(false);
<\/script>

<Toggle bind:pressed>Stumm</Toggle>`}</code
    ></pre>

  <p>
    <strong>Wähle das, wenn:</strong> du eine funktionierende visuelle Basis willst, ohne erst CSS
    zu schreiben. Layer 5 wird während der v1.0-Serie als <code>0.x.x-preview</code> ausgeliefert, daher
    bevorzugen stabilitätssensible Projekte Layer 4 + eigenes Styling.
  </p>

  <h2>Verantwortungsmatrix</h2>

  <p>Was du auf jeder Schicht schreibst. „Kumiki" = die Library erledigt es; „Du" = dein Code.</p>

  <table class="matrix">
    <thead>
      <tr>
        <th>Verantwortung</th>
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
          <td class:you={row.l2 === 'Du'} class:them={row.l2 === 'Kumiki'}>{row.l2}</td>
          <td class:you={row.l3.startsWith('Du')} class:them={row.l3 === 'Kumiki'}>{row.l3}</td>
          <td class:you={row.l4 === 'Du'} class:them={row.l4 === 'Kumiki'}>{row.l4}</td>
          <td class:them={row.l5 === 'Kumiki'}>{row.l5}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <p class="note">
    * Die Svelte-Reaktivitätsbrücke wird in L3 nur benötigt, wenn du
    <code>controller.pressed</code> als Text anzeigst. Erledigt CSS alles via
    <code>data-state</code>, ist kein <code>subscribe</code> nötig.
  </p>

  <h2>Eine Schicht wählen — Entscheidungsbaum</h2>

  <ul>
    <li>
      <strong>Du brauchst es jetzt sofort lauffähig mit Styles?</strong> → <strong>Layer 5</strong>
      (<code>npx kumiki add</code>). Hinweis: während v1.0 als Preview markiert.
    </li>
    <li>
      <strong>Standard-&lt;button&gt; reicht, du stylst selbst?</strong> → <strong>Layer 4</strong>
      (<code>{`<Toggle.Root>`}</code>). Der Standard-Einstieg.
    </li>
    <li>
      <strong>Du musst Element-Typ oder Struktur selbst wählen?</strong> → <strong>Layer 3</strong>
      (<code>{`{@attach t.root}`}</code>). Wenn das <code>child</code>-Snippet von Layer 4 deinen
      Bedarf deckt, bleib in Layer 4 — weniger Code.
    </li>
    <li>
      <strong>Außerhalb von Svelte / serverseitig validieren / nur die FSM?</strong> →
      <strong>Layer 2</strong>
      (<code>createToggleMachine</code>).
    </li>
  </ul>

  <h2>Was als Nächstes lesen</h2>
  <ul>
    <li>
      <a href="/docs/styling">Styling</a> — wie du <code>data-*</code>, <code>class</code>
      Pass-Through und das <code>child</code>-Snippet in Layer 4 nutzt.
    </li>
    <li><a href="/docs/architecture">Architektur</a> — das vollständige Fünf-Schichten-Modell.</li>
    <li>
      <a href="/docs/composition">Komposition</a> — optionale Features per
      <code>with*</code>-Wrapper hinzufügen.
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
