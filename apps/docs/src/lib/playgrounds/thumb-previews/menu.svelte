<div class="demo">
  <span class="trigger">
    Options
    <svg width="9" height="9" viewBox="0 0 9 9"
      ><path d="M1 3 l3.5 3.5 L8 3" stroke="currentColor" stroke-width="1.2" fill="none" /></svg
    >
  </span>
  <ul class="menu">
    <li class="active">Rename</li>
    <li>Duplicate</li>
    <li>Move to…</li>
    <li class="sep"></li>
    <li class="danger">Delete</li>
  </ul>
</div>

<style>
  .demo {
    position: relative;
    width: 240px;
    padding: 14px 14px 0;
    height: 200px;
    color: var(--k-ink-1);
  }
  .trigger {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--k-ink-1);
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-2);
    border-radius: 6px;
    padding: 6px 10px;
  }
  .menu {
    position: relative;
    margin: 8px 0 0;
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-2);
    border-radius: 8px;
    box-shadow: 0 8px 24px color-mix(in oklab, var(--k-ink-1) 14%, transparent);
    padding: 4px;
    list-style: none;
    width: 160px;
  }
  .menu li {
    padding: 6px 10px;
    font-size: 12px;
    color: var(--k-ink-1);
    border-radius: 4px;
  }
  .menu li.active {
    background: var(--k-surface-2);
  }
  .menu li.sep {
    height: 1px;
    background: var(--k-line-1);
    margin: 4px 0;
    padding: 0;
  }
  .menu li.danger {
    color: var(--k-shu-ink);
  }
</style>
