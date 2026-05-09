<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import { LOCALES } from '$lib/i18n/dict.js';
</script>

<svelte:head>
  <title>国际化与 RTL · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ 基础 — 04"
  title="语言作为子路径导入。"
  lede="没有翻译的大包。每个 locale 都是自己的子路径导入,brotli ≤ 1 KB,按需懒加载。RTL 反转活在状态机里,而非 CSS。"
>
  <h2>Phase 1 的 locale</h2>
  <ul class="locales">
    {#each LOCALES as l (l.code)}
      <li>
        <span class="native">{l.native}</span>
        <span class="meta"><code>@kumiki/locale/{l.code}</code> · {l.name}</span>
      </li>
    {/each}
  </ul>

  <h2>运行时切换</h2>
  <p>
    包裹你的应用一次,然后随时切换导入的 locale 包。下方组件会在每次变更时重新读取消息。
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

  <h2>RTL 不是事后补丁</h2>
  <p>
    阅读方向从 <code>LocaleProvider</code> 通过上下文传播。方向敏感的键盘映射(Tabs 的
    <code>ArrowRight</code>、Slider、RadioGroup)从机器上下文读取方向 — 控制器并不知道 RTL。
  </p>

  <p>
    每个组件详情页上的 <strong>方向切换</strong> 让你不切换语言就能预览任何 locale 的 RTL,用于验证样式。
  </p>

  <h2>本地化的内容</h2>
  <p><code>@kumiki/locale</code> 包覆盖:</p>
  <ul>
    <li><code>combobox</code>:列表框标签、「无结果」、清除按钮。</li>
    <li><code>dialog</code>:关闭按钮标签。</li>
    <li><code>tabs</code>:默认 tablist 标签。</li>
    <li><code>formField</code>:必填标记、「必填」/「类型不匹配」错误。</li>
  </ul>
  <p>
    Form Field 组合的校验消息可以整体替换,或通过 Standard Schema 扩展 — 无需每种校验器的适配层。
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
