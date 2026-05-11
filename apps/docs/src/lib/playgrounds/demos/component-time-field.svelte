<!--
  Layer 4 TimeField demo — segmented time-of-day input. Each segment is a
  separately-focusable spinbutton; the Input wraps them in a group with the
  Label as accessible name.
-->
<script lang="ts">
  import { TimeField } from '@kumiki/components';
  import { Time } from '@internationalized/date';

  let value = $state<Time | null>(new Time(9, 30));
</script>

<div class="demo">
  <TimeField.Root bind:value granularity="minute">
    <TimeField.Label class="tf-label">Open at</TimeField.Label>
    <TimeField.Input class="tf-input">
      <TimeField.Segment kind="hour" />
      <span aria-hidden="true">:</span>
      <TimeField.Segment kind="minute" />
      <TimeField.Segment kind="dayPeriod" />
    </TimeField.Input>
  </TimeField.Root>

  <p class="state">value = <code>{value ? value.toString() : 'null'}</code></p>
  <p class="hint">
    Layer 4 emits only structure + ARIA. Each segment is its own spinbutton — Arrow Up/Down adjusts,
    Tab moves between segments, type-ahead works.
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    width: 360px;
    min-height: 220px;
    box-sizing: border-box;
  }
  .demo :global(.tf-label) {
    display: block;
    font-size: 12px;
    color: var(--k-ink-3);
    margin-block-end: 8px;
    font-family: var(--k-font-mono);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .demo :global(.tf-input) {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    border: 1px solid var(--k-line-2);
    border-radius: var(--k-radius-sm);
    background: var(--k-surface-1);
    font-family: var(--k-font-mono);
    font-size: 14px;
  }
  .state {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 12px;
    font-family: var(--k-font-mono);
  }
  .state code {
    color: var(--k-matcha-ink);
  }
  .hint {
    margin-top: 12px;
    color: var(--k-ink-3);
    font-size: 13px;
    line-height: 1.55;
  }
</style>
