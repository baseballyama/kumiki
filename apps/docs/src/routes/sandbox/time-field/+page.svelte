<!--
  TimeField sandbox — Playwright + axe fixture.

  Query params:
    ?granularity=hour|minute|second
    ?cycle=12|24
    ?disabled=1
    ?readonly=1
    ?dir=rtl
-->
<script lang="ts">
  import { TimeField, type TimeGranularity } from '@kumiki/components/time-field';
  import { Time } from '@internationalized/date';
  import { page } from '$app/state';

  const granularity = $derived(
    (page.url.searchParams.get('granularity') ?? 'minute') as TimeGranularity,
  );
  const hourCycle = $derived(page.url.searchParams.get('cycle') === '12' ? 12 : 24);
  const disabled = $derived(page.url.searchParams.get('disabled') === '1');
  const readonly = $derived(page.url.searchParams.get('readonly') === '1');
  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');

  let value = $state<Time | null>(new Time(9, 30, 0));
  let log = $state<string[]>([]);
  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>TimeField sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="time-field" data-testid="sandbox">
  <h1>TimeField sandbox</h1>

  <div data-testid="time-field-host">
    <TimeField.Root
      bind:value
      {granularity}
      hourCycle={hourCycle as 12 | 24}
      {disabled}
      {readonly}
      onValueChange={(v) => append(`onValueChange(${v ? v.toString() : 'null'})`)}
    >
      <TimeField.Label>Reminder time</TimeField.Label>
      <TimeField.Input data-testid="input">
        <TimeField.Segment kind="hour" data-testid="seg-hour" />
        <TimeField.Segment kind="minute" data-testid="seg-minute" />
        {#if granularity === 'second'}
          <TimeField.Segment kind="second" data-testid="seg-second" />
        {/if}
        {#if hourCycle === 12}
          <TimeField.Segment kind="dayPeriod" data-testid="seg-day-period" />
        {/if}
      </TimeField.Input>
    </TimeField.Root>
  </div>

  <p data-testid="state">
    value: <strong data-testid="value">{value ? value.toString() : 'null'}</strong>
    · granularity: <strong data-testid="granularity">{granularity}</strong>
    · cycle: <strong data-testid="cycle">{hourCycle}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}<li>{line}</li>{/each}
  </ol>
</div>
