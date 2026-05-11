<script lang="ts">
  import { Vanilla as Slider } from '@kumiki/atelier/slider';

  let volume = $state(40);
  let brightness = $state(80);
</script>

<div class="demo">
  <label class="row">
    <span>Volume</span>
    <Slider.Root min={0} max={100} step={1} bind:value={volume} aria-label="Volume">
      <Slider.Thumb />
    </Slider.Root>
    <code>{volume}</code>
  </label>

  <label class="row">
    <span>Brightness</span>
    <Slider.Root min={0} max={100} step={5} bind:value={brightness} aria-label="Brightness">
      <Slider.Thumb />
    </Slider.Root>
    <code>{brightness}</code>
  </label>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .row {
    display: grid;
    grid-template-columns: 80px 1fr 40px;
    gap: 12px;
    align-items: center;
    color: var(--k-ink-2);
    font-size: 14px;
  }
  .row code {
    color: var(--k-matcha-ink);
    text-align: right;
    font-family: var(--k-font-mono, monospace);
  }
</style>
