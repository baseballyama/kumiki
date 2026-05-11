<script lang="ts">
  import { Avatar } from '@kumiki/components/avatar';
  import { AvatarGroup } from '@kumiki/components/avatar-group';

  const users = [
    { id: 'a', name: 'Aiko' },
    { id: 'b', name: 'Beni' },
    { id: 'c', name: 'Cho' },
    { id: 'd', name: 'Daichi' },
    { id: 'e', name: 'Eiko' },
    { id: 'f', name: 'Fumi' },
  ];

  let max = $state(3);
</script>

<div class="demo">
  <div class="controls">
    <label class="control">
      max
      <input type="number" min="1" max="6" bind:value={max} />
    </label>
    <span class="hint inline">total = {users.length}</span>
  </div>

  <AvatarGroup.Root {max} total={users.length} aria-label="Project members">
    {#each users.slice(0, max) as u (u.id)}
      <AvatarGroup.Item>
        <Avatar.Root decorative size="md">
          <Avatar.Image src={`https://broken.invalid/${u.id}.png`} />
          <Avatar.Fallback>{u.name[0]}</Avatar.Fallback>
        </Avatar.Root>
      </AvatarGroup.Item>
    {/each}
    {#if users.length > max}
      <AvatarGroup.Overflow />
    {/if}
  </AvatarGroup.Root>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    width: 380px;
    min-height: 220px;
    box-sizing: border-box;
  }
  .controls {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }
  .control {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .control input {
    background: var(--k-code-bg);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
    border-radius: 6px;
    padding: 4px 8px;
    width: 64px;
  }
  .demo :global(ul[data-component-part='group']) {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
  }
  .demo :global(li[data-component-part='item']),
  .demo :global(li[data-component-part='overflow']) {
    margin-left: -8px;
    border: 2px solid var(--k-surface-0);
    border-radius: 50%;
    background: var(--k-surface-2);
  }
  .demo :global(li[data-component-part='item']:first-child) {
    margin-left: 0;
  }
  .demo :global(li[data-component-part='overflow']) {
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--k-ink-3);
    font-size: 12px;
    font-weight: 600;
  }
  .demo :global(span[data-size='md']) {
    position: relative;
    display: inline-block;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--k-surface-2);
    color: var(--k-ink-1);
    overflow: hidden;
    text-align: center;
    line-height: 36px;
    font-weight: 600;
    font-size: 13px;
  }
  .demo :global(img[data-component-part='image']) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .demo :global(img[data-hidden]),
  .demo :global(span[data-component-part='fallback'][data-hidden]) {
    visibility: hidden;
  }
  .hint {
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .inline {
    display: inline-block;
  }
</style>
