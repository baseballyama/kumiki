<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>مقدّمة · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ البدء — 01"
  title="مقدّمة"
  lede="Kumiki — 組木 — نظام مكوّنات أوّلية لـ Svelte 5 ذو وصول عميق. وُجد لأن سؤال «اجعل هذا المكوّن سهل الوصول وقابلاً للترجمة وقابلاً للتنسيق وخفيفًا» لا ينبغي أن يُجاب عليه خمسين مرة في خمسين مستودعًا."
>
  <h2>لماذا Kumiki؟</h2>
  <p>
    تختار معظم مكتبات المكوّنات القابلة للوصول مقايضة واحدة وتلتزم بها. بعضها headless ويترك لك
    توصيل ARIA. وبعضها مُنسَّق ويفرض نظامًا تصميميًا كاملًا. وبعضها يقيّدك بمكتبة حالة معيّنة؛
    وبعضها لا يملك آلة حالة. تُجيب Kumiki على هذه المقايضة بالرفض: خمس طبقات قابلة للتركيب، كلٌّ
    منها قابل للاستخدام مستقلًا.
  </p>

  <ul>
    <li><strong>Layer 0 — Types.</strong> سطح TypeScript مشترك تتحدّث به كلّ طبقة فوقه.</li>
    <li>
      <strong>Layer 1 — Primitives.</strong> مساعدات مستقلّة عن إطار العمل (focus trap وdismissable وID
      وlocale).
    </li>
    <li>
      <strong>Layer 2 — Machines.</strong> آلات حالة منتهية بـ TS خالص. زمن تشغيل ~1 KB، JSON قابل للفحص
      بالكامل.
    </li>
    <li>
      <strong>Layer 3 — Attachments.</strong> مصانع <code>{'{@attach}'}</code> تقود ARIA و
      <code>data-state</code> على عُقد DOM حقيقية.
    </li>
    <li>
      <strong>Layer 4 — Components.</strong> مكوّنات مركّبة مثل <code>{`<Combobox.Root>`}</code>،
      مريحة منذ البداية.
    </li>
    <li>
      <strong>Layer 5 — Atelier.</strong> خيارات منمَّقة جاهزة للنسخ واللصق. تُشحن في
      <code>0.x-preview</code>.
    </li>
  </ul>

  <h2>الحالة</h2>
  <p>
    Kumiki في مرحلة <strong>ما قبل ألفا</strong>. البنية مقفلة، وميزانيات الحزم مفروضة في CI،
    وعمليات قارئ الشاشة الليلية تعمل — لكن لم تُنشر أيّ نسخة على npm بعد. توقّع تغييرات في الـ API.
    أبلغ عن المشكلات على
    <a href="https://github.com/baseballyama/kumiki/issues">baseballyama/kumiki</a>.
  </p>

  <h2>الخطوات التالية</h2>
  <p>
    التالي: <a href="/docs/installation">التثبيت</a> أو
    <a href="/docs/architecture">البنية</a>. إن كنت تفضّل رؤية الأمور فعليًا،
    <a href="/components">استعرض المكوّنات</a>.
  </p>
</Prose>
