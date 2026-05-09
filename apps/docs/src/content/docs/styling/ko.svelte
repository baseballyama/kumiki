<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);

  const stack = [
    { layer: '제품 베이스라인', tool: '전역 CSS [data-component*] 셀렉터', use: '모든 Dialog 가 공유하는 리셋 스타일' },
    { layer: '디자인 시스템 부품', tool: '서브컴포넌트로 class 패스스루', use: '<MyDialog> 의 구조 스타일링' },
    { layer: '변형 / 테마', tool: 'CSS 커스텀 프로퍼티', use: '브랜드 컬러, 다크 / 라이트 전환' },
    { layer: '상태 차이', tool: 'data-state 셀렉터(또는 Tailwind data-[state=open]:)', use: '열림 / 닫힘, 선택, 비활성, 호버' },
    { layer: '엘리먼트 교체', tool: 'child 스니펫', use: '루트 엘리먼트로 <a> 또는 <MyButton>' },
  ];
</script>

<svelte:head>
  <title>스타일링 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 기초 — 07"
  title="스타일링"
  lede="Kumiki Layer 4 는 CSS 0 바이트로 출시됩니다. 그렇게 만든 이유, 어떻게 옷을 입히는지, 그리고 Svelte 의 scoped style 한계를 어떻게 우회하는지 — 다섯 레시피, 한 가지 함정."
>
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

  <h2>Kumiki 가 스타일을 출하하지 않는 이유</h2>
  <p>Layer 4 는 <strong>의미 있는 DOM + ARIA + <code>data-*</code> 속성</strong>만 내보냅니다. 의도된 결정입니다:</p>
  <ul>
    <li><strong>번들 예산</strong>: Toggle 1.5 KB / Dialog 3.5 KB / Combobox 4.5 KB — CSS 가 들어갈 자리가 없습니다.</li>
    <li><strong>디자인 시스템은 제각각</strong>: Tailwind / UnoCSS / 바닐라 CSS / CSS-in-JS — 아무것도 결정하지 않음으로써 모두에 맞춰집니다.</li>
    <li><strong>애니메이션도 CSS 주도</strong>: 우리는 <code>data-state="open|closed"</code> 만 내보냅니다. CSS Transitions, View Transitions, 모션 라이브러리 중에서 당신이 고릅니다.</li>
  </ul>

  <p>그래서 <strong>다섯 가지 기법</strong> 으로 스타일을 조합합니다. 선호도 순으로 나열합니다.</p>

  <h2>레시피 1: <code>data-*</code> 셀렉터(상태 스타일링의 표준 경로)</h2>
  <p>Kumiki 가 내보내는 속성을 CSS 셀렉터로 읽습니다. Radix 가 다져 놓은 검증된 패턴입니다.</p>

  <table class="attrs">
    <thead>
      <tr><th>속성</th><th>값</th><th>나타나는 곳</th></tr>
    </thead>
    <tbody>
      <tr><td><code>data-state</code></td><td><code>open</code> / <code>closed</code> / <code>opening</code> / <code>closing</code> / <code>on</code> / <code>off</code></td><td>Dialog, Toggle, Tooltip, Popover</td></tr>
      <tr><td><code>data-orientation</code></td><td><code>horizontal</code> / <code>vertical</code></td><td>Tabs, RadioGroup, Slider</td></tr>
      <tr><td><code>data-side</code></td><td><code>top</code> / <code>right</code> / <code>bottom</code> / <code>left</code></td><td>플로팅 위치 엘리먼트</td></tr>
      <tr><td><code>data-direction</code></td><td><code>ltr</code> / <code>rtl</code></td><td>RTL 반전</td></tr>
      <tr><td><code>data-disabled</code></td><td>(빈 문자열)</td><td>비활성 상태</td></tr>
      <tr><td><code>data-checked</code></td><td><code>true</code> / <code>false</code> / <code>mixed</code></td><td>Checkbox / Toggle / Switch</td></tr>
      <tr><td><code>data-component</code> / <code>data-component-host</code></td><td><code>combobox</code> / <code>dialog</code> / …</td><td>컴포넌트 루트 엘리먼트 식별</td></tr>
      <tr><td><code>data-component-part</code></td><td><code>title</code> / <code>close</code> / <code>overlay</code> / …</td><td>서브컴포넌트 엘리먼트 식별</td></tr>
    </tbody>
  </table>

  <pre><code
      >{`/* 전역 스타일시트 */
[data-state='on'] { background: var(--ds-accent); color: white; }
[data-state='off'] { background: var(--ds-surface-2); }
[data-state='open'] { animation: fade-in 200ms; }
[data-state='closed'] { animation: fade-out 150ms; }`}</code
    ></pre>

  <p>같은 내용을 Tailwind / UnoCSS 로:</p>
  <pre><code
      >{`<Toggle.Root class="bg-gray-200 data-[state=on]:bg-blue-500 data-[state=on]:text-white" />`}</code
    ></pre>

  <h2>레시피 2: <code>class</code> / <code>style</code> 패스스루</h2>
  <p>
    Layer 4 서브컴포넌트는 <strong><code>...rest</code> 를 spread 하는 얇은 단일-엘리먼트 래퍼</strong>입니다. 당신이 전달하는 <code>class</code>, <code>style</code>, 추가 <code>data-*</code>, 추가 ARIA 속성은 모두 실제 DOM 루트에 떨어집니다.
  </p>

  <pre><code
      >{`<Toggle.Root class="ds-toggle" style="--ring-color: var(--ds-accent)">
  음소거
</Toggle.Root>`}</code
    ></pre>

  <p>
    구현 참고: <code>packages/components/src/toggle/Root.svelte</code> 는 Props 타입에 <code>[key: string]: unknown</code> 을 선언하고 <code>...rest</code> 를 자체 <code>&lt;button&gt;</code> 에 직접 spread 합니다.
  </p>

  <h2>레시피 3: CSS 커스텀 프로퍼티(테마 전파의 표준 경로)</h2>
  <p>
    Svelte 의 scoped CSS 와 달리 <strong>CSS 변수는 정상 캐스케이드를 따릅니다</strong>. 부모에서 선언하면 자식 컴포넌트 내부 DOM 까지 도달하며 — Svelte 의 스코프 장벽을 완전히 우회합니다.
  </p>

  <pre><code
      >{`<Combobox.Root style="
  --combobox-bg: var(--ds-surface);
  --combobox-border: var(--ds-line-strong);
">
  <Combobox.Input class="ds-input" />
</Combobox.Root>

<style>
  /* MyCombobox.svelte 의 scoped 스타일 — 자식 내부 <input> 까지 도달 */
  .ds-input {
    background: var(--combobox-bg);
    border: 1px solid var(--combobox-border);
  }
</style>`}</code
    ></pre>

  <p><strong>용도:</strong> 브랜드 컬러, 다크 모드 전환, 컴포넌트 경계를 넘어야 하는 토큰.</p>

  <h2>레시피 4: <code>child</code> 스니펫 — 엘리먼트 교체</h2>
  <p>
    기본적으로 <code>Toggle.Root</code> 는 <code>&lt;button&gt;</code> 을 렌더합니다. "여기는 <code>&lt;a&gt;</code> 가 필요해" 또는 "내 <code>&lt;MyButton&gt;</code> 을 쓰고 싶어" 를 위한 비상구입니다.
  </p>

  <pre><code
      >{`<Toggle.Root bind:pressed>
  {#snippet child({ props, state })}
    <MyButton {...props} class="brand-btn" disabled={state.disabled}>
      {state.pressed ? '음소거됨' : '켜짐'}
    </MyButton>
  {/snippet}
</Toggle.Root>`}</code
    ></pre>

  <p>
    <code>props</code> 는 완전히 타입화됩니다: <code>type</code> / <code>aria-pressed</code> / <code>aria-disabled</code> / <code>data-state</code> / <code>onclick</code> / <code>onkeydown</code> / <code>id</code>. 그것을 당신의 엘리먼트에 spread 하는 것이 당신의 일입니다.
  </p>

  <p class="note">
    <strong>기본으로 이걸 손에 잡지 마세요.</strong> <code>child</code> 는 비상구이지 표준 스타일링 경로가 아닙니다. <code>class</code> 패스스루로 충분하다면 그것을 선호하세요 — 그리고 <code>props</code> 를 다시 spread 하는 것은 당신 책임이라는 것을 기억하세요(잊으면 ARIA / 이벤트가 빠집니다).
  </p>

  <h2>레시피 5: Tailwind / UnoCSS / 바닐라 CSS</h2>

  <h3>Tailwind v4</h3>
  <pre><code
      >{`<Toggle.Root class="
  inline-flex items-center px-3 py-2 rounded-md
  bg-gray-200 text-gray-700
  data-[state=on]:bg-blue-600 data-[state=on]:text-white
  data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
" />`}</code
    ></pre>

  <h3>UnoCSS(기본 모드)</h3>
  <p>Tailwind 와 동일한 작성 경험. <code>data-[state=on]:</code> 변형은 <code>@unocss/preset-mini</code> / <code>preset-wind3</code> 에 내장되어 있습니다.</p>

  <h3>UnoCSS svelte-scoped 모드</h3>
  <p>
    <code>@unocss/svelte-scoped</code> 는 각 부모 <code>.svelte</code> 를 스캔한 다음 생성된 CSS 를 <strong><code>:global(...)</code> 로 감싸서</strong> 그 파일의 <code>&lt;style&gt;</code> 에 주입합니다. 규칙이 전역이므로 부모에서 작성한 utility 가 추가 작업 없이 자식 컴포넌트 내부 DOM 까지 도달합니다.
  </p>

  <h3>바닐라 CSS / CSS Modules</h3>

  <pre><code
      >{`/* app.css(전역) */
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

  <pre><code>{`<Toggle.Root class="ds-toggle">음소거</Toggle.Root>`}</code></pre>

  <h2>패턴: 그 위에 디자인 시스템 구축</h2>
  <p>제품 전반에서 재사용하기 위해 Kumiki 를 자신의 <code>&lt;MyToggle&gt;</code> 로 감싸세요.</p>

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
  /* 레시피 2 — class 패스스루 덕분에 이 scoped 스타일이 실제 DOM 까지 도달합니다 */
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

  <p>소비자 측:</p>
  <pre><code
      >{`<script lang="ts">
  import MyToggle from '$lib/components/MyToggle.svelte';
  let muted = $state(false);
<\/script>

<MyToggle bind:pressed={muted} aria-label="음소거">
  {muted ? '음소거됨' : '켜짐'}
</MyToggle>`}</code
    ></pre>

  <h2>함정: Svelte 의 scoped <code>&lt;style&gt;</code> 은 자식으로 전파되지 않음</h2>
  <p>
    오래된 Svelte 제약: 부모 <code>.svelte</code> 의 <code>&lt;style&gt;</code> 에 정의된 클래스는 <strong>자식 컴포넌트 내부의 DOM 엘리먼트에 도달하지 않습니다</strong>.
  </p>

  <pre><code
      >{`<!-- 기대대로 동작하지 않음 -->
<Combobox.Root class="my-combo">
  <Combobox.Input />
</Combobox.Root>

<style>
  /* 이 파일의 템플릿에 .my-combo 가 사용되지 않으므로 Svelte 가 제거할 수 있고,
     자손 <input> 은 다른 컴포넌트의 스코프에 있습니다. */
  .my-combo input { padding: 8px; }
</style>`}</code
    ></pre>

  <p>네 가지 탈출구:</p>
  <ol>
    <li><strong>Tailwind / UnoCSS / 전역 스타일시트 사용</strong>(레시피 1, 5). 애초에 scoped 가 아니므로 문제가 없습니다. <strong>1순위 권장.</strong></li>
    <li><strong>각 서브컴포넌트에 <code>class</code> 전달</strong>(레시피 2). <code>&lt;Combobox.Input class="ds-input" /&gt;</code> 은 자식의 루트 엘리먼트에 클래스를 떨어뜨립니다. 부모 <code>&lt;style&gt;</code> 안에서는 <code>:global(.ds-input)</code> 으로 쓰거나 <code>app.css</code> 로 옮기세요.</li>
    <li><strong>CSS 커스텀 프로퍼티</strong>(레시피 3). Svelte 스코프를 지나 캐스케이드합니다. 테마 전파에 가장 적합.</li>
    <li>
      <strong><code>:global(...)</code> 뚫기</strong>. 마지막 수단.
      <pre><code
          >{`<style>
  .my-combo :global([data-component-part='item'][data-highlighted]) {
    background: var(--ds-accent-subtle);
  }
</style>`}</code
        ></pre>
      Svelte 5 는 <code>:global &#123; ... &#125;</code> 블록 문법도 지원합니다.
    </li>
  </ol>

  <h2>권장 스택</h2>
  <table class="stack">
    <thead>
      <tr><th>레이어</th><th>도구</th><th>용도</th></tr>
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

  <h2>다음으로 읽을 것</h2>
  <ul>
    <li><a href="/docs/layers-by-example">예제로 보는 계층</a> — 사용자 코드가 Layer 2/3/4/5 에서 어떻게 다른지.</li>
    <li><a href="/docs/composition">합성</a> — <code>with*</code> 래퍼로 선택 기능 추가하기.</li>
    <li><a href="/docs/i18n">국제화와 RTL</a> — RTL 스타일링에 <code>data-direction</code> 사용하기.</li>
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
