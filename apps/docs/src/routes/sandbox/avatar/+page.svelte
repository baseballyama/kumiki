<!--
  Avatar sandbox — axe smoke fixture (no keyboard interactions).

  Query params:
    ?decorative=1
    ?size=sm|md|lg
    ?dir=rtl
-->
<script lang="ts">
  import { Avatar, type AvatarSize } from '@kumiki/components/avatar';
  import { page } from '$app/state';

  const decorative = $derived(page.url.searchParams.get('decorative') === '1');
  const size = $derived((page.url.searchParams.get('size') ?? 'md') as AvatarSize);
  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
</script>

<svelte:head>
  <title>Avatar sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="avatar" data-testid="sandbox">
  <h1>Avatar sandbox</h1>

  {#if decorative}
    <Avatar.Root decorative {size}>
      <Avatar.Image src="/favicon.svg" />
      <Avatar.Fallback />
    </Avatar.Root>
  {:else}
    <Avatar.Root name="Mei Tanaka" {size}>
      <Avatar.Image src="/favicon.svg" />
      <Avatar.Fallback />
    </Avatar.Root>
  {/if}

  <p data-testid="state">
    decorative: <strong data-testid="decorative">{decorative}</strong>
    · size: <strong data-testid="size">{size}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>
</div>
