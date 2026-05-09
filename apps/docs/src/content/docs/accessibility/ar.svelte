<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>إمكانية الوصول · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ الأساسيات — 03"
  title="النسخة الطويلة من إمكانية الوصول."
  lede="يلتقط axe-core 30–40% من مخالفات WCAG. أمّا الـ 60% المتبقّية فمن اختبارات لوحة مفاتيح APG ومن تشغيل قارئات شاشة حقيقية. تُغلق Kumiki عمليات الدمج على الثلاثة."
>
  <h2>ثلاث طبقات من الاختبار</h2>

  <table class="strata">
    <thead>
      <tr>
        <th>ماذا</th>
        <th>متى</th>
        <th>يلتقط</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>axe-core</strong></td>
        <td>كل PR — LTR وRTL × كلّ حالة موثَّقة</td>
        <td>المخالفات السكونيّة: تسميات مفقودة، تباين، صحّة role.</td>
      </tr>
      <tr>
        <td><strong>لوحة مفاتيح APG</strong></td>
        <td>كل PR — Playwright لكلّ نمط</td>
        <td>ترتيب Tab، تنقّل بالأسهم، دلالات Home / End / Page، Escape.</td>
      </tr>
      <tr>
        <td><strong>قارئات Guidepup</strong></td>
        <td>جدول ليلي</td>
        <td>ما تقوله VoiceOver وNVDA فعليًا، وبالترتيب الفعلي.</td>
      </tr>
    </tbody>
  </table>

  <h2>أسماء مطلوبة على مستوى النوع</h2>
  <p>
    حين تُلزم WAI-ARIA APG باسم قابل للوصول (تفكّر في الحوارات)، يفرض TypeScript الشرط.
    <code>{`<Dialog.Root>`}</code> لا يُكمَّل دون أحد <code>title</code> أو <code>aria-label</code>
    أو <code>aria-labelledby</code>.
  </p>

  <pre><code
      >{`<Dialog.Root title="تأكيد الحذف">
  <!-- يُكمَّل -->
</Dialog.Root>

<Dialog.Root>
  <!-- خطأ نوع: اسم قابل للوصول مفقود -->
</Dialog.Root>`}</code
    ></pre>

  <h2>عقود لوحة المفاتيح</h2>
  <p>
    تُوثّق كلّ مكوّنة خرائط مفاتيحها في صفحة تفاصيلها (تبويب <strong>إمكانية الوصول</strong>). حيث
    تحدّد APG نمطًا، تتبعه Kumiki حرفيًا — دون تأويل إبداعي.
  </p>

  <h2>تخفيف الحركة، RTL، تباين عالٍ</h2>
  <ul>
    <li>
      تُقلّص <code>prefers-reduced-motion</code> كلّ الانتقالات إلى نحو 10 ميلي ثانية في موقع
      التوثيق.
    </li>
    <li>
      RTL ليس فكرة لاحقة. خرائط المفاتيح الحسّاسة للاتّجاه (Tabs وSlider) تقرأ الاتّجاه من سياق
      الآلة لا من DOM.
    </li>
    <li>يُحترَم وضع Forced-colors — تتجنّب المكوّنات الإيحاء بالحالة عبر الخلفية فقط.</li>
  </ul>

  <h2>قائمة «Kumiki-ready»</h2>
  <p>
    على كلّ مكوّنة أن تستوفي قائمة
    <a href="https://github.com/baseballyama/kumiki/blob/main/docs/design/05-accessibility.md"
      >docs/design/05-accessibility.md §5.6</a
    >
    قبل الدمج. لا استثناءات، ولا أعلام <code>--ignore</code>.
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
