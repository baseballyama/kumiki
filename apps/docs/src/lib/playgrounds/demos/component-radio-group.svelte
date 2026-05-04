<script lang="ts">
  import { Root, Item, type RadioItem } from '@kumiki/component-radio-group';

  type Plan = 'free' | 'pro' | 'enterprise';

  const plans: RadioItem<Plan>[] = [
    { id: 'free', value: 'free', label: 'Free' },
    { id: 'pro', value: 'pro', label: 'Pro' },
    { id: 'enterprise', value: 'enterprise', label: 'Enterprise' },
  ];

  let value = $state<Plan | null>('free');
</script>

<div class="demo">
  <Root items={plans} bind:value>
    {#each plans as plan (plan.id)}
      <Item value={plan}>
        <span class="dot" aria-hidden="true"></span>
        <span class="label">{plan.label}</span>
      </Item>
    {/each}
  </Root>

  <p class="state">value: <code>{value ?? 'null'}</code></p>
</div>

<style>
  .demo {
    background: #16162a;
    border: 1px solid #2a2a4a;
    border-radius: 12px;
    padding: 24px;
  }
  .demo :global([role='radiogroup']) {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .demo :global(button[role='radio']) {
    background: #0e0e1c;
    border: 1px solid #3a3a5a;
    border-radius: 8px;
    padding: 10px 14px;
    color: #e0e0e0;
    font: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    text-align: left;
    transition: border-color 120ms;
  }
  .demo :global(button[role='radio']:focus) {
    outline: none;
    border-color: #4fc08d;
  }
  .demo :global(button[role='radio'][aria-checked='true']) {
    border-color: #ff3e00;
  }
  .demo :global(button[role='radio'] .dot) {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid #888;
    flex: 0 0 auto;
    position: relative;
  }
  .demo :global(button[role='radio'][aria-checked='true'] .dot) {
    border-color: #ff3e00;
  }
  .demo :global(button[role='radio'][aria-checked='true'] .dot::after) {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: 50%;
    background: #ff3e00;
  }
  .state {
    color: #888;
    font-size: 14px;
    margin-top: 16px;
  }
  .state code {
    color: #4fc08d;
  }
</style>
