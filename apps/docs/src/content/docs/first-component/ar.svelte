<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);
</script>

<svelte:head>
  <title>أوّل مكوّن لك · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ البدء — 03"
  title="أوّل مكوّن لك"
  lede="جولة موجَّهة من خمس دقائق. سنوصّل Toggle ونلاحظ عقد ARIA الخاصّ به ونبدّل لغة العرض دون أن نلمس المكوّن."
>
  <h2>1. ضعه في المكان</h2>
  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="كتم الصوت">
  {pressed ? 'مكتوم' : 'مُشغَّل'}
</Toggle.Root>`}</code
    ></pre>

  <h2>2. شاهده يستجيب</h2>
  <p>الـ Toggle أدناه موصّل بحالتك المحلّية لا بسجلّ العروض — جرّبه.</p>

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

  <h2>3. افحص العقد</h2>
  <p>
    افتح الفاحص. للزرّ <code>aria-pressed</code> مدفوع بالحالة، إضافة إلى ربط
    <code>data-state="on"</code> لتنسيق CSS. لا CSS عام، ولا آراء تصميمية — نسّقه كما تشاء.
  </p>
  <pre><code
      >{`<button aria-pressed="true" data-state="on" type="button">
  مكتوم
</button>`}</code
    ></pre>

  <h2>4. ترجمه</h2>
  <p>
    بدّل اللغة من رأس الصفحة. الـ Toggle لا يحوي نصوصًا مترجمة، لكن مكوّنات مثل Combobox وDialog
    وFormField ستتبدّل فورًا. جرّب
    <a href={resolve('/components/component-combobox')}>عرض Combobox</a> بعد التبديل إلى اليابانية.
  </p>

  <h2>والآن؟</h2>
  <ul>
    <li>اقرأ <a href={resolve('/docs/architecture')}>البنية ذات الخمس طبقات</a>.</li>
    <li>تصفّح <a href={resolve('/docs/accessibility')}>نموذج الوصول</a>.</li>
    <li>استعرض <a href={resolve('/components')}>كل المكوّنات</a> مع عروض حيّة.</li>
  </ul>
</Prose>
