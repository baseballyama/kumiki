<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);
</script>

<svelte:head>
  <title>첫 컴포넌트 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 시작하기 — 03"
  title="첫 컴포넌트"
  lede="5 분짜리 안내 투어. Toggle 을 연결하고, 그 ARIA 계약을 관찰하며, 컴포넌트를 건드리지 않고 표시 언어를 전환합니다."
>
  <h2>1. 그냥 끼워 넣기</h2>
  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="음소거">
  {pressed ? '음소거됨' : '켜짐'}
</Toggle.Root>`}</code
    ></pre>

  <h2>2. 반응 확인</h2>
  <p>
    아래 Toggle 은 데모 레지스트리가 아니라 이 페이지의 로컬 상태에 연결되어 있습니다 — 눌러 보세요.
  </p>

  <PreviewFrame>
    <div style="display: flex; gap: 16px; align-items: center;">
      <Toggle.Root bind:pressed aria-label="음소거">
        {pressed ? '음소거됨' : '켜짐'}
      </Toggle.Root>
      <span style="font-family: var(--k-font-mono); font-size: 12px; color: var(--k-ink-3);">
        pressed = {pressed}
      </span>
    </div>
  </PreviewFrame>

  <h2>3. 계약 확인</h2>
  <p>
    개발자 도구를 여세요. 버튼은 상태에 따라 <code>aria-pressed</code> 를 가지며, CSS 스타일링을
    위한
    <code>data-state="on"</code> 훅도 있습니다. 글로벌 CSS 도, 디자인 의견도 없습니다 — 원하는 대로 스타일하세요.
  </p>
  <pre><code
      >{`<button aria-pressed="true" data-state="on" type="button">
  음소거됨
</button>`}</code
    ></pre>

  <h2>4. 로컬라이즈</h2>
  <p>
    페이지 헤더에서 로케일을 바꿔 보세요. Toggle 자체에는 로컬라이즈된 문자열이 없지만 Combobox,
    Dialog, FormField 같은 컴포넌트는 즉시 전환됩니다. 일본어로 바꾼 뒤
    <a href="/components/component-combobox">Combobox 데모</a> 를 시도해 보세요.
  </p>

  <h2>다음은?</h2>
  <ul>
    <li><a href="/docs/architecture">5 계층 아키텍처</a> 읽기.</li>
    <li><a href="/docs/accessibility">접근성 모델</a> 훑어보기.</li>
    <li>라이브 데모와 함께 <a href="/components">모든 컴포넌트</a> 둘러보기.</li>
  </ul>
</Prose>
