<script lang="ts">
  import { Vanilla as Toggle } from '@kumiki/atelier/toggle';

  let bold = $state(false);
  let italic = $state(true);
</script>

<div class="demo">
  <div class="row">
    <Toggle.Root bind:pressed={bold} size="md"><b>B</b></Toggle.Root>
    <Toggle.Root bind:pressed={italic} size="md"><i>I</i></Toggle.Root>
    <Toggle.Root size="md"><u>U</u></Toggle.Root>
    <Toggle.Root disabled size="md">D</Toggle.Root>
  </div>
  <p class="state">
    bold = <code>{bold}</code> · italic = <code>{italic}</code>
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    width: 360px;
    min-height: 200px;
    box-sizing: border-box;
  }
  .row {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  .state {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 13px;
    font-family: var(--k-font-mono, monospace);
  }
  .state code {
    color: var(--k-matcha-ink);
  }
</style>
