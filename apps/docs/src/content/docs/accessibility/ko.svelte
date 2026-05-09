<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>접근성 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 기초 — 03"
  title="접근성의 긴 버전."
  lede="axe-core 는 WCAG 위반의 30–40% 를 잡습니다. 나머지 60% 는 APG 키보드 테스트와 실제 스크린 리더 실행에서 옵니다. Kumiki 는 셋 모두를 머지 게이트로 둡니다."
>
  <h2>세 층의 테스트</h2>

  <table class="strata">
    <thead>
      <tr>
        <th>무엇</th>
        <th>언제</th>
        <th>잡는 것</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>axe-core</strong></td>
        <td>모든 PR — LTR & RTL × 문서화된 모든 상태</td>
        <td>정적 위반: 누락된 레이블, 대비, 역할의 적법성.</td>
      </tr>
      <tr>
        <td><strong>APG 키보드</strong></td>
        <td>모든 PR — 패턴별 Playwright</td>
        <td>탭 순서, 방향키 내비게이션, Home / End / Page 의미, Escape.</td>
      </tr>
      <tr>
        <td><strong>Guidepup 스크린 리더</strong></td>
        <td>야간 스케줄</td>
        <td>VoiceOver 와 NVDA 가 실제로 말하는 내용, 그리고 실제 순서.</td>
      </tr>
    </tbody>
  </table>

  <h2>타입 수준에서 강제되는 접근 가능한 이름</h2>
  <p>
    WAI-ARIA APG 가 접근 가능한 이름을 요구하는 곳(예: 대화 상자)에서 TypeScript 가 그 요구를 강제합니다.
    <code>{`<Dialog.Root>`}</code> 는 <code>title</code>, <code>aria-label</code>,
    <code>aria-labelledby</code> 중 하나 없이 컴파일되지 않습니다.
  </p>

  <pre><code
      >{`<Dialog.Root title="삭제 확인">
  <!-- 컴파일됨 -->
</Dialog.Root>

<Dialog.Root>
  <!-- 타입 오류: 접근 가능한 이름 누락 -->
</Dialog.Root>`}</code
    ></pre>

  <h2>키보드 계약</h2>
  <p>
    각 컴포넌트는 상세 페이지의 <strong>접근성</strong> 탭에서 키맵을 문서화합니다. APG 가 패턴을
    정의한 곳에서는 Kumiki 가 이를 그대로 따릅니다 — 창의적 해석은 하지 않습니다.
  </p>

  <h2>모션 줄이기, RTL, 고대비</h2>
  <ul>
    <li><code>prefers-reduced-motion</code> 은 문서 사이트 전반에서 모든 트랜지션을 약 10 ms 로 줄입니다.</li>
    <li>
      RTL 은 사후 처리가 아닙니다. 방향에 민감한 키맵(Tabs, Slider)은 DOM 이 아니라 머신 컨텍스트에서
      방향을 읽습니다.
    </li>
    <li>Forced-colors 모드를 존중합니다 — 컴포넌트는 배경만으로 상태를 표현하지 않습니다.</li>
  </ul>

  <h2>「Kumiki-ready」체크리스트</h2>
  <p>
    모든 컴포넌트는 머지 전에
    <a href="https://github.com/baseballyama/kumiki/blob/main/docs/design/05-accessibility.md"
      >docs/design/05-accessibility.md §5.6</a
    >
    의 체크리스트를 만족해야 합니다. 예외 없음, <code>--ignore</code> 플래그 없음.
  </p>
</Prose>

<style>
  table.strata {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 14px;
  }
  table.strata th,
  table.strata td {
    padding: 12px 14px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: top;
  }
  table.strata th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    font-weight: 500;
  }
  table.strata td {
    color: var(--k-ink-3);
  }
  table.strata td:first-child {
    color: var(--k-ink-1);
    width: 22%;
  }
  table.strata td:nth-child(2) {
    width: 32%;
  }
</style>
