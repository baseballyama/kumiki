<!--
  Badge sandbox — axe smoke fixture (no keyboard interactions).

  Query params:
    ?variant=neutral|info|success|warn|error
    ?size=sm|md
    ?dir=rtl
-->
<script lang="ts">
  import { Badge, type BadgeVariant, type BadgeSize } from '@kumiki/components/badge';
  import { page } from '$app/state';

  const variant = $derived((page.url.searchParams.get('variant') ?? 'neutral') as BadgeVariant);
  const size = $derived((page.url.searchParams.get('size') ?? 'md') as BadgeSize);
  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
</script>

<svelte:head>
  <title>Badge sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="badge" data-testid="sandbox">
  <h1>Badge sandbox</h1>

  <Badge.Root {variant} {size}>New</Badge.Root>
  <Badge.Root {variant} {size} aria-label="3 unread notifications">3</Badge.Root>
  <Badge.Root decorative {variant} {size} />

  <p data-testid="state">
    variant: <strong data-testid="variant">{variant}</strong>
    · size: <strong data-testid="size">{size}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>
</div>
