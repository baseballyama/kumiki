<script lang="ts">
  import { Vanilla as Toolbar } from '@kumiki/atelier/toolbar';

  let last = $state<string>('—');
</script>

<div class="demo">
  <Toolbar.Root aria-label="Formatting">
    <Toolbar.Item onclick={() => (last = 'bold')}><b>B</b></Toolbar.Item>
    <Toolbar.Item onclick={() => (last = 'italic')}><i>I</i></Toolbar.Item>
    <Toolbar.Item onclick={() => (last = 'underline')}><u>U</u></Toolbar.Item>
    <Toolbar.Separator />
    <Toolbar.Item onclick={() => (last = 'link')}>Link</Toolbar.Item>
    <Toolbar.Item disabled>Disabled</Toolbar.Item>
  </Toolbar.Root>
  <p class="state">last action: <code>{last}</code></p>
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
