<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);

  const matrix = [
    { task: 'FSM (انتقالات الحالة)', l2: 'Kumiki', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'جسر التفاعلية مع Svelte', l2: 'أنت', l3: 'أنت*', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'عنصر <button>', l2: 'أنت', l3: 'أنت', l4: 'Kumiki', l5: 'مَنسوخ' },
    { task: 'سمات ARIA (aria-pressed، …)', l2: 'أنت', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'مخرَج data-state', l2: 'أنت', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'معالجة النقر / المفاتيح', l2: 'أنت', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'الاسم القابل للوصول (aria-label)', l2: 'أنت', l3: 'أنت', l4: 'أنت', l5: 'Kumiki' },
    { task: 'التنسيق', l2: 'أنت', l3: 'أنت', l4: 'أنت', l5: 'مَنسوخ' },
  ];
</script>

<svelte:head>
  <title>الطبقات بالمثال — Toggle · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ الأساسيات — 06"
  title="الطبقات بالمثال: Toggle"
  lede="نفس الـ Toggle، مكتوبًا في Layer 2 و3 و4 و5 — بمراقبة جنبًا إلى جنب. كلّ خطوة نزولًا في الـ stack تمنحك تحكّمًا أكبر ومسؤوليّةً أكبر."
>
  <p>
    تكشف طبقات Kumiki جميعًا <strong>السلوك ذاته بمستويات تجريد مختلفة</strong>. تنزل طبقة وتتولّى
    المزيد من DOM وARIA وأسلاك الأحداث — لكنّك تكسب حرّية اختيار البنية. تصعد طبقة فتكتب أقلّ مقابل
    قبول خيارات Kumiki البنيويّة.
  </p>

  <p>
    نستخدم <a href="/components/component-toggle">Toggle</a> مثالًا تطبيقيًّا. السلوك بسيط (اضغط
    لتبديل)، لكنّ التنفيذ موجود في <strong>الطبقات الأربع</strong>، ما يجعله مثاليًّا لمقارنة جنبًا إلى جنب.
  </p>

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

  <h2>1. Layer 4 — مكوّن مركّب (نقطة الدخول الافتراضيّة)</h2>
  <p>
    أقصر طريق. <code>Toggle.Root</code> يصيّر <code>&lt;button&gt;</code> ويُدير ARIA و
    <code>data-state</code> ولوحة المفاتيح وSSR. أنت مسؤول عن <strong>أمرين</strong>: استقبال
    الحالة عبر <code>bind:pressed</code> وتوفير <code>aria-label</code> (أو تسمية مرئيّة).
  </p>

  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="كتم الصوت">
  {pressed ? 'مكتوم' : 'مُشغَّل'}
</Toggle.Root>`}</code
    ></pre>

  <p>الـ DOM الناتج:</p>

  <pre><code
      >{`<button type="button" aria-pressed="false" data-state="off" id="toggle-…">
  مُشغَّل
</button>`}</code
    ></pre>

  <p>
    <strong>اختر هذا حين:</strong> 90% من الحالات. الـ <code>&lt;button&gt;</code> الأصلي يكفي ولا
    تحتاج إلى تجاوز البنية المغلِّفة.
  </p>

  <h2>2. Layer 3 — Headless attachment</h2>
  <p>
    حين تحتاج إلى اختيار العنصر بنفسك (<code>&lt;a&gt;</code> أو <code>&lt;div role="button"&gt;</code>
    أو غلاف مخصّص). <code>createToggle()</code> تعيد مصنعًا متوافقًا مع
    <code>{`{@attach}`}</code> تَنشره على أيّ عنصر تريد.
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggle } from '@kumiki/headless/toggle';

  const t = createToggle({ initial: false });

  // controller.pressed جالبٌ بسيط. لعرضه نصًّا عليك الاشتراك ومرآته إلى $state.
  // (غير ضروري إن كان CSS يتولّى كلّ شيء.)
  let pressed = $state(t.pressed);
  $effect(() => t.subscribe(({ context }) => (pressed = context.pressed)));
<\/script>

<button {@attach t.root} aria-label="كتم الصوت" class="my-btn">
  {pressed ? 'مكتوم' : 'مُشغَّل'}
</button>`}</code
    ></pre>

  <p>
    عند التركيب يكتب <code>{`{@attach t.root}`}</code> سمات DOM (<code>type</code> و
    <code>aria-pressed</code> و<code>data-state</code> و<code>id</code>) ويربط مستمعي النقر +
    المفتاح (Space / Enter). <strong>ما يُضاف إلى مسؤوليّاتك:</strong> اختيار العنصر، التنسيق،
    التسمية المرئيّة، و(إن لزم) <code>subscribe</code> لمرآة الحالة في متغيّرات تفاعليّة.
  </p>

  <p>
    <strong>اختر هذا حين:</strong> بنية Layer 4 الثابتة (<code>&lt;button&gt;</code>) لا تناسب.
    مثلًا، حين تحتاج إلى وضع الـ toggle داخل <code>&lt;label&gt;</code> أو لفّه في غلاف رتبة-أعلى.
  </p>

  <h2>3. Layer 2 — آلة خالصة</h2>
  <p>
    دون Svelte إطلاقًا — آلة حالة منتهية بـ TypeScript خالص. <strong>تكتب أنت DOM وARIA والأحداث
    والمفاتيح بنفسك.</strong>
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
  aria-label="كتم الصوت"
  onclick={() => m.send({ type: 'TOGGLE' })}
>
  {pressed ? 'مكتوم' : 'مُشغَّل'}
</button>`}</code
    ></pre>

  <p><strong>سبب النزول إلى Layer 2 ليس عادةً واجهة المستخدم — بل إعادة استخدام المنطق:</strong></p>
  <ul>
    <li>التحقّق من منطق Toggle على الخادم (server routes في SvelteKit / Workers).</li>
    <li>كتابة اختبارات وحدة FSM خالصة في Vitest (دون jsdom، نحو 20μs لكل انتقال).</li>
    <li>
      تصوير الانتقالات في <a href="https://stately.ai/viz">stately.ai/viz</a> (<code
        >machine.toJSON()</code
      > يُخرج JSON متوافقًا مع XState).
    </li>
    <li>التضمين في مضيفين غير-Svelte (JS أصيل، Web Components، إطار آخر).</li>
  </ul>

  <h2>4. Layer 5 — Atelier (خيارات منمَّقة بالنسخ واللصق)</h2>
  <p>
    تنسخ الـ CLI المصادر إلى مستودعك. بعد النسخ تصبح <strong>كودك</strong> — حرّر بحرّية.
  </p>

  <pre><code
      >{`# خيار Tailwind v4
npx kumiki add toggle --variant=tailwind

# خيار CSS أصيل
npx kumiki add toggle --variant=vanilla`}</code
    ></pre>

  <p>الملفّات المُضافة:</p>

  <pre><code
      >{`src/lib/components/Toggle.svelte   # غلاف منمَّق حول Toggle.Root في Layer 4`}</code
    ></pre>

  <p>استخدمه كأيّ مكوّن Svelte آخر:</p>

  <pre><code
      >{`<script lang="ts">
  import Toggle from '$lib/components/Toggle.svelte';
  let pressed = $state(false);
<\/script>

<Toggle bind:pressed>كتم</Toggle>`}</code
    ></pre>

  <p>
    <strong>اختر هذا حين:</strong> تريد قاعدة بصريّة عاملة دون كتابة CSS أوّلًا. تُشحن Layer 5 ضمن
    <code>0.x.x-preview</code> أثناء سلسلة v1.0، فللمشاريع الحسّاسة للاستقرار يُفضَّل Layer 4 +
    تنسيقك الخاص.
  </p>

  <h2>مصفوفة المسؤوليّات</h2>

  <p>ما تكتبه في كلّ طبقة. «Kumiki» = تتولّاه المكتبة؛ «أنت» = كودك.</p>

  <table class="matrix">
    <thead>
      <tr>
        <th>المسؤوليّة</th>
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
          <td class:you={row.l2 === 'أنت'} class:them={row.l2 === 'Kumiki'}>{row.l2}</td>
          <td class:you={row.l3.startsWith('أنت')} class:them={row.l3 === 'Kumiki'}>{row.l3}</td>
          <td class:you={row.l4 === 'أنت'} class:them={row.l4 === 'Kumiki'}>{row.l4}</td>
          <td class:them={row.l5 === 'Kumiki'}>{row.l5}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <p class="note">
    * يُحتاج جسر تفاعلية Svelte في L3 فقط إن كنت تعرض <code>controller.pressed</code> نصًّا. إن
    تولّى CSS كلّ شيء عبر <code>data-state</code> فلا حاجة إلى <code>subscribe</code>.
  </p>

  <h2>اختيار طبقة — شجرة قرار</h2>

  <ul>
    <li>
      <strong>تحتاجه عاملًا بأنماط الآن؟</strong> → <strong>Layer 5</strong>
      (<code>npx kumiki add</code>). ملاحظة: مُعلَّمة بـ preview أثناء v1.0.
    </li>
    <li>
      <strong>الـ &lt;button&gt; القياسي يكفي وستُنسّق بنفسك؟</strong> → <strong>Layer 4</strong>
      (<code>{`<Toggle.Root>`}</code>). نقطة الدخول الافتراضيّة.
    </li>
    <li>
      <strong>تحتاج إلى اختيار نوع العنصر أو البنية بنفسك؟</strong> → <strong>Layer 3</strong>
      (<code>{`{@attach t.root}`}</code>). إن غطّى scnippet <code>child</code> الخاص بـ Layer 4
      حاجتك، ابقَ في Layer 4 — كود أقلّ.
    </li>
    <li>
      <strong>تشغيل خارج Svelte / تحقّق على الخادم / تحتاج FSM فقط؟</strong> → <strong>Layer 2</strong>
      (<code>createToggleMachine</code>).
    </li>
  </ul>

  <h2>ماذا تقرأ بعد ذلك</h2>
  <ul>
    <li>
      <a href="/docs/styling">التنسيق</a> — كيف تستخدم <code>data-*</code> وتمرير
      <code>class</code> وscnippet <code>child</code> في Layer 4.
    </li>
    <li><a href="/docs/architecture">البنية</a> — نموذج الطبقات الخمس الكامل.</li>
    <li>
      <a href="/docs/composition">التركيب</a> — إضافة ميزات اختيارية عبر مغلِّفات <code>with*</code>.
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
