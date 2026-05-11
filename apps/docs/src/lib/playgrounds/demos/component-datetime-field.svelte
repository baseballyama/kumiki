<!--
  Layer 4 DateTimeField demo — composition of DatePart + TimePart over a
  single `CalendarDateTime` value. Headless: no styling here, just behavior
  and structural ARIA from the underlying DatePicker / TimeField parts.
-->
<script lang="ts">
  import { DateTimeField } from '@kumiki/components';
  import { type CalendarDateTime, now, getLocalTimeZone } from '@internationalized/date';

  let value = $state<CalendarDateTime | null>(
    now(getLocalTimeZone()) as unknown as CalendarDateTime,
  );
</script>

<div class="demo">
  <DateTimeField.Root bind:value granularity="minute">
    <DateTimeField.Label class="dtf-label">Starts at</DateTimeField.Label>
    <div class="dtf-row">
      <DateTimeField.DatePart />
      <DateTimeField.TimePart />
    </div>
  </DateTimeField.Root>

  <p class="state">value = <code>{value ? value.toString() : 'null'}</code></p>
  <p class="hint">
    Layer 4 ships <strong>no styling</strong>. DatePart and TimePart are independently focusable
    inputs — segmented input has better screen-reader coverage than a fused calendar+strip widget.
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    width: 400px;
    min-height: 240px;
    box-sizing: border-box;
  }
  .demo :global(.dtf-label) {
    display: block;
    font-size: 12px;
    color: var(--k-ink-3);
    margin-block-end: 8px;
    font-family: var(--k-font-mono);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .dtf-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
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
