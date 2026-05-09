<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>Installation · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Erste Schritte — 02"
  title="Installation"
  lede="Kumiki wird als Sammlung unabhängig versionierter Pakete auf npm ausgeliefert. Installiere nur die Schicht, die du brauchst; Subpath-Imports halten Tree-Shaking gnadenlos."
>
  <h2>Voraussetzungen</h2>
  <ul>
    <li>Node.js 22 oder neuer.</li>
    <li>Svelte 5.29+ (für die <code>{'{@attach}'}</code>-Direktive).</li>
    <li>
      Ein ESM-fähiger Bundler — Vite 5+, Rollup 4+, esbuild 0.25+. CJS wird nicht ausgeliefert.
    </li>
  </ul>

  <h2>Wähle deine Schicht</h2>
  <p>Die meisten wollen Layer 4 — zusammengesetzte Komponenten — und ein Locale-Bundle:</p>
  <pre><code>pnpm add @kumiki/components @kumiki/locale</code></pre>

  <p>
    Volle DOM-Kontrolle nötig? Überspringe die Komponenten und nutze die Layer-3-Attachments direkt:
  </p>
  <pre><code>pnpm add @kumiki/headless</code></pre>

  <p>Baust du eigene Primitive? Du kannst jede Zustandsautomat allein verwenden:</p>
  <pre><code>pnpm add @kumiki/machines</code></pre>

  <h2>Locale bereitstellen</h2>
  <p>
    Wrappe deine App einmal in <code>LocaleProvider</code>. Jede Kumiki-Komponente darunter holt
    sich Nachrichten und Schreibrichtung von dort.
  </p>
  <pre><code
      >{`<script lang="ts">
  import { LocaleProvider } from '@kumiki/components';
  import { messages, direction } from '@kumiki/locale/de';

  let { children } = $props();
<\/script>

<LocaleProvider.Root locale="de" {messages} dir={direction}>
  {@render children()}
</LocaleProvider.Root>`}</code
    ></pre>

  <p>
    Die Locale-Bundles sind Subpath-Imports — jedes wiegt ≤ 1 KB Brotli. Wechsle die Sprache zur
    Laufzeit, indem du das <code>messages</code>-Bundle austauschst; die Komponenten berechnen ihren
    ARIA-Text automatisch neu.
  </p>

  <h2>Installation verifizieren</h2>
  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="Audio stummschalten">
  {pressed ? 'Stumm' : 'An'}
</Toggle.Root>`}</code
    ></pre>

  <p>Das war's. Schau dir den <a href="/components">Komponenten-Katalog</a> an.</p>
</Prose>
