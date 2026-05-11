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
      <label class="row">
        <RadioGroup.Item value={p} />
        <span>{p.label}</span>
      </label>
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
    width: 360px;
    min-height: 260px;
    box-sizing: border-box;
  }
  .demo :global(.row) {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--k-ink-1);
    font-size: 14px;
    cursor: pointer;
    user-select: none;
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
