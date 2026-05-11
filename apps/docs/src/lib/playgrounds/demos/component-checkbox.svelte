<script lang="ts">
  import { Checkbox, type CheckboxValue } from '@kumiki/components/checkbox';

  let value = $state<CheckboxValue>('unchecked');
  let disabled = $state(false);
  let log = $state<string[]>([]);

  function append(line: string) {
    log = [line, ...log].slice(0, 6);
  }
</script>

<div class="demo">
  <div class="row">
    <Checkbox.Root bind:value {disabled} onCheckedChange={(v) => append(`onCheckedChange(${v})`)}>
      {value === 'checked' ? '✓' : value === 'mixed' ? '−' : ''}
    </Checkbox.Root>

    <span class="label">
      I {value === 'checked' ? 'agree' : value === 'mixed' ? 'partly agree' : "don't agree"} to the terms
    </span>

    <label class="control">
      <input type="checkbox" bind:checked={disabled} />
      disabled
    </label>
  </div>

  <div class="ext-row">
    <button type="button" onclick={() => (value = 'unchecked')}>set unchecked</button>
    <button type="button" onclick={() => (value = 'mixed')}>set mixed (programmatic)</button>
    <button type="button" onclick={() => (value = 'checked')}>set checked</button>
  </div>

  <p class="state">value = <code>{value}</code></p>

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
  }
  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .row :global(button[role='checkbox']) {
    width: 22px;
    height: 22px;
    padding: 0;
    border-radius: 4px;
    border: 1px solid var(--k-line-2);
    background: var(--k-code-bg);
    color: var(--k-matcha-ink);
    font-size: 14px;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex: 0 0 auto;
  }
  .row :global(button[role='checkbox'][aria-checked='true']) {
    background: var(--k-shu);
    border-color: var(--k-shu);
    color: white;
  }
  .row :global(button[role='checkbox'][aria-checked='mixed']) {
    background: var(--k-yamabuki);
    border-color: var(--k-yamabuki);
    color: var(--k-surface-0);
    font-weight: 700;
  }
  .row :global(button[role='checkbox'][aria-disabled='true']) {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .label {
    color: var(--k-ink-2);
  }
  .control {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--k-ink-3);
    font-size: 14px;
  }
  .ext-row {
    margin-top: 12px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .ext-row button {
    padding: 6px 10px;
    background: transparent;
    color: var(--k-ink-3);
    border: 1px dashed var(--k-line-2);
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
  }
  .state {
    color: var(--k-ink-3);
    font-size: 14px;
    margin-top: 12px;
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
