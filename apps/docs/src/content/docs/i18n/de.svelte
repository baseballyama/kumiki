<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import { LOCALES } from '$lib/i18n/dict.js';
</script>

<svelte:head>
  <title>i18n & RTL · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Grundlagen — 04"
  title="Sprachen als Subpath-Imports."
  lede="Kein Mega-Bundle an Übersetzungen. Jede Locale ist ihr eigener Subpath-Import zu ≤ 1 KB Brotli, lazy-geladen. Die RTL-Umkehr lebt in der Zustandsmaschine, nicht im CSS."
>
  <h2>Phase-1-Locales</h2>
  <ul class="locales">
    {#each LOCALES as l (l.code)}
      <li>
        <span class="native">{l.native}</span>
        <span class="meta"><code>@kumiki/locale/{l.code}</code> · {l.name}</span>
      </li>
    {/each}
  </ul>

  <h2>Zur Laufzeit wechseln</h2>
  <p>
    Wrappe deine App einmal, dann tausche das importierte Locale-Bundle jederzeit aus. Die
    Komponenten darunter lesen die Nachrichten bei jeder Änderung neu.
  </p>
  <pre><code
      >{`<script lang="ts">
  import { LocaleProvider } from '@kumiki/components';
  import * as ja from '@kumiki/locale/ja';
  import * as en from '@kumiki/locale/en';

  let active = $state<'ja' | 'en'>('ja');
  const bundle = $derived(active === 'ja' ? ja : en);
<\/script>

<button onclick={() => (active = active === 'ja' ? 'en' : 'ja')}>
  {active.toUpperCase()}
</button>

<LocaleProvider.Root locale={active} messages={bundle.messages} dir={bundle.direction}>
  {@render children()}
</LocaleProvider.Root>`}</code
    ></pre>

  <h2>RTL ist kein Nachgedanke</h2>
  <p>
    Die Schreibrichtung wird vom <code>LocaleProvider</code> über den Kontext propagiert.
    Richtungsabhängige Keymaps (Tabs <code>ArrowRight</code>, Slider, RadioGroup) lesen die Richtung
    aus dem Maschinen­kontext — der Controller weiß nichts von RTL.
  </p>

  <p>
    Der <strong>Richtungs-Toggle</strong> auf jeder Komponenten-Detailseite lässt dich RTL für jede Locale
    prüfen, ohne die Sprache zu wechseln. Nutze ihn, um dein Styling zu verifizieren.
  </p>

  <h2>Was lokalisiert ist</h2>
  <p>Die <code>@kumiki/locale</code>-Bundles decken ab:</p>
  <ul>
    <li><code>combobox</code>: Listbox-Label, „keine Ergebnisse", Löschen-Button.</li>
    <li><code>dialog</code>: Schließen-Button-Label.</li>
    <li><code>tabs</code>: Standard-Tablist-Label.</li>
    <li><code>formField</code>: Required-Marker, Fehler „erforderlich" / „Typ stimmt nicht".</li>
  </ul>
  <p>
    Die von Form Field zusammengestellten Validierungs­meldungen können komplett ersetzt oder über
    Standard Schema erweitert werden — kein Adapter pro Validator nötig.
  </p>
</Prose>

<style>
  ul.locales {
    list-style: none;
    margin: 24px 0;
    padding: 0;
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    overflow: hidden;
  }
  ul.locales li {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 24px;
    padding: 12px 16px;
    border-block-end: 1px solid var(--k-line-1);
  }
  ul.locales li:last-child {
    border-block-end: 0;
  }
  ul.locales .native {
    font-family: var(--k-font-display);
    font-size: 17px;
    color: var(--k-ink-1);
    font-variation-settings: 'opsz' 36;
  }
  ul.locales .meta {
    font-family: var(--k-font-mono);
    font-size: 11px;
    color: var(--k-ink-3);
  }
</style>
