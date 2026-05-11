<script lang="ts">
  import { Vanilla as Tabs } from '@kumiki/atelier/tabs';
  import type { TabItem } from '@kumiki/components/tabs';

  const items: TabItem[] = [
    { id: 'account', value: 'account', label: 'Account' },
    { id: 'team', value: 'team', label: 'Team' },
    { id: 'security', value: 'security', label: 'Security' },
  ];
</script>

<div class="demo">
  <Tabs.Root {items} defaultValue="account">
    <Tabs.List aria-label="Settings">
      {#each items as t (t.id)}<Tabs.Tab value={t}>{t.label}</Tabs.Tab>{/each}
    </Tabs.List>
    <Tabs.Panel value={items[0]!}>
      <p>Manage your account profile and preferences.</p>
    </Tabs.Panel>
    <Tabs.Panel value={items[1]!}>
      <p>Invite teammates and manage roles.</p>
    </Tabs.Panel>
    <Tabs.Panel value={items[2]!}>
      <p>Two-factor auth, sessions, and access tokens.</p>
    </Tabs.Panel>
  </Tabs.Root>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
  }
  .demo p {
    margin: 0;
    color: var(--k-ink-2);
    font-size: 14px;
  }
</style>
