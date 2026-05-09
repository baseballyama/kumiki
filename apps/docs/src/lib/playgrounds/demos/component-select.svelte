<script lang="ts">
  import { Root, Trigger, Listbox, Option, type SelectItem } from '@kumiki/components/select';

  type Plan = 'free' | 'pro' | 'enterprise';
  const plans: SelectItem<Plan>[] = [
    { id: 'free', value: 'free', label: 'Free' },
    { id: 'pro', value: 'pro', label: 'Pro' },
    { id: 'enterprise', value: 'enterprise', label: 'Enterprise' },
  ];

  let value = $state<Plan | null>('pro');

  const labelFor = (v: Plan | null) => plans.find((p) => p.value === v)?.label ?? null;
</script>

<div class="demo">
  <Root items={plans} bind:value>
    <Trigger class="trigger">
      {labelFor(value) ?? 'Pick a plan'}
      <span class="caret" aria-hidden="true">▾</span>
    </Trigger>
    <Listbox class="listbox">
      {#each plans as plan (plan.id)}
        <Option value={plan} class="option">
          <span>{plan.label}</span>
          {#if plan.value === value}<span aria-hidden="true">✓</span>{/if}
        </Option>
      {/each}
    </Listbox>
  </Root>

  <p class="state">value: <code>{value ?? 'null'}</code></p>
</div>

<style>
  .demo {
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: 12px;
    padding: 24px;
    position: relative;
  }
  .demo :global(.trigger) {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--k-code-bg);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
    padding: 8px 14px;
    border-radius: 6px;
    cursor: pointer;
    font: inherit;
    min-width: 180px;
    justify-content: space-between;
  }
  .demo :global(.trigger:focus) {
    outline: none;
    border-color: var(--k-matcha);
  }
  .demo :global(.trigger .caret) {
    color: var(--k-ink-3);
    font-size: 12px;
  }
  .demo :global(.listbox[hidden]) {
    display: none;
  }
  .demo :global(.listbox:not([hidden])) {
    margin: 4px 0 0;
    padding: 4px 0;
    list-style: none;
    background: var(--k-surface-2);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
    border-radius: 6px;
    min-width: 180px;
    box-shadow: 0 6px 20px oklch(0 0 0 / 0.3);
  }
  .demo :global(.option) {
    display: flex;
    justify-content: space-between;
    padding: 8px 14px;
    cursor: pointer;
  }
  .demo :global(.option[data-highlighted]) {
    background: var(--k-shu);
    color: #fff;
  }
  .demo :global(.option[aria-selected='true']) {
    color: var(--k-matcha);
  }
  .demo :global(.option[aria-selected='true'][data-highlighted]) {
    color: #fff;
  }
  .state {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 14px;
  }
  .state code {
    color: var(--k-matcha);
  }
</style>
