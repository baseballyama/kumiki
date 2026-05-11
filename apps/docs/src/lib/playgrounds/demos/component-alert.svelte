<script lang="ts">
  import { Alert, type AlertSeverity } from '@kumiki/components/alert';

  let severity = $state<AlertSeverity>('info');
  let dismissed = $state(false);

  function reopen() {
    dismissed = false;
  }
</script>

<div class="demo">
  <div class="controls">
    <label class="control">
      Severity
      <select bind:value={severity}>
        <option value="info">info</option>
        <option value="success">success</option>
        <option value="warning">warning</option>
        <option value="error">error</option>
      </select>
    </label>
    {#if dismissed}
      <button type="button" class="ext" onclick={reopen}>Re-open</button>
    {/if}
  </div>

  {#if !dismissed}
    <Alert.Root {severity} dismissible onDismiss={() => (dismissed = true)}>
      <Alert.Title>Heads up</Alert.Title>
      <Alert.Description>
        This is a {severity} alert with a dismiss button.
      </Alert.Description>
      <Alert.Close>×</Alert.Close>
    </Alert.Root>
  {/if}
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    width: 420px;
    min-height: 280px;
    box-sizing: border-box;
  }
  .controls {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 16px;
  }
  .control {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .control select {
    background: var(--k-code-bg);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
    border-radius: 6px;
    padding: 4px 8px;
  }
  .ext {
    background: transparent;
    color: var(--k-ink-2);
    border: 1px dashed var(--k-line-2);
    border-radius: var(--k-radius-sm);
    padding: 6px 12px;
    font: inherit;
    cursor: pointer;
  }
  .demo :global([role='alert']),
  .demo :global([role='status']) {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 6px 16px;
    padding: 14px 18px;
    border: 1px solid var(--k-line-2);
    border-radius: var(--k-radius-md);
    background: var(--k-surface-1);
    color: var(--k-ink-1);
  }
  .demo :global([data-severity='error']) {
    border-color: #b91c1c;
    background: #2a1010;
  }
  .demo :global([data-severity='warning']) {
    border-color: #b8860b;
    background: #2a230b;
  }
  .demo :global([data-severity='success']) {
    border-color: #166534;
    background: #102a17;
  }
  .demo :global([data-component-part='close']) {
    grid-row: 1 / span 2;
    grid-column: 2;
    background: transparent;
    border: 0;
    color: var(--k-ink-2);
    font-size: 18px;
    cursor: pointer;
  }
</style>
