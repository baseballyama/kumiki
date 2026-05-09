<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>הקדמה · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ התחלה — 01"
  title="הקדמה"
  lede="Kumiki — 組木 — היא מערכת רכיבי UI ל-Svelte 5 עם נגישות עמוקה. היא נוצרה כי השאלה «תהפוך את הרכיב הזה לנגיש, ניתן לתרגום, ניתן לעיצוב ורזה» לא צריכה להיענות חמישים פעם בחמישים מאגרים."
>
  <h2>למה Kumiki?</h2>
  <p>
    רוב ספריות הרכיבים הנגישות בוחרות פשרה אחת ונדבקות בה. חלקן headless ומשאירות לך לחבר את ה-ARIA
    בעצמך. אחרות מגיעות עם עיצוב וכופות עליך מערכת עיצוב שלמה. חלקן כובלות אותך לספריית מכונת מצב
    מסוימת; אחרות אין להן כזו בכלל. Kumiki מסרבת לפשרה: חמש שכבות שניתנות להרכבה, כל אחת שמישה באופן
    עצמאי.
  </p>

  <ul>
    <li><strong>Layer 0 — Types.</strong> משטח TypeScript משותף שכל שכבה מעליו מדברת בו.</li>
    <li>
      <strong>Layer 1 — Primitives.</strong> כלי עזר ללא תלות במסגרת (focus trap, dismissable, ID, locale).
    </li>
    <li>
      <strong>Layer 2 — Machines.</strong> מכונות מצב סופיות ב-TS טהור. זמן ריצה ~1 KB, JSON ניתן לבדיקה
      מלאה.
    </li>
    <li>
      <strong>Layer 3 — Attachments.</strong> מפעלי <code>{'{@attach}'}</code> שמניעים ARIA ואת
      <code>data-state</code> על צמתי DOM אמיתיים.
    </li>
    <li>
      <strong>Layer 4 — Components.</strong> רכיבים מורכבים כמו <code>{`<Combobox.Root>`}</code>,
      ארגונומיים כברירת מחדל.
    </li>
    <li>
      <strong>Layer 5 — Atelier.</strong> וריאציות מסוגננות עם דעה, להעתקה והדבקה. נשלח כ-
      <code>0.x-preview</code>.
    </li>
  </ul>

  <h2>סטטוס</h2>
  <p>
    Kumiki בשלב <strong>קדם-אלפא</strong>. הארכיטקטורה נעולה, תקציבי הבנדל נאכפים ב-CI, וריצות קוראי
    המסך הליליות מתבצעות — אך עדיין לא פורסמה גרסה ב-npm. צפו לשינויי API. דווחו תקלות ב-
    <a href="https://github.com/baseballyama/kumiki/issues">baseballyama/kumiki</a>.
  </p>

  <h2>הצעד הבא</h2>
  <p>
    הבא: <a href="/docs/installation">התקנה</a> או
    <a href="/docs/architecture">ארכיטקטורה</a>. אם אתם מעדיפים לראות דברים בפעולה,
    <a href="/components">דפדפו ברכיבים</a>.
  </p>
</Prose>
