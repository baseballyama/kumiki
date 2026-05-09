<!--
  AvatarGroup sandbox — axe smoke fixture (no keyboard interactions).

  Query params:
    ?dir=rtl
-->
<script lang="ts">
  import { Avatar } from '@kumiki/components/avatar';
  import { AvatarGroup } from '@kumiki/components/avatar-group';
  import { page } from '$app/state';

  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
  const users = ['Mei', 'Yui', 'Ryo', 'Aki', 'Sora'];
</script>

<svelte:head>
  <title>AvatarGroup sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="avatar-group" data-testid="sandbox">
  <h1>AvatarGroup sandbox</h1>

  <AvatarGroup.Root max={3} total={users.length} aria-label="Members">
    {#each users.slice(0, 3) as u (u)}
      <AvatarGroup.Item>
        <Avatar.Root decorative>
          <Avatar.Image src="/favicon.svg" />
          <Avatar.Fallback>{u[0]}</Avatar.Fallback>
        </Avatar.Root>
      </AvatarGroup.Item>
    {/each}
    <AvatarGroup.Overflow />
  </AvatarGroup.Root>

  <p data-testid="state">
    dir: <strong data-testid="dir">{dir}</strong>
  </p>
</div>
