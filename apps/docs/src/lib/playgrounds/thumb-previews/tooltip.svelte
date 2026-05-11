<div class="demo">
  <span class="trigger">Save</span>
  <span class="bubble">
    Saves the document (⌘S)
    <span class="arrow"></span>
  </span>
</div>

<style>
  .demo {
    position: relative;
    width: 280px;
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 24px;
    color: var(--k-ink-1);
  }
  .trigger {
    font-size: 14px;
    color: var(--k-ink-1);
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-2);
    border-radius: 6px;
    padding: 8px 14px;
    font-family: var(--k-font-mono);
  }
  .bubble {
    position: absolute;
    inset-block-start: 6px;
    inset-inline-start: 50%;
    transform: translateX(-50%);
    background: var(--k-surface-0);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
    font-size: 11px;
    padding: 6px 10px;
    border-radius: 6px;
    white-space: nowrap;
    box-shadow: 0 4px 12px color-mix(in oklab, var(--k-ink-1) 12%, transparent);
  }
  .arrow {
    position: absolute;
    inset-block-end: -5px;
    inset-inline-start: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 8px;
    height: 8px;
    background: var(--k-surface-0);
    border-block-end: 1px solid var(--k-line-2);
    border-inline-end: 1px solid var(--k-line-2);
  }
</style>
