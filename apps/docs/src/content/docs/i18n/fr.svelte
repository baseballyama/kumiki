<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import { LOCALES } from '$lib/i18n/dict.js';
</script>

<svelte:head>
  <title>i18n et RTL · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Fondations — 04"
  title="Les langues comme imports par sous-chemin."
  lede="Pas de méga-bundle de traductions. Chaque locale est son propre import par sous-chemin à ≤ 1 Ko brotli, chargé à la demande. L'inversion RTL vit dans la machine à états, pas dans le CSS."
>
  <h2>Locales de la Phase 1</h2>
  <ul class="locales">
    {#each LOCALES as l (l.code)}
      <li>
        <span class="native">{l.native}</span>
        <span class="meta"><code>@kumiki/locale/{l.code}</code> · {l.name}</span>
      </li>
    {/each}
  </ul>

  <h2>Basculer à l'exécution</h2>
  <p>
    Enveloppez votre app une fois, puis échangez le bundle de locale importé à n'importe quel
    moment. Les composants en dessous relisent les messages à chaque changement.
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

  <h2>RTL n'est pas une réflexion d'après-coup</h2>
  <p>
    Le sens de lecture se propage depuis <code>LocaleProvider</code> via le contexte. Les mappings
    clavier sensibles au sens (Tabs <code>ArrowRight</code>, Slider, RadioGroup) lisent le sens dans
    le contexte de la machine — le controller ignore RTL.
  </p>

  <p>
    Le <strong>toggle de sens</strong> sur chaque page de détail vous laisse prévisualiser RTL pour
    n'importe quelle locale, sans changer de langue. Utilisez-le pour vérifier votre style.
  </p>

  <h2>Ce qui est localisé</h2>
  <p>Les bundles <code>@kumiki/locale</code> couvrent :</p>
  <ul>
    <li><code>combobox</code> : label de la listbox, « aucun résultat », bouton effacer.</li>
    <li><code>dialog</code> : label du bouton de fermeture.</li>
    <li><code>tabs</code> : label par défaut du tablist.</li>
    <li><code>formField</code> : marqueur requis, erreurs « requis » / « type incorrect ».</li>
  </ul>
  <p>
    Les messages de validation composés par Form Field peuvent être remplacés intégralement ou
    étendus via Standard Schema — pas besoin d'adapter par validateur.
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
