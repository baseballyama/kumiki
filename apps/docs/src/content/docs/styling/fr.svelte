<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);

  const stack = [
    {
      layer: 'Base produit',
      tool: 'Sélecteurs CSS globaux [data-component*]',
      use: 'Règles de type reset partagées par tous les Dialog',
    },
    {
      layer: 'Pièces du design system',
      tool: 'Pass-through de class aux sous-composants',
      use: 'Stylage structurel pour <MyDialog>',
    },
    {
      layer: 'Variante / thème',
      tool: 'CSS Custom Properties',
      use: 'Couleurs de marque, bascule clair / sombre',
    },
    {
      layer: "Différences d'état",
      tool: 'Sélecteurs data-state (ou Tailwind data-[state=open]:)',
      use: 'Ouvert / fermé, sélectionné, désactivé, hover',
    },
    {
      layer: "Échange d'élément",
      tool: 'snippet child',
      use: 'Rendre <a> ou <MyButton> comme élément racine',
    },
  ];
</script>

<svelte:head>
  <title>Style · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Fondations — 07"
  title="Style"
  lede="Kumiki Layer 4 livre zéro octet de CSS. Pourquoi nous l'avons construit ainsi, comment l'habiller, et comment naviguer les limites des styles scoped de Svelte — cinq recettes et un piège."
>
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

  <h2>Pourquoi Kumiki ne livre pas de styles</h2>
  <p>
    Layer 4 émet uniquement <strong
      >du DOM sémantique + ARIA + des attributs <code>data-*</code></strong
    >. Délibéré :
  </p>
  <ul>
    <li>
      <strong>Budgets de bundle</strong> : Toggle 1,5 Ko / Dialog 3,5 Ko / Combobox 4,5 Ko ne laissent
      pas de place au CSS.
    </li>
    <li>
      <strong>Les design systems varient</strong> : Tailwind / UnoCSS / CSS vanilla / CSS-in-JS — en ne
      décidant rien, on s'adapte à tous.
    </li>
    <li>
      <strong>L'animation aussi est CSS</strong> : nous émettons juste
      <code>data-state="open|closed"</code> ; vous choisissez entre CSS Transitions, View Transitions
      ou une lib motion.
    </li>
  </ul>

  <p>
    Vous composez donc le style à partir de <strong>cinq techniques</strong>. Listées par
    préférence.
  </p>

  <h2>Recette 1 : sélecteurs <code>data-*</code> (la voie canonique pour le style d'état)</h2>
  <p>
    Lisez les attributs émis par Kumiki via les sélecteurs CSS. Pattern éprouvé établi par Radix.
  </p>

  <table class="attrs">
    <thead>
      <tr><th>Attribut</th><th>Valeurs</th><th>Où il apparaît</th></tr>
    </thead>
    <tbody>
      <tr
        ><td><code>data-state</code></td><td
          ><code>open</code> / <code>closed</code> / <code>opening</code> / <code>closing</code> /
          <code>on</code>
          / <code>off</code></td
        ><td>Dialog, Toggle, Tooltip, Popover</td></tr
      >
      <tr
        ><td><code>data-orientation</code></td><td
          ><code>horizontal</code> / <code>vertical</code></td
        ><td>Tabs, RadioGroup, Slider</td></tr
      >
      <tr
        ><td><code>data-side</code></td><td
          ><code>top</code> / <code>right</code> / <code>bottom</code> / <code>left</code></td
        ><td>Éléments à positionnement flottant</td></tr
      >
      <tr
        ><td><code>data-direction</code></td><td><code>ltr</code> / <code>rtl</code></td><td
          >Inversion RTL</td
        ></tr
      >
      <tr><td><code>data-disabled</code></td><td>(chaîne vide)</td><td>État désactivé</td></tr>
      <tr
        ><td><code>data-checked</code></td><td
          ><code>true</code> / <code>false</code> / <code>mixed</code></td
        ><td>Checkbox / Toggle / Switch</td></tr
      >
      <tr
        ><td><code>data-component</code> / <code>data-component-host</code></td><td
          ><code>combobox</code> / <code>dialog</code> / …</td
        ><td>Identifie l'élément racine du composant</td></tr
      >
      <tr
        ><td><code>data-component-part</code></td><td
          ><code>title</code> / <code>close</code> / <code>overlay</code> / …</td
        ><td>Identifie les éléments des sous-composants</td></tr
      >
    </tbody>
  </table>

  <pre><code
      >{`/* feuille de style globale */
[data-state='on'] { background: var(--ds-accent); color: white; }
[data-state='off'] { background: var(--ds-surface-2); }
[data-state='open'] { animation: fade-in 200ms; }
[data-state='closed'] { animation: fade-out 150ms; }`}</code
    ></pre>

  <p>La même chose en utilities Tailwind / UnoCSS :</p>
  <pre><code
      >{`<Toggle.Root class="bg-gray-200 data-[state=on]:bg-blue-500 data-[state=on]:text-white" />`}</code
    ></pre>

  <h2>Recette 2 : pass-through de <code>class</code> / <code>style</code></h2>
  <p>
    Les sous-composants Layer 4 sont <strong
      >de fins wrappers à un seul élément qui propagent <code>...rest</code></strong
    >. Tout ce que vous passez — <code>class</code>, <code>style</code>, <code>data-*</code> additionnels,
    attributs ARIA supplémentaires — atterrit sur la racine DOM réelle.
  </p>

  <pre><code
      >{`<Toggle.Root class="ds-toggle" style="--ring-color: var(--ds-accent)">
  Couper le son
</Toggle.Root>`}</code
    ></pre>

  <p>
    Référence d'implémentation : <code>packages/components/src/toggle/Root.svelte</code> déclare
    <code>[key: string]: unknown</code>
    dans son type Props et propage <code>...rest</code> directement sur son
    <code>&lt;button&gt;</code>.
  </p>

  <h2>Recette 3 : CSS Custom Properties (la voie canonique pour propager le thème)</h2>
  <p>
    Contrairement au CSS scoped de Svelte, <strong
      >les variables CSS suivent la cascade normale</strong
    >. Déclarées sur le parent, elles atteignent le DOM à l'intérieur des composants enfants —
    contournant complètement la barrière de scope de Svelte.
  </p>

  <pre><code
      >{`<Combobox.Root style="
  --combobox-bg: var(--ds-surface);
  --combobox-border: var(--ds-line-strong);
">
  <Combobox.Input class="ds-input" />
</Combobox.Root>

<style>
  /* style scoped de MyCombobox.svelte — atteint le <input> interne de l'enfant */
  .ds-input {
    background: var(--combobox-bg);
    border: 1px solid var(--combobox-border);
  }
</style>`}</code
    ></pre>

  <p>
    <strong>À utiliser pour :</strong> couleurs de marque, bascule mode sombre, tokens devant traverser
    les frontières de composants.
  </p>

  <h2>Recette 4 : snippet <code>child</code> — échange d'élément</h2>
  <p>
    Par défaut, <code>Toggle.Root</code> rend un <code>&lt;button&gt;</code>. La sortie de secours
    pour « je veux un <code>&lt;a&gt;</code> ici » ou « je veux mon propre
    <code>&lt;MyButton&gt;</code> ».
  </p>

  <pre><code
      >{`<Toggle.Root bind:pressed>
  {#snippet child({ props, state })}
    <MyButton {...props} class="brand-btn" disabled={state.disabled}>
      {state.pressed ? 'Muet' : 'Activé'}
    </MyButton>
  {/snippet}
</Toggle.Root>`}</code
    ></pre>

  <p>
    <code>props</code> est entièrement typé : <code>type</code> / <code>aria-pressed</code> /
    <code>aria-disabled</code>
    / <code>data-state</code> / <code>onclick</code> / <code>onkeydown</code> / <code>id</code>.
    Votre travail est de le propager sur votre élément.
  </p>

  <p class="note">
    <strong>Ne sautez pas dessus par défaut.</strong> <code>child</code> est une sortie de secours,
    pas la voie de stylage standard. Si un pass-through de <code>class</code> couvre, préférez-le —
    et souvenez-vous que re-propager <code>props</code> est de votre responsabilité (l'oublier perd le
    câblage ARIA / événements).
  </p>

  <h2>Recette 5 : Tailwind / UnoCSS / CSS vanilla</h2>

  <h3>Tailwind v4</h3>
  <pre><code
      >{`<Toggle.Root class="
  inline-flex items-center px-3 py-2 rounded-md
  bg-gray-200 text-gray-700
  data-[state=on]:bg-blue-600 data-[state=on]:text-white
  data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
" />`}</code
    ></pre>

  <h3>UnoCSS (mode par défaut)</h3>
  <p>
    Expérience d'écriture identique à Tailwind. La variante <code>data-[state=on]:</code> est
    intégrée via <code>@unocss/preset-mini</code> / <code>preset-wind3</code>.
  </p>

  <h3>UnoCSS mode svelte-scoped</h3>
  <p>
    <code>@unocss/svelte-scoped</code> scanne chaque <code>.svelte</code> parent, puis injecte le
    CSS généré <strong>enveloppé dans <code>:global(...)</code></strong> dans le
    <code>&lt;style&gt;</code> de ce fichier. Comme les règles sont globales, les utilities écrites dans
    le parent atteignent le DOM dans les composants enfants sans travail supplémentaire.
  </p>

  <h3>CSS vanilla / CSS Modules</h3>

  <pre><code
      >{`/* app.css (global) */
.ds-toggle {
  display: inline-flex; align-items: center;
  padding: 8px 12px; border-radius: 6px;
  background: var(--ds-surface-2); color: var(--ds-ink);
}
.ds-toggle[data-state='on'] {
  background: var(--ds-accent); color: white;
}
.ds-toggle[data-disabled] { opacity: 0.5; cursor: not-allowed; }`}</code
    ></pre>

  <pre><code>{`<Toggle.Root class="ds-toggle">Muet</Toggle.Root>`}</code></pre>

  <h2>Pattern : construire un design system par-dessus</h2>
  <p>
    Enveloppez Kumiki dans votre propre <code>&lt;MyToggle&gt;</code> pour la réutilisation à l'échelle
    du produit.
  </p>

  <pre><code
      >{`<!-- src/lib/components/MyToggle.svelte -->
<script lang="ts">
  import { Toggle } from '@kumiki/components';
  import type { Snippet } from 'svelte';

  type Props = {
    pressed?: boolean;
    'aria-label': string;
    children: Snippet;
  };
  let { pressed = $bindable(false), 'aria-label': ariaLabel, children }: Props = $props();
<\/script>

<Toggle.Root bind:pressed aria-label={ariaLabel} class="ds-toggle">
  {@render children()}
</Toggle.Root>

<style>
  /* Recette 2 — le pass-through de class signifie que ce style scoped atteint le DOM réel */
  :global(.ds-toggle) {
    display: inline-flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    background: var(--ds-surface-2);
    transition: background 120ms;
  }
  :global(.ds-toggle[data-state='on']) {
    background: var(--ds-accent);
    color: white;
  }
</style>`}</code
    ></pre>

  <p>Côté consommateur :</p>
  <pre><code
      >{`<script lang="ts">
  import MyToggle from '$lib/components/MyToggle.svelte';
  let muted = $state(false);
<\/script>

<MyToggle bind:pressed={muted} aria-label="Couper le son">
  {muted ? 'Muet' : 'Activé'}
</MyToggle>`}</code
    ></pre>

  <h2>Piège : le <code>&lt;style&gt;</code> scoped de Svelte ne se propage pas dans les enfants</h2>
  <p>
    Contrainte Svelte de longue date : les classes définies dans le <code>&lt;style&gt;</code> d'un
    <code>.svelte</code>
    parent <strong>n'atteignent pas les éléments DOM dans les composants enfants</strong>.
  </p>

  <pre><code
      >{`<!-- Ne fonctionne pas comme attendu -->
<Combobox.Root class="my-combo">
  <Combobox.Input />
</Combobox.Root>

<style>
  /* .my-combo n'est pas utilisé dans le template de ce fichier, donc Svelte
     peut l'éliminer, et le <input> descendant vit dans le scope d'un autre composant. */
  .my-combo input { padding: 8px; }
</style>`}</code
    ></pre>

  <p>Quatre issues :</p>
  <ol>
    <li>
      <strong>Utilisez Tailwind / UnoCSS / une feuille de style globale</strong> (recettes 1, 5). Ce
      n'est pas scoped à la base, donc le problème n'existe pas.
      <strong>Recommandation de première ligne.</strong>
    </li>
    <li>
      <strong>Passez une <code>class</code> à chaque sous-composant</strong> (recette 2).
      <code>&lt;Combobox.Input class="ds-input" /&gt;</code>
      dépose la classe sur l'élément racine de l'enfant. Dans un <code>&lt;style&gt;</code> parent,
      vous écririez <code>:global(.ds-input)</code> (ou déplacez la règle vers
      <code>app.css</code>).
    </li>
    <li>
      <strong>CSS Custom Properties</strong> (recette 3). Elles passent au-delà du scoping de Svelte.
      Idéal pour propager le thème.
    </li>
    <li>
      <strong>Perçage avec <code>:global(...)</code></strong>. Dernier recours.
      <pre><code
          >{`<style>
  .my-combo :global([data-component-part='item'][data-highlighted]) {
    background: var(--ds-accent-subtle);
  }
</style>`}</code
        ></pre>
      Svelte 5 supporte aussi la syntaxe de bloc<code>:global &#123; ... &#125;</code>.
    </li>
  </ol>

  <h2>Stack recommandé</h2>
  <table class="stack">
    <thead>
      <tr><th>Couche</th><th>Outil</th><th>Usage</th></tr>
    </thead>
    <tbody>
      {#each stack as row (row.layer)}
        <tr>
          <td class="layer">{row.layer}</td>
          <td><code>{row.tool}</code></td>
          <td class="use">{row.use}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <h2>À lire ensuite</h2>
  <ul>
    <li>
      <a href="/docs/layers-by-example">Couches par l'exemple</a> — comment le code utilisateur diffère
      en Layer 2/3/4/5.
    </li>
    <li>
      <a href="/docs/composition">Composition</a> — ajouter des fonctionnalités optionnelles via les
      wrappers <code>with*</code>.
    </li>
    <li>
      <a href="/docs/i18n">i18n et RTL</a> — utiliser <code>data-direction</code> pour le style RTL.
    </li>
  </ul>
</Prose>

<style>
  table.attrs,
  table.stack {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 13px;
  }
  table.attrs th,
  table.attrs td,
  table.stack th,
  table.stack td {
    padding: 10px 12px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: middle;
  }
  table.attrs th,
  table.stack th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    border-block-end-color: var(--k-line-2);
    font-weight: 500;
  }
  table.stack .layer {
    color: var(--k-ink-2);
    font-weight: 500;
  }
  table.stack .use,
  table.attrs td:last-child {
    color: var(--k-ink-3);
  }
  table.attrs code,
  table.stack code {
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
