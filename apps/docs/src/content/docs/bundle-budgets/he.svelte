<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';

  const budgets = [
    { name: '@kumiki/primitives/<each>', limit: '500 B' },
    { name: '@kumiki/runtime', limit: '1 KB' },
    { name: '@kumiki/machines/toggle', limit: '800 B' },
    { name: '@kumiki/machines/combobox', limit: '3 KB' },
    { name: '@kumiki/components/toggle', limit: '1.5 KB' },
    { name: '@kumiki/components/dialog', limit: '3.5 KB' },
    { name: '@kumiki/components/combobox', limit: '4.5 KB' },
    { name: '@kumiki/locale/<lang>', limit: '1 KB' },
  ];
</script>

<svelte:head>
  <title>תקציבי בנדל · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ יסודות — 05"
  title="ביטים הם פיצ׳ר."
  lede="לכל subpath של רכיב יש תקציב brotli. CI נכשלת אם PR סוטה ממנו. העלאת תקציב מחייבת ADR חדש עם ראיות מדודות — לעולם לא תוספת מזדמנת."
>
  <h2>המספרים</h2>
  <table class="budgets">
    <thead>
      <tr><th>Subpath</th><th class="num">Brotli</th></tr>
    </thead>
    <tbody>
      {#each budgets as b (b.name)}
        <tr><td><code>{b.name}</code></td><td class="num">{b.limit}</td></tr>
      {/each}
    </tbody>
  </table>

  <p>
    הטבלה המלאה — כל subpath וכל הנמקה — חיה ב-
    <a href="https://github.com/baseballyama/kumiki/blob/main/docs/design/09-bundle-budget.md"
      >docs/design/09-bundle-budget.md</a
    >. המספרים הנמדדים כעת מוצגים ב-
    <a href="/sizes">/sizes</a>; השוואות מול מתחרים ב-
    <a href="/sizes/compare">/sizes/compare</a>.
  </p>

  <h2>איך תקציבים נאכפים</h2>
  <ol>
    <li><code>size-limit</code> מודד כל subpath בכל ריצת CI.</li>
    <li>אם מדידה חורגת מהמגבלה, ה-build נכשל. ללא <code>--ignore</code>.</li>
    <li>
      <code>agadoo</code> מאמת tree-shaking — כל חבילה מצהירה
      <code>sideEffects: false</code> ונבדקת.
    </li>
    <li>
      <code>publint</code> + <code>arethetypeswrong</code> מאמתים שהצורה שפורסמה תואמת את
      <code>exports</code> שהוצהרו.
    </li>
  </ol>

  <h2>למה זה בתיעוד</h2>
  <p>
    כי לסוקרים מגיע לדעת. PR שמעלה את Combobox מ-4.5 KB ל-4.8 KB אינה שינוי קטן — היא החלטה
    שמחייבת ADR מתאים. המספר גלוי לצרכנים; גם המשמעת חייבת להיות גלויה.
  </p>
</Prose>

<style>
  table.budgets {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 14px;
  }
  table.budgets th,
  table.budgets td {
    padding: 10px 14px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
  }
  table.budgets th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    font-weight: 500;
  }
  table.budgets .num {
    text-align: end;
    font-family: var(--k-font-mono);
    color: var(--k-shu-ink);
  }
  :global([data-theme='dark']) table.budgets .num {
    color: var(--k-shu);
  }
  table.budgets code {
    font-size: 12px;
    background: transparent;
    border: 0;
    padding: 0;
  }
</style>
