<div class="demo">
  <div class="bar">
    <button class="b on" title="Bold"><b>B</b></button>
    <button class="b" title="Italic"><i>I</i></button>
    <button class="b" title="Underline"><u>U</u></button>
    <span class="sep"></span>
    <button class="b" title="Align left">
      <svg viewBox="0 0 14 12" width="12" height="10"
        ><path
          d="M1 2 h12 M1 6 h8 M1 10 h12"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        /></svg
      >
    </button>
    <button class="b" title="Align center">
      <svg viewBox="0 0 14 12" width="12" height="10"
        ><path
          d="M1 2 h12 M3 6 h8 M1 10 h12"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        /></svg
      >
    </button>
    <span class="sep"></span>
    <button class="b" title="Link">
      <svg viewBox="0 0 14 12" width="12" height="10"
        ><path
          d="M3 6 a3 3 0 0 1 3 -3 h1 M11 6 a3 3 0 0 0 -3 -3 h-1 M5 6 h4"
          stroke="currentColor"
          stroke-width="1.4"
          fill="none"
          stroke-linecap="round"
        /></svg
      >
    </button>
  </div>
</div>

<style>
  .demo {
    padding: 14px 12px;
    color: var(--k-ink-1);
  }
  .bar {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-2);
    border-radius: 8px;
    padding: 4px;
  }
  .b {
    width: 26px;
    height: 26px;
    border-radius: 5px;
    border: 0;
    background: transparent;
    color: var(--k-ink-1);
    display: grid;
    place-items: center;
    font-size: 12px;
    cursor: pointer;
  }
  .b.on {
    background: var(--k-surface-2);
  }
  .sep {
    width: 1px;
    height: 18px;
    background: var(--k-line-1);
    margin: 0 4px;
  }
</style>
