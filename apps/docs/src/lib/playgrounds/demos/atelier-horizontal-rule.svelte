<script lang="ts">
  import { Vanilla as HR } from '@kumiki/atelier/horizontal-rule';
</script>

<div class="demo">
  <section class="block">
    <h3>Section A</h3>
    <p>Some content above the rule.</p>
  </section>
  <HR.Root />
  <section class="block">
    <h3>Section B</h3>
    <p>Some content below.</p>
  </section>

  <div class="vsep">
    <span>left</span>
    <HR.Root orientation="vertical" />
    <span>right</span>
  </div>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .block h3 {
    margin: 0 0 4px;
    font-size: 14px;
    color: var(--k-ink-2);
  }
  .block p {
    margin: 0;
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .vsep {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    height: 2rem;
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 13px;
  }
</style>
