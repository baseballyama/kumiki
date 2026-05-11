<script lang="ts">
  import { Vanilla as Checkbox } from '@kumiki/atelier/checkbox';
  import type { CheckboxValue } from '@kumiki/components/checkbox';

  let agreed = $state<CheckboxValue>('unchecked');
  let mixed = $state<CheckboxValue>('mixed');
</script>

<div class="demo">
  <ul class="list">
    <li>
      <Checkbox.Root id="agree" bind:value={agreed} />
      <label for="agree">I agree to the terms</label>
    </li>
    <li>
      <Checkbox.Root id="mixed" bind:value={mixed} />
      <label for="mixed">Tri-state (mixed)</label>
    </li>
    <li>
      <Checkbox.Root id="dis" disabled aria-label="Disabled checkbox" />
      <label for="dis" class="muted">Disabled</label>
    </li>
  </ul>
  <p class="state">
    agreed = <code>{agreed}</code> · mixed = <code>{mixed}</code>
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
    gap: 10px;
  }
  .list li {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--k-ink-2);
    font-size: 14px;
  }
  .muted {
    color: var(--k-ink-4);
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
