<div class="demo">
  <span class="trigger">Notifications</span>
  <div class="content">
    <h4>Inbox</h4>
    <p>You have 3 unread items.</p>
    <div class="row"><span class="btn">Dismiss</span></div>
    <span class="arrow"></span>
  </div>
</div>

<style>
  .demo {
    position: relative;
    width: 280px;
    padding: 16px 16px 0;
    height: 200px;
    color: var(--k-ink-1);
  }
  .trigger {
    display: inline-block;
    font-size: 12px;
    color: var(--k-ink-1);
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-2);
    border-radius: 6px;
    padding: 6px 12px;
  }
  .content {
    position: relative;
    margin-top: 10px;
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-2);
    border-radius: 8px;
    padding: 12px 14px;
    box-shadow: 0 8px 24px color-mix(in oklab, var(--k-ink-1) 14%, transparent);
    width: 220px;
  }
  .content h4 {
    font-family: var(--k-font-display);
    font-size: 14px;
    margin: 0 0 4px;
    color: var(--k-ink-1);
  }
  .content p {
    font-size: 11px;
    color: var(--k-ink-3);
    margin: 0 0 10px;
    line-height: 1.45;
  }
  .row {
    display: flex;
    justify-content: flex-end;
  }
  .btn {
    font-size: 11px;
    color: var(--k-ink-3);
    padding: 4px 8px;
    border-radius: 4px;
  }
  .arrow {
    position: absolute;
    inset-block-start: -5px;
    inset-inline-start: 18px;
    width: 9px;
    height: 9px;
    background: var(--k-surface-0);
    border-block-start: 1px solid var(--k-line-2);
    border-inline-start: 1px solid var(--k-line-2);
    transform: rotate(45deg);
  }
</style>
