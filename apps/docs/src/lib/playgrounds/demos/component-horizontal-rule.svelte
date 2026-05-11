<script lang="ts">
  import {
    HorizontalRule,
    type HorizontalRuleOrientation,
  } from '@kumiki/components/horizontal-rule';

  let orientation = $state<HorizontalRuleOrientation>('horizontal');
</script>

<div class="demo">
  <div class="controls">
    <label class="control">
      Orientation
      <select bind:value={orientation}>
        <option value="horizontal">horizontal</option>
        <option value="vertical">vertical</option>
      </select>
    </label>
  </div>

  {#if orientation === 'horizontal'}
    <section>
      <p class="prose">First section above the separator.</p>
      <HorizontalRule.Root {orientation} />
      <p class="prose">Second section below.</p>
    </section>
  {:else}
    <section class="hbox">
      <span>Left</span>
      <HorizontalRule.Root {orientation} />
      <span>Middle</span>
      <HorizontalRule.Root {orientation} />
      <span>Right</span>
    </section>
  {/if}

  <p class="hint">
    Horizontal renders <code>&lt;hr&gt;</code>; vertical coerces to
    <code>&lt;div role="separator"&gt;</code>.
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    width: 400px;
    min-height: 280px;
    box-sizing: border-box;
  }
  .controls {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
  }
  .control {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .control select {
    background: var(--k-code-bg);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
    border-radius: 6px;
    padding: 4px 8px;
  }
  .prose {
    color: var(--k-ink-2);
    font-size: 14px;
    margin: 0;
  }
  .demo :global(hr) {
    border: 0;
    border-top: 1px solid var(--k-line-1);
    margin: 14px 0;
  }
  .hbox {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--k-ink-2);
    font-size: 14px;
  }
  .hbox :global([role='separator']) {
    width: 1px;
    height: 18px;
    background: var(--k-line-1);
  }
  .hint {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .hint code {
    color: var(--k-matcha-ink);
  }
</style>
