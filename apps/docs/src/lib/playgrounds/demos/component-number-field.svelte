<script lang="ts">
  import { Root, Input, Increment, Decrement } from '@kumiki/components/number-field';

  let qty = $state<number | null>(1);
  let price = $state<number | null>(1500);
  const formatPrice = (n: number) => `$${n.toLocaleString('en-US')}`;
  const parsePrice = (raw: string) => {
    const s = raw.replace(/[$,\s]/g, '');
    if (s === '') return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
  };
</script>

<div class="demo">
  <div class="row">
    <span class="label">Quantity</span>
    <Root bind:value={qty} min={0} max={99} step={1} class="field">
      <Decrement aria-label="Decrease" class="step">−</Decrement>
      <Input aria-label="Quantity" class="input" />
      <Increment aria-label="Increase" class="step">+</Increment>
    </Root>
  </div>

  <div class="row">
    <span class="label">Price</span>
    <Root
      bind:value={price}
      min={0}
      max={1000000}
      step={100}
      format={formatPrice}
      parse={parsePrice}
      class="field"
    >
      <Decrement aria-label="Decrease" class="step">−</Decrement>
      <Input aria-label="Price" class="input wide" />
      <Increment aria-label="Increase" class="step">+</Increment>
    </Root>
  </div>

  <p class="state">
    qty: <code>{qty === null ? 'null' : qty}</code> · price:
    <code>{price === null ? 'null' : price}</code>
  </p>
</div>

<style>
  .demo {
    background: #16162a;
    border: 1px solid #2a2a4a;
    border-radius: 12px;
    padding: 24px;
    display: grid;
    gap: 16px;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .label {
    color: #aaa;
    font-size: 13px;
    width: 80px;
  }
  .demo :global(.field) {
    display: inline-flex;
    align-items: stretch;
    gap: 0;
    border: 1px solid #3a3a5a;
    border-radius: 6px;
    overflow: hidden;
    background: #1a1a30;
  }
  .demo :global(.field .input) {
    width: 96px;
    background: #0e0e1c;
    color: #e0e0e0;
    border: none;
    text-align: center;
    font-variant-numeric: tabular-nums;
    padding: 6px 8px;
    font-size: 14px;
  }
  .demo :global(.field .input.wide) {
    width: 130px;
  }
  .demo :global(.field .input:focus) {
    outline: 2px solid #4fc08d;
    outline-offset: -2px;
  }
  .demo :global(.field .step) {
    width: 32px;
    background: #1a1a30;
    color: #e0e0e0;
    border: none;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
  }
  .demo :global(.field .step:hover:not(:disabled)) {
    background: #2a2a4a;
  }
  .demo :global(.field .step:disabled) {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .state {
    margin: 0;
    color: #888;
    font-size: 13px;
  }
  .state code {
    color: #4fc08d;
  }
</style>
