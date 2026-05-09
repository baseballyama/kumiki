<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';

  const layers = [
    {
      n: 0,
      ji: '型',
      name: 'Types',
      pkg: '@kumiki/types',
      role: 'משטח TypeScript משותף — הדבר היחיד שכל שכבה מעליו מסכימה עליו.',
    },
    {
      n: 1,
      ji: '基',
      name: 'Primitives',
      pkg: '@kumiki/primitives',
      role: 'כלי עזר ללא תלות במסגרת (focus trap, dismissable, ID, locale, motion).',
    },
    {
      n: 2,
      ji: '機',
      name: 'Machines',
      pkg: '@kumiki/machines',
      role: 'מכונות מצב ב-TS טהור. זמן ריצה ~1 KB, JSON ניתן לבדיקה.',
    },
    {
      n: 3,
      ji: '装',
      name: 'Attachments',
      pkg: '@kumiki/headless',
      role: 'מפעלי {@attach} של Svelte 5 — מניעים ARIA + data-state על DOM אמיתי.',
    },
    {
      n: 4,
      ji: '組',
      name: 'Components',
      pkg: '@kumiki/components',
      role: 'רכיבים מורכבים. API ארגונומי עם מרחב שמות בנקודות.',
    },
    {
      n: 5,
      ji: '釉',
      name: 'Atelier',
      pkg: '@kumiki/atelier',
      role: 'תצוגה מקדימה של Layer 5 — וריאציות מסוגננות להעתקה.',
    },
  ];
</script>

<svelte:head>
  <title>ארכיטקטורה · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ יסודות — 01"
  title="חמש שכבות, מודל מנטלי אחד."
  lede="כל פרימיטיב Kumiki חי בשכבה אחת בדיוק. בחר את השכבה שמתאימה לדרישת השליטה שלך — ושלח רק את הביטים של השכבה הזו. ייצוא בנתיבי משנה שומר על tree-shaking כירורגי."
>
  <p>
    השמות שאולים מחיבורי <em>Kumiki</em> בעץ. כל שכבה היא חלק שמשתלב הבא ללא מסמרים או דבק.
  </p>

  <table class="layers">
    <thead>
      <tr>
        <th>L</th>
        <th>שם</th>
        <th>חבילה</th>
        <th>תפקיד</th>
      </tr>
    </thead>
    <tbody>
      {#each layers as l (l.n)}
        <tr>
          <td class="num">L{l.n}</td>
          <td><span class="ji">{l.ji}</span><strong>{l.name}</strong></td>
          <td><code>{l.pkg}</code></td>
          <td class="role">{l.role}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <h2>בחירת שכבה</h2>
  <p>רוב האפליקציות חיות ב-Layer 4. רד נמוך יותר רק כשאתה צריך:</p>
  <ul>
    <li>
      <strong>Layer 3 (attachments)</strong> כשאתה שולט הדוק ב-DOM — אתה מעצב עם
      <code>&lt;button&gt;</code> טבעי, לא עם עטיפת Svelte.
    </li>
    <li>
      <strong>Layer 2 (machines)</strong> ל-SSR / ולידציה בצד השרת, או להריץ את הלוגיקה בהקשר שאינו Svelte
      (Cypress, Vitest, worker).
    </li>
    <li>
      <strong>Layer 1 (primitives)</strong> כשאתה כותב את הרכיב שלך מעל מנועי dismissable / focus-trap
      / ID.
    </li>
  </ul>

  <h2>למה לא להכניס הכל?</h2>
  <p>
    תקציבי בנדל. לכל subpath יש תקציב brotli שנאכף ב-CI — Toggle נשלח ב-1.5 KB, Combobox ב-4.5 KB.
    משיכת וריאציות מסוגננות של Layer 5 לתוך פרויקט שכבר יש לו design tokens משלו היא בזבוז ביטים;
    חבילת Atelier היא opt-in, לא ברירת מחדל.
  </p>

  <h2>קריאת חובה</h2>
  <p>
    מסמכי העיצוב הפנימיים חיים ב-
    <a href="https://github.com/baseballyama/kumiki/tree/main/docs/design">/docs/design</a>. במיוחד
    שים לב ל:
  </p>
  <ul>
    <li><code>02-architecture.md</code> — מודל השכבות הזה, עם תרשימים.</li>
    <li><code>03-package-structure.md</code> — גבולות חבילות.</li>
    <li><code>04-state-machines.md</code> — מפרט זמן ריצה של FSM.</li>
    <li><code>09-bundle-budget.md</code> — תקציבי brotli לכל subpath.</li>
  </ul>
</Prose>

<style>
  table.layers {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 14px;
  }
  table.layers th,
  table.layers td {
    padding: 12px 14px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: middle;
  }
  table.layers th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    border-block-end-color: var(--k-line-2);
    font-weight: 500;
  }
  table.layers .num {
    color: var(--k-shu);
    font-family: var(--k-font-mono);
    font-size: 12px;
    width: 5%;
  }
  table.layers .ji {
    font-family: var(--k-font-display);
    font-size: 22px;
    color: var(--k-ink-1);
    margin-inline-end: 8px;
    font-variation-settings:
      'opsz' 36,
      'SOFT' 30;
  }
  table.layers .role {
    color: var(--k-ink-3);
  }
  table.layers code {
    font-size: 11px;
  }
</style>
