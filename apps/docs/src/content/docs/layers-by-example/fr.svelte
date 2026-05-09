<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);

  const matrix = [
    { task: 'FSM (transitions d\'état)', l2: 'Kumiki', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'Pont de réactivité Svelte', l2: 'Vous', l3: 'Vous*', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'Élément <button>', l2: 'Vous', l3: 'Vous', l4: 'Kumiki', l5: 'Copié' },
    { task: 'Attributs ARIA (aria-pressed, …)', l2: 'Vous', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'Sortie data-state', l2: 'Vous', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'Gestion clic / clavier', l2: 'Vous', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'Nom accessible (aria-label)', l2: 'Vous', l3: 'Vous', l4: 'Vous', l5: 'Kumiki' },
    { task: 'Style', l2: 'Vous', l3: 'Vous', l4: 'Vous', l5: 'Copié' },
  ];
</script>

<svelte:head>
  <title>Couches par l'exemple — Toggle · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Fondations — 06"
  title="Couches par l'exemple : Toggle"
  lede="Le même Toggle, écrit en Layer 2, 3, 4, et 5 — observé côte à côte. Chaque pas en bas du stack vous donne un peu plus de contrôle et un peu plus de responsabilité."
>
  <p>
    Les couches Kumiki exposent toutes <strong>le même comportement à différents niveaux d'abstraction</strong>.
    Descendre d'une couche : vous reprenez plus de DOM, ARIA et plomberie d'événements — mais vous
    gagnez la liberté de choisir la structure. Monter d'une couche : vous écrivez moins de code au
    prix d'accepter les choix structurels de Kumiki.
  </p>

  <p>
    Nous utilisons <a href="/components/component-toggle">Toggle</a> comme exemple détaillé. Le
    comportement est simple (presser pour basculer), mais l'implémentation existe dans
    <strong>les quatre couches</strong> — idéal pour une comparaison côte à côte.
  </p>

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

  <h2>1. Layer 4 — Composant composé (le point d'entrée par défaut)</h2>
  <p>
    Le chemin le plus court. <code>Toggle.Root</code> rend le <code>&lt;button&gt;</code>, gère ARIA,
    <code>data-state</code>, le clavier et le SSR. Vous êtes responsable de
    <strong>deux choses</strong> : recevoir l'état via <code>bind:pressed</code> et fournir un
    <code>aria-label</code> (ou un libellé visible).
  </p>

  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="Couper le son">
  {pressed ? 'Muet' : 'Activé'}
</Toggle.Root>`}</code
    ></pre>

  <p>DOM résultant :</p>

  <pre><code
      >{`<button type="button" aria-pressed="false" data-state="off" id="toggle-…">
  Activé
</button>`}</code
    ></pre>

  <p>
    <strong>Choisissez ceci quand :</strong> 90 % des cas. Le <code>&lt;button&gt;</code> natif suffit,
    vous n'avez pas besoin de remplacer la structure d'enrobage.
  </p>

  <h2>2. Layer 3 — Attachment headless</h2>
  <p>
    Quand vous devez choisir l'élément vous-même (un <code>&lt;a&gt;</code>, un
    <code>&lt;div role="button"&gt;</code>, un wrapper personnalisé). <code>createToggle()</code>
    retourne une fabrique compatible avec <code>{`{@attach}`}</code> que vous propagez sur l'élément
    de votre choix.
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggle } from '@kumiki/headless/toggle';

  const t = createToggle({ initial: false });

  // controller.pressed est un getter ordinaire. Pour l'afficher en texte, il faut
  // s'abonner et le miroiter dans $state. (Inutile si CSS gère tout.)
  let pressed = $state(t.pressed);
  $effect(() => t.subscribe(({ context }) => (pressed = context.pressed)));
<\/script>

<button {@attach t.root} aria-label="Couper le son" class="my-btn">
  {pressed ? 'Muet' : 'Activé'}
</button>`}</code
    ></pre>

  <p>
    Au montage, <code>{`{@attach t.root}`}</code> écrit les attributs côté DOM (<code>type</code>,
    <code>aria-pressed</code>, <code>data-state</code>, <code>id</code>) et branche les listeners
    clic + touche (Espace / Entrée). <strong>Ce qui s'ajoute à vos responsabilités :</strong> le choix
    de l'élément, le style, le libellé visible, et (si nécessaire) un <code>subscribe</code> pour
    miroiter l'état dans des locales réactives.
  </p>

  <p>
    <strong>Choisissez ceci quand :</strong> la structure fixe de Layer 4 (<code>&lt;button&gt;</code>)
    ne convient pas. Par exemple, quand le toggle doit être à l'intérieur d'un <code>&lt;label&gt;</code>
    ou enveloppé dans une coquille d'ordre supérieur.
  </p>

  <h2>3. Layer 2 — Machine pure</h2>
  <p>
    Pas de Svelte du tout — une machine à états finis en TypeScript pur. <strong>Vous écrivez DOM,
    ARIA, événements et clavier vous-même.</strong>
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggleMachine } from '@kumiki/machines/toggle';

  const m = createToggleMachine({ initial: false });
  let pressed = $state(m.context.pressed);
  m.subscribe(({ context }) => (pressed = context.pressed));
<\/script>

<button
  type="button"
  aria-pressed={pressed ? 'true' : 'false'}
  data-state={pressed ? 'on' : 'off'}
  aria-label="Couper le son"
  onclick={() => m.send({ type: 'TOGGLE' })}
>
  {pressed ? 'Muet' : 'Activé'}
</button>`}</code
    ></pre>

  <p>
    <strong>La raison de descendre en Layer 2 n'est généralement pas l'UI — c'est la réutilisation
    de logique :</strong>
  </p>
  <ul>
    <li>Valider la logique du Toggle côté serveur (server routes SvelteKit / Workers).</li>
    <li>Écrire des tests unitaires FSM purs en Vitest (pas de jsdom, ~20μs par transition).</li>
    <li>
      Visualiser les transitions sur <a href="https://stately.ai/viz">stately.ai/viz</a> (<code
        >machine.toJSON()</code
      > émet du JSON compatible XState).
    </li>
    <li>Embarquer dans des hôtes non-Svelte (vanilla JS, Web Components, autre framework).</li>
  </ul>

  <h2>4. Layer 5 — Atelier (variantes stylées copier-coller)</h2>
  <p>
    Le CLI copie les sources dans votre repo. Après copie, c'est <strong>votre code</strong> —
    éditez librement.
  </p>

  <pre><code
      >{`# Variante Tailwind v4
npx kumiki add toggle --variant=tailwind

# Variante CSS vanilla
npx kumiki add toggle --variant=vanilla`}</code
    ></pre>

  <p>Fichiers ajoutés :</p>

  <pre><code
      >{`src/lib/components/Toggle.svelte   # wrapper stylé autour du Toggle.Root de Layer 4`}</code
    ></pre>

  <p>Utilisez-le comme n'importe quel composant Svelte :</p>

  <pre><code
      >{`<script lang="ts">
  import Toggle from '$lib/components/Toggle.svelte';
  let pressed = $state(false);
<\/script>

<Toggle bind:pressed>Couper le son</Toggle>`}</code
    ></pre>

  <p>
    <strong>Choisissez ceci quand :</strong> vous voulez une base visuelle fonctionnelle sans écrire
    de CSS d'abord. Layer 5 est livré sous <code>0.x.x-preview</code> pendant la série v1.0, donc
    pour les projets sensibles à la stabilité, préférez Layer 4 + votre propre style.
  </p>

  <h2>Matrice de responsabilités</h2>

  <p>Ce que vous écrivez à chaque couche. « Kumiki » = la librairie s'en charge ; « Vous » = votre code.</p>

  <table class="matrix">
    <thead>
      <tr>
        <th>Responsabilité</th>
        <th>L2 (machine)</th>
        <th>L3 (headless)</th>
        <th>L4 (component)</th>
        <th>L5 (atelier)</th>
      </tr>
    </thead>
    <tbody>
      {#each matrix as row (row.task)}
        <tr>
          <td class="task">{row.task}</td>
          <td class:you={row.l2 === 'Vous'} class:them={row.l2 === 'Kumiki'}>{row.l2}</td>
          <td class:you={row.l3.startsWith('Vous')} class:them={row.l3 === 'Kumiki'}>{row.l3}</td>
          <td class:you={row.l4 === 'Vous'} class:them={row.l4 === 'Kumiki'}>{row.l4}</td>
          <td class:them={row.l5 === 'Kumiki'}>{row.l5}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <p class="note">
    * Le pont de réactivité Svelte n'est nécessaire en L3 que si vous affichez
    <code>controller.pressed</code> en texte. Si CSS gère tout via <code>data-state</code>, aucun
    <code>subscribe</code> n'est requis.
  </p>

  <h2>Choisir une couche — arbre de décision</h2>

  <ul>
    <li>
      <strong>Besoin d'un truc qui tourne avec du style maintenant ?</strong> →
      <strong>Layer 5</strong>
      (<code>npx kumiki add</code>). Note : tagué preview pendant v1.0.
    </li>
    <li>
      <strong>Le &lt;button&gt; standard suffit, vous le stylez vous-même ?</strong> →
      <strong>Layer 4</strong>
      (<code>{`<Toggle.Root>`}</code>). Le point d'entrée par défaut.
    </li>
    <li>
      <strong>Besoin de choisir vous-même le type ou la structure de l'élément ?</strong> →
      <strong>Layer 3</strong>
      (<code>{`{@attach t.root}`}</code>). Si le snippet <code>child</code> de Layer 4 couvre votre
      besoin, restez en Layer 4 — c'est moins de code.
    </li>
    <li>
      <strong>Exécution hors-Svelte / validation côté serveur / juste la FSM ?</strong> →
      <strong>Layer 2</strong>
      (<code>createToggleMachine</code>).
    </li>
  </ul>

  <h2>À lire ensuite</h2>
  <ul>
    <li>
      <a href="/docs/styling">Style</a> — comment utiliser <code>data-*</code>, le pass-through
      <code>class</code> et le snippet <code>child</code> en Layer 4.
    </li>
    <li><a href="/docs/architecture">Architecture</a> — le modèle à cinq couches complet.</li>
    <li>
      <a href="/docs/composition">Composition</a> — ajouter des fonctionnalités optionnelles via les
      wrappers <code>with*</code>.
    </li>
  </ul>
</Prose>

<style>
  table.matrix {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 13px;
  }
  table.matrix th,
  table.matrix td {
    padding: 10px 12px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: middle;
  }
  table.matrix th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    border-block-end-color: var(--k-line-2);
    font-weight: 500;
  }
  table.matrix .task {
    color: var(--k-ink-2);
    font-weight: 500;
  }
  table.matrix td.you {
    color: var(--k-shu);
    font-family: var(--k-font-mono);
    font-size: 12px;
  }
  table.matrix td.them {
    color: var(--k-ink-4);
    font-family: var(--k-font-mono);
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
