<script lang="ts">
  import { Root, Item, type RadioItem } from '@kumiki/components/radio-group';

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
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: 12px;
    padding: 24px;
  }
  .demo :global([role='radiogroup']) {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .demo :global(button[role='radio']) {
    background: var(--k-code-bg);
    border: 1px solid var(--k-line-2);
    border-radius: 8px;
    padding: 10px 14px;
    color: var(--k-ink-1);
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
    border-color: var(--k-matcha);
  }
  .demo :global(button[role='radio'][aria-checked='true']) {
    border-color: var(--k-shu);
  }
  .demo :global(button[role='radio'] .dot) {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid var(--k-ink-3);
    flex: 0 0 auto;
    position: relative;
  }
  .demo :global(button[role='radio'][aria-checked='true'] .dot) {
    border-color: var(--k-shu);
  }
  .demo :global(button[role='radio'][aria-checked='true'] .dot::after) {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: 50%;
    background: var(--k-shu);
  }
  .state {
    color: var(--k-ink-3);
    font-size: 14px;
    margin-top: 16px;
  }
  .state code {
    color: var(--k-matcha);
  }
</style>
