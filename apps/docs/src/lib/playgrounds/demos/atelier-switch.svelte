<script lang="ts">
  import { Vanilla as Switch } from '@kumiki/atelier/switch';

  let notify = $state(true);
  let darkMode = $state(false);
</script>

<div class="demo">
  <ul class="list">
    <li>
      <span>Email notifications</span>
      <Switch.Root bind:checked={notify} aria-label="Email notifications" />
    </li>
    <li>
      <span>Dark mode</span>
      <Switch.Root bind:checked={darkMode} aria-label="Dark mode" />
    </li>
    <li>
      <span>Auto-save (disabled)</span>
      <Switch.Root disabled aria-label="Auto-save" />
    </li>
  </ul>
  <p class="state">
    notify = <code>{notify}</code> · darkMode = <code>{darkMode}</code>
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
  }
  .list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--k-ink-2);
    font-size: 14px;
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
