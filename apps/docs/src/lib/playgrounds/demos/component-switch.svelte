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
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: 12px;
    padding: 24px;
    width: 460px;
    min-height: 340px;
    box-sizing: border-box;
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
    background: var(--k-line-1);
    border: 1px solid var(--k-line-2);
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
    background: var(--k-ink-3);
    transition:
      transform 180ms,
      background-color 120ms;
  }
  .row :global(button[role='switch'][aria-checked='true']) {
    background: var(--k-shu);
    border-color: var(--k-shu);
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
    color: var(--k-ink-3);
    font-size: 14px;
  }
  .ext {
    background: transparent;
    color: var(--k-ink-3);
    border: 1px dashed var(--k-line-2);
    border-radius: 8px;
    padding: 8px 14px;
    font: inherit;
    cursor: pointer;
  }
  .state {
    color: var(--k-ink-3);
    font-size: 14px;
    margin-top: 16px;
  }
  .state code {
    color: var(--k-matcha-ink);
  }
  .log {
    margin-top: 8px;
    padding: 8px 12px 8px 28px;
    background: var(--k-code-bg);
    border-radius: 6px;
    font-size: 13px;
    color: var(--k-ink-3);
    list-style: decimal;
  }
</style>
