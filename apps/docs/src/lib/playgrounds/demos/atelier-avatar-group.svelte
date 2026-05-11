<script lang="ts">
  import { Vanilla as AvatarGroup } from '@kumiki/atelier/avatar-group';
  import { Vanilla as Avatar } from '@kumiki/atelier/avatar';

  const members = [
    { id: '1', name: 'Akari', initials: 'AS' },
    { id: '2', name: 'Ben', initials: 'BC' },
    { id: '3', name: 'Cora', initials: 'CD' },
    { id: '4', name: 'Dai', initials: 'DI' },
    { id: '5', name: 'Eun-ji', initials: 'EJ' },
  ];
</script>

<div class="demo">
  <AvatarGroup.Root max={3} total={members.length} aria-label="Project members">
    {#each members.slice(0, 3) as m (m.id)}
      <AvatarGroup.Item>
        <Avatar.Root name={m.name} size="md">
          <Avatar.Fallback>{m.initials}</Avatar.Fallback>
        </Avatar.Root>
      </AvatarGroup.Item>
    {/each}
    <AvatarGroup.Overflow />
  </AvatarGroup.Root>
  <p class="hint">
    <code>max</code> caps the visible count; <code>Overflow</code> renders <code>+N</code>.
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
  }
  .hint {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .hint code {
    color: var(--k-matcha-ink);
  }
</style>
