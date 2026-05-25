<script lang="ts">
  import { resolve } from '$app/paths';
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
  <title>ميزانيات الحزم · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ الأساسيات — 05"
  title="البايتات ميزة."
  lede="لكلّ مسار فرعي للمكوّن ميزانية brotli. تفشل CI إذا انحرفت PR. رفع الميزانية يستدعي ADR جديدًا بأدلّة قياس — لا تزيد عابرة أبدًا."
>
  <h2>الأرقام</h2>
  <table class="budgets">
    <thead>
      <tr><th>المسار الفرعي</th><th class="num">Brotli</th></tr>
    </thead>
    <tbody>
      {#each budgets as b (b.name)}
        <tr><td><code>{b.name}</code></td><td class="num">{b.limit}</td></tr>
      {/each}
    </tbody>
  </table>

  <p>
    الجدول الكامل — كلّ مسار فرعي وتعليله — في
    <a href="https://github.com/baseballyama/kumiki/blob/main/docs/design/09-bundle-budget.md"
      >docs/design/09-bundle-budget.md</a
    >. الأرقام المُقاسة الحاليّة في
    <a href={resolve('/sizes')}>/sizes</a>؛ المقارنات مع المنافسين في
    <a href={resolve('/sizes/compare')}>/sizes/compare</a>.
  </p>

  <h2>كيف تُفرَض الميزانيات</h2>
  <ol>
    <li>يقيس <code>size-limit</code> كلّ مسار فرعي في كلّ تشغيل CI.</li>
    <li>إن تجاوز قياسٌ الحدّ، يفشل البناء. لا <code>--ignore</code>.</li>
    <li>
      يتحقّق <code>agadoo</code> من tree-shaking — كلّ حزمة تُعلن
      <code>sideEffects: false</code> ويُجرى عليها الفحص.
    </li>
    <li>
      <code>publint</code> + <code>arethetypeswrong</code> يتحقّقان من أنّ الشكل المنشور يطابق
      <code>exports</code> المُعلَنة.
    </li>
  </ol>

  <h2>لماذا في التوثيق</h2>
  <p>
    لأنّ على المراجعين أن يعرفوا. PR ترفع Combobox من 4.5 KB إلى 4.8 KB ليست تغييرًا صغيرًا — إنّها
    قرار يحتاج ADR مقابلًا. الرقم مرئي للمستهلكين؛ ويجب أن يكون الانضباط مرئيًا أيضًا.
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
