<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>التركيب · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ الأساسيات — 02"
  title="التركيب فوق الإعداد."
  lede="مكوّنات Kumiki مركّبة. يبني Root الحالة، وتقدّمها مكوّنات فرعية مسمّاة. نمط child snippet يسمح لك بتبديل أيّ عنصر دون فقدان السلوك."
>
  <h2>الشكل المركّب</h2>
  <p>كل مكوّن في Layer 4 يتبع المخطّط ذاته:</p>
  <pre><code
      >{`<Combobox.Root>
  <Combobox.Input />
  <Combobox.Listbox>
    {#each items as item}
      <Combobox.Item value={item}>{item.label}</Combobox.Item>
    {/each}
  </Combobox.Listbox>
</Combobox.Root>`}</code
    ></pre>

  <h2>scnippet <code>child</code></h2>
  <p>
    تحتاج إلى تصيير <code>{`<a>`}</code> بدلًا من <code>{`<button>`}</code>؟ استخدم scnippet
    <code>child</code>. يمنحك المكوّن الـ props التي كان سيقوم بنشرها؛ أنت تقرّر على أيّ وسم تضعها.
    هذا يحلّ محلّ نمط <code>asChild</code> في Radix/Bits v1.
  </p>
  <pre><code
      >{`<Toggle.Root>
  {#snippet child({ props })}
    <a href={resolve('/destination')} {...props}>انتقل</a>
  {/snippet}
</Toggle.Root>`}</code
    ></pre>

  <p>
    لا يزال المكوّن يتحكّم في ARIA — يتغيّر الوسم المرسوم فقط. لا يوجد prop باسم
    <code>asChild</code> في Kumiki ولن يوجد.
  </p>

  <h2>منافذ هروب طبقيّة</h2>
  <p>
    إن لم يكفِ <code>child</code> — مثلًا تحتاج إلى تنسيق ثلاث عُقد DOM مخصّصة — انزل طبقةً. استخدم
    مصانع attachment في <code>@kumiki/headless</code> واكتب JSX/HTML الخاصّ بك حولها.
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggle } from '@kumiki/headless/toggle';
  const t = createToggle({ pressed: $state(false) });
<\/script>

<button {@attach t.root} class="my-fancy-toggle">
  {t.pressed ? 'مُشغَّل' : 'مُطفأ'}
</button>`}</code
    ></pre>

  <h2>التعميم ينتشر</h2>
  <p>
    المكوّنات التي تأخذ قيمة مكتوبة (Combobox وRadioGroup وSelect وFormField) تنشر هذا التعميم من
    Root. تقرأه المكوّنات الفرعية الداخلية عبر <code>getContext</code>. لا داعي لتكرار النوع في كل
    طبقة.
  </p>
</Prose>
