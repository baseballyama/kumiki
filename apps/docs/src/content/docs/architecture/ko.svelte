<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';

  const layers = [
    {
      n: 0,
      ji: '型',
      name: 'Types',
      pkg: '@kumiki/types',
      role: '공유 TypeScript 표면 — 위 모든 계층이 동의하는 유일한 계약.',
    },
    {
      n: 1,
      ji: '基',
      name: 'Primitives',
      pkg: '@kumiki/primitives',
      role: '프레임워크 비의존 헬퍼(focus trap, dismissable, ID, locale, motion).',
    },
    {
      n: 2,
      ji: '機',
      name: 'Machines',
      pkg: '@kumiki/machines',
      role: '순수 TS 유한 상태 기계. 약 1 KB 런타임, 검사 가능한 JSON.',
    },
    {
      n: 3,
      ji: '装',
      name: 'Attachments',
      pkg: '@kumiki/headless',
      role: 'Svelte 5 의 {@attach} 팩토리 — 실제 DOM 에 ARIA + data-state 를 구동.',
    },
    {
      n: 4,
      ji: '組',
      name: 'Components',
      pkg: '@kumiki/components',
      role: '복합 프리미티브. 도트 네임스페이스의 인체공학적 API.',
    },
    {
      n: 5,
      ji: '釉',
      name: 'Atelier',
      pkg: '@kumiki/atelier',
      role: 'Layer 5 프리뷰 — 복사·붙여넣기 가능한 스타일 변형.',
    },
  ];
</script>

<svelte:head>
  <title>아키텍처 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 기초 — 01"
  title="다섯 계층, 하나의 모델."
  lede="모든 Kumiki 프리미티브는 정확히 하나의 계층에 속합니다. 필요한 제어 단위에 맞춰 계층을 선택하고 — 그 계층의 바이트만 출하하세요. 서브패스 export 가 tree-shaking 을 외과적 수준으로 유지합니다."
>
  <p>
    이름은 <em>조목(組木)</em> 짜맞춤 기법에서 따왔습니다. 각 계층은 못이나 풀 없이 다음 계층과 정확히
    맞물리는 부재입니다.
  </p>

  <table class="layers">
    <thead>
      <tr>
        <th>L</th>
        <th>이름</th>
        <th>패키지</th>
        <th>역할</th>
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

  <h2>계층 고르기</h2>
  <p>대부분의 앱은 Layer 4 에 머뭅니다. 더 아래로 내려가는 경우는 다음과 같을 때입니다:</p>
  <ul>
    <li>
      <strong>Layer 3 (attachments)</strong> — DOM 을 엄격히 통제할 때. Svelte 래퍼가 아닌 네이티브
      <code>&lt;button&gt;</code> 으로 스타일링하고 싶을 때.
    </li>
    <li>
      <strong>Layer 2 (machines)</strong> — SSR / 서버 측 검증, 혹은 Svelte 가 아닌 환경 (Cypress, Vitest,
      worker) 에서 로직을 실행할 때.
    </li>
    <li>
      <strong>Layer 1 (primitives)</strong> — dismissable / focus-trap / ID 엔진 위에 자신의 컴포넌트를
      만들 때.
    </li>
  </ul>

  <h2>왜 전부 끌어들이지 않는가?</h2>
  <p>
    번들 예산. 각 서브패스에는 CI 가 강제하는 brotli 예산이 있습니다 — Toggle 은 1.5 KB, Combobox 는
    4.5 KB. 자체 디자인 토큰을 이미 가진 프로젝트에 Layer 5 의 스타일 변형을 끌어들이는 것은 바이트
    낭비입니다. Atelier 패키지는 옵트인이며 기본이 아닙니다.
  </p>

  <h2>원전 자료</h2>
  <p>
    내부 설계 문서는
    <a href="https://github.com/baseballyama/kumiki/tree/main/docs/design">/docs/design</a> 에 있습니다.
    특히 주목할 것:
  </p>
  <ul>
    <li><code>02-architecture.md</code> — 이 계층 모델, 도식 포함.</li>
    <li><code>03-package-structure.md</code> — 패키지 경계.</li>
    <li><code>04-state-machines.md</code> — FSM 런타임 명세.</li>
    <li><code>09-bundle-budget.md</code> — 서브패스별 brotli 예산.</li>
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
