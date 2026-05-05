<script lang="ts">
  import { Switch } from '@kumiki/components/switch';

  let checked = $state(false);
  let disabled = $state(false);
  let log = $state<string[]>([]);

  function append(line: string) {
    log = [line, ...log].slice(0, 6);
  }
</script>

<div class="demo">
  <div class="row">
    <Switch.Root bind:checked {disabled} onCheckedChange={(v) => append(`onCheckedChange(${v})`)}>
      {checked ? 'On' : 'Off'}
    </Switch.Root>

    <label class="control">
      <input type="checkbox" bind:checked={disabled} />
      disabled
    </label>

    <button type="button" class="ext" onclick={() => (checked = !checked)}>
      Externally toggle
    </button>
  </div>

  <p class="state">
    checked = <code>{checked}</code> · disabled = <code>{disabled}</code>
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
    background: #16162a;
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
  .row :global(button[role='switch']) {
    padding: 4px;
    width: 48px;
    height: 26px;
    border-radius: 13px;
    background: #2a2a4a;
    border: 1px solid #3a3a5a;
    cursor: pointer;
    position: relative;
    transition: background-color 120ms;
  }
  .row :global(button[role='switch']::after) {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #888;
    transition:
      transform 180ms,
      background-color 120ms;
  }
  .row :global(button[role='switch'][aria-checked='true']) {
    background: #ff3e00;
    border-color: #ff3e00;
  }
  .row :global(button[role='switch'][aria-checked='true']::after) {
    transform: translateX(22px);
    background: white;
  }
  .row :global(button[role='switch'][aria-disabled='true']) {
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
