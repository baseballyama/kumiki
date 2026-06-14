<!--
  Popover sandbox — fixture for Playwright + axe.

  Query params:
    ?initial=open       start open (default closed)
    ?escape=0           disable closeOnEscape (default on)
    ?outside=0          disable closeOnOutsideClick (default on)
    ?dir=rtl            wrap in dir="rtl"
-->
<script lang="ts">
  import { Root, Trigger, Content, Title, Description, Close } from '@kumiki/components/popover';
  import { page } from '$app/state';

  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
  const closeOnEscape = $derived(page.url.searchParams.get('escape') !== '0');
  const closeOnOutsideClick = $derived(page.url.searchParams.get('outside') !== '0');
  const initialOpen = $derived(page.url.searchParams.get('initial') === 'open');

  // svelte-ignore state_referenced_locally
  let open = $state(initialOpen);
  let log = $state<string[]>([]);

  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>Popover sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-testid="sandbox">
  <h1>Popover sandbox</h1>

  <div data-testid="popover-host">
    <Root
      bind:open
      {closeOnEscape}
      {closeOnOutsideClick}
      onOpenChange={(v) => append(`onOpenChange(${v})`)}
    >
      <Trigger data-testid="trigger">Open popover</Trigger>
      <Content data-testid="content" class="panel">
        <Title data-testid="title">Settings</Title>
        <Description data-testid="description">Configure your preferences.</Description>
        <input data-testid="input" placeholder="Type here…" />
        <button data-testid="another">Another button</button>
        <Close data-testid="close">Close</Close>
      </Content>
    </Root>
  </div>

  <p data-testid="state">
    open: <strong data-testid="open">{open}</strong>
    · escape: <strong data-testid="escape">{closeOnEscape}</strong>
    · outside: <strong data-testid="outside">{closeOnOutsideClick}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <button data-testid="ext-toggle" type="button" onclick={() => (open = !open)}>
    Toggle externally
  </button>

  <button data-testid="outside-button" type="button">Outside button</button>
</div>

<style>
  /* The docs global stylesheet colours headings/paragraphs with the (light-
     theme) ink tokens; inside this dark demo panel those would be unreadable,
     so descendant text inherits the panel's light colour. */
  :global(.panel :is(h1, h2, h3, h4, p)) {
    color: inherit;
  }
  :global(.panel) {
    background: #16162a;
    border: 1px solid #3a3a5a;
    border-radius: 8px;
    padding: 16px;
    color: #e0e0e0;
    min-width: 240px;
    margin-top: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
  :global(.panel input) {
    background: #0e0e1c;
    color: #e0e0e0;
    border: 1px solid #3a3a5a;
    border-radius: 4px;
    padding: 4px 8px;
    margin: 8px 0;
    width: 100%;
  }
  :global(.panel button) {
    background: #2a2a4a;
    color: #e0e0e0;
    border: none;
    border-radius: 4px;
    padding: 4px 12px;
    margin-right: 8px;
    cursor: pointer;
  }
  :global([data-component-host='popover'][data-state='closed']) {
    display: none;
  }
</style>
