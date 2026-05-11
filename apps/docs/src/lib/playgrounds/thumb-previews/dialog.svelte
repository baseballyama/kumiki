<!--
  Thumbnail-only preview: a static visual that shows the dialog in its
  open state. Theme-aware via Kumiki tokens.
-->
<div class="demo">
  <div class="overlay"></div>
  <div class="content">
    <h4>Edit profile</h4>
    <p>Update your account details.</p>
    <div class="row">
      <span class="btn ghost">Cancel</span>
      <span class="btn primary">Save</span>
    </div>
  </div>
</div>

<style>
  .demo {
    position: relative;
    width: 340px;
    height: 200px;
    background: var(--k-surface-1);
    border-radius: 10px;
    overflow: hidden;
    color: var(--k-ink-1);
  }
  .overlay {
    position: absolute;
    inset: 0;
    background: color-mix(in oklab, var(--k-ink-1) 30%, transparent);
  }
  .content {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 50%;
    transform: translate(-50%, -50%);
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: 10px;
    padding: 18px 22px;
    width: 240px;
    box-shadow: 0 12px 32px color-mix(in oklab, var(--k-ink-1) 24%, transparent);
  }
  h4 {
    font-family: var(--k-font-display);
    font-size: 18px;
    margin: 0 0 6px;
    color: var(--k-ink-1);
  }
  p {
    font-size: 12px;
    color: var(--k-ink-3);
    margin: 0 0 14px;
    line-height: 1.4;
  }
  .row {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
  .btn {
    font-size: 12px;
    padding: 6px 12px;
    border-radius: 6px;
  }
  .ghost {
    color: var(--k-ink-3);
  }
  .primary {
    background: var(--k-ink-1);
    color: var(--k-surface-0);
  }
</style>
