<script lang="ts">
  import { Vanilla as Calendar } from '@kumiki/atelier/calendar';
  import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date';

  let value = $state<CalendarDate | null>(today(getLocalTimeZone()));
</script>

<div class="demo">
  <Calendar.Root bind:value>
    <Calendar.Header />
    <Calendar.Grid>
      {#snippet day(cell)}
        <Calendar.Day date={cell.date} inMonth={cell.inMonth} />
      {/snippet}
    </Calendar.Grid>
  </Calendar.Root>

  <p class="state">selected = <code>{value ? value.toString() : '—'}</code></p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    width: fit-content;
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
