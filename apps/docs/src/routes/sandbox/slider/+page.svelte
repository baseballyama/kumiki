<!--
  Slider sandbox — fixture for Playwright + axe.

  Query params:
    ?initial=N                  default value
    ?orientation=vertical       use vertical orientation
    ?disabled=1                 start disabled
    ?dir=rtl                    wrap in dir="rtl"
-->
<script lang="ts">
  import { Root, Thumb } from '@kumiki/component-slider';
  import { page } from '$app/state';

  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
  const orientation = $derived(
    page.url.searchParams.get('orientation') === 'vertical' ? 'vertical' : 'horizontal',
  );
  const disabled = $derived(page.url.searchParams.get('disabled') === '1');
  const initial = $derived(parseInt(page.url.searchParams.get('initial') ?? '50', 10));

  // svelte-ignore state_referenced_locally
  let value = $state<number>(initial);
  let log = $state<string[]>([]);

  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>Slider sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-testid="sandbox">
  <h1>Slider sandbox</h1>

  <div data-testid="slider-host">
    <Root
      bind:value
      {orientation}
      direction={dir}
      {disabled}
      onValueChange={(v) => append(`onValueChange(${v})`)}
    >
      <Thumb data-testid="thumb" aria-label="Volume" />
    </Root>
  </div>

  <p data-testid="state">
    value: <strong data-testid="value">{value}</strong>
    · orientation: <strong data-testid="orientation">{orientation}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
    · disabled: <strong data-testid="disabled">{disabled}</strong>
  </p>

  <button data-testid="ext-zero" type="button" onclick={() => (value = 0)}>Set 0</button>
  <button data-testid="ext-100" type="button" onclick={() => (value = 100)}>Set 100</button>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}
      <li>{line}</li>
    {/each}
  </ol>
</div>

<style>
  :global([data-component-host='slider'][data-orientation='horizontal']) {
    position: relative;
    width: 320px;
    height: 24px;
    background: #1a1a30;
    border: 1px solid #3a3a5a;
    border-radius: 6px;
    margin: 12px 0;
    cursor: pointer;
  }
  :global([data-component-host='slider'][data-orientation='vertical']) {
    position: relative;
    width: 24px;
    height: 200px;
    background: #1a1a30;
    border: 1px solid #3a3a5a;
    border-radius: 6px;
    margin: 12px 0;
    cursor: pointer;
  }
  :global([data-component-part='thumb']) {
    position: absolute;
    width: 16px;
    height: 16px;
    background: #4fc08d;
    border: 2px solid #fff;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
  :global(
    [data-component-host='slider'][data-orientation='horizontal'] [data-component-part='thumb']
  ) {
    top: 50%;
    left: var(--kumiki-slider-pct);
  }
  :global(
    [data-component-host='slider'][data-orientation='vertical'] [data-component-part='thumb']
  ) {
    left: 50%;
    bottom: var(--kumiki-slider-pct);
    transform: translate(-50%, 50%);
  }
  :global([data-component-host='slider'][data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
