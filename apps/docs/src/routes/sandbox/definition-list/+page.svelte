<!--
  DefinitionList sandbox — axe smoke fixture (no keyboard interactions).

  Query params:
    ?grouped=1
    ?dir=rtl
-->
<script lang="ts">
  import { DefinitionList } from '@kumiki/components/definition-list';
  import { page } from '$app/state';

  const grouped = $derived(page.url.searchParams.get('grouped') === '1');
  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
</script>

<svelte:head>
  <title>DefinitionList sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="definition-list" data-testid="sandbox">
  <h1>DefinitionList sandbox</h1>

  <DefinitionList.Root {grouped}>
    <DefinitionList.Term>Status</DefinitionList.Term>
    <DefinitionList.Description>Active</DefinitionList.Description>
    <DefinitionList.Term>Created</DefinitionList.Term>
    <DefinitionList.Description>2026-05-10</DefinitionList.Description>
  </DefinitionList.Root>

  <p data-testid="state">
    grouped: <strong data-testid="grouped">{grouped}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>
</div>
