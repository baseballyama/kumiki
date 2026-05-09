<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);

  const matrix = [
    { task: 'FSM (מעברי מצב)', l2: 'Kumiki', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'גשר ראקטיביות של Svelte', l2: 'אתה', l3: 'אתה*', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'אלמנט <button>', l2: 'אתה', l3: 'אתה', l4: 'Kumiki', l5: 'מועתק' },
    { task: 'תכונות ARIA (aria-pressed, …)', l2: 'אתה', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'פלט data-state', l2: 'אתה', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'טיפול בקליק / מקש', l2: 'אתה', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'שם נגיש (aria-label)', l2: 'אתה', l3: 'אתה', l4: 'אתה', l5: 'Kumiki' },
    { task: 'עיצוב', l2: 'אתה', l3: 'אתה', l4: 'אתה', l5: 'מועתק' },
  ];
</script>

<svelte:head>
  <title>שכבות לדוגמה — Toggle · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ יסודות — 06"
  title="שכבות לדוגמה: Toggle"
  lede="אותו Toggle, נכתב ב-Layer 2, 3, 4, ו-5 — ונצפה זה לצד זה. כל צעד למטה במחסנית מעניק לך מעט יותר שליטה ומעט יותר אחריות."
>
  <p>
    כל השכבות של Kumiki חושפות <strong>אותה התנהגות ברמות הפשטה שונות</strong>. ירידה בשכבה אחת
    משאירה בידיך עוד DOM, ARIA והאזנה לאירועים — אבל גם מעניקה חופש לבחור את המבנה. עלייה בשכבה אחת
    — פחות קוד, אבל אתה מקבל את הבחירות המבניות של Kumiki.
  </p>

  <p>
    אנו משתמשים ב-<a href="/components/component-toggle">Toggle</a> כדוגמה מובנית. ההתנהגות פשוטה
    (לחץ כדי להחליף), אבל היישום קיים ב<strong>כל ארבע השכבות</strong>, ולכן אידיאלי להשוואה זו לצד
    זו.
  </p>

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

  <h2>1. Layer 4 — רכיב מורכב (נקודת הכניסה המוגדרת כברירת מחדל)</h2>
  <p>
    הדרך הקצרה ביותר. <code>Toggle.Root</code> מרנדר את <code>&lt;button&gt;</code>, מנהל ARIA,
    <code>data-state</code>, מקלדת ו-SSR. אתה אחראי על <strong>שני דברים</strong>: לקבל סטייט דרך
    <code>bind:pressed</code> ולספק <code>aria-label</code> (או תווית גלויה).
  </p>

  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="השתק שמע">
  {pressed ? 'מושתק' : 'פעיל'}
</Toggle.Root>`}</code
    ></pre>

  <p>ה-DOM שנוצר:</p>

  <pre><code
      >{`<button type="button" aria-pressed="false" data-state="off" id="toggle-…">
  פעיל
</button>`}</code
    ></pre>

  <p>
    <strong>בחר זאת כאשר:</strong> 90% מהמקרים. ה-<code>&lt;button&gt;</code> הטבעי מספיק, ואינך צריך
    לעקוף את מבנה העטיפה.
  </p>

  <h2>2. Layer 3 — Headless attachment</h2>
  <p>
    כשצריך לבחור את האלמנט בעצמך (<code>&lt;a&gt;</code>, <code>&lt;div role="button"&gt;</code>,
    עטיפה מותאמת). <code>createToggle()</code> מחזירה מפעל תואם ל-<code>{`{@attach}`}</code> שניתן לפזר
    על כל אלמנט שתבחר.
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggle } from '@kumiki/headless/toggle';

  const t = createToggle({ initial: false });

  // controller.pressed הוא getter רגיל. כדי להציג כטקסט יש להירשם
  // ולשקף ל-$state. (לא נחוץ אם CSS מטפל בכל.)
  let pressed = $state(t.pressed);
  $effect(() => t.subscribe(({ context }) => (pressed = context.pressed)));
<\/script>

<button {@attach t.root} aria-label="השתק שמע" class="my-btn">
  {pressed ? 'מושתק' : 'פעיל'}
</button>`}</code
    ></pre>

  <p>
    בעת ההרכבה, <code>{`{@attach t.root}`}</code> כותב את התכונות בצד ה-DOM (<code>type</code>,
    <code>aria-pressed</code>, <code>data-state</code>, <code>id</code>) ומחבר מאזיני קליק + מקש
    (Space / Enter). <strong>מה שמתווסף לאחריותך:</strong> בחירת האלמנט, העיצוב, התווית הגלויה, ו(רק
    אם נחוץ) <code>subscribe</code> כדי לשקף סטייט למשתנים ראקטיביים.
  </p>

  <p>
    <strong>בחר זאת כאשר:</strong> המבנה הקבוע של Layer 4 (<code>&lt;button&gt;</code>) לא מתאים.
    למשל, כשצריך את ה-toggle בתוך <code>&lt;label&gt;</code> או עטוף בקליפה מסדר גבוה משלך.
  </p>

  <h2>3. Layer 2 — מכונה טהורה</h2>
  <p>
    בלי Svelte בכלל — מכונת מצב סופית ב-TypeScript טהור. <strong
      >אתה כותב את ה-DOM, ARIA, האירועים והמקלדת בעצמך.</strong
    >
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
  aria-label="השתק שמע"
  onclick={() => m.send({ type: 'TOGGLE' })}
>
  {pressed ? 'מושתק' : 'פעיל'}
</button>`}</code
    ></pre>

  <p><strong>הסיבה לרדת ל-Layer 2 בדרך כלל אינה UI — אלא שימוש חוזר בלוגיקה:</strong></p>
  <ul>
    <li>אימות לוגיקת Toggle בצד השרת (server routes של SvelteKit / Workers).</li>
    <li>כתיבת בדיקות יחידה FSM טהורות ב-Vitest (ללא jsdom, ~20μs לכל מעבר).</li>
    <li>
      ויזואליזציה של מעברים ב-<a href="https://stately.ai/viz">stately.ai/viz</a> (<code
        >machine.toJSON()</code
      > מפיק JSON תואם XState).
    </li>
    <li>הטבעה במארחים שאינם Svelte (JS גולמי, Web Components, מסגרת אחרת).</li>
  </ul>

  <h2>4. Layer 5 — Atelier (וריאציות מסוגננות להעתקה)</h2>
  <p>
    ה-CLI מעתיק מקורות אל ה-repo שלך. לאחר ההעתקה, זה <strong>הקוד שלך</strong> — ערוך כרצונך.
  </p>

  <pre><code
      >{`# וריאציית Tailwind v4
npx kumiki add toggle --variant=tailwind

# וריאציית CSS גולמי
npx kumiki add toggle --variant=vanilla`}</code
    ></pre>

  <p>קבצים שנוספו:</p>

  <pre><code
      >{`src/lib/components/Toggle.svelte   # עטיפה מסוגננת סביב Toggle.Root של Layer 4`}</code
    ></pre>

  <p>השתמש בו כמו בכל רכיב Svelte אחר:</p>

  <pre><code
      >{`<script lang="ts">
  import Toggle from '$lib/components/Toggle.svelte';
  let pressed = $state(false);
<\/script>

<Toggle bind:pressed>השתק</Toggle>`}</code
    ></pre>

  <p>
    <strong>בחר זאת כאשר:</strong> אתה רוצה בסיס חזותי שעובד בלי לכתוב CSS תחילה. Layer 5 נשלחת תחת
    <code>0.x.x-preview</code> במהלך סדרת v1.0, כך שלפרויקטים רגישים ליציבות העדף Layer 4 + עיצוב משלך.
  </p>

  <h2>מטריצת אחריות</h2>

  <p>מה אתה כותב בכל שכבה. "Kumiki" = הספרייה מטפלת; "אתה" = הקוד שלך.</p>

  <table class="matrix">
    <thead>
      <tr>
        <th>אחריות</th>
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
          <td class:you={row.l2 === 'אתה'} class:them={row.l2 === 'Kumiki'}>{row.l2}</td>
          <td class:you={row.l3.startsWith('אתה')} class:them={row.l3 === 'Kumiki'}>{row.l3}</td>
          <td class:you={row.l4 === 'אתה'} class:them={row.l4 === 'Kumiki'}>{row.l4}</td>
          <td class:them={row.l5 === 'Kumiki'}>{row.l5}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <p class="note">
    * גשר הראקטיביות של Svelte נחוץ ב-L3 רק אם אתה מציג <code>controller.pressed</code> כטקסט. אם
    CSS מטפל בכל דרך <code>data-state</code>, אין צורך ב-<code>subscribe</code>.
  </p>

  <h2>בחירת שכבה — עץ החלטה</h2>

  <ul>
    <li>
      <strong>צריך שזה יעבוד עם עיצוב כבר עכשיו?</strong> → <strong>Layer 5</strong>
      (<code>npx kumiki add</code>). הערה: מסומן כ-preview במהלך v1.0.
    </li>
    <li>
      <strong>&lt;button&gt; סטנדרטי בסדר, תעצב בעצמך?</strong> → <strong>Layer 4</strong>
      (<code>{`<Toggle.Root>`}</code>). נקודת הכניסה ברירת מחדל.
    </li>
    <li>
      <strong>צריך לבחור את סוג האלמנט או המבנה בעצמך?</strong> → <strong>Layer 3</strong>
      (<code>{`{@attach t.root}`}</code>). אם הסניפט <code>child</code> של Layer 4 מכסה את הצורך, הישאר
      ב-Layer 4 — פחות קוד.
    </li>
    <li>
      <strong>הרצה מחוץ ל-Svelte / ולידציה בצד שרת / רוצה רק את ה-FSM?</strong> →
      <strong>Layer 2</strong>
      (<code>createToggleMachine</code>).
    </li>
  </ul>

  <h2>מה לקרוא בהמשך</h2>
  <ul>
    <li>
      <a href="/docs/styling">עיצוב</a> — איך להשתמש ב-<code>data-*</code>, מעבר
      <code>class</code> וסניפט <code>child</code> ב-Layer 4.
    </li>
    <li><a href="/docs/architecture">ארכיטקטורה</a> — מודל חמש השכבות המלא.</li>
    <li>
      <a href="/docs/composition">הרכבה</a> — הוספת תכונות אופציונליות דרך עוטפי <code>with*</code>.
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
