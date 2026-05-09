<script lang="ts">
  import { Avatar, type AvatarSize } from '@kumiki/components/avatar';

  let size = $state<AvatarSize>('md');
</script>

<div class="demo">
  <div class="controls">
    <label class="control">
      Size
      <select bind:value={size}>
        <option value="sm">sm</option>
        <option value="md">md</option>
        <option value="lg">lg</option>
      </select>
    </label>
  </div>

  <div class="row">
    <!-- Meaningful: name carried via alt -->
    <Avatar.Root name="Aiko Tanaka" {size}>
      <Avatar.Image src="https://i.pravatar.cc/64?img=12" />
      <Avatar.Fallback />
    </Avatar.Root>

    <!-- Decorative + initials fallback (broken image) -->
    <Avatar.Root decorative {size}>
      <Avatar.Image src="https://broken.invalid/x.png" />
      <Avatar.Fallback>JS</Avatar.Fallback>
    </Avatar.Root>

    <!-- Decorative + custom snippet fallback -->
    <Avatar.Root decorative {size}>
      <Avatar.Image src="https://broken.invalid/y.png" />
      <Avatar.Fallback>★</Avatar.Fallback>
    </Avatar.Root>
  </div>

  <p class="hint">
    <code>name=</code> ⇒ <code>alt=name</code> · <code>decorative</code> ⇒ <code>alt=""</code>.
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
  }
  .controls {
    margin-bottom: 16px;
  }
  .control {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .control select {
    background: var(--k-code-bg);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
    border-radius: 6px;
    padding: 4px 8px;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .demo :global(span[data-size]) {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--k-surface-2);
    color: var(--k-ink-1);
    overflow: hidden;
    text-align: center;
    line-height: 40px;
    font-weight: 600;
    font-size: 14px;
  }
  .demo :global(span[data-size='sm']) {
    width: 28px;
    height: 28px;
    line-height: 28px;
    font-size: 12px;
  }
  .demo :global(span[data-size='lg']) {
    width: 56px;
    height: 56px;
    line-height: 56px;
    font-size: 18px;
  }
  .demo :global(img[data-part='image']) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .demo :global(img[data-hidden]) {
    visibility: hidden;
  }
  .demo :global(span[data-part='fallback'][data-hidden]) {
    visibility: hidden;
  }
  .hint {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .hint code {
    color: var(--k-matcha);
  }
</style>
