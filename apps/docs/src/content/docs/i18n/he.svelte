<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import { LOCALES } from '$lib/i18n/dict.js';
</script>

<svelte:head>
  <title>i18n ו-RTL · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ יסודות — 04"
  title="שפות כייבוא בנתיבי משנה."
  lede="אין מגה-באנדל של תרגומים. כל locale הוא ייבוא משלו בנתיב משנה במשקל ≤ 1 KB brotli, נטען בעצלות לפי דרישה. היפוך ה-RTL חי במכונת המצב, לא ב-CSS."
>
  <h2>locales של שלב 1</h2>
  <ul class="locales">
    {#each LOCALES as l (l.code)}
      <li>
        <span class="native">{l.native}</span>
        <span class="meta"><code>@kumiki/locale/{l.code}</code> · {l.name}</span>
      </li>
    {/each}
  </ul>

  <h2>החלפה בזמן ריצה</h2>
  <p>
    עטוף את האפליקציה פעם אחת, ואז החלף את חבילת ה-locale המיובאת בכל רגע. הרכיבים מתחתיה קוראים
    מחדש את ההודעות בכל שינוי.
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

  <h2>RTL אינו מחשבה מאוחרת</h2>
  <p>
    כיוון הקריאה מתפשט מ-<code>LocaleProvider</code> דרך ה-context. מפות מקשים תלויות-כיוון (Tabs
    <code>ArrowRight</code>, Slider, RadioGroup) קוראות את הכיוון מהקשר המכונה — ה-controller אינו
    יודע על RTL.
  </p>

  <p>
    ה<strong>הצגת כיוון</strong> בכל עמוד פרטי רכיב מאפשרת לראות RTL לכל locale בלי להחליף שפה. השתמש
    בה לאימות העיצוב.
  </p>

  <h2>מה מתורגם</h2>
  <p>חבילות <code>@kumiki/locale</code> מכסות:</p>
  <ul>
    <li><code>combobox</code>: תווית listbox, "אין תוצאות", כפתור ניקוי.</li>
    <li><code>dialog</code>: תווית כפתור סגירה.</li>
    <li><code>tabs</code>: תווית tablist ברירת מחדל.</li>
    <li><code>formField</code>: סימון שדה חובה, שגיאות "נדרש" / "טיפוס לא תואם".</li>
  </ul>
  <p>
    הודעות הוולידציה ש-Form Field מרכיב ניתנות להחלפה מלאה או הרחבה דרך Standard Schema — אין צורך
    במתאם לכל ולידטור.
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
