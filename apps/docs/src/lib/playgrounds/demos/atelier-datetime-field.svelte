<script lang="ts">
  import { Vanilla as DateTimeField } from '@kumiki/atelier/datetime-field';
  import { type CalendarDateTime, now, getLocalTimeZone } from '@internationalized/date';

  let value = $state<CalendarDateTime | null>(
    now(getLocalTimeZone()) as unknown as CalendarDateTime,
  );
</script>

<div class="demo">
  <DateTimeField.Root bind:value granularity="minute">
    <DateTimeField.Label>Starts at</DateTimeField.Label>
    <DateTimeField.DatePart />
    <DateTimeField.TimePart />
  </DateTimeField.Root>

  <p class="state">value = <code>{value ? value.toString() : 'null'}</code></p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    min-height: 200px;
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
