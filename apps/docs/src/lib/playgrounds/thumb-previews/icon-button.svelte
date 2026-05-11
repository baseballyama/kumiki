<div class="demo">
  <button class="ib primary" aria-label="Add">
    <svg viewBox="0 0 16 16" width="14" height="14"
      ><path
        d="M8 3 v10 M3 8 h10"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
      /></svg
    >
  </button>
  <button class="ib" aria-label="Edit">
    <svg viewBox="0 0 16 16" width="14" height="14"
      ><path
        d="M3 13 l8 -8 l2 2 l-8 8 z M3 13 h3"
        stroke="currentColor"
        stroke-width="1.4"
        fill="none"
        stroke-linejoin="round"
      /></svg
    >
  </button>
  <button class="ib" aria-label="Search">
    <svg viewBox="0 0 16 16" width="14" height="14"
      ><circle cx="7" cy="7" r="4" stroke="currentColor" stroke-width="1.4" fill="none" /><path
        d="M10 10 l3 3"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linecap="round"
      /></svg
    >
  </button>
  <button class="ib danger" aria-label="Delete">
    <svg viewBox="0 0 16 16" width="14" height="14"
      ><path
        d="M4 5 h8 M5.5 5 v-1.5 a1.5 1.5 0 0 1 1.5 -1.5 h2 a1.5 1.5 0 0 1 1.5 1.5 v1.5 M5 5 l1 9 h4 l1 -9"
        stroke="currentColor"
        stroke-width="1.3"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      /></svg
    >
  </button>
</div>

<style>
  .demo {
    display: flex;
    gap: 10px;
    padding: 18px;
    align-items: center;
  }
  .ib {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid var(--k-line-2);
    background: var(--k-surface-0);
    color: var(--k-ink-1);
    display: grid;
    place-items: center;
    cursor: pointer;
  }
  .ib.primary {
    background: var(--k-ink-1);
    color: var(--k-surface-0);
    border-color: var(--k-ink-1);
  }
  .ib.danger {
    background: var(--k-shu);
    color: var(--k-surface-0);
    border-color: var(--k-shu);
  }
</style>
