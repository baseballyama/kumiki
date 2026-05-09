<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);

  const matrix = [
    { task: 'FSM (상태 전이)', l2: 'Kumiki', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'Svelte 반응 브리지', l2: '당신', l3: '당신*', l4: 'Kumiki', l5: 'Kumiki' },
    { task: '<button> 요소', l2: '당신', l3: '당신', l4: 'Kumiki', l5: '복사됨' },
    { task: 'ARIA 속성 (aria-pressed, …)', l2: '당신', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'data-state 출력', l2: '당신', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: '클릭 / 키 처리', l2: '당신', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: '접근 가능한 이름 (aria-label)', l2: '당신', l3: '당신', l4: '당신', l5: 'Kumiki' },
    { task: '스타일링', l2: '당신', l3: '당신', l4: '당신', l5: '복사됨' },
  ];
</script>

<svelte:head>
  <title>예제로 보는 계층 — Toggle · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 기초 — 06"
  title="예제로 보는 계층: Toggle"
  lede="같은 Toggle 을 Layer 2, 3, 4, 5 에서 각각 작성한 모습을 나란히 비교합니다. 스택을 한 단계 내려갈 때마다 더 많은 제어와 더 많은 책임이 주어집니다."
>
  <p>
    Kumiki 의 모든 계층은 <strong>같은 동작을 다른 추상화 수준</strong>으로 노출합니다. 한 계층 내려가면
    DOM, ARIA, 이벤트 배선의 더 많은 부분을 떠맡지만 — 그만큼 구조를 직접 고를 자유도 얻습니다. 한 계층
    올라가면 코드는 줄어들지만 Kumiki 의 구조적 선택을 받아들여야 합니다.
  </p>

  <p>
    예제로 <a href="/components/component-toggle">Toggle</a> 을 사용합니다. 동작은 단순(눌러 뒤집기)하지만,
    구현이 <strong>네 계층 모두</strong>에 존재하므로 나란히 비교하기에 이상적입니다.
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

  <h2>1. Layer 4 — 복합 컴포넌트(기본 진입점)</h2>
  <p>
    가장 짧은 길. <code>Toggle.Root</code> 가 <code>&lt;button&gt;</code> 을 렌더하고 ARIA,
    <code>data-state</code>, 키보드, SSR 을 관리합니다. 당신의 책임은 <strong>두 가지</strong>입니다:
    <code>bind:pressed</code> 로 상태 받기, 그리고 <code>aria-label</code>(또는 가시 레이블) 제공.
  </p>

  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="음소거">
  {pressed ? '음소거됨' : '켜짐'}
</Toggle.Root>`}</code
    ></pre>

  <p>결과 DOM:</p>

  <pre><code
      >{`<button type="button" aria-pressed="false" data-state="off" id="toggle-…">
  켜짐
</button>`}</code
    ></pre>

  <p>
    <strong>이때 선택:</strong> 90% 의 경우. 네이티브 <code>&lt;button&gt;</code> 으로 충분하고, 래핑 구조를 덮어쓸 필요가 없을 때.
  </p>

  <h2>2. Layer 3 — Headless attachment</h2>
  <p>
    요소를 직접 골라야 할 때(<code>&lt;a&gt;</code>, <code>&lt;div role="button"&gt;</code>, 사용자 정의 래퍼).
    <code>createToggle()</code> 은 <code>{`{@attach}`}</code> 와 호환되는 팩토리를 반환하며, 원하는 어떤
    요소에도 spread 할 수 있습니다.
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggle } from '@kumiki/headless/toggle';

  const t = createToggle({ initial: false });

  // controller.pressed 는 일반 getter 입니다. 텍스트로 표시하려면 subscribe
  // 하여 $state 에 미러링해야 합니다. (CSS 가 모두 처리한다면 불필요.)
  let pressed = $state(t.pressed);
  $effect(() => t.subscribe(({ context }) => (pressed = context.pressed)));
<\/script>

<button {@attach t.root} aria-label="음소거" class="my-btn">
  {pressed ? '음소거됨' : '켜짐'}
</button>`}</code
    ></pre>

  <p>
    마운트 시 <code>{`{@attach t.root}`}</code> 가 DOM 측 속성(<code>type</code>,
    <code>aria-pressed</code>, <code>data-state</code>, <code>id</code>)을 쓰고 클릭 + 키
    (Space / Enter) 리스너를 연결합니다. <strong>늘어난 책임:</strong> 요소 선택, 스타일링, 가시 레이블,
    그리고 (필요할 때만) 상태를 반응형 로컬에 미러링하기 위한 <code>subscribe</code>.
  </p>

  <p>
    <strong>이때 선택:</strong> Layer 4 의 고정 구조(<code>&lt;button&gt;</code>)가 맞지 않을 때. 예: toggle
    을 <code>&lt;label&gt;</code> 안에 넣거나 사용자 정의 상위 셸로 감쌀 때.
  </p>

  <h2>3. Layer 2 — 순수 상태 기계</h2>
  <p>Svelte 가 전혀 없습니다 — 순수 TypeScript 유한 상태 기계. <strong>DOM, ARIA, 이벤트, 키보드를 모두 직접 작성합니다.</strong></p>

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
  aria-label="음소거"
  onclick={() => m.send({ type: 'TOGGLE' })}
>
  {pressed ? '음소거됨' : '켜짐'}
</button>`}</code
    ></pre>

  <p><strong>Layer 2 로 내려가는 이유는 보통 UI 가 아니라 — 로직 재사용입니다:</strong></p>
  <ul>
    <li>서버에서 Toggle 로직 검증(SvelteKit server routes / Workers).</li>
    <li>Vitest 에서 순수 FSM 단위 테스트 작성(jsdom 불필요, 전이당 약 20μs).</li>
    <li>
      <a href="https://stately.ai/viz">stately.ai/viz</a> 에서 전이를 시각화 (<code
        >machine.toJSON()</code
      > 이 XState 호환 JSON 을 출력).
    </li>
    <li>비-Svelte 호스트(바닐라 JS, Web Components, 다른 프레임워크)에 임베드.</li>
  </ul>

  <h2>4. Layer 5 — Atelier (복사·붙여넣기 가능한 스타일 변형)</h2>
  <p>CLI 가 소스를 당신의 저장소로 복사합니다. 복사 후에는 <strong>당신의 코드</strong>입니다 — 자유롭게 편집하세요.</p>

  <pre><code
      >{`# Tailwind v4 변형
npx kumiki add toggle --variant=tailwind

# 바닐라 CSS 변형
npx kumiki add toggle --variant=vanilla`}</code
    ></pre>

  <p>추가되는 파일:</p>

  <pre><code
      >{`src/lib/components/Toggle.svelte   # Layer 4 Toggle.Root 를 감싼 스타일 래퍼`}</code
    ></pre>

  <p>다른 Svelte 컴포넌트와 똑같이 사용하세요:</p>

  <pre><code
      >{`<script lang="ts">
  import Toggle from '$lib/components/Toggle.svelte';
  let pressed = $state(false);
<\/script>

<Toggle bind:pressed>음소거</Toggle>`}</code
    ></pre>

  <p>
    <strong>이때 선택:</strong> CSS 를 먼저 쓰지 않고도 동작하는 시각 기준선이 필요할 때. Layer 5 는 v1.0
    동안 <code>0.x.x-preview</code> 로 출시되므로, 안정성에 민감한 프로젝트라면 Layer 4 + 자체 스타일링을
    선호하세요.
  </p>

  <h2>책임 매트릭스</h2>

  <p>각 계층에서 당신이 작성하는 것. "Kumiki" = 라이브러리가 처리; "당신" = 당신의 코드.</p>

  <table class="matrix">
    <thead>
      <tr>
        <th>책임</th>
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
          <td class:you={row.l2 === '당신'} class:them={row.l2 === 'Kumiki'}>{row.l2}</td>
          <td class:you={row.l3.startsWith('당신')} class:them={row.l3 === 'Kumiki'}>{row.l3}</td>
          <td class:you={row.l4 === '당신'} class:them={row.l4 === 'Kumiki'}>{row.l4}</td>
          <td class:them={row.l5 === 'Kumiki'}>{row.l5}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <p class="note">
    * Svelte 반응 브리지는 L3 에서 <code>controller.pressed</code> 를 텍스트로 표시할 때만 필요합니다.
    CSS 가 <code>data-state</code> 로 모두 처리한다면 <code>subscribe</code> 는 필요하지 않습니다.
  </p>

  <h2>계층 선택 — 의사결정 트리</h2>

  <ul>
    <li>
      <strong>지금 당장 스타일까지 갖춰서 동작이 필요한가?</strong> → <strong>Layer 5</strong>
      (<code>npx kumiki add</code>). 참고: v1.0 동안 preview 태그.
    </li>
    <li>
      <strong>표준 &lt;button&gt; 으로 충분하고 스타일은 직접?</strong> → <strong>Layer 4</strong>
      (<code>{`<Toggle.Root>`}</code>). 기본 진입점.
    </li>
    <li>
      <strong>요소 타입이나 구조를 직접 골라야 하는가?</strong> → <strong>Layer 3</strong>
      (<code>{`{@attach t.root}`}</code>). Layer 4 의 <code>child</code> 스니펫이 충분하다면 Layer 4
      에 머무르세요 — 코드가 더 적습니다.
    </li>
    <li>
      <strong>Svelte 외부 실행 / 서버 검증 / FSM 만 필요?</strong> → <strong>Layer 2</strong>
      (<code>createToggleMachine</code>).
    </li>
  </ul>

  <h2>다음으로 읽을 것</h2>
  <ul>
    <li>
      <a href="/docs/styling">스타일링</a> — Layer 4 에서 <code>data-*</code>,
      <code>class</code> 패스스루, <code>child</code> 스니펫 사용법.
    </li>
    <li><a href="/docs/architecture">아키텍처</a> — 5 계층 모델 전체.</li>
    <li>
      <a href="/docs/composition">합성</a> — <code>with*</code> 래퍼로 선택 기능 추가하기.
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
