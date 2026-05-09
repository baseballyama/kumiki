<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import { LOCALES } from '$lib/i18n/dict.js';
</script>

<svelte:head>
  <title>i18n وRTL · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ الأساسيات — 04"
  title="اللغات كاستيرادات بمسار فرعي."
  lede="لا حزمة عملاقة من الترجمات. كل locale استيراد بمسار فرعي خاصّ به بحجم ≤ 1 KB brotli، يُحمَّل عند الطلب. ينعكس RTL داخل آلة الحالة لا في CSS."
>
  <h2>locales المرحلة 1</h2>
  <ul class="locales">
    {#each LOCALES as l (l.code)}
      <li>
        <span class="native">{l.native}</span>
        <span class="meta"><code>@kumiki/locale/{l.code}</code> · {l.name}</span>
      </li>
    {/each}
  </ul>

  <h2>التبديل وقت التشغيل</h2>
  <p>
    لُفّ تطبيقك مرّة واحدة، ثمّ بدّل حزمة locale المستوردة في أيّ وقت. تعيد المكوّنات الواقعة تحته
    قراءة الرسائل عند كل تغيير.
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

  <h2>RTL ليس فكرة لاحقة</h2>
  <p>
    يَنتشر اتّجاه القراءة من <code>LocaleProvider</code> عبر السياق. تقرأ خرائط المفاتيح الحساسة
    للاتّجاه (Tabs <code>ArrowRight</code> وSlider وRadioGroup) الاتّجاه من سياق الآلة — لا يعرف الـ controller
    شيئًا عن RTL.
  </p>

  <p>
    يُتيح <strong>زر تبديل الاتّجاه</strong> في كل صفحة تفاصيل مكوّن معاينة RTL لأيّ locale دون تبديل
    اللغة. استخدمه لاختبار التنسيق.
  </p>

  <h2>ما الذي يُتَرجَم</h2>
  <p>تشمل حزم <code>@kumiki/locale</code>:</p>
  <ul>
    <li><code>combobox</code>: تسمية listbox، «لا نتائج»، زر المسح.</li>
    <li><code>dialog</code>: تسمية زرّ الإغلاق.</li>
    <li><code>tabs</code>: تسمية tablist الافتراضية.</li>
    <li><code>formField</code>: علامة الإلزام، أخطاء «مطلوب» / «نوع غير متطابق».</li>
  </ul>
  <p>
    رسائل التحقق التي يؤلّفها Form Field يمكن استبدالها بالكامل أو توسيعها عبر Standard Schema — لا
    حاجة إلى محوّلات لكل مدقّق.
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
