<script lang="ts">
  import {
    Root,
    Trigger,
    Overlay,
    Content,
    Title,
    Description,
    Close,
  } from '@kumiki/components/dialog';

  let open = $state(false);
  let modal = $state(true);
</script>

<div class="demo">
  <div class="controls">
    <label>
      <input type="checkbox" bind:checked={modal} />
      modal
    </label>
  </div>

  <Root bind:open {modal}>
    <Trigger class="trigger">Open dialog</Trigger>
    {#if modal}
      <Overlay class="overlay" />
    {/if}
    <Content class="panel">
      <Title>Confirm purchase</Title>
      <Description>
        You're about to enroll in the <strong>Pro</strong> plan. Billing starts today.
      </Description>
      <input type="text" placeholder="Enter coupon (optional)" class="input" />
      <div class="actions">
        <Close class="ghost">Cancel</Close>
        <Close class="primary">Confirm</Close>
      </div>
    </Content>
  </Root>

  <p class="state">open: <code>{open}</code> · modal: <code>{modal}</code></p>
</div>

<style>
  .demo {
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: 12px;
    padding: 24px;
    width: 400px;
    min-height: 220px;
    box-sizing: border-box;
  }
  .controls {
    margin-bottom: 16px;
    color: var(--k-ink-2);
    font-size: 13px;
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .controls input[type='checkbox'] {
    margin-right: 6px;
  }
  .demo :global(.trigger) {
    background: var(--k-shu);
    color: #fff;
    border: 0;
    padding: 8px 16px;
    border-radius: 6px;
    font: inherit;
    cursor: pointer;
  }
  .demo :global(.trigger:hover) {
    background: var(--k-shu-hover);
  }
  .demo :global(.overlay) {
    position: fixed;
    inset: 0;
    background: oklch(0 0 0 / 0.4);
    z-index: 50;
  }
  .demo :global(.panel) {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--k-surface-2);
    color: var(--k-ink-1);
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 20px 60px oklch(0 0 0 / 0.4);
    min-width: 360px;
    max-width: 90vw;
    z-index: 51;
    display: grid;
    gap: 12px;
  }
  .demo :global(.panel h2) {
    margin: 0;
    font-size: 18px;
    color: var(--k-matcha-ink);
  }
  .demo :global(.panel p) {
    margin: 0;
    color: var(--k-ink-2);
    font-size: 14px;
    line-height: 1.5;
  }
  .demo :global(.panel .input) {
    background: var(--k-code-bg);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
    padding: 8px 12px;
    border-radius: 6px;
    font: inherit;
  }
  .demo :global(.panel .actions) {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 8px;
  }
  .demo :global(.panel .ghost) {
    background: transparent;
    color: var(--k-ink-2);
    border: 1px solid var(--k-line-2);
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
  }
  .demo :global(.panel .primary) {
    background: var(--k-shu);
    color: #fff;
    border: 0;
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
  }
  .state {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 14px;
  }
  .state code {
    color: var(--k-matcha-ink);
  }
</style>
