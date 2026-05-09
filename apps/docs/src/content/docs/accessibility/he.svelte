<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>נגישות · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ יסודות — 03"
  title="הגרסה הארוכה של נגישות."
  lede="axe-core תופס 30–40% מהפרות WCAG. ה-60% הנותרים מגיעים מבדיקות מקלדת APG ומריצות אמיתיות של קוראי מסך. Kumiki חוסמת merges על שלושתם."
>
  <h2>שלוש שכבות בדיקה</h2>

  <table class="strata">
    <thead>
      <tr>
        <th>מה</th>
        <th>מתי</th>
        <th>מה היא תופסת</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>axe-core</strong></td>
        <td>כל PR — LTR & RTL × כל מצב מתועד</td>
        <td>הפרות סטטיות: תוויות חסרות, ניגודיות, תקפות role.</td>
      </tr>
      <tr>
        <td><strong>מקלדת APG</strong></td>
        <td>כל PR — Playwright לפי דפוס</td>
        <td>סדר Tab, ניווט בחיצים, סמנטיקה של Home / End / Page, Escape.</td>
      </tr>
      <tr>
        <td><strong>קוראי Guidepup</strong></td>
        <td>תזמון לילי</td>
        <td>מה ש-VoiceOver ו-NVDA אומרים בפועל, בסדר האמיתי.</td>
      </tr>
    </tbody>
  </table>

  <h2>שמות נדרשים ברמת הטיפוס</h2>
  <p>
    היכן ש-WAI-ARIA APG מחייבת שם נגיש (חשבו על דיאלוגים), TypeScript אוכפת את הדרישה.
    <code>{`<Dialog.Root>`}</code> לא ייקמפל ללא אחד מ-<code>title</code>, <code>aria-label</code>
    או <code>aria-labelledby</code>.
  </p>

  <pre><code
      >{`<Dialog.Root title="אישור מחיקה">
  <!-- מתקמפל -->
</Dialog.Root>

<Dialog.Root>
  <!-- שגיאת טיפוס: שם נגיש חסר -->
</Dialog.Root>`}</code
    ></pre>

  <h2>חוזי מקלדת</h2>
  <p>
    כל רכיב מתעד את מפת המקשים שלו בעמוד הפרטים (טאב <strong>נגישות</strong>). היכן ש-APG מגדירה
    דפוס, Kumiki עוקבת אחריו מילה במילה — בלי פרשנות יצירתית.
  </p>

  <h2>הפחתת תנועה, RTL, ניגודיות גבוהה</h2>
  <ul>
    <li><code>prefers-reduced-motion</code> מצמצם את כל המעברים ל-~10 מ״ש בכל אתר התיעוד.</li>
    <li>
      RTL אינו מחשבה מאוחרת. מפות מקשים תלויות-כיוון (Tabs, Slider) קוראות את הכיוון מהקשר המכונה,
      לא מה-DOM.
    </li>
    <li>מצב Forced-colors מכובד — רכיבים נמנעים מסימון מצב באמצעות רקע בלבד.</li>
  </ul>

  <h2>רשימת ה״Kumiki-ready״</h2>
  <p>
    כל רכיב חייב לעמוד ברשימה ב-
    <a href="https://github.com/baseballyama/kumiki/blob/main/docs/design/05-accessibility.md"
      >docs/design/05-accessibility.md §5.6</a
    >
    לפני המיזוג. ללא יוצאים מן הכלל, ללא דגלי <code>--ignore</code>.
  </p>
</Prose>

<style>
  table.strata {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 14px;
  }
  table.strata th,
  table.strata td {
    padding: 12px 14px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: top;
  }
  table.strata th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    font-weight: 500;
  }
  table.strata td {
    color: var(--k-ink-3);
  }
  table.strata td:first-child {
    color: var(--k-ink-1);
    width: 22%;
  }
  table.strata td:nth-child(2) {
    width: 32%;
  }
</style>
