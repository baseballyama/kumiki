<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>Komposition · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Grundlagen — 02"
  title="Komposition statt Konfiguration."
  lede="Kumiki-Komponenten sind zusammengesetzte Primitive. Der Root baut den Zustand auf, benannte Unter­komponenten präsentieren ihn. Das child-Snippet-Muster lässt dich jedes Element austauschen, ohne das Verhalten zu verlieren."
>
  <h2>Zusammengesetzte Form</h2>
  <p>Jede Layer-4-Komponente folgt dem gleichen Aufriss:</p>
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

  <h2>Das <code>child</code>-Snippet</h2>
  <p>
    Möchtest du ein <code>{`<a>`}</code> statt eines <code>{`<button>`}</code> rendern? Nutze das
    <code>child</code>-Snippet. Die Komponente reicht dir die Props, die sie spreaden würde; du
    entscheidest, auf welches Tag sie kommen. Das ersetzt das <code>asChild</code>-Muster aus
    Radix/Bits v1.
  </p>
  <pre><code
      >{`<Toggle.Root>
  {#snippet child({ props })}
    <a href={resolve('/destination')} {...props}>Navigieren</a>
  {/snippet}
</Toggle.Root>`}</code
    ></pre>

  <p>
    Die Komponente steuert weiterhin ARIA — nur das gerenderte Tag ändert sich. Es gibt kein
    <code>asChild</code>-Prop in Kumiki und wird es nie geben.
  </p>

  <h2>Geschichtete Notausgänge</h2>
  <p>
    Reicht <code>child</code> nicht — du musst etwa drei eigene DOM-Knoten koordinieren — geh eine
    Schicht tiefer. Nutze die Headless-Attachment-Fabriken in <code>@kumiki/headless</code> und schreibe
    dein eigenes JSX/HTML drumherum.
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggle } from '@kumiki/headless/toggle';
  const t = createToggle({ pressed: $state(false) });
<\/script>

<button {@attach t.root} class="my-fancy-toggle">
  {t.pressed ? 'An' : 'Aus'}
</button>`}</code
    ></pre>

  <h2>Generics werden propagiert</h2>
  <p>
    Komponenten, die einen typisierten Wert annehmen (Combobox, RadioGroup, Select, FormField),
    propagieren diesen Generic vom Root. Innere Unter­komponenten lesen ihn über
    <code>getContext</code> — kein Bedarf, den Typ auf jeder Ebene zu wiederholen.
  </p>
</Prose>
