<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>Installation · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Démarrer — 02"
  title="Installation"
  lede="Kumiki est livré sous forme d'un ensemble de paquets versionnés indépendamment sur npm. N'installez que la couche dont vous avez besoin ; les imports par sous-chemin gardent le tree-shaking impitoyable."
>
  <h2>Prérequis</h2>
  <ul>
    <li>Node.js 22 ou plus récent.</li>
    <li>Svelte 5.29+ (pour la directive <code>{'{@attach}'}</code>).</li>
    <li>Un bundler ESM-aware — Vite 5+, Rollup 4+, esbuild 0.25+. CJS n'est pas livré.</li>
  </ul>

  <h2>Choisissez votre couche</h2>
  <p>
    La plupart des utilisateurs veulent la Layer 4 — composants composés — et un bundle de locale :
  </p>
  <pre><code>pnpm add @kumiki/components @kumiki/locale</code></pre>

  <p>
    Besoin du contrôle total du DOM ? Sautez les composants et consommez directement les attachments
    de Layer 3 :
  </p>
  <pre><code>pnpm add @kumiki/headless</code></pre>

  <p>
    Vous construisez vos propres primitives ? Vous pouvez utiliser n'importe quelle machine à états
    seule :
  </p>
  <pre><code>pnpm add @kumiki/machines</code></pre>

  <h2>Fournir une locale</h2>
  <p>
    Enveloppez votre application dans <code>LocaleProvider</code> une seule fois. Chaque composant Kumiki
    en dessous récupère les messages et le sens de lecture.
  </p>
  <pre><code
      >{`<script lang="ts">
  import { LocaleProvider } from '@kumiki/components';
  import { messages, direction } from '@kumiki/locale/fr';

  let { children } = $props();
<\/script>

<LocaleProvider.Root locale="fr" {messages} dir={direction}>
  {@render children()}
</LocaleProvider.Root>`}</code
    ></pre>

  <p>
    Les bundles de locale sont des imports par sous-chemin — chacun pèse ≤ 1 Ko brotli. Changez de
    langue à l'exécution en échangeant le bundle de <code>messages</code> ; les composants recalculent
    automatiquement leur texte ARIA.
  </p>

  <h2>Vérifier l'installation</h2>
  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="Couper le son">
  {pressed ? 'Muet' : 'Activé'}
</Toggle.Root>`}</code
    ></pre>

  <p>Voilà. Passez au <a href={resolve('/components')}>catalogue de composants</a>.</p>
</Prose>
