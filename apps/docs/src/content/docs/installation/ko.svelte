<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>설치 · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 시작하기 — 02"
  title="설치"
  lede="Kumiki 는 독립적으로 버전 관리되는 여러 패키지로 npm 에 배포됩니다. 필요한 계층만 설치하세요. 서브패스 import 가 tree-shaking 을 날카롭게 유지합니다."
>
  <h2>요구 사항</h2>
  <ul>
    <li>Node.js 22 이상.</li>
    <li>Svelte 5.29+ (<code>{'{@attach}'}</code> 디렉티브를 위해).</li>
    <li>ESM 인식 번들러 — Vite 5+, Rollup 4+, esbuild 0.25+. CJS 는 배포하지 않습니다.</li>
  </ul>

  <h2>계층 선택</h2>
  <p>대부분의 사용자는 Layer 4 — 복합 컴포넌트 — 와 locale 번들이 필요합니다:</p>
  <pre><code>pnpm add @kumiki/components @kumiki/locale</code></pre>

  <p>DOM 을 완전히 제어해야 하나요? 컴포넌트를 건너뛰고 Layer 3 attachments 를 직접 사용하세요:</p>
  <pre><code>pnpm add @kumiki/headless</code></pre>

  <p>자신만의 프리미티브를 만들고 있나요? 어느 상태 기계든 단독으로 사용 가능합니다:</p>
  <pre><code>pnpm add @kumiki/machines</code></pre>

  <h2>Locale 제공</h2>
  <p>
    앱을 <code>LocaleProvider</code> 로 한 번 감싸세요. 그 아래의 모든 Kumiki 컴포넌트가 메시지와 읽기
    방향을 받습니다.
  </p>
  <pre><code
      >{`<script lang="ts">
  import { LocaleProvider } from '@kumiki/components';
  import { messages, direction } from '@kumiki/locale/ko';

  let { children } = $props();
<\/script>

<LocaleProvider.Root locale="ko" {messages} dir={direction}>
  {@render children()}
</LocaleProvider.Root>`}</code
    ></pre>

  <p>
    Locale 번들은 서브패스 import 입니다 — 각 brotli ≤ 1 KB. 런타임에 <code>messages</code>
    번들을 바꾸면 언어가 전환되며, 컴포넌트는 ARIA 텍스트를 자동으로 다시 계산합니다.
  </p>

  <h2>설치 확인</h2>
  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="음소거">
  {pressed ? '음소거됨' : '켜짐'}
</Toggle.Root>`}</code
    ></pre>

  <p>이제 끝입니다. <a href={resolve('/components')}>컴포넌트 카탈로그</a> 를 둘러보세요.</p>
</Prose>
