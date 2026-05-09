<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>Composition · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Fondations — 02"
  title="Composition plutôt que configuration."
  lede="Les composants Kumiki sont des primitives composées. Le Root pose l'état, des sous-composants nommés le présentent. Le motif child snippet vous laisse remplacer n'importe quel élément sans perdre le comportement."
>
  <h2>Forme composée</h2>
  <p>Chaque composant Layer 4 suit le même squelette :</p>
  <pre><code
      >{`<Combobox.Root>
  <Combobox.Input />
  <Combobox.Listbox>
    {#each items as item}
      <Combobox.Item value={item}>{item.label}</Combobox.Item>
    {/each}
  </Combobox.Listbox>
</Combobox.Root>`}</code
    ></pre>

  <h2>Le snippet <code>child</code></h2>
  <p>
    Besoin de rendre un <code>{`<a>`}</code> au lieu d'un <code>{`<button>`}</code> ? Utilisez le
    snippet <code>child</code>. Le composant vous donne les props qu'il aurait propagées ; vous
    décidez sur quelle balise les poser. Cela remplace le motif <code>asChild</code> de Radix/Bits v1.
  </p>
  <pre><code
      >{`<Toggle.Root>
  {#snippet child({ props })}
    <a href="/destination" {...props}>Naviguer</a>
  {/snippet}
</Toggle.Root>`}</code
    ></pre>

  <p>
    Le composant contrôle toujours l'ARIA — seule la balise rendue change. Il n'y a pas de prop
    <code>asChild</code> dans Kumiki et il n'y en aura jamais.
  </p>

  <h2>Sorties de secours par couche</h2>
  <p>
    Si <code>child</code> ne suffit pas — par exemple il faut coordonner trois nœuds DOM personnalisés —
    descendez d'une couche. Utilisez les fabriques d'attachments dans <code>@kumiki/headless</code>
    et écrivez votre propre JSX/HTML autour.
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggle } from '@kumiki/headless/toggle';
  const t = createToggle({ pressed: $state(false) });
<\/script>

<button {@attach t.root} class="my-fancy-toggle">
  {t.pressed ? 'Allumé' : 'Éteint'}
</button>`}</code
    ></pre>

  <h2>Les génériques se propagent</h2>
  <p>
    Les composants qui prennent une valeur typée (Combobox, RadioGroup, Select, FormField) propagent
    ce générique depuis le Root. Les sous-composants internes le lisent via <code>getContext</code>.
    Pas besoin de répéter le type à chaque niveau.
  </p>
</Prose>
