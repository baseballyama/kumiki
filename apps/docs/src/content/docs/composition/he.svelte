<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>הרכבה · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ יסודות — 02"
  title="הרכבה מעל קונפיגורציה."
  lede="רכיבי Kumiki הם פרימיטיבים מורכבים. ה-Root מקים את הסטייט, וסאב-רכיבים מנויים מציגים אותו. דפוס child snippet מאפשר להחליף כל אלמנט מבלי לאבד התנהגות."
>
  <h2>צורה מורכבת</h2>
  <p>כל רכיב Layer 4 עוקב אחר אותה תבנית:</p>
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

  <h2>הסניפט <code>child</code></h2>
  <p>
    צריך לרנדר <code>{`<a>`}</code> במקום <code>{`<button>`}</code>? השתמש בסניפט
    <code>child</code>. הרכיב מוסר לך את ה-props שהיה מפזר; אתה מחליט באיזה תג להניח אותם. זה מחליף
    את דפוס <code>asChild</code> של Radix/Bits v1.
  </p>
  <pre><code
      >{`<Toggle.Root>
  {#snippet child({ props })}
    <a href="/destination" {...props}>נווט</a>
  {/snippet}
</Toggle.Root>`}</code
    ></pre>

  <p>
    הרכיב עדיין שולט ב-ARIA — רק התג שמרונדר משתנה. אין prop בשם <code>asChild</code> ב-Kumiki ולא
    יהיה.
  </p>

  <h2>פתחי מילוט שכבתיים</h2>
  <p>
    אם <code>child</code> לא מספיק — למשל אתה צריך לתאם שלושה DOM nodes מותאמים — רד שכבה. השתמש
    במפעלי ה-attachment ב-<code>@kumiki/headless</code> וכתוב JSX/HTML משלך סביבם.
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggle } from '@kumiki/headless/toggle';
  const t = createToggle({ pressed: $state(false) });
<\/script>

<button {@attach t.root} class="my-fancy-toggle">
  {t.pressed ? 'דלוק' : 'כבוי'}
</button>`}</code
    ></pre>

  <h2>גנריקות מתפשטות</h2>
  <p>
    רכיבים שמקבלים ערך עם טיפוס (Combobox, RadioGroup, Select, FormField) מפיצים את הגנריקה מה-Root.
    סאב-רכיבים פנימיים קוראים אותה דרך <code>getContext</code>. אין צורך לחזור על הטיפוס בכל רמה.
  </p>
</Prose>
