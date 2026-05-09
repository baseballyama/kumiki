<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);
</script>

<svelte:head>
  <title>הרכיב הראשון שלך · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ התחלה — 03"
  title="הרכיב הראשון שלך"
  lede="סיור מודרך של חמש דקות. נחבר Toggle, נצפה בחוזה ה-ARIA שלו ונחליף את שפת התצוגה בלי לגעת ברכיב."
>
  <h2>1. שים אותו</h2>
  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="השתק שמע">
  {pressed ? 'מושתק' : 'פעיל'}
</Toggle.Root>`}</code
    ></pre>

  <h2>2. ראה אותו מגיב</h2>
  <p>ה-Toggle למטה מחובר לסטייט המקומי שלך, לא לרישום הדמואים — נסה אותו.</p>

  <PreviewFrame>
    <div style="display: flex; gap: 16px; align-items: center;">
      <Toggle.Root bind:pressed aria-label="השתק שמע">
        {pressed ? 'מושתק' : 'פעיל'}
      </Toggle.Root>
      <span style="font-family: var(--k-font-mono); font-size: 12px; color: var(--k-ink-3);">
        pressed = {pressed}
      </span>
    </div>
  </PreviewFrame>

  <h2>3. בדוק את החוזה</h2>
  <p>
    פתח את כלי הפיתוח. לכפתור יש <code>aria-pressed</code> שמובל על-ידי הסטייט, וכן
    <code>data-state="on"</code> כמכוון CSS. אין CSS גלובלי, אין דעות עיצוביות — עצב כרצונך.
  </p>
  <pre><code
      >{`<button aria-pressed="true" data-state="on" type="button">
  מושתק
</button>`}</code
    ></pre>

  <h2>4. תרגם אותו</h2>
  <p>
    החלף את ה-locale בכותרת העליונה. ל-Toggle עצמו אין מחרוזות מתורגמות, אבל רכיבים כמו Combobox,
    Dialog ו-FormField יחליפו מיד. נסה את
    <a href="/components/component-combobox">דמו Combobox</a> אחרי החלפה ליפנית.
  </p>

  <h2>מה עכשיו?</h2>
  <ul>
    <li>קרא את ה<a href="/docs/architecture">ארכיטקטורה החמש-שכבתית</a>.</li>
    <li>עיין ב<a href="/docs/accessibility">מודל הנגישות</a>.</li>
    <li>דפדף בין <a href="/components">כל הרכיבים</a> עם דמואים חיים.</li>
  </ul>
</Prose>
