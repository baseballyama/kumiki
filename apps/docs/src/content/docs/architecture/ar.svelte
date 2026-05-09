<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';

  const layers = [
    {
      n: 0,
      ji: '型',
      name: 'Types',
      pkg: '@kumiki/types',
      role: 'سطح TypeScript مشترك — الشيء الوحيد الذي تتفق عليه كلّ طبقة أعلى.',
    },
    {
      n: 1,
      ji: '基',
      name: 'Primitives',
      pkg: '@kumiki/primitives',
      role: 'مساعدات مستقلّة عن إطار العمل (focus trap وdismissable وID وlocale وmotion).',
    },
    {
      n: 2,
      ji: '機',
      name: 'Machines',
      pkg: '@kumiki/machines',
      role: 'آلات حالة منتهية بـ TS خالص. زمن تشغيل ~1 KB، JSON قابل للفحص.',
    },
    {
      n: 3,
      ji: '装',
      name: 'Attachments',
      pkg: '@kumiki/headless',
      role: 'مصانع {@attach} في Svelte 5 — تقود ARIA + data-state على DOM حقيقي.',
    },
    {
      n: 4,
      ji: '組',
      name: 'Components',
      pkg: '@kumiki/components',
      role: 'مكوّنات مركّبة. واجهة برمجية مريحة بفضاء أسماء بالنقاط.',
    },
    {
      n: 5,
      ji: '釉',
      name: 'Atelier',
      pkg: '@kumiki/atelier',
      role: 'معاينة Layer 5 — خيارات منمَّقة جاهزة للنسخ واللصق.',
    },
  ];
</script>

<svelte:head>
  <title>البنية · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ الأساسيات — 01"
  title="خمس طبقات، نموذج عقلي واحد."
  lede="تقع كلّ مكوّنة Kumiki أوّلية في طبقة واحدة بالضبط. اختر الطبقة المناسبة لاحتياجك للتحكّم — وأرسل بايتات تلك الطبقة فقط. الصادرات بمسار فرعي تُبقي إزالة الكود الميت جراحيّة."
>
  <p>
    تستعير الأسماء من وصلات <em>Kumiki</em> الخشبيّة. كل طبقة قطعة تتعشّق مع التالية دون مسامير أو غراء.
  </p>

  <table class="layers">
    <thead>
      <tr>
        <th>L</th>
        <th>الاسم</th>
        <th>الحزمة</th>
        <th>الدور</th>
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

  <h2>اختيار طبقة</h2>
  <p>تعيش معظم التطبيقات في Layer 4. انزل إلى أبعد من ذلك فقط عندما تحتاج إلى:</p>
  <ul>
    <li>
      <strong>Layer 3 (attachments)</strong> عند التحكم الدقيق في DOM — أنت تنسّق
      <code>&lt;button&gt;</code> أصليًا لا غلافًا من Svelte.
    </li>
    <li>
      <strong>Layer 2 (machines)</strong> للتحقق على الـ SSR / الخادم، أو لتشغيل المنطق في سياق ليس Svelte
      (Cypress أو Vitest أو worker).
    </li>
    <li>
      <strong>Layer 1 (primitives)</strong> عند تأليف مكوّنك الخاصّ فوق محرّكات dismissable / focus-trap
      / ID.
    </li>
  </ul>

  <h2>لماذا لا نسحب كلّ شيء؟</h2>
  <p>
    ميزانيات الحزم. لكل مسار فرعي ميزانية brotli تفرضها CI — يُشحن Toggle بـ 1.5 KB وCombobox بـ 4.5
    KB. سحب خيارات Layer 5 المنمَّقة إلى مشروع يملك بالفعل tokens تصميمه هو هدر للبايتات؛ حزمة
    Atelier اختيارية، ليست الافتراضي.
  </p>

  <h2>قراءة موثوقة</h2>
  <p>
    تعيش وثائق التصميم الداخلية في
    <a href="https://github.com/baseballyama/kumiki/tree/main/docs/design">/docs/design</a>. لاحظ
    خاصّةً:
  </p>
  <ul>
    <li><code>02-architecture.md</code> — نموذج الطبقات هذا مع رسوم.</li>
    <li><code>03-package-structure.md</code> — حدود الحزم.</li>
    <li><code>04-state-machines.md</code> — مواصفة زمن تشغيل FSM.</li>
    <li><code>09-bundle-budget.md</code> — ميزانيات brotli لكل مسار فرعي.</li>
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
