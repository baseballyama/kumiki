<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>소개 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 시작하기 — 01"
  title="소개"
  lede="Kumiki — 組木 — 는 Svelte 5 를 위한 깊이 있는 접근성을 갖춘 UI 프리미티브 시스템입니다. “이 컴포넌트를 a11y, 국제화, 테마, 경량화 모두 챙기게 만들어 줘” 라는 질문에 50 개 저장소에서 50 번 답하고 싶지 않아서 만들어졌습니다."
>
  <h2>왜 Kumiki 인가?</h2>
  <p>
    대부분의 접근성 컴포넌트 라이브러리는 하나의 트레이드오프를 정해 그것에 머무릅니다. 어떤 것은
    headless 라 ARIA 배선을 사용자에게 맡기고, 어떤 것은 스타일과 함께 디자인 시스템을 통째로
    강요합니다. 어떤 것은 특정 상태 기계 라이브러리에 묶여 있고, 어떤 것은 상태 기계가 아예
    없습니다. Kumiki 는 그 트레이드오프를 거부합니다 — 다섯 개의 조합 가능한 계층, 각각이 독립적으로
    사용 가능합니다.
  </p>

  <ul>
    <li><strong>Layer 0 — Types.</strong> 모든 상위 계층이 공유하는 TypeScript 표면.</li>
    <li>
      <strong>Layer 1 — Primitives.</strong> 프레임워크 비의존 헬퍼 (focus trap, dismissable, ID, locale).
    </li>
    <li>
      <strong>Layer 2 — Machines.</strong> 순수 TS 유한 상태 기계. 약 1 KB 런타임, 완전히 검사 가능한
      JSON.
    </li>
    <li>
      <strong>Layer 3 — Attachments.</strong> <code>{'{@attach}'}</code> 팩토리가 실제 DOM 노드에
      ARIA 와 <code>data-state</code> 를 구동합니다.
    </li>
    <li>
      <strong>Layer 4 — Components.</strong> <code>{`<Combobox.Root>`}</code> 같은 복합 프리미티브, 기본적으로
      사용하기 편합니다.
    </li>
    <li>
      <strong>Layer 5 — Atelier.</strong> 의견을 가진 복사·붙여넣기 가능한 스타일 변형.
      <code>0.x-preview</code> 로 출시.
    </li>
  </ul>

  <h2>상태</h2>
  <p>
    Kumiki 는 <strong>프리알파</strong> 입니다. 아키텍처는 확정되었고, 번들 예산은 CI 에서 강제되며,
    스크린 리더 야간 검증도 돌고 있습니다 — 다만 아직 npm 에 게시된 버전은 없습니다. API 가 바뀐다고
    가정하세요. 이슈는
    <a href="https://github.com/baseballyama/kumiki/issues">baseballyama/kumiki</a> 에 등록해 주세요.
  </p>

  <h2>다음 단계</h2>
  <p>
    다음은: <a href={resolve('/docs/installation')}>설치</a> 또는
    <a href={resolve('/docs/architecture')}>아키텍처</a>. 먼저 실제로 동작하는 것을 보고 싶다면
    <a href={resolve('/components')}>컴포넌트 둘러보기</a>.
  </p>
</Prose>
