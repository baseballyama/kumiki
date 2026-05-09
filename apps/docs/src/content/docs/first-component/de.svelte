<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);
</script>

<svelte:head>
  <title>Deine erste Komponente · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Erste Schritte — 03"
  title="Deine erste Komponente"
  lede="Eine geführte Fünf-Minuten-Tour. Wir verdrahten ein Toggle, beobachten seinen ARIA-Vertrag und wechseln seine Anzeigesprache, ohne die Komponente anzufassen."
>
  <h2>1. Einfügen</h2>
  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="Audio stummschalten">
  {pressed ? 'Stumm' : 'An'}
</Toggle.Root>`}</code
    ></pre>

  <h2>2. Reaktion beobachten</h2>
  <p>
    Das Toggle unten ist mit deinem lokalen State verdrahtet, nicht mit dem Demo-Register — probier
    es aus.
  </p>

  <PreviewFrame>
    <div style="display: flex; gap: 16px; align-items: center;">
      <Toggle.Root bind:pressed aria-label="Audio stummschalten">
        {pressed ? 'Stumm' : 'An'}
      </Toggle.Root>
      <span style="font-family: var(--k-font-mono); font-size: 12px; color: var(--k-ink-3);">
        pressed = {pressed}
      </span>
    </div>
  </PreviewFrame>

  <h2>3. Vertrag inspizieren</h2>
  <p>
    Öffne die DevTools. Der Button hat ein zustands­getriebenes <code>aria-pressed</code> sowie
    einen
    <code>data-state="on"</code>-Hook fürs CSS-Styling. Kein globales CSS, keine Design-Vorgaben —
    style es wie du möchtest.
  </p>
  <pre><code
      >{`<button aria-pressed="true" data-state="on" type="button">
  Stumm
</button>`}</code
    ></pre>

  <h2>4. Lokalisieren</h2>
  <p>
    Ändere die Locale im Header. Das Toggle selbst hat keine lokalisierten Strings, aber Komponenten
    wie Combobox, Dialog und FormField wechseln sofort. Probiere die
    <a href="/components/component-combobox">Combobox-Demo</a>, nachdem du auf Japanisch gewechselt
    hast.
  </p>

  <h2>Was nun?</h2>
  <ul>
    <li>Lies die <a href="/docs/architecture">Fünf-Schichten-Architektur</a>.</li>
    <li>Überfliege das <a href="/docs/accessibility">Barriere­freiheitsmodell</a>.</li>
    <li>Stöbere durch <a href="/components">alle Komponenten</a> mit Live-Demos.</li>
  </ul>
</Prose>
