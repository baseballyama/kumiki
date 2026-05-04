<!--
  Tooltip sandbox — fixture for Playwright + axe.

  Query params:
    ?initial=open               start open
    ?openDelay=N                ms (default 0 in fixture for fast tests)
    ?closeDelay=N               ms (default 0 in fixture for fast tests)
    ?disableHover=1             disable hoverable content
    ?dir=rtl                    wrap in dir="rtl"
-->
<script lang="ts">
  import { Root, Trigger, Content } from '@kumiki/component-tooltip';
  import { page } from '$app/state';

  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
  const openDelay = $derived(parseInt(page.url.searchParams.get('openDelay') ?? '0', 10));
  const closeDelay = $derived(parseInt(page.url.searchParams.get('closeDelay') ?? '0', 10));
  const disableHoverableContent = $derived(page.url.searchParams.get('disableHover') === '1');
  const initialOpen = $derived(page.url.searchParams.get('initial') === 'open');

  // svelte-ignore state_referenced_locally
  let open = $state(initialOpen);
  let log = $state<string[]>([]);

  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>Tooltip sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-testid="sandbox">
  <h1>Tooltip sandbox</h1>

  <div data-testid="tooltip-host">
    <Root
      bind:open
      {openDelay}
      {closeDelay}
      {disableHoverableContent}
      onOpenChange={(v) => append(`onOpenChange(${v})`)}
    >
      <Trigger data-testid="trigger" class="trigger">Hover or focus me</Trigger>
      <Content data-testid="content" class="hint">
        Tooltip content — non-interactive, descriptive only.
      </Content>
    </Root>
  </div>

  <p data-testid="state">
    open: <strong data-testid="open">{open}</strong>
    · openDelay: <strong data-testid="open-delay">{openDelay}</strong>
    · closeDelay: <strong data-testid="close-delay">{closeDelay}</strong>
    · disableHover: <strong data-testid="disable-hover">{disableHoverableContent}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <button data-testid="ext-toggle" type="button" onclick={() => (open = !open)}>
    Toggle externally
  </button>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}
      <li>{line}</li>
    {/each}
  </ol>
</div>

<style>
  :global(.trigger) {
    /* WCAG AA 4.5:1 against white — Svelte orange #ff3e00 fails at 3.53:1. */
    background: #b32a00;
    color: #fff;
    border: 0;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font: inherit;
  }
  /* UA `[hidden] { display: none }` would be overridden by `.hint`'s
     custom display; explicitly keep it hiding. */
  :global(.hint[hidden]) {
    display: none;
  }
  :global(.hint:not([hidden])) {
    margin-top: 8px;
    padding: 6px 10px;
    background: #1e1e3a;
    color: #ddd;
    border-radius: 6px;
    font-size: 13px;
    max-width: 280px;
    display: inline-block;
  }
</style>
