<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);

  const stack = [
    {
      layer: 'בסיס מוצר',
      tool: 'סלקטורי CSS גלובליים [data-component*]',
      use: 'כללי reset משותפים לכל Dialog',
    },
    { layer: 'חלקי מערכת עיצוב', tool: 'העברת class לסאב-רכיבים', use: 'עיצוב מבני ל-<MyDialog>' },
    {
      layer: 'וריאציה / ערכת נושא',
      tool: 'CSS Custom Properties',
      use: 'צבעי מותג, החלפה בהיר / כהה',
    },
    {
      layer: 'הבדלי מצב',
      tool: 'סלקטורי data-state (או Tailwind data-[state=open]:)',
      use: 'פתוח / סגור, נבחר, מושבת, ריחוף',
    },
    { layer: 'החלפת אלמנט', tool: 'snippet child', use: 'רנדר <a> או <MyButton> כאלמנט שורש' },
  ];
</script>

<svelte:head>
  <title>עיצוב · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ יסודות — 07"
  title="עיצוב"
  lede="Kumiki Layer 4 שולחת אפס בייטים של CSS. למה בנינו את זה כך, איך להלביש אותה, ואיך לנווט במגבלות הסגנון הסקופים של Svelte — חמישה מתכונים ומלכודת אחת."
>
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

  <h2>למה Kumiki לא שולחת סגנונות</h2>
  <p>Layer 4 פולטת רק <strong>DOM סמנטי + ARIA + תכונות <code>data-*</code></strong>. בכוונה:</p>
  <ul>
    <li>
      <strong>תקציבי בנדל</strong>: Toggle 1.5 KB / Dialog 3.5 KB / Combobox 4.5 KB לא משאירים מקום
      ל-CSS.
    </li>
    <li>
      <strong>מערכות עיצוב משתנות</strong>: Tailwind / UnoCSS / CSS גולמי / CSS-in-JS — בכך שאיננו
      מחליטים דבר, אנו מתאימים לכולן.
    </li>
    <li>
      <strong>אנימציה היא גם CSS</strong>: אנו פולטים רק <code>data-state="open|closed"</code>; אתם
      בוחרים בין CSS Transitions, View Transitions או ספריית motion.
    </li>
  </ul>

  <p>אז אתם מחברים עיצוב מ<strong>חמש טכניקות</strong>. רשומות בסדר עדיפות.</p>

  <h2>מתכון 1: סלקטורי <code>data-*</code> (הדרך הקאנונית לעיצוב מצב)</h2>
  <p>קראו את התכונות שפלטה Kumiki דרך סלקטורי CSS. דפוס מנוסה שביסס Radix.</p>

  <table class="attrs">
    <thead>
      <tr><th>תכונה</th><th>ערכים</th><th>איפה מופיע</th></tr>
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
        ><td>אלמנטים ממוקמים-צף</td></tr
      >
      <tr
        ><td><code>data-direction</code></td><td><code>ltr</code> / <code>rtl</code></td><td
          >היפוך RTL</td
        ></tr
      >
      <tr><td><code>data-disabled</code></td><td>(מחרוזת ריקה)</td><td>מצב מושבת</td></tr>
      <tr
        ><td><code>data-checked</code></td><td
          ><code>true</code> / <code>false</code> / <code>mixed</code></td
        ><td>Checkbox / Toggle / Switch</td></tr
      >
      <tr
        ><td><code>data-component</code> / <code>data-component-host</code></td><td
          ><code>combobox</code> / <code>dialog</code> / …</td
        ><td>מזהה את אלמנט שורש הרכיב</td></tr
      >
      <tr
        ><td><code>data-component-part</code></td><td
          ><code>title</code> / <code>close</code> / <code>overlay</code> / …</td
        ><td>מזהה אלמנטים של סאב-רכיב</td></tr
      >
    </tbody>
  </table>

  <pre><code
      >{`/* גיליון סגנונות גלובלי */
[data-state='on'] { background: var(--ds-accent); color: white; }
[data-state='off'] { background: var(--ds-surface-2); }
[data-state='open'] { animation: fade-in 200ms; }
[data-state='closed'] { animation: fade-out 150ms; }`}</code
    ></pre>

  <p>אותו הדבר ב-Tailwind / UnoCSS:</p>
  <pre><code
      >{`<Toggle.Root class="bg-gray-200 data-[state=on]:bg-blue-500 data-[state=on]:text-white" />`}</code
    ></pre>

  <h2>מתכון 2: העברת <code>class</code> / <code>style</code></h2>
  <p>
    סאב-רכיבי Layer 4 הם <strong>עטיפות דקות חד-אלמנטיות שמפזרות <code>...rest</code></strong>. כל
    מה שתעבירו — <code>class</code>, <code>style</code>, <code>data-*</code> נוספים, תכונות ARIA נוספות
    — נוחת על שורש ה-DOM האמיתי.
  </p>

  <pre><code
      >{`<Toggle.Root class="ds-toggle" style="--ring-color: var(--ds-accent)">
  השתק
</Toggle.Root>`}</code
    ></pre>

  <p>
    הפניית מימוש: <code>packages/components/src/toggle/Root.svelte</code> מצהיר על
    <code>[key: string]: unknown</code>
    בטיפוס Props ומפזר <code>...rest</code> ישירות על ה-<code>&lt;button&gt;</code> שלו.
  </p>

  <h2>מתכון 3: CSS Custom Properties (הדרך הקאנונית להפצת ערכת נושא)</h2>
  <p>
    בשונה מה-CSS הסקופי של Svelte, <strong>משתני CSS זורמים דרך הקסקייד הרגיל</strong>. כשמוצהרים על
    האב, הם מגיעים ל-DOM בתוך רכיבים-בנים — ועוקפים לחלוטין את חסם הסקופ של Svelte.
  </p>

  <pre><code
      >{`<Combobox.Root style="
  --combobox-bg: var(--ds-surface);
  --combobox-border: var(--ds-line-strong);
">
  <Combobox.Input class="ds-input" />
</Combobox.Root>

<style>
  /* הסגנון הסקופי של MyCombobox.svelte — מגיע ל-<input> הפנימי של הילד */
  .ds-input {
    background: var(--combobox-bg);
    border: 1px solid var(--combobox-border);
  }
</style>`}</code
    ></pre>

  <p>
    <strong>השתמשו בזה ל:</strong> צבעי מותג, החלפת מצב כהה, טוקנים שצריכים לחצות גבולות רכיבים.
  </p>

  <h2>מתכון 4: snippet <code>child</code> — החלפת אלמנט</h2>
  <p>
    כברירת מחדל <code>Toggle.Root</code> מרנדר <code>&lt;button&gt;</code>. פתח החירום ל"אני רוצה
    <code>&lt;a&gt;</code>
    כאן" או "אני רוצה את <code>&lt;MyButton&gt;</code> שלי".
  </p>

  <pre><code
      >{`<Toggle.Root bind:pressed>
  {#snippet child({ props, state })}
    <MyButton {...props} class="brand-btn" disabled={state.disabled}>
      {state.pressed ? 'מושתק' : 'פעיל'}
    </MyButton>
  {/snippet}
</Toggle.Root>`}</code
    ></pre>

  <p>
    <code>props</code> מטופס במלואו: <code>type</code> / <code>aria-pressed</code> /
    <code>aria-disabled</code>
    / <code>data-state</code> / <code>onclick</code> / <code>onkeydown</code> / <code>id</code>.
    תפקידכם לפזר אותו על האלמנט שלכם.
  </p>

  <p class="note">
    <strong>אל תשלפו את זה כברירת מחדל.</strong> <code>child</code> הוא פתח חירום, לא נתיב עיצוב
    סטנדרטי. אם העברת <code>class</code> מכסה זאת, העדיפו אותה — וזכרו שפיזור מחדש של
    <code>props</code> הוא באחריותכם (שכחה מאבדת חיווט ARIA / אירועים).
  </p>

  <h2>מתכון 5: Tailwind / UnoCSS / CSS גולמי</h2>

  <h3>Tailwind v4</h3>
  <pre><code
      >{`<Toggle.Root class="
  inline-flex items-center px-3 py-2 rounded-md
  bg-gray-200 text-gray-700
  data-[state=on]:bg-blue-600 data-[state=on]:text-white
  data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
" />`}</code
    ></pre>

  <h3>UnoCSS (מצב ברירת מחדל)</h3>
  <p>
    חוויית כתיבה זהה ל-Tailwind. הווריאנט <code>data-[state=on]:</code> מובנה דרך
    <code>@unocss/preset-mini</code>
    / <code>preset-wind3</code>.
  </p>

  <h3>UnoCSS מצב svelte-scoped</h3>
  <p>
    <code>@unocss/svelte-scoped</code> סורק כל <code>.svelte</code> אב, ואז מזריק את ה-CSS שיצר
    <strong>עטוף ב-<code>:global(...)</code></strong>
    לתוך ה-<code>&lt;style&gt;</code> של אותו קובץ. מכיוון שהכללים גלובליים, ה-utilities שכתבתם באב מגיעים
    ל-DOM בתוך רכיבים-בנים בלי עבודה נוספת.
  </p>

  <h3>CSS גולמי / CSS Modules</h3>

  <pre><code
      >{`/* app.css (גלובלי) */
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

  <pre><code>{`<Toggle.Root class="ds-toggle">השתק</Toggle.Root>`}</code></pre>

  <h2>תבנית: בניית מערכת עיצוב מעל</h2>
  <p>עטפו את Kumiki ב-<code>&lt;MyToggle&gt;</code> משלכם לשימוש חוזר ברחבי המוצר.</p>

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
  /* מתכון 2 — העברת class פירושה שהסגנון הסקופי הזה מגיע ל-DOM האמיתי */
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

  <p>צד הצרכן:</p>
  <pre><code
      >{`<script lang="ts">
  import MyToggle from '$lib/components/MyToggle.svelte';
  let muted = $state(false);
<\/script>

<MyToggle bind:pressed={muted} aria-label="השתק שמע">
  {muted ? 'מושתק' : 'פעיל'}
</MyToggle>`}</code
    ></pre>

  <h2>מלכודת: ה-<code>&lt;style&gt;</code> הסקופי של Svelte לא מתפשט לבנים</h2>
  <p>
    מגבלה ארוכת שנים של Svelte: מחלקות שהוגדרו ב-<code>&lt;style&gt;</code> של <code>.svelte</code>
    אב <strong>לא מגיעות לאלמנטי DOM בתוך רכיבים-בנים</strong>.
  </p>

  <pre><code
      >{`<!-- לא עובד כצפוי -->
<Combobox.Root class="my-combo">
  <Combobox.Input />
</Combobox.Root>

<style>
  /* .my-combo לא בשימוש בתבנית הקובץ הזה, לכן Svelte עשוי להסיר אותו,
     וה-<input> הצאצא חי בסקופ של רכיב אחר. */
  .my-combo input { padding: 8px; }
</style>`}</code
    ></pre>

  <p>ארבע יציאות:</p>
  <ol>
    <li>
      <strong>השתמשו ב-Tailwind / UnoCSS / גיליון סגנונות גלובלי</strong> (מתכונים 1, 5). לא סקופי
      מלכתחילה, אז הבעיה לא קיימת. <strong>המלצת קו ראשון.</strong>
    </li>
    <li>
      <strong>העבירו <code>class</code> לכל סאב-רכיב</strong> (מתכון 2).
      <code>&lt;Combobox.Input class="ds-input" /&gt;</code>
      מנחית את המחלקה על אלמנט השורש של הילד. בתוך <code>&lt;style&gt;</code> אב תכתבו
      <code>:global(.ds-input)</code>
      (או העבירו את הכלל ל-<code>app.css</code>).
    </li>
    <li>
      <strong>CSS Custom Properties</strong> (מתכון 3). הם חוצים את הסקופינג של Svelte. הכי טוב להפצת
      ערכת נושא.
    </li>
    <li>
      <strong>חדירה עם <code>:global(...)</code></strong>. מוצא אחרון.
      <pre><code
          >{`<style>
  .my-combo :global([data-component-part='item'][data-highlighted]) {
    background: var(--ds-accent-subtle);
  }
</style>`}</code
        ></pre>
      Svelte 5 תומכת גם בתחביר הבלוק<code>:global &#123; ... &#125;</code>.
    </li>
  </ol>

  <h2>הסטאק המומלץ</h2>
  <table class="stack">
    <thead>
      <tr><th>שכבה</th><th>כלי</th><th>שימוש</th></tr>
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

  <h2>מה לקרוא בהמשך</h2>
  <ul>
    <li><a href="/docs/layers-by-example">שכבות לדוגמה</a> — איך הקוד שלך שונה ב-Layer 2/3/4/5.</li>
    <li>
      <a href="/docs/composition">הרכבה</a> — הוספת תכונות אופציונליות דרך עוטפי <code>with*</code>.
    </li>
    <li><a href="/docs/i18n">i18n ו-RTL</a> — שימוש ב-<code>data-direction</code> לעיצוב RTL.</li>
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
