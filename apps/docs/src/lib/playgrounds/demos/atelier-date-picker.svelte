<script lang="ts">
  import { Vanilla as DatePicker } from '@kumiki/atelier/date-picker';
  import { type CalendarDate, today, getLocalTimeZone } from '@internationalized/date';

  let value = $state<CalendarDate | null>(today(getLocalTimeZone()));
</script>

<div class="demo">
  <label class="row">
    <span>Pick a date</span>
    <DatePicker.Root bind:value>
      <DatePicker.Trigger />
      <DatePicker.Content />
    </DatePicker.Root>
  </label>

  <p class="state">value = <code>{value ? value.toString() : 'null'}</code></p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    width: 440px;
    min-height: 480px;
    box-sizing: border-box;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--k-ink-2);
    font-size: 14px;
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
