<script lang="ts">
  import { Root, Trigger, Content, Title, Description, Close } from '@kumiki/component-popover';

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
    background: #16162a;
    border: 1px solid #2a2a4a;
    border-radius: 12px;
    padding: 24px;
    position: relative;
  }
  .demo :global(.trigger) {
    background: #4fc08d;
    color: #0e0e1c;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-weight: 600;
    cursor: pointer;
  }
  .demo :global(.trigger:focus) {
    outline: 2px solid #ff3e00;
    outline-offset: 2px;
  }
  .demo :global(.panel) {
    background: #0e0e1c;
    border: 1px solid #3a3a5a;
    border-radius: 8px;
    padding: 16px;
    color: #e0e0e0;
    width: 240px;
    margin-top: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
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
    color: #888;
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
    background: #1a1a30;
    color: #e0e0e0;
    border: none;
    border-radius: 4px;
    padding: 6px 8px;
    cursor: pointer;
    font-size: 13px;
  }
  .demo :global(.links button:hover) {
    background: #2a2a4a;
  }
  .demo :global(.close) {
    background: #2a2a4a;
    color: #e0e0e0;
    border: none;
    border-radius: 4px;
    padding: 4px 12px;
    cursor: pointer;
    font-size: 12px;
  }
  .state {
    margin-top: 16px;
    color: #888;
    font-size: 13px;
  }
  .state code {
    color: #4fc08d;
  }
</style>
