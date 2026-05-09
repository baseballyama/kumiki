<!--
  HorizontalRule sandbox — axe smoke fixture (no keyboard interactions).

  Query params:
    ?orientation=horizontal|vertical
    ?dir=rtl
-->
<script lang="ts">
  import {
    HorizontalRule,
    type HorizontalRuleOrientation,
  } from '@kumiki/components/horizontal-rule';
  import { page } from '$app/state';

  const orientation = $derived(
    (page.url.searchParams.get('orientation') ?? 'horizontal') as HorizontalRuleOrientation,
  );
  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
</script>

<svelte:head>
  <title>HorizontalRule sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="horizontal-rule" data-testid="sandbox">
  <h1>HorizontalRule sandbox</h1>

  <p>Above</p>
  <HorizontalRule.Root {orientation} />
  <p>Below</p>

  <p data-testid="state">
    orientation: <strong data-testid="orientation">{orientation}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>
</div>
