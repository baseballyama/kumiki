<script lang="ts">
  import { Vanilla as RadioGroup } from '@kumiki/atelier/radio-group';
  import type { RadioItem } from '@kumiki/components/radio-group';

  type Plan = 'free' | 'pro' | 'team';
  const plans: RadioItem<Plan>[] = [
    { id: 'free', value: 'free', label: 'Free' },
    { id: 'pro', value: 'pro', label: 'Pro' },
    { id: 'team', value: 'team', label: 'Team' },
  ];
  let value = $state<Plan | null>('pro');
</script>

<div class="demo">
  <RadioGroup.Root items={plans} bind:value aria-label="Plan">
    {#each plans as p (p.id)}
      <RadioGroup.Item value={p}>{p.label}</RadioGroup.Item>
    {/each}
  </RadioGroup.Root>

  <p class="state">selected = <code>{value ?? 'null'}</code></p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
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
