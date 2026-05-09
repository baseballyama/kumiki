<script lang="ts">
  import { Root, Trigger, Content, Title, Description, Close } from '@kumiki/components/popover';

  let open = $state(false);
</script>

<div class="demo">
  <Root bind:open>
    <Trigger class="trigger">Share</Trigger>
    <Content class="panel">
      <Title class="panel-title">Share this page</Title>
      <Description class="panel-desc">Pick a destination.</Description>
      <ul class="links">
        <li><button>Copy link</button></li>
        <li><button>Email</button></li>
        <li><button>Slack</button></li>
      </ul>
      <Close class="close">Done</Close>
    </Content>
  </Root>

  <p class="state">open: <code>{open}</code></p>
</div>

<style>
  .demo {
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: 12px;
    padding: 24px;
    position: relative;
  }
  .demo :global(.trigger) {
    background: var(--k-matcha);
    color: var(--k-code-bg);
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-weight: 600;
    cursor: pointer;
  }
  .demo :global(.trigger:focus) {
    outline: 2px solid var(--k-shu);
    outline-offset: 2px;
  }
  .demo :global(.panel) {
    background: var(--k-code-bg);
    border: 1px solid var(--k-line-2);
    border-radius: 8px;
    padding: 16px;
    color: var(--k-ink-1);
    width: 240px;
    margin-top: 8px;
    box-shadow: 0 8px 24px oklch(0 0 0 / 0.4);
  }
  .demo :global([data-component-host='popover'][data-state='closed']) {
    display: none;
  }
  .demo :global(.panel-title) {
    margin: 0 0 4px;
    font-size: 14px;
    color: #fff;
  }
  .demo :global(.panel-desc) {
    margin: 0 0 12px;
    font-size: 12px;
    color: var(--k-ink-3);
  }
  .demo :global(.links) {
    list-style: none;
    padding: 0;
    margin: 0 0 12px;
    display: grid;
    gap: 4px;
  }
  .demo :global(.links button) {
    width: 100%;
    text-align: left;
    background: var(--k-surface-2);
    color: var(--k-ink-1);
    border: none;
    border-radius: 4px;
    padding: 6px 8px;
    cursor: pointer;
    font-size: 13px;
  }
  .demo :global(.links button:hover) {
    background: var(--k-line-1);
  }
  .demo :global(.close) {
    background: var(--k-line-1);
    color: var(--k-ink-1);
    border: none;
    border-radius: 4px;
    padding: 4px 12px;
    cursor: pointer;
    font-size: 12px;
  }
  .state {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .state code {
    color: var(--k-matcha);
  }
</style>
