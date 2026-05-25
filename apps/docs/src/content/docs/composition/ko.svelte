<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>합성 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 기초 — 02"
  title="설정보다 합성."
  lede="Kumiki 컴포넌트는 복합 프리미티브입니다. Root 가 상태를 세우고, 명명된 서브컴포넌트가 이를 표현합니다. child 스니펫 패턴은 동작을 잃지 않고 어떤 요소든 교체할 수 있게 해줍니다."
>
  <h2>복합 형태</h2>
  <p>모든 Layer 4 컴포넌트는 같은 개요를 따릅니다:</p>
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

  <h2><code>child</code> 스니펫</h2>
  <p>
    <code>{`<button>`}</code> 대신 <code>{`<a>`}</code> 를 렌더링해야 하나요? <code>child</code>
    스니펫을 사용하세요. 컴포넌트가 spread 했을 props 를 건네주며, 어떤 태그에 올릴지는 당신이 결정합니다.
    이는 Radix/Bits v1 의 <code>asChild</code> 패턴을 대체합니다.
  </p>
  <pre><code
      >{`<Toggle.Root>
  {#snippet child({ props })}
    <a href={resolve('/destination')} {...props}>이동</a>
  {/snippet}
</Toggle.Root>`}</code
    ></pre>

  <p>
    컴포넌트는 여전히 ARIA 를 제어하며, 바뀌는 것은 렌더링되는 태그뿐입니다. Kumiki 에는
    <code>asChild</code> prop 이 없으며 앞으로도 없을 것입니다.
  </p>

  <h2>계층별 비상구</h2>
  <p>
    <code>child</code> 로도 부족하다면 — 예컨대 세 개의 커스텀 DOM 노드를 조정해야 한다면 — 한 계층
    내려가세요.
    <code>@kumiki/headless</code> 의 attachment 팩토리를 사용하고 자신의 JSX/HTML 을 둘러싸세요.
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggle } from '@kumiki/headless/toggle';
  const t = createToggle({ pressed: $state(false) });
<\/script>

<button {@attach t.root} class="my-fancy-toggle">
  {t.pressed ? '켜짐' : '꺼짐'}
</button>`}</code
    ></pre>

  <h2>제네릭이 전파됨</h2>
  <p>
    타입이 지정된 값을 받는 컴포넌트(Combobox, RadioGroup, Select, FormField)는 그 제네릭을 Root
    에서 전파합니다. 내부 서브컴포넌트는 <code>getContext</code> 로 읽으므로, 각 계층에서 타입을 반복할
    필요가 없습니다.
  </p>
</Prose>
