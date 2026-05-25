<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>Introduction · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Démarrer — 01"
  title="Introduction"
  lede="Kumiki — 組木 — est un système de primitives UI profondément accessible pour Svelte 5. Il existe parce que la question « rendre ce composant accessible, internationalisable, thématisable et léger » ne devrait pas être ré-instruite cinquante fois dans cinquante dépôts."
>
  <h2>Pourquoi Kumiki ?</h2>
  <p>
    La plupart des bibliothèques de composants accessibles choisissent un compromis et s’y tiennent.
    Certaines sont headless et vous laissent câbler l’ARIA vous-même. D’autres sont stylées et
    imposent tout un design system. Certaines vous enferment dans une bibliothèque de machines à
    états ; d’autres n’en ont aucune. Kumiki refuse ce compromis : cinq couches composables, chacune
    utilisable indépendamment.
  </p>

  <ul>
    <li>
      <strong>Layer 0 — Types.</strong> Une surface TypeScript partagée que chaque couche au-dessus parle.
    </li>
    <li>
      <strong>Layer 1 — Primitives.</strong> Helpers agnostiques au framework (focus trap, dismissable,
      ID, locale).
    </li>
    <li>
      <strong>Layer 2 — Machines.</strong> Machines à états finis en TS pur. Runtime de ~1 Ko, JSON pleinement
      inspectable.
    </li>
    <li>
      <strong>Layer 3 — Attachments.</strong> Fabriques <code>{'{@attach}'}</code> qui pilotent ARIA
      et <code>data-state</code> sur des nœuds DOM réels.
    </li>
    <li>
      <strong>Layer 4 — Components.</strong> Primitives composées comme
      <code>{`<Combobox.Root>`}</code>, ergonomiques par défaut.
    </li>
    <li>
      <strong>Layer 5 — Atelier.</strong> Variantes stylées prêtes au copier-coller. Livré en
      <code>0.x-preview</code>.
    </li>
  </ul>

  <h2>Statut</h2>
  <p>
    Kumiki est en <strong>pré-alpha</strong>. L’architecture est figée, les budgets de bundle sont
    appliqués en CI, et les exécutions nocturnes des lecteurs d’écran tournent — mais aucune version
    n’est encore publiée sur npm. Anticipez des changements d’API. Ouvrez vos issues sur
    <a href="https://github.com/baseballyama/kumiki/issues">baseballyama/kumiki</a>.
  </p>

  <h2>Et ensuite</h2>
  <p>
    Étape suivante : <a href={resolve('/docs/installation')}>installation</a> ou
    <a href={resolve('/docs/architecture')}>architecture</a>. Si vous préférez voir des choses
    tourner,
    <a href={resolve('/components')}>parcourez les composants</a>.
  </p>
</Prose>
