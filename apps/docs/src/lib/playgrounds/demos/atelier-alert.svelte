<script lang="ts">
  import { Vanilla as Alert } from '@kumiki/atelier/alert';

  let dismissed = $state(false);
</script>

<div class="demo">
  <Alert.Root severity="info">
    <Alert.Title>Info</Alert.Title>
    <Alert.Description>The deploy starts at 09:00 JST.</Alert.Description>
  </Alert.Root>

  <Alert.Root severity="success">
    <Alert.Title>Saved</Alert.Title>
    <Alert.Description>Changes published to production.</Alert.Description>
  </Alert.Root>

  <Alert.Root severity="warn">
    <Alert.Title>Heads up</Alert.Title>
    <Alert.Description>Your trial expires in 3 days.</Alert.Description>
  </Alert.Root>

  {#if !dismissed}
    <Alert.Root severity="error" dismissible onDismiss={() => (dismissed = true)}>
      <Alert.Title>Build failed</Alert.Title>
      <Alert.Description>Check the CI logs for details.</Alert.Description>
      <Alert.Close />
    </Alert.Root>
  {:else}
    <p class="hint">Error alert dismissed.</p>
  {/if}
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 400px;
    min-height: 420px;
    box-sizing: border-box;
  }
  .hint {
    color: var(--k-ink-3);
    font-size: 13px;
  }
</style>
