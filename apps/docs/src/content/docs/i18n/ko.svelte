<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import { LOCALES } from '$lib/i18n/dict.js';
</script>

<svelte:head>
  <title>국제화와 RTL · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 기초 — 04"
  title="서브패스 import 로 만나는 언어."
  lede="번역의 거대 번들은 없습니다. 각 로케일은 brotli ≤ 1 KB 의 서브패스 import 로, 필요할 때 지연 로딩됩니다. RTL 반전은 CSS 가 아니라 상태 기계 안에 있습니다."
>
  <h2>Phase 1 의 로케일</h2>
  <ul class="locales">
    {#each LOCALES as l (l.code)}
      <li>
        <span class="native">{l.native}</span>
        <span class="meta"><code>@kumiki/locale/{l.code}</code> · {l.name}</span>
      </li>
    {/each}
  </ul>

  <h2>런타임에 전환</h2>
  <p>
    앱을 한 번 감싸세요. 이후 언제든 import 한 로케일 번들을 교체할 수 있고, 그 아래 컴포넌트는 변경마다
    메시지를 다시 읽습니다.
  </p>
  <pre><code
      >{`<script lang="ts">
  import { LocaleProvider } from '@kumiki/components';
  import * as ja from '@kumiki/locale/ja';
  import * as en from '@kumiki/locale/en';

  let active = $state<'ja' | 'en'>('ja');
  const bundle = $derived(active === 'ja' ? ja : en);
<\/script>

<button onclick={() => (active = active === 'ja' ? 'en' : 'ja')}>
  {active.toUpperCase()}
</button>

<LocaleProvider.Root locale={active} messages={bundle.messages} dir={bundle.direction}>
  {@render children()}
</LocaleProvider.Root>`}</code
    ></pre>

  <h2>RTL 은 사후 처리가 아닙니다</h2>
  <p>
    읽기 방향은 <code>LocaleProvider</code> 에서 컨텍스트를 통해 전파됩니다. 방향에 민감한 키맵(Tabs 의
    <code>ArrowRight</code>, Slider, RadioGroup)은 머신 컨텍스트에서 방향을 읽으며 — 컨트롤러는
    RTL 을 모릅니다.
  </p>

  <p>
    각 컴포넌트 상세 페이지의 <strong>방향 토글</strong> 은 언어를 바꾸지 않고도 어느 로케일이든 RTL 을
    미리 보여줍니다. 스타일을 검증할 때 사용하세요.
  </p>

  <h2>로컬라이즈되는 항목</h2>
  <p><code>@kumiki/locale</code> 번들의 범위:</p>
  <ul>
    <li><code>combobox</code>: listbox 레이블, "결과 없음", 지우기 버튼.</li>
    <li><code>dialog</code>: 닫기 버튼 레이블.</li>
    <li><code>tabs</code>: 기본 tablist 레이블.</li>
    <li><code>formField</code>: 필수 표시, "필수"/"타입 불일치" 에러.</li>
  </ul>
  <p>
    Form Field 가 구성하는 검증 메시지는 통째로 교체하거나 Standard Schema 로 확장할 수 있습니다 — 검증기마다 어댑터가 필요하지 않습니다.
  </p>
</Prose>

<style>
  ul.locales {
    list-style: none;
    margin: 24px 0;
    padding: 0;
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    overflow: hidden;
  }
  ul.locales li {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 24px;
    padding: 12px 16px;
    border-block-end: 1px solid var(--k-line-1);
  }
  ul.locales li:last-child {
    border-block-end: 0;
  }
  ul.locales .native {
    font-family: var(--k-font-display);
    font-size: 17px;
    color: var(--k-ink-1);
    font-variation-settings: 'opsz' 36;
  }
  ul.locales .meta {
    font-family: var(--k-font-mono);
    font-size: 11px;
    color: var(--k-ink-3);
  }
</style>
