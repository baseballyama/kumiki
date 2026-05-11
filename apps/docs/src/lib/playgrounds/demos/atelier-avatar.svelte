<script lang="ts">
  import { Vanilla as Avatar } from '@kumiki/atelier/avatar';
</script>

<div class="demo">
  <div class="row">
    <Avatar.Root name="Akari Suzuki" size="sm">
      <Avatar.Image src="/missing-1.jpg" />
      <Avatar.Fallback>AS</Avatar.Fallback>
    </Avatar.Root>
    <Avatar.Root name="Ben Carter" size="md">
      <Avatar.Image src="/missing-2.jpg" />
      <Avatar.Fallback>BC</Avatar.Fallback>
    </Avatar.Root>
    <Avatar.Root name="Cora Day" size="lg">
      <Avatar.Image src="/missing-3.jpg" />
      <Avatar.Fallback>CD</Avatar.Fallback>
    </Avatar.Root>
    <Avatar.Root decorative size="md">
      <Avatar.Fallback>★</Avatar.Fallback>
    </Avatar.Root>
  </div>
  <p class="hint">
    The image paths intentionally 404 so the fallback initials render.
    <code>name</code> drives the accessible label; <code>decorative</code> hides it from AT.
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
  }
  .row {
    display: flex;
    gap: 12px;
    align-items: center;
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
