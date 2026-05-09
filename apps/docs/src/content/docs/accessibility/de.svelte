<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>Barrierefreiheit · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Grundlagen — 03"
  title="Die lange Version der Barrierefreiheit."
  lede="axe-core fängt 30–40 % der WCAG-Verletzungen ab. Die übrigen 60 % kommen von APG-Tastaturtests und echten Screenreader-Läufen. Kumiki versperrt das Mergen, bis alle drei grün sind."
>
  <h2>Drei Test-Schichten</h2>

  <table class="strata">
    <thead>
      <tr>
        <th>Was</th>
        <th>Wann</th>
        <th>Fängt ab</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>axe-core</strong></td>
        <td>Jeder PR — LTR & RTL × jeder dokumentierte Zustand</td>
        <td>Statische Verletzungen: fehlende Labels, Kontrast, Role-Gültigkeit.</td>
      </tr>
      <tr>
        <td><strong>APG-Tastatur</strong></td>
        <td>Jeder PR — Playwright pro Muster</td>
        <td>Tab-Reihenfolge, Pfeilnavigation, Home / End / Page-Semantik, Escape.</td>
      </tr>
      <tr>
        <td><strong>Guidepup-Screenreader</strong></td>
        <td>Nächtlicher Plan</td>
        <td>Was VoiceOver und NVDA tatsächlich sagen, in tatsächlicher Reihenfolge.</td>
      </tr>
    </tbody>
  </table>

  <h2>Typebene erzwingt zugängliche Namen</h2>
  <p>
    Wo die WAI-ARIA APG einen zugänglichen Namen verlangt (z. B. Dialoge), erzwingt TypeScript die
    Anforderung. <code>{`<Dialog.Root>`}</code> kompiliert nicht ohne eines von
    <code>title</code>, <code>aria-label</code> oder <code>aria-labelledby</code>.
  </p>

  <pre><code
      >{`<Dialog.Root title="Löschen bestätigen">
  <!-- kompiliert -->
</Dialog.Root>

<Dialog.Root>
  <!-- Typfehler: zugänglicher Name fehlt -->
</Dialog.Root>`}</code
    ></pre>

  <h2>Tastaturverträge</h2>
  <p>
    Jede Komponente dokumentiert ihr Keymap auf der Detailseite (Tab
    <strong>Barrierefreiheit</strong>). Wo APG ein Muster vorgibt, folgt Kumiki ihm wörtlich — keine
    kreative Auslegung.
  </p>

  <h2>Reduzierte Bewegung, RTL, hoher Kontrast</h2>
  <ul>
    <li>
      <code>prefers-reduced-motion</code> verkürzt sämtliche Übergänge im Doku-Site auf ~10 ms.
    </li>
    <li>
      RTL ist kein Nachgedanke. Richtungsabhängige Keymaps (Tabs, Slider) lesen die Richtung aus dem
      Maschinen-Kontext, nicht aus dem DOM.
    </li>
    <li>
      Forced-Colors-Modus wird respektiert — Komponenten vermeiden reine Hintergrund-Hinweise.
    </li>
  </ul>

  <h2>Die „Kumiki-ready"-Checkliste</h2>
  <p>
    Jede Komponente muss die Checkliste in
    <a href="https://github.com/baseballyama/kumiki/blob/main/docs/design/05-accessibility.md"
      >docs/design/05-accessibility.md §5.6</a
    >
    erfüllen, bevor sie gemergt wird. Keine Ausnahmen, keine <code>--ignore</code>-Flags.
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
