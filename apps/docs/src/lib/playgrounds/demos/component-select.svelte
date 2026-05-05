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
    background: #16162a;
    border: 1px solid #2a2a4a;
    border-radius: 12px;
    padding: 24px;
    position: relative;
  }
  .demo :global(.trigger) {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #0e0e1c;
    color: #e0e0e0;
    border: 1px solid #3a3a5a;
    padding: 8px 14px;
    border-radius: 6px;
    cursor: pointer;
    font: inherit;
    min-width: 180px;
    justify-content: space-between;
  }
  .demo :global(.trigger:focus) {
    outline: none;
    border-color: #4fc08d;
  }
  .demo :global(.trigger .caret) {
    color: #888;
    font-size: 12px;
  }
  .demo :global(.listbox[hidden]) {
    display: none;
  }
  .demo :global(.listbox:not([hidden])) {
    margin: 4px 0 0;
    padding: 4px 0;
    list-style: none;
    background: #1e1e3a;
    color: #e0e0e0;
    border: 1px solid #3a3a5a;
    border-radius: 6px;
    min-width: 180px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }
  .demo :global(.option) {
    display: flex;
    justify-content: space-between;
    padding: 8px 14px;
    cursor: pointer;
  }
  .demo :global(.option[data-highlighted]) {
    background: #ff3e00;
    color: #fff;
  }
  .demo :global(.option[aria-selected='true']) {
    color: #4fc08d;
  }
  .demo :global(.option[aria-selected='true'][data-highlighted]) {
    color: #fff;
  }
  .state {
    margin-top: 16px;
    color: #888;
    font-size: 14px;
  }
  .state code {
    color: #4fc08d;
  }
</style>
