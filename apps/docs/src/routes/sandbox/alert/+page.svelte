<!--
  Alert sandbox — Playwright + axe fixture.

  Query params:
    ?severity=info|success|warn|error
    ?dismissible=1
    ?dir=rtl
-->
<script lang="ts">
  import { Alert, type AlertSeverity } from '@kumiki/components/alert';
  import { page } from '$app/state';

  const severity = $derived((page.url.searchParams.get('severity') ?? 'info') as AlertSeverity);
  const dismissible = $derived(page.url.searchParams.get('dismissible') === '1');
  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');

  // svelte-ignore state_referenced_locally
  let visible = $state(true);
</script>

<svelte:head>
  <title>Alert sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="alert" data-testid="sandbox">
  <h1>Alert sandbox</h1>

  {#if visible}
    <Alert.Root {severity} {dismissible} onDismiss={() => (visible = false)}>
      <Alert.Title>Heads up</Alert.Title>
      <Alert.Description>Sandbox alert body — used by Playwright + axe.</Alert.Description>
      {#if dismissible}<Alert.Close>Dismiss</Alert.Close>{/if}
    </Alert.Root>
  {/if}

  <p data-testid="state">
    severity: <strong data-testid="severity">{severity}</strong>
    · dismissible: <strong data-testid="dismissible">{dismissible}</strong>
    · visible: <strong data-testid="visible">{visible}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>
</div>
