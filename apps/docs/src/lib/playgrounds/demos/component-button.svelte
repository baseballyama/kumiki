<script lang="ts">
  import { Button, type ButtonVariant, type ButtonSize } from '@kumiki/components/button';

  let variant = $state<ButtonVariant>('primary');
  let size = $state<ButtonSize>('md');
  let loading = $state(false);
  let disabled = $state(false);
  let log = $state<string[]>([]);

  function append(line: string) {
    log = [line, ...log].slice(0, 6);
  }

  async function fakeWork() {
    loading = true;
    append('clicked → loading…');
    await new Promise((r) => setTimeout(r, 1200));
    loading = false;
    append('done');
  }
</script>

<div class="demo">
  <div class="row">
    <Button.Root {variant} {size} {loading} {disabled} onclick={fakeWork}>Save changes</Button.Root>

    <label class="control">
      Variant
      <select bind:value={variant}>
        <option value="primary">primary</option>
        <option value="secondary">secondary</option>
        <option value="ghost">ghost</option>
        <option value="danger">danger</option>
      </select>
    </label>

    <label class="control">
      Size
      <select bind:value={size}>
        <option value="sm">sm</option>
        <option value="md">md</option>
        <option value="lg">lg</option>
      </select>
    </label>

    <label class="control">
      <input type="checkbox" bind:checked={disabled} /> disabled
    </label>
  </div>

  <p class="state">
    variant=<code>{variant}</code> · size=<code>{size}</code> · loading=<code>{loading}</code>
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
  }
  .row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  .row :global(button) {
    padding: 10px 18px;
    background: var(--k-shu);
    color: white;
    border: 1px solid var(--k-shu);
    border-radius: var(--k-radius-sm);
    font: inherit;
    cursor: pointer;
  }
  .row :global(button[data-variant='secondary']) {
    background: var(--k-surface-2);
    color: var(--k-ink-1);
    border-color: var(--k-line-2);
  }
  .row :global(button[data-variant='ghost']) {
    background: transparent;
    color: var(--k-ink-1);
    border-color: transparent;
  }
  .row :global(button[data-variant='danger']) {
    background: #b91c1c;
    border-color: #b91c1c;
  }
  .row :global(button[data-size='sm']) {
    padding: 6px 12px;
    font-size: 13px;
  }
  .row :global(button[data-size='lg']) {
    padding: 14px 24px;
    font-size: 16px;
  }
  .row :global(button[aria-busy='true']),
  .row :global(button[aria-disabled='true']) {
    opacity: 0.55;
    cursor: not-allowed;
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
