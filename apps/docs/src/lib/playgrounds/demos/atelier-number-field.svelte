<script lang="ts">
  import { Vanilla as NumberField } from '@kumiki/atelier/number-field';

  let qty = $state<number | null>(1);
</script>

<div class="demo">
  <label class="row">
    <span>Quantity</span>
    <NumberField.Root min={0} max={99} step={1} bind:value={qty}>
      <NumberField.Decrement aria-label="Decrease" />
      <NumberField.Input aria-label="Quantity" />
      <NumberField.Increment aria-label="Increase" />
    </NumberField.Root>
  </label>

  <p class="state">value = <code>{qty ?? 'null'}</code></p>
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
    gap: 16px;
    align-items: center;
    color: var(--k-ink-2);
    font-size: 14px;
  }
  .state {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 13px;
    font-family: var(--k-font-mono, monospace);
  }
  .state code {
    color: var(--k-matcha-ink);
  }
</style>
