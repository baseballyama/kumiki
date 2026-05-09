<!--
  @component DateTimeField.TimePart — pre-wired TimeField for the time half.

  Renders `<TimeField.Root><TimeField.Label /><TimeField.Input>...</TimeField.Input></TimeField.Root>`
  with the value bridged to the surrounding DateTimeField. The label defaults
  to a visually hidden placeholder so the surrounding `DateTimeField.Label`
  remains the canonical accessible name; consumers can override via `label`.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import { Time } from '@internationalized/date';
  import * as TimeField from '../time-field/index.js';
  import { DATETIME_FIELD_CONTEXT_KEY, type DateTimeFieldContextValue } from './context.js';

  type Props = {
    /** Visually hidden override for the inner TimeField label. */
    label?: string;
    [key: string]: unknown;
  };

  let { label = 'Time', ...rest }: Props = $props();

  const ctxOptional = getContext<DateTimeFieldContextValue | undefined>(DATETIME_FIELD_CONTEXT_KEY);
  if (!ctxOptional) {
    throw new Error('<DateTimeField.TimePart> must be inside <DateTimeField.Root>.');
  }
  const ctx: DateTimeFieldContextValue = ctxOptional;

  const timeValue = $derived.by<Time | null>(() => {
    if (!ctx.value) return null;
    return new Time(ctx.value.hour, ctx.value.minute, ctx.value.second);
  });
</script>

<TimeField.Root
  value={timeValue}
  onValueChange={(t) => ctx.setTime(t)}
  granularity={ctx.granularity}
  hourCycle={ctx.hourCycle}
  disabled={ctx.disabled}
  {...rest}
>
  <TimeField.Label class="sr-only">{label}</TimeField.Label>
  <TimeField.Input>
    <TimeField.Segment kind="hour" />
    <TimeField.Segment kind="minute" />
    {#if ctx.granularity === 'second'}
      <TimeField.Segment kind="second" />
    {/if}
    {#if ctx.hourCycle === 12}
      <TimeField.Segment kind="dayPeriod" />
    {/if}
  </TimeField.Input>
</TimeField.Root>
