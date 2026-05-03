<script lang="ts">
  import { Toggle } from '@kumiki/component-toggle';

  let pressed = $state(false);
  let disabled = $state(false);
  let log = $state<string[]>([]);

  function append(line: string) {
    log = [line, ...log].slice(0, 6);
  }
</script>

<div class="demo">
  <div class="row">
    <Toggle.Root bind:pressed {disabled} onPressedChange={(v) => append(`onPressedChange(${v})`)}>
      {pressed ? 'On' : 'Off'}
    </Toggle.Root>

    <label class="control">
      <input type="checkbox" bind:checked={disabled} />
      disabled
    </label>

    <button type="button" class="ext" onclick={() => (pressed = !pressed)}>
      Externally toggle (controlled)
    </button>
  </div>

  <p class="state">
    pressed = <code>{pressed}</code> · disabled = <code>{disabled}</code>
  </p>

  {#if log.length > 0}
    <ol class="log">
      {#each log as line, i (`${i}-${line}`)}
        <li><code>{line}</code></li>
      {/each}
    </ol>
  {/if}
</div>

<style>
  .demo {
    background: var(--demo-bg, #16162a);
    border: 1px solid #2a2a4a;
    border-radius: 12px;
    padding: 24px;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  .row :global(button[aria-pressed]) {
    padding: 10px 18px;
    background: #1a1a2e;
    color: #e0e0e0;
    border: 1px solid #3a3a5a;
    border-radius: 8px;
    font: inherit;
    cursor: pointer;
    transition: background-color 120ms;
    min-width: 80px;
  }
  .row :global(button[aria-pressed='true']) {
    background: #ff3e00;
    border-color: #ff3e00;
    color: white;
  }
  .row :global(button[aria-disabled='true']) {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .control {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #999;
    font-size: 14px;
  }
  .ext {
    background: transparent;
    color: #999;
    border: 1px dashed #3a3a5a;
    border-radius: 8px;
    padding: 8px 14px;
    font: inherit;
    cursor: pointer;
  }
  .state {
    color: #888;
    font-size: 14px;
    margin-top: 16px;
  }
  .state code {
    color: #4fc08d;
  }
  .log {
    margin-top: 8px;
    padding: 8px 12px 8px 28px;
    background: #0e0e1c;
    border-radius: 6px;
    font-size: 13px;
    color: #888;
    list-style: decimal;
  }
</style>
