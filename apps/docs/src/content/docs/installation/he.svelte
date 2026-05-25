<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>התקנה · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ התחלה — 02"
  title="התקנה"
  lede="Kumiki נשלחת כסט של חבילות עם גרסאות עצמאיות ב-npm. התקן רק את השכבה שאתה צריך; ייבוא בנתיב משנה שומר על tree-shaking חד."
>
  <h2>דרישות</h2>
  <ul>
    <li>Node.js 22 ומעלה.</li>
    <li>Svelte 5.29+ (לדירקטיבת <code>{'{@attach}'}</code>).</li>
    <li>באנדלר תומך-ESM — Vite 5+, Rollup 4+, esbuild 0.25+. CJS לא נשלח.</li>
  </ul>

  <h2>בחר את השכבה</h2>
  <p>רוב המשתמשים רוצים את Layer 4 — רכיבים מורכבים — וחבילת locale:</p>
  <pre><code>pnpm add @kumiki/components @kumiki/locale</code></pre>

  <p>צריך שליטה מלאה ב-DOM? דלג על הרכיבים וצרוך attachments של Layer 3 ישירות:</p>
  <pre><code>pnpm add @kumiki/headless</code></pre>

  <p>בונה רכיבים משלך? אפשר להשתמש בכל מכונת מצב לבד:</p>
  <pre><code>pnpm add @kumiki/machines</code></pre>

  <h2>ספק locale</h2>
  <p>
    עטוף את האפליקציה ב-<code>LocaleProvider</code> פעם אחת. כל רכיב Kumiki תחתיו אוסף את ההודעות ואת
    כיוון הקריאה.
  </p>
  <pre><code
      >{`<script lang="ts">
  import { LocaleProvider } from '@kumiki/components';
  import { messages, direction } from '@kumiki/locale/he';

  let { children } = $props();
<\/script>

<LocaleProvider.Root locale="he" {messages} dir={direction}>
  {@render children()}
</LocaleProvider.Root>`}</code
    ></pre>

  <p>
    חבילות ה-locale הן ייבוא בנתיב משנה — כל אחת שוקלת ≤ 1 KB brotli. החלף שפה בזמן ריצה על-ידי
    החלפת חבילת <code>messages</code>; הרכיבים מחשבים מחדש את הטקסט של ARIA אוטומטית.
  </p>

  <h2>אמת את ההתקנה</h2>
  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="השתק שמע">
  {pressed ? 'מושתק' : 'פעיל'}
</Toggle.Root>`}</code
    ></pre>

  <p>זהו. גש ל<a href={resolve('/components')}>קטלוג הרכיבים</a>.</p>
</Prose>
