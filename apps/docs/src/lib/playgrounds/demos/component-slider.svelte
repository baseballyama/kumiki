<script lang="ts">
  import { Root, Thumb } from '@kumiki/components/slider';

  let value = $state(50);
  let orientation = $state<'horizontal' | 'vertical'>('horizontal');
</script>

<div class="demo">
  <div class="controls">
    <label>
      Orientation:
      <select bind:value={orientation}>
        <option value="horizontal">horizontal</option>
        <option value="vertical">vertical</option>
      </select>
    </label>
  </div>

  <div class="slider-wrap" data-orientation={orientation}>
    <Root bind:value {orientation} class="track">
      <Thumb aria-label="Demo slider" class="thumb" />
    </Root>
  </div>

  <p class="state">value: <code>{value}</code></p>
</div>

<style>
  .demo {
    background: #16162a;
    border: 1px solid #2a2a4a;
    border-radius: 12px;
    padding: 24px;
  }
  .controls {
    margin-bottom: 16px;
    color: #aaa;
    font-size: 13px;
  }
  .controls select {
    background: #0e0e1c;
    color: #e0e0e0;
    border: 1px solid #3a3a5a;
    border-radius: 6px;
    padding: 4px 8px;
    margin-left: 6px;
  }
  .slider-wrap {
    padding: 24px 0;
  }
  .demo :global(.track) {
    position: relative;
    background: #1a1a30;
    border: 1px solid #3a3a5a;
    border-radius: 999px;
    cursor: pointer;
  }
  .demo :global(.track[data-orientation='horizontal']) {
    width: 320px;
    height: 8px;
  }
  .demo :global(.track[data-orientation='vertical']) {
    width: 8px;
    height: 200px;
  }
  .demo :global(.thumb) {
    position: absolute;
    width: 18px;
    height: 18px;
    background: #ff3e00;
    border: 2px solid #fff;
    border-radius: 50%;
    cursor: grab;
  }
  .demo :global(.thumb:focus) {
    outline: 2px solid #4fc08d;
    outline-offset: 2px;
  }
  .demo :global(.track[data-orientation='horizontal'] .thumb) {
    top: 50%;
    left: var(--kumiki-slider-pct);
    transform: translate(-50%, -50%);
  }
  .demo :global(.track[data-orientation='vertical'] .thumb) {
    left: 50%;
    bottom: var(--kumiki-slider-pct);
    transform: translate(-50%, 50%);
  }
  .state {
    margin-top: 16px;
    color: #888;
    font-size: 13px;
  }
  .state code {
    color: #4fc08d;
  }
</style>
