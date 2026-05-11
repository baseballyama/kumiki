<!--
  Thumbnail-only preview: a static accordion with one panel expanded so the
  affordance reads at a glance. Theme-aware via Kumiki tokens.
-->
<div class="demo">
  <div class="row open">
    <span class="label">Why Svelte 5 only?</span>
    <span class="caret" aria-hidden="true">▾</span>
  </div>
  <div class="panel">
    Kumiki relies on <code>{`{@attach}`}</code> (≥ 5.29) and runes — see ADR 0001.
  </div>
  <div class="row">
    <span class="label">Where do styles live?</span>
    <span class="caret closed" aria-hidden="true">▸</span>
  </div>
  <div class="row">
    <span class="label">How are bundle sizes enforced?</span>
    <span class="caret closed" aria-hidden="true">▸</span>
  </div>
</div>

<style>
  .demo {
    width: 340px;
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: 12px;
    padding: 14px 18px;
    color: var(--k-ink-1);
    font-family: var(--k-font-display);
  }
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-block-end: 1px solid var(--k-line-1);
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.005em;
    color: var(--k-ink-1);
  }
  .row.open {
    border-block-end: 1px solid transparent;
  }
  .row:last-of-type {
    border-block-end: 0;
  }
  .label {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .caret {
    color: var(--k-shu);
    font-size: 13px;
    margin-inline-start: 12px;
    transform: translateY(-1px);
  }
  .caret.closed {
    color: var(--k-ink-4);
  }
  .panel {
    padding: 0 0 14px;
    font-size: 13px;
    font-weight: 400;
    color: var(--k-ink-3);
    line-height: 1.5;
    border-block-end: 1px solid var(--k-line-1);
  }
  .panel code {
    font-family: var(--k-font-mono);
    font-size: 11.5px;
    background: var(--k-surface-2);
    border: 1px solid var(--k-line-1);
    border-radius: 4px;
    padding: 1px 5px;
    color: var(--k-ink-1);
  }
</style>
