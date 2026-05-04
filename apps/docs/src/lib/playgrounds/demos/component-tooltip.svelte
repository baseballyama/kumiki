<script lang="ts">
  import { Root, Trigger, Content } from '@kumiki/component-tooltip';

  let openDelay = $state(700);
  let closeDelay = $state(300);
</script>

<div class="demo">
  <div class="controls">
    <label>
      open delay
      <input type="number" min="0" step="100" bind:value={openDelay} />
    </label>
    <label>
      close delay
      <input type="number" min="0" step="100" bind:value={closeDelay} />
    </label>
  </div>

  <div class="row">
    <Root {openDelay} {closeDelay}>
      <Trigger class="trigger">⌘K</Trigger>
      <Content class="hint">Open the command palette</Content>
    </Root>

    <Root {openDelay} {closeDelay}>
      <Trigger class="trigger ghost">?</Trigger>
      <Content class="hint">Show keyboard shortcuts</Content>
    </Root>

    <Root {openDelay} {closeDelay}>
      <Trigger class="trigger ghost">⚙</Trigger>
      <Content class="hint">Settings</Content>
    </Root>
  </div>

  <p class="state">
    Hover or focus a button. Tooltip respects <code>prefers-reduced-motion</code>.
  </p>
</div>

<style>
  .demo {
    background: #16162a;
    border: 1px solid #2a2a4a;
    border-radius: 12px;
    padding: 24px;
  }
  .controls {
    margin-bottom: 16px;
    color: #aaa;
    font-size: 13px;
    display: flex;
    gap: 16px;
  }
  .controls input {
    background: #0e0e1c;
    color: #e0e0e0;
    border: 1px solid #3a3a5a;
    border-radius: 6px;
    padding: 4px 8px;
    width: 80px;
    margin-left: 6px;
  }
  .row {
    display: flex;
    gap: 12px;
  }
  .demo :global(.trigger) {
    background: #ff3e00;
    color: #fff;
    border: 0;
    padding: 8px 14px;
    border-radius: 6px;
    cursor: pointer;
    font:
      600 14px ui-monospace,
      monospace;
  }
  .demo :global(.trigger.ghost) {
    background: transparent;
    color: #4fc08d;
    border: 1px solid #3a3a5a;
  }
  .demo :global(.hint[hidden]) {
    display: none;
  }
  .demo :global(.hint:not([hidden])) {
    margin-top: 6px;
    padding: 6px 10px;
    background: #0e0e1c;
    color: #ddd;
    border: 1px solid #3a3a5a;
    border-radius: 6px;
    font-size: 13px;
    max-width: 280px;
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
