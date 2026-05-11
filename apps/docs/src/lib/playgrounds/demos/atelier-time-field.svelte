<script lang="ts">
  import { Vanilla as TimeField } from '@kumiki/atelier/time-field';
  import { Time } from '@internationalized/date';

  let value = $state<Time | null>(new Time(9, 30));
</script>

<div class="demo">
  <TimeField.Root bind:value granularity="minute">
    <TimeField.Label>Open at</TimeField.Label>
    <TimeField.Input>
      <TimeField.Segment kind="hour" />
      <span aria-hidden="true">:</span>
      <TimeField.Segment kind="minute" />
      <TimeField.Segment kind="dayPeriod" />
    </TimeField.Input>
  </TimeField.Root>

  <p class="state">value = <code>{value ? value.toString() : 'null'}</code></p>
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
  .state {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 13px;
    font-family: var(--k-font-mono, monospace);
  }
  .state code {
    color: var(--k-matcha-ink);
  }
</style>
