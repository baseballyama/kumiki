<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';

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
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    width: 100%;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  .row :global(button[aria-pressed]) {
    padding: 10px 18px;
    background: var(--k-surface-2);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
    border-radius: var(--k-radius-sm);
    font: inherit;
    cursor: pointer;
    transition:
      background-color 120ms,
      border-color 120ms;
    min-width: 80px;
  }
  .row :global(button[aria-pressed='true']) {
    background: var(--k-shu);
    border-color: var(--k-shu);
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
    color: var(--k-ink-3);
    font-size: 14px;
  }
  .control input {
    accent-color: var(--k-shu);
  }
  .ext {
    background: transparent;
    color: var(--k-ink-2);
    border: 1px dashed var(--k-line-2);
    border-radius: var(--k-radius-sm);
    padding: 8px 14px;
    font: inherit;
    cursor: pointer;
  }
  .ext:hover {
    border-color: var(--k-line-3);
  }
  .state {
    color: var(--k-ink-3);
    font-size: 13px;
    margin-top: 16px;
    font-family: var(--k-font-mono, monospace);
  }
  .state code {
    color: var(--k-matcha);
  }
  .log {
    margin-top: 8px;
    padding: 8px 12px 8px 28px;
    background: var(--k-code-bg);
    border: 1px solid var(--k-code-line);
    border-radius: var(--k-radius-sm);
    font-size: 12px;
    color: var(--k-ink-3);
    list-style: decimal;
    font-family: var(--k-font-mono, monospace);
  }
</style>
