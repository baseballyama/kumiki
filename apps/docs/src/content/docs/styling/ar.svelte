<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);

  const stack = [
    {
      layer: 'الأساس المنتجي',
      tool: 'محدّدات CSS عامّة [data-component*]',
      use: 'قواعد إعادة تعيين تتشاركها كل Dialog',
    },
    {
      layer: 'قطع نظام التصميم',
      tool: 'تمرير class إلى المكوّنات الفرعية',
      use: 'تنسيق هيكلي لـ <MyDialog>',
    },
    {
      layer: 'الصيغة / الموضوع',
      tool: 'CSS Custom Properties',
      use: 'ألوان العلامة، التبديل بين الفاتح / الداكن',
    },
    {
      layer: 'فروقات الحالة',
      tool: 'محدّدات data-state (أو Tailwind data-[state=open]:)',
      use: 'مفتوح / مغلق، مُحدَّد، معطَّل، تحويم',
    },
    { layer: 'استبدال العنصر', tool: 'scnippet child', use: 'تصيير <a> أو <MyButton> كعنصر جذر' },
  ];
</script>

<svelte:head>
  <title>التنسيق · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ الأساسيات — 07"
  title="التنسيق"
  lede="تشحن Kumiki Layer 4 صفر بايت من CSS. لماذا بنيناه هكذا، وكيف تُلبسه، وكيف تتعامل مع حدود scoped style في Svelte — خمس وصفات وفخّ واحد."
>
  <PreviewFrame>
    <div style="display: flex; gap: 16px; align-items: center;">
      <Toggle.Root bind:pressed aria-label="كتم الصوت">
        {pressed ? 'مكتوم' : 'مُشغَّل'}
      </Toggle.Root>
      <span style="font-family: var(--k-font-mono); font-size: 12px; color: var(--k-ink-3);">
        pressed = {pressed}
      </span>
    </div>
  </PreviewFrame>

  <h2>لماذا لا تشحن Kumiki أنماطًا</h2>
  <p>تُصدر Layer 4 فقط <strong>DOM دلاليًّا + ARIA + سمات <code>data-*</code></strong>. بقصد:</p>
  <ul>
    <li>
      <strong>ميزانيات الحزم</strong>: Toggle 1.5 KB / Dialog 3.5 KB / Combobox 4.5 KB لا تترك
      مجالًا لـ CSS.
    </li>
    <li>
      <strong>أنظمة التصميم تختلف</strong>: Tailwind / UnoCSS / CSS أصيل / CSS-in-JS — بعدم اتّخاذ
      قرار، نُلائم الجميع.
    </li>
    <li>
      <strong>الحركة أيضًا CSS</strong>: نُصدر فقط <code>data-state="open|closed"</code>؛ تختار أنت
      بين CSS Transitions أو View Transitions أو مكتبة motion.
    </li>
  </ul>

  <p>إذًا تُؤلِّف التنسيق من <strong>خمس تقنيات</strong>. مدرَجة بترتيب الأفضليّة.</p>

  <h2>الوصفة 1: محدّدات <code>data-*</code> (المسار القياسي لتنسيق الحالة)</h2>
  <p>اقرأ السمات التي تُصدرها Kumiki عبر محدّدات CSS. نمط مُختبَر أرساه Radix.</p>

  <table class="attrs">
    <thead>
      <tr><th>السمة</th><th>القيم</th><th>أين تظهر</th></tr>
    </thead>
    <tbody>
      <tr
        ><td><code>data-state</code></td><td
          ><code>open</code> / <code>closed</code> / <code>opening</code> / <code>closing</code> /
          <code>on</code>
          / <code>off</code></td
        ><td>Dialog وToggle وTooltip وPopover</td></tr
      >
      <tr
        ><td><code>data-orientation</code></td><td
          ><code>horizontal</code> / <code>vertical</code></td
        ><td>Tabs وRadioGroup وSlider</td></tr
      >
      <tr
        ><td><code>data-side</code></td><td
          ><code>top</code> / <code>right</code> / <code>bottom</code> / <code>left</code></td
        ><td>عناصر طافية الموضع</td></tr
      >
      <tr
        ><td><code>data-direction</code></td><td><code>ltr</code> / <code>rtl</code></td><td
          >قلب RTL</td
        ></tr
      >
      <tr><td><code>data-disabled</code></td><td>(سلسلة فارغة)</td><td>حالة معطَّل</td></tr>
      <tr
        ><td><code>data-checked</code></td><td
          ><code>true</code> / <code>false</code> / <code>mixed</code></td
        ><td>Checkbox / Toggle / Switch</td></tr
      >
      <tr
        ><td><code>data-component</code> / <code>data-component-host</code></td><td
          ><code>combobox</code> / <code>dialog</code> / …</td
        ><td>تُعرّف عنصر جذر المكوّن</td></tr
      >
      <tr
        ><td><code>data-component-part</code></td><td
          ><code>title</code> / <code>close</code> / <code>overlay</code> / …</td
        ><td>تُعرّف عناصر المكوّنات الفرعية</td></tr
      >
    </tbody>
  </table>

  <pre><code
      >{`/* ورقة أنماط عامّة */
[data-state='on'] { background: var(--ds-accent); color: white; }
[data-state='off'] { background: var(--ds-surface-2); }
[data-state='open'] { animation: fade-in 200ms; }
[data-state='closed'] { animation: fade-out 150ms; }`}</code
    ></pre>

  <p>الكتابة ذاتها بأدوات Tailwind / UnoCSS:</p>
  <pre><code
      >{`<Toggle.Root class="bg-gray-200 data-[state=on]:bg-blue-500 data-[state=on]:text-white" />`}</code
    ></pre>

  <h2>الوصفة 2: تمرير <code>class</code> / <code>style</code></h2>
  <p>
    المكوّنات الفرعية في Layer 4 هي <strong>أغلفة رفيعة بعنصر واحد تنشر <code>...rest</code></strong
    >. أيّ ما تُمرّره — <code>class</code> أو <code>style</code> أو <code>data-*</code> إضافيّة أو سمات
    ARIA — يحطّ على جذر DOM الحقيقي.
  </p>

  <pre><code
      >{`<Toggle.Root class="ds-toggle" style="--ring-color: var(--ds-accent)">
  كتم
</Toggle.Root>`}</code
    ></pre>

  <p>
    مرجع التنفيذ: <code>packages/components/src/toggle/Root.svelte</code> يُعلن
    <code>[key: string]: unknown</code>
    في نوع Props ويَنشر <code>...rest</code> مباشرةً على <code>&lt;button&gt;</code> الخاصّ به.
  </p>

  <h2>الوصفة 3: CSS Custom Properties (المسار القياسي لانتشار الموضوع)</h2>
  <p>
    خلافًا لـ scoped CSS في Svelte، <strong>تتدفّق متغيّرات CSS عبر السلسلة الطبيعيّة</strong>.
    مُعلَنة على الأب، تصل إلى DOM داخل المكوّنات الأبناء — متجاوزةً تمامًا حاجز نطاق Svelte.
  </p>

  <pre><code
      >{`<Combobox.Root style="
  --combobox-bg: var(--ds-surface);
  --combobox-border: var(--ds-line-strong);
">
  <Combobox.Input class="ds-input" />
</Combobox.Root>

<style>
  /* النمط ذو النطاق في MyCombobox.svelte — يصل إلى <input> الداخلي للابن */
  .ds-input {
    background: var(--combobox-bg);
    border: 1px solid var(--combobox-border);
  }
</style>`}</code
    ></pre>

  <p>
    <strong>استخدمها لـ:</strong> ألوان العلامة، تبديل الوضع الداكن، الـ tokens التي يجب أن تعبر حدود
    المكوّنات.
  </p>

  <h2>الوصفة 4: scnippet <code>child</code> — استبدال العنصر</h2>
  <p>
    افتراضيًّا يصيّر <code>Toggle.Root</code> <code>&lt;button&gt;</code>. منفذ الهروب لـ«أريد
    <code>&lt;a&gt;</code>
    هنا» أو «أريد <code>&lt;MyButton&gt;</code> الخاصّ بي».
  </p>

  <pre><code
      >{`<Toggle.Root bind:pressed>
  {#snippet child({ props, state })}
    <MyButton {...props} class="brand-btn" disabled={state.disabled}>
      {state.pressed ? 'مكتوم' : 'مُشغَّل'}
    </MyButton>
  {/snippet}
</Toggle.Root>`}</code
    ></pre>

  <p>
    <code>props</code> مكتوبٌ بالكامل: <code>type</code> / <code>aria-pressed</code> /
    <code>aria-disabled</code>
    / <code>data-state</code> / <code>onclick</code> / <code>onkeydown</code> / <code>id</code>.
    مهمّتك أن تنشره على عنصرك.
  </p>

  <p class="note">
    <strong>لا تلجأ إليه افتراضيًّا.</strong> <code>child</code> منفذ هروب لا مسار تنسيق قياسي. إن
    غطّى تمرير <code>class</code> الأمر، فضّله — وتذكّر أنّ إعادة نشر <code>props</code> مسؤوليّتك (نسيانه
    يفقد ARIA / الأحداث).
  </p>

  <h2>الوصفة 5: Tailwind / UnoCSS / CSS أصيل</h2>

  <h3>Tailwind v4</h3>
  <pre><code
      >{`<Toggle.Root class="
  inline-flex items-center px-3 py-2 rounded-md
  bg-gray-200 text-gray-700
  data-[state=on]:bg-blue-600 data-[state=on]:text-white
  data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
" />`}</code
    ></pre>

  <h3>UnoCSS (الوضع الافتراضي)</h3>
  <p>
    تجربة كتابة مطابقة لـ Tailwind. صيغة <code>data-[state=on]:</code> مدمَجة عبر
    <code>@unocss/preset-mini</code>
    / <code>preset-wind3</code>.
  </p>

  <h3>UnoCSS وضع svelte-scoped</h3>
  <p>
    <code>@unocss/svelte-scoped</code> يفحص كلّ <code>.svelte</code> أبًا، ثمّ يحقن CSS المُولَّد
    <strong>ملفوفًا في <code>:global(...)</code></strong>
    داخل <code>&lt;style&gt;</code> ذلك الملف. لأنّ القواعد عالميّة، تصل أدوات الـ utility التي كتبتها
    في الأب إلى DOM داخل المكوّنات الأبناء دون عمل إضافي.
  </p>

  <h3>CSS أصيل / CSS Modules</h3>

  <pre><code
      >{`/* app.css (عام) */
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

  <pre><code>{`<Toggle.Root class="ds-toggle">كتم</Toggle.Root>`}</code></pre>

  <h2>نمط: بناء نظام تصميم فوقها</h2>
  <p>لُفّ Kumiki في <code>&lt;MyToggle&gt;</code> الخاصّ بك لإعادة الاستخدام عبر المنتج كاملاً.</p>

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
  /* الوصفة 2 — تمرير class يعني أنّ هذا النمط ذا النطاق يصل إلى DOM الحقيقي */
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

  <p>جانب المستهلك:</p>
  <pre><code
      >{`<script lang="ts">
  import MyToggle from '$lib/components/MyToggle.svelte';
  let muted = $state(false);
<\/script>

<MyToggle bind:pressed={muted} aria-label="كتم الصوت">
  {muted ? 'مكتوم' : 'مُشغَّل'}
</MyToggle>`}</code
    ></pre>

  <h2>الفخّ: <code>&lt;style&gt;</code> ذو النطاق في Svelte لا ينتشر إلى الأبناء</h2>
  <p>
    قيد قديم في Svelte: الفئات المُعرّفة في <code>&lt;style&gt;</code> أبًا في <code>.svelte</code>
    <strong>لا تصل إلى عناصر DOM داخل المكوّنات الأبناء</strong>.
  </p>

  <pre><code
      >{`<!-- لا يعمل كما تتوقّع -->
<Combobox.Root class="my-combo">
  <Combobox.Input />
</Combobox.Root>

<style>
  /* .my-combo غير مستخدَم في قالب هذا الملف، لذا قد يحذفه Svelte،
     ويعيش <input> المنحدِر داخل نطاق مكوّن آخر. */
  .my-combo input { padding: 8px; }
</style>`}</code
    ></pre>

  <p>أربع مخارج:</p>
  <ol>
    <li>
      <strong>استخدم Tailwind / UnoCSS / ورقة أنماط عامّة</strong> (الوصفتان 1 و5). ليست ذات نطاق
      أصلًا، فلا توجد المشكلة. <strong>التوصية الأولى.</strong>
    </li>
    <li>
      <strong>مرّر <code>class</code> لكلّ مكوّن فرعي</strong> (الوصفة 2).
      <code>&lt;Combobox.Input class="ds-input" /&gt;</code>
      تُلقي الفئة على عنصر جذر الابن. داخل <code>&lt;style&gt;</code> أبٍ تكتب
      <code>:global(.ds-input)</code>
      (أو انقل القاعدة إلى <code>app.css</code>).
    </li>
    <li>
      <strong>CSS Custom Properties</strong> (الوصفة 3). تتجاوز نطاق Svelte. الأفضل لانتشار الموضوع.
    </li>
    <li>
      <strong>الاختراق بـ <code>:global(...)</code></strong>. الملاذ الأخير.
      <pre><code
          >{`<style>
  .my-combo :global([data-component-part='item'][data-highlighted]) {
    background: var(--ds-accent-subtle);
  }
</style>`}</code
        ></pre>
      تدعم Svelte 5 أيضًا صيغة الكتلة<code>:global &#123; ... &#125;</code>.
    </li>
  </ol>

  <h2>الكدسة المُوصى بها</h2>
  <table class="stack">
    <thead>
      <tr><th>الطبقة</th><th>الأداة</th><th>الاستخدام</th></tr>
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

  <h2>ماذا تقرأ بعدها</h2>
  <ul>
    <li>
      <a href="/docs/layers-by-example">الطبقات بالمثال</a> — كيف يختلف كود المستخدم في Layer 2/3/4/5.
    </li>
    <li>
      <a href="/docs/composition">التركيب</a> — إضافة ميزات اختياريّة عبر مغلِّفات
      <code>with*</code>.
    </li>
    <li><a href="/docs/i18n">i18n وRTL</a> — استخدام <code>data-direction</code> لتنسيق RTL.</li>
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
