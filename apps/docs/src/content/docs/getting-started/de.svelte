<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>Einführung · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Erste Schritte — 01"
  title="Einführung"
  lede="Kumiki — 組木 — ist ein UI-Primitivsystem für Svelte 5 mit tiefer Barrierefreiheit. Es existiert, weil die Frage „mach diese Komponente a11y-konform, internationalisierbar, thematisierbar und schlank“ nicht fünfzigmal in fünfzig Repositories beantwortet werden sollte."
>
  <h2>Warum Kumiki?</h2>
  <p>
    Die meisten barrierefreien Komponenten­bibliotheken treffen einen Kompromiss und bleiben dabei.
    Manche sind headless und überlassen das Verkabeln von ARIA dir. Andere kommen mit Styling und
    drücken dir ein komplettes Design-System auf. Manche binden dich an eine bestimmte
    State-Machine-Bibliothek; andere haben gar keine. Kumiki lehnt diesen Kompromiss ab: fünf
    komponierbare Schichten, jede unabhängig nutzbar.
  </p>

  <ul>
    <li>
      <strong>Layer 0 — Types.</strong> Eine geteilte TypeScript-Oberfläche, die jede Schicht darüber
      spricht.
    </li>
    <li>
      <strong>Layer 1 — Primitives.</strong> Framework-unabhängige Helfer (Focus-Trap, Dismissable, ID,
      Locale).
    </li>
    <li>
      <strong>Layer 2 — Machines.</strong> Reine TS-Zustands­automaten. ~1 KB Runtime, voll inspizierbares
      JSON.
    </li>
    <li>
      <strong>Layer 3 — Attachments.</strong> <code>{'{@attach}'}</code>-Fabriken, die ARIA und
      <code>data-state</code> an echten DOM-Knoten antreiben.
    </li>
    <li>
      <strong>Layer 4 — Components.</strong> Zusammen­gesetzte Primitive wie
      <code>{`<Combobox.Root>`}</code>, standardmäßig ergonomisch.
    </li>
    <li>
      <strong>Layer 5 — Atelier.</strong> Meinungsstarke, kopier­bare gestylte Varianten. Wird als
      <code>0.x-preview</code> ausgeliefert.
    </li>
  </ul>

  <h2>Status</h2>
  <p>
    Kumiki ist <strong>Pre-Alpha</strong>. Die Architektur steht, die Bundle-Budgets werden in der
    CI erzwungen, und die nächtlichen Screen-Reader-Läufe laufen — aber es ist noch keine Version
    auf npm veröffentlicht. Rechne mit API-Änderungen. Issues bitte unter
    <a href="https://github.com/baseballyama/kumiki/issues">baseballyama/kumiki</a>.
  </p>

  <h2>Weiter geht's</h2>
  <p>
    Nächste Station: <a href={resolve('/docs/installation')}>Installation</a> oder
    <a href={resolve('/docs/architecture')}>Architektur</a>. Wenn du dir lieber Dinge anschauen
    möchtest,
    <a href={resolve('/components')}>stöbere durch die Komponenten</a>.
  </p>
</Prose>
