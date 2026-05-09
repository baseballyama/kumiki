<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);
</script>

<svelte:head>
  <title>Votre premier composant · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Démarrer — 03"
  title="Votre premier composant"
  lede="Une visite guidée de cinq minutes. Nous allons brancher un Toggle, observer son contrat ARIA, et changer sa langue d'affichage sans toucher au composant."
>
  <h2>1. Posez-le</h2>
  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="Couper le son">
  {pressed ? 'Muet' : 'Activé'}
</Toggle.Root>`}</code
    ></pre>

  <h2>2. Regardez-le réagir</h2>
  <p>Le Toggle ci-dessous est branché à votre état local, pas au registre de démos — essayez.</p>

  <PreviewFrame>
    <div style="display: flex; gap: 16px; align-items: center;">
      <Toggle.Root bind:pressed aria-label="Couper le son">
        {pressed ? 'Muet' : 'Activé'}
      </Toggle.Root>
      <span style="font-family: var(--k-font-mono); font-size: 12px; color: var(--k-ink-3);">
        pressed = {pressed}
      </span>
    </div>
  </PreviewFrame>

  <h2>3. Inspectez le contrat</h2>
  <p>
    Ouvrez l'inspecteur. Le bouton a un <code>aria-pressed</code> piloté par l'état, plus un
    <code>data-state="on"</code> pour le style CSS. Aucun CSS global, aucune opinion de design — stylez-le
    comme vous voulez.
  </p>
  <pre><code
      >{`<button aria-pressed="true" data-state="on" type="button">
  Muet
</button>`}</code
    ></pre>

  <h2>4. Localisez-le</h2>
  <p>
    Changez la locale dans l'en-tête. Le Toggle lui-même n'a pas de chaînes traduites, mais les
    composants comme Combobox, Dialog et FormField basculent instantanément. Essayez la
    <a href="/components/component-combobox">démo Combobox</a> après être passé au japonais.
  </p>

  <h2>Et maintenant ?</h2>
  <ul>
    <li>Lisez l'<a href="/docs/architecture">architecture en cinq couches</a>.</li>
    <li>Survolez le <a href="/docs/accessibility">modèle d'accessibilité</a>.</li>
    <li>Parcourez <a href="/components">tous les composants</a> avec des démos en direct.</li>
  </ul>
</Prose>
