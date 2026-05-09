<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);

  const stack = [
    { layer: 'Produkt-Baseline', tool: 'Globale CSS [data-component*]-Selektoren', use: 'Reset-artige Regeln, geteilt über jedes Dialog' },
    { layer: 'Design-System-Teile', tool: 'class-Pass-through an Sub-Komponenten', use: 'Strukturelles Styling für <MyDialog>' },
    { layer: 'Variante / Theme', tool: 'CSS Custom Properties', use: 'Markenfarben, Hell-/Dunkel-Wechsel' },
    { layer: 'Zustands-Unterschiede', tool: 'data-state-Selektoren (oder Tailwind data-[state=open]:)', use: 'Offen / geschlossen, ausgewählt, deaktiviert, Hover' },
    { layer: 'Element-Tausch', tool: 'child-Snippet', use: '<a> oder <MyButton> als Wurzelelement rendern' },
  ];
</script>

<svelte:head>
  <title>Styling · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Grundlagen — 07"
  title="Styling"
  lede="Kumiki Layer 4 liefert null Bytes CSS aus. Warum wir es so gebaut haben, wie du es kleidest und wie du an Sveltes Scoped-Style-Grenzen vorbeinavigierst — fünf Rezepte und eine Falle."
>
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

  <h2>Warum Kumiki keine Styles liefert</h2>
  <p>Layer 4 emittiert nur <strong>semantisches DOM + ARIA + <code>data-*</code>-Attribute</strong>. Bewusst:</p>
  <ul>
    <li><strong>Bundle-Budgets</strong>: Toggle 1,5 KB / Dialog 3,5 KB / Combobox 4,5 KB lassen keinen Platz für CSS.</li>
    <li><strong>Design-Systeme variieren</strong>: Tailwind / UnoCSS / Vanilla CSS / CSS-in-JS — indem wir nichts entscheiden, passen wir zu allen.</li>
    <li><strong>Animation ist auch CSS</strong>: wir emittieren nur <code>data-state="open|closed"</code>; du wählst zwischen CSS-Transitions, View-Transitions oder einer Motion-Library.</li>
  </ul>

  <p>Du komponierst Styling also aus <strong>fünf Techniken</strong>. Hier in der Reihenfolge der Bevorzugung.</p>

  <h2>Rezept 1: <code>data-*</code>-Selektoren (der kanonische Weg für Zustands-Styling)</h2>
  <p>Lies Kumikis emittierte Attribute über CSS-Selektoren. Bewährtes Muster, etabliert von Radix.</p>

  <table class="attrs">
    <thead>
      <tr><th>Attribut</th><th>Werte</th><th>Wo es erscheint</th></tr>
    </thead>
    <tbody>
      <tr><td><code>data-state</code></td><td><code>open</code> / <code>closed</code> / <code>opening</code> / <code>closing</code> / <code>on</code> / <code>off</code></td><td>Dialog, Toggle, Tooltip, Popover</td></tr>
      <tr><td><code>data-orientation</code></td><td><code>horizontal</code> / <code>vertical</code></td><td>Tabs, RadioGroup, Slider</td></tr>
      <tr><td><code>data-side</code></td><td><code>top</code> / <code>right</code> / <code>bottom</code> / <code>left</code></td><td>Floating-positionierte Elemente</td></tr>
      <tr><td><code>data-direction</code></td><td><code>ltr</code> / <code>rtl</code></td><td>RTL-Umkehrung</td></tr>
      <tr><td><code>data-disabled</code></td><td>(leerer String)</td><td>Deaktivierter Zustand</td></tr>
      <tr><td><code>data-checked</code></td><td><code>true</code> / <code>false</code> / <code>mixed</code></td><td>Checkbox / Toggle / Switch</td></tr>
      <tr><td><code>data-component</code> / <code>data-component-host</code></td><td><code>combobox</code> / <code>dialog</code> / …</td><td>Identifiziert das Wurzelelement der Komponente</td></tr>
      <tr><td><code>data-component-part</code></td><td><code>title</code> / <code>close</code> / <code>overlay</code> / …</td><td>Identifiziert Sub-Komponenten-Elemente</td></tr>
    </tbody>
  </table>

  <pre><code
      >{`/* globales Stylesheet */
[data-state='on'] { background: var(--ds-accent); color: white; }
[data-state='off'] { background: var(--ds-surface-2); }
[data-state='open'] { animation: fade-in 200ms; }
[data-state='closed'] { animation: fade-out 150ms; }`}</code
    ></pre>

  <p>Dasselbe als Tailwind / UnoCSS Utilities:</p>
  <pre><code
      >{`<Toggle.Root class="bg-gray-200 data-[state=on]:bg-blue-500 data-[state=on]:text-white" />`}</code
    ></pre>

  <h2>Rezept 2: <code>class</code> / <code>style</code>-Pass-through</h2>
  <p>
    Layer-4-Sub-Komponenten sind <strong>dünne Ein-Element-Wrapper, die <code>...rest</code> spreaden</strong>. Was du übergibst — <code>class</code>, <code>style</code>, zusätzliche <code>data-*</code>, weitere ARIA-Attribute — landet auf dem echten DOM-Wurzelelement.
  </p>

  <pre><code
      >{`<Toggle.Root class="ds-toggle" style="--ring-color: var(--ds-accent)">
  Stumm
</Toggle.Root>`}</code
    ></pre>

  <p>
    Implementations-Referenz: <code>packages/components/src/toggle/Root.svelte</code> deklariert <code>[key: string]: unknown</code> in seinem Props-Typ und spreadet <code>...rest</code> direkt auf seinem <code>&lt;button&gt;</code>.
  </p>

  <h2>Rezept 3: CSS Custom Properties (der kanonische Weg für Theme-Propagation)</h2>
  <p>
    Anders als Sveltes Scoped CSS <strong>fließen CSS-Variablen über die normale Kaskade</strong>. Auf dem Eltern deklariert, erreichen sie das DOM in Kindern — und umgehen die Scope-Barriere von Svelte komplett.
  </p>

  <pre><code
      >{`<Combobox.Root style="
  --combobox-bg: var(--ds-surface);
  --combobox-border: var(--ds-line-strong);
">
  <Combobox.Input class="ds-input" />
</Combobox.Root>

<style>
  /* MyCombobox.svelte — der Scoped-Style erreicht das innere <input> des Kindes */
  .ds-input {
    background: var(--combobox-bg);
    border: 1px solid var(--combobox-border);
  }
</style>`}</code
    ></pre>

  <p><strong>Verwende es für:</strong> Markenfarben, Dark-Mode-Wechsel, Tokens, die Komponentengrenzen überschreiten müssen.</p>

  <h2>Rezept 4: <code>child</code>-Snippet — Element-Tausch</h2>
  <p>
    Standardmäßig rendert <code>Toggle.Root</code> ein <code>&lt;button&gt;</code>. Der Notausgang für „Ich will hier ein <code>&lt;a&gt;</code>" oder „Ich will mein eigenes <code>&lt;MyButton&gt;</code>".
  </p>

  <pre><code
      >{`<Toggle.Root bind:pressed>
  {#snippet child({ props, state })}
    <MyButton {...props} class="brand-btn" disabled={state.disabled}>
      {state.pressed ? 'Stumm' : 'An'}
    </MyButton>
  {/snippet}
</Toggle.Root>`}</code
    ></pre>

  <p>
    <code>props</code> ist vollständig typisiert: <code>type</code> / <code>aria-pressed</code> / <code>aria-disabled</code> / <code>data-state</code> / <code>onclick</code> / <code>onkeydown</code> / <code>id</code>. Deine Aufgabe ist, sie auf deinem Element zu spreaden.
  </p>

  <p class="note">
    <strong>Greif nicht standardmäßig dazu.</strong> <code>child</code> ist ein Notausgang, nicht der Standard-Styling-Pfad. Wenn ein <code>class</code>-Pass-through reicht, bevorzuge das — und denk daran, dass das erneute Spreaden von <code>props</code> in deiner Verantwortung liegt (vergisst du es, gehen ARIA / Event-Bindungen verloren).
  </p>

  <h2>Rezept 5: Tailwind / UnoCSS / Vanilla CSS</h2>

  <h3>Tailwind v4</h3>
  <pre><code
      >{`<Toggle.Root class="
  inline-flex items-center px-3 py-2 rounded-md
  bg-gray-200 text-gray-700
  data-[state=on]:bg-blue-600 data-[state=on]:text-white
  data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
" />`}</code
    ></pre>

  <h3>UnoCSS (Standardmodus)</h3>
  <p>Identische Schreiberfahrung wie Tailwind. Die Variante <code>data-[state=on]:</code> ist eingebaut über <code>@unocss/preset-mini</code> / <code>preset-wind3</code>.</p>

  <h3>UnoCSS svelte-scoped-Modus</h3>
  <p>
    <code>@unocss/svelte-scoped</code> scannt jedes Eltern-<code>.svelte</code>, dann injiziert es das generierte CSS <strong>verpackt in <code>:global(...)</code></strong> in den <code>&lt;style&gt;</code> dieser Datei. Da die Regeln global sind, erreichen Utilities, die du im Eltern geschrieben hast, das DOM in den Kindern ohne weitere Arbeit.
  </p>

  <h3>Vanilla CSS / CSS Modules</h3>

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

  <pre><code>{`<Toggle.Root class="ds-toggle">Stumm</Toggle.Root>`}</code></pre>

  <h2>Pattern: ein Design-System obendrauf bauen</h2>
  <p>Wickle Kumiki in dein eigenes <code>&lt;MyToggle&gt;</code> für die Wiederverwendung im gesamten Produkt.</p>

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
  /* Rezept 2 — class-Pass-through bedeutet, dass dieser scoped Style das echte DOM erreicht */
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

  <p>Konsumentenseite:</p>
  <pre><code
      >{`<script lang="ts">
  import MyToggle from '$lib/components/MyToggle.svelte';
  let muted = $state(false);
<\/script>

<MyToggle bind:pressed={muted} aria-label="Stummschalten">
  {muted ? 'Stumm' : 'An'}
</MyToggle>`}</code
    ></pre>

  <h2>Falle: Sveltes scoped <code>&lt;style&gt;</code> propagiert nicht in Kinder</h2>
  <p>
    Lange bestehende Svelte-Einschränkung: Klassen, die im <code>&lt;style&gt;</code> eines Eltern-<code>.svelte</code> definiert sind, <strong>erreichen nicht die DOM-Elemente innerhalb von Kind-Komponenten</strong>.
  </p>

  <pre><code
      >{`<!-- Funktioniert nicht wie erwartet -->
<Combobox.Root class="my-combo">
  <Combobox.Input />
</Combobox.Root>

<style>
  /* .my-combo wird im Template dieser Datei nicht verwendet, daher kann Svelte
     es entfernen, und das absteigende <input> liegt im Scope einer anderen Komponente. */
  .my-combo input { padding: 8px; }
</style>`}</code
    ></pre>

  <p>Vier Auswege:</p>
  <ol>
    <li><strong>Verwende Tailwind / UnoCSS / ein globales Stylesheet</strong> (Rezepte 1, 5). Von Anfang an nicht scoped, also existiert das Problem nicht. <strong>Erste Empfehlung.</strong></li>
    <li><strong>Übergib jeder Sub-Komponente eine <code>class</code></strong> (Rezept 2). <code>&lt;Combobox.Input class="ds-input" /&gt;</code> landet die Klasse auf dem Wurzelelement des Kindes. In einem Eltern-<code>&lt;style&gt;</code> würdest du <code>:global(.ds-input)</code> schreiben (oder die Regel nach <code>app.css</code> verschieben).</li>
    <li><strong>CSS Custom Properties</strong> (Rezept 3). Sie überschreiten Sveltes Scoping. Am besten für Theme-Propagation.</li>
    <li>
      <strong>Durchstoßen mit <code>:global(...)</code></strong>. Letzter Ausweg.
      <pre><code
          >{`<style>
  .my-combo :global([data-component-part='item'][data-highlighted]) {
    background: var(--ds-accent-subtle);
  }
</style>`}</code
        ></pre>
      Svelte 5 unterstützt auch die Block-Syntax <code>:global &#123; ... &#125;</code>.
    </li>
  </ol>

  <h2>Empfohlener Stack</h2>
  <table class="stack">
    <thead>
      <tr><th>Schicht</th><th>Werkzeug</th><th>Verwendung</th></tr>
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

  <h2>Was als Nächstes lesen</h2>
  <ul>
    <li><a href="/docs/layers-by-example">Schichten am Beispiel</a> — wie sich der User-Code in Layer 2/3/4/5 unterscheidet.</li>
    <li><a href="/docs/composition">Komposition</a> — optionale Features per <code>with*</code>-Wrapper hinzufügen.</li>
    <li><a href="/docs/i18n">i18n & RTL</a> — <code>data-direction</code> für RTL-Styling nutzen.</li>
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
