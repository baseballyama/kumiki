<!--
  Dialog sandbox — fixture for Playwright + axe.

  Query params:
    ?initial=open               start open (default closed)
    ?modal=0                    non-modal (default modal)
    ?escape=0                   disable closeOnEscape (default on)
    ?outside=0                  disable closeOnOutsideClick (default on)
    ?side=center|left|right|top|bottom (default center; non-center = drawer)
    ?dir=rtl                    wrap in dir="rtl"
-->
<script lang="ts">
  import {
    Root,
    Trigger,
    Overlay,
    Content,
    Title,
    Description,
    Close,
  } from '@kumiki/components/dialog';
  import { page } from '$app/state';

  type DialogSide = 'center' | 'left' | 'right' | 'top' | 'bottom';

  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
  const modal = $derived(page.url.searchParams.get('modal') !== '0');
  const closeOnEscape = $derived(page.url.searchParams.get('escape') !== '0');
  const closeOnOutsideClick = $derived(page.url.searchParams.get('outside') !== '0');
  const initialOpen = $derived(page.url.searchParams.get('initial') === 'open');
  const side = $derived((page.url.searchParams.get('side') ?? 'center') as DialogSide);

  // svelte-ignore state_referenced_locally
  let open = $state(initialOpen);
  let log = $state<string[]>([]);

  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>Dialog sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-testid="sandbox">
  <h1>Dialog sandbox</h1>

  <div data-testid="dialog-host">
    <Root
      bind:open
      {modal}
      {closeOnEscape}
      {closeOnOutsideClick}
      onOpenChange={(v) => append(`onOpenChange(${v})`)}
    >
      <Trigger data-testid="trigger">Open dialog</Trigger>
      {#if modal}
        <Overlay data-testid="overlay" class="overlay" />
      {/if}
      <Content data-testid="content" class="panel" data-side={side}>
        <Title>Confirm action</Title>
        <Description>This dialog is part of the test fixture for Kumiki.</Description>
        <input data-testid="input" placeholder="Type here…" />
        <button data-testid="another">Another button</button>
        <Close data-testid="close">Close</Close>
      </Content>
    </Root>
  </div>

  <p data-testid="state">
    open: <strong data-testid="open">{open}</strong>
    · modal: <strong data-testid="modal">{modal}</strong>
    · escape: <strong data-testid="escape">{closeOnEscape}</strong>
    · outside: <strong data-testid="outside">{closeOnOutsideClick}</strong>
    · side: <strong data-testid="side">{side}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <button data-testid="ext-toggle" type="button" onclick={() => (open = !open)}>
    Toggle externally
  </button>

  <div id="bg-content">
    <button data-testid="bg-button">Background button (should be inert when modal & open)</button>
  </div>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}
      <li>{line}</li>
    {/each}
  </ol>
</div>

<style>
  :global(.overlay) {
    position: fixed;
    inset: 0;
    /* Sit above the docs site header (sticky, z-index 50) so the backdrop
       covers the whole viewport — a real modal overlay would do the same. */
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
  }
  /* `[hidden]` UA rule is `display: none` — make sure custom `display`
     does not override it. */
  :global(.panel[hidden]) {
    display: none;
  }
  :global(.panel:not([hidden])) {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 1001;
    transform: translate(-50%, -50%);
    background: #fff;
    color: #111;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    min-width: 320px;
    display: grid;
    gap: 12px;
  }
  :global(.panel input),
  :global(.panel button) {
    padding: 6px 10px;
  }
</style>
