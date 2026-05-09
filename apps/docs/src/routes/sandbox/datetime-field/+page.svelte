<!--
  DateTimeField sandbox — Playwright + axe fixture.

  Query params:
    ?disabled=1
    ?dir=rtl
-->
<script lang="ts">
  import { DateTimeField } from '@kumiki/components/datetime-field';
  import { CalendarDateTime } from '@internationalized/date';
  import { page } from '$app/state';

  const disabled = $derived(page.url.searchParams.get('disabled') === '1');
  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');

  let value = $state<CalendarDateTime | null>(new CalendarDateTime(2026, 5, 10, 9, 30, 0));
  let log = $state<string[]>([]);
  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>DateTimeField sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="datetime-field" data-testid="sandbox">
  <h1>DateTimeField sandbox</h1>

  <div data-testid="datetime-field-host">
    <DateTimeField.Root
      bind:value
      {disabled}
      onValueChange={(v) => append(`onValueChange(${v ? v.toString() : 'null'})`)}
    >
      <DateTimeField.Label>Scheduled at</DateTimeField.Label>
      <DateTimeField.DatePart />
      <DateTimeField.TimePart />
    </DateTimeField.Root>
  </div>

  <p data-testid="state">
    value: <strong data-testid="value">{value ? value.toString() : 'null'}</strong>
    · disabled: <strong data-testid="disabled">{disabled}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}<li>{line}</li>{/each}
  </ol>
</div>
