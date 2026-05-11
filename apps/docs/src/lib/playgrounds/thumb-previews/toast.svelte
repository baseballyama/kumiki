<div class="demo">
  <div class="toast success">
    <span class="dot"></span>
    <div>
      <strong>Saved</strong>
      <p>Your changes were saved.</p>
    </div>
    <span class="x">×</span>
  </div>
  <div class="toast error">
    <span class="dot"></span>
    <div>
      <strong>Failed</strong>
      <p>Something went wrong.</p>
    </div>
    <span class="x">×</span>
  </div>
</div>

<style>
  .demo {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    width: 280px;
    color: var(--k-ink-1);
  }
  .toast {
    display: grid;
    grid-template-columns: 14px 1fr 14px;
    gap: 8px;
    align-items: center;
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-2);
    border-radius: 8px;
    padding: 10px 12px;
    box-shadow: 0 4px 12px color-mix(in oklab, var(--k-ink-1) 12%, transparent);
  }
  .toast.success {
    border-inline-start: 3px solid var(--k-matcha);
  }
  .toast.error {
    border-inline-start: 3px solid var(--k-shu);
  }
  .toast.success .dot {
    background: var(--k-matcha);
  }
  .toast.error .dot {
    background: var(--k-shu);
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
  }
  strong {
    font-size: 12px;
    font-weight: 600;
    color: var(--k-ink-1);
  }
  p {
    margin: 2px 0 0;
    font-size: 11px;
    color: var(--k-ink-3);
    line-height: 1.3;
  }
  .x {
    text-align: center;
    color: var(--k-ink-4);
    font-size: 14px;
  }
</style>
