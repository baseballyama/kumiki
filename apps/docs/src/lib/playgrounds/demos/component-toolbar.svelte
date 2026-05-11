<!--
  Layer 4 Toolbar demo — APG `toolbar` pattern. Single tab stop with
  Arrow / Home / End roving between enabled items. The roving-tabindex
  coordinator is pure DOM bookkeeping (no machine, no Layer 3).
-->
<script lang="ts">
  import { Toolbar } from '@kumiki/components';

  let last = $state<string>('—');
</script>

<div class="demo">
  <Toolbar.Root aria-label="Formatting" class="tb-root">
    <Toolbar.Item class="tb-item" onclick={() => (last = 'bold')}><b>B</b></Toolbar.Item>
    <Toolbar.Item class="tb-item" onclick={() => (last = 'italic')}><i>I</i></Toolbar.Item>
    <Toolbar.Item class="tb-item" onclick={() => (last = 'underline')}><u>U</u></Toolbar.Item>
    <Toolbar.Separator class="tb-sep" />
    <Toolbar.Item class="tb-item" onclick={() => (last = 'link')}>Link</Toolbar.Item>
    <Toolbar.Item class="tb-item" disabled>Disabled</Toolbar.Item>
  </Toolbar.Root>

  <p class="state">last action = <code>{last}</code></p>
  <p class="hint">
    A single Tab enters the toolbar at the active item. Arrow keys move between enabled items;
    disabled items are skipped. Home / End jump to the ends.
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    width: 400px;
    min-height: 200px;
    box-sizing: border-box;
  }
  .demo :global(.tb-root) {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px;
    border: 1px solid var(--k-line-2);
    border-radius: var(--k-radius-sm);
    background: var(--k-surface-1);
  }
  .demo :global(.tb-item) {
    min-inline-size: 32px;
    block-size: 30px;
    display: inline-grid;
    place-items: center;
    padding: 0 10px;
    border: 0;
    border-radius: var(--k-radius-xs);
    background: transparent;
    color: var(--k-ink-1);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
  }
  .demo :global(.tb-item:hover:not([data-disabled])) {
    background: var(--k-surface-2);
  }
  .demo :global(.tb-item[data-disabled]) {
    color: var(--k-ink-4);
    cursor: not-allowed;
  }
  .demo :global(.tb-sep) {
    inline-size: 1px;
    block-size: 18px;
    background: var(--k-line-2);
    margin-inline: 2px;
  }
  .state {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 12px;
    font-family: var(--k-font-mono);
  }
  .state code {
    color: var(--k-matcha-ink);
  }
  .hint {
    margin-top: 12px;
    color: var(--k-ink-3);
    font-size: 13px;
    line-height: 1.55;
  }
</style>
