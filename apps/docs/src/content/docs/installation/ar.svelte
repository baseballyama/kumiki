<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>التثبيت · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ البدء — 02"
  title="التثبيت"
  lede="تُشحن Kumiki كحزم متعدّدة الإصدارات على npm. ثبّت فقط الطبقة التي تحتاجها؛ الاستيراد بمسار فرعي يبقي إزالة الكود الميت قاسية."
>
  <h2>المتطلّبات</h2>
  <ul>
    <li>Node.js 22 أو أحدث.</li>
    <li>Svelte 5.29+ (لتوجيه <code>{'{@attach}'}</code>).</li>
    <li>محزّم يدعم ESM — Vite 5+ وRollup 4+ وesbuild 0.25+. لا يُشحن CJS.</li>
  </ul>

  <h2>اختر طبقتك</h2>
  <p>يحتاج معظم المستخدمين إلى Layer 4 — المكوّنات المركّبة — وحزمة locale:</p>
  <pre><code>pnpm add @kumiki/components @kumiki/locale</code></pre>

  <p>تحتاج تحكّمًا كاملًا في DOM؟ تجاوز المكوّنات واستهلك attachments الطبقة 3 مباشرةً:</p>
  <pre><code>pnpm add @kumiki/headless</code></pre>

  <p>تبني مكوّنات أوّلية خاصة بك؟ يمكنك استخدام أيّ آلة حالة وحدها:</p>
  <pre><code>pnpm add @kumiki/machines</code></pre>

  <h2>وفّر locale</h2>
  <p>
    لُفّ تطبيقك بـ <code>LocaleProvider</code> مرّة واحدة. تستلم كل مكوّنة Kumiki أسفلها الرسائل واتّجاه
    القراءة.
  </p>
  <pre><code
      >{`<script lang="ts">
  import { LocaleProvider } from '@kumiki/components';
  import { messages, direction } from '@kumiki/locale/ar';

  let { children } = $props();
<\/script>

<LocaleProvider.Root locale="ar" {messages} dir={direction}>
  {@render children()}
</LocaleProvider.Root>`}</code
    ></pre>

  <p>
    حزم اللغة استيرادات بمسار فرعي — كلٌّ منها ≤ 1 KB brotli. بدّل اللغة وقت التشغيل بتبديل حزمة
    <code>messages</code>؛ تُعيد المكوّنات حساب نصوص ARIA تلقائيًا.
  </p>

  <h2>تأكّد من التثبيت</h2>
  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="كتم الصوت">
  {pressed ? 'مكتوم' : 'مُشغَّل'}
</Toggle.Root>`}</code
    ></pre>

  <p>هذا كل شيء. اذهب إلى <a href={resolve('/components')}>فهرس المكوّنات</a>.</p>
</Prose>
